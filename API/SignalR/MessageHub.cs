using API.Data.Repositories;
using API.DTOs;
using API.Extensions;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class MessageHub(IMessageRepository messageRepository, 
        IUserRepository<AppUser> userRepository,
        IMapper mapper): Hub
    {
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext?.Request.Query["user"];

            if (Context.User == null || string.IsNullOrEmpty(otherUser))
                throw new HubException("Cannot get current user claim");
            var groupName = GetGroupName(Context.User.GetUserName(), otherUser);

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await AddToGroup(groupName);

            var messages = await messageRepository.GetMessageThread(Context.User.GetUserName(), otherUser!);

            await Clients.Group(groupName).SendAsync("ReceiveMessageThread", messages);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await RemoveFromMessageGroup();
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
            if (Context.User == null) 
                throw new HubException("Cannot get current user claim");

            var username = Context.User.GetUserName();

            if (username == createMessageDto.RecipientUsername.ToLower())
                throw new HubException("You cannot message yourself");

            var httpContext = Context.GetHttpContext() ?? throw new HubException("Internal Server Error: Unable to initialize httpContext");
            
            var sender = await userRepository.GetUserByUsernameAsync(username);
            var recipient = await userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

            if (recipient == null || sender == null || sender.UserName == null || recipient.UserName == null) 
                throw new HubException("Error sending message");

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = username,
                RecipientUsername = createMessageDto.RecipientUsername,
                Content = createMessageDto.Content
            };

            var groupName = GetGroupName(sender.UserName, recipient.UserName);
            var group = await messageRepository.GetMessageGroup(groupName);

            if (group != null && group.Connections.Any(x => x.Username == recipient.UserName))
            {
                message.DateRead = DateTime.UtcNow;
            }

            messageRepository.AddMessage(message);

            if (await messageRepository.SaveAllAsync())
            {
                await Clients.Group(groupName).SendAsync("NewMessage", mapper.Map<MessageDto>(message));
            }
        }

        private async Task<bool> AddToGroup(string groupName)
        {
            var username = Context.User?.GetUserName() ?? throw new HubException("Cannot get current user claim");
            var group = await messageRepository.GetMessageGroup(groupName);
            var connection = new Connection { ConnectionId = Context.ConnectionId, Username = username };

            if (group == null)
            {
                group = new Group { Name = groupName };
                messageRepository.AddGroup(group);
            }

            group.Connections.Add(connection);

            return await messageRepository.SaveAllAsync();
        }

        private async Task RemoveFromMessageGroup()
        {
            var connection = await messageRepository.GetConnection(Context.ConnectionId);

            if(connection != null)
            {
                messageRepository.RemoveConnection(connection);
                await messageRepository.SaveAllAsync();
            }
        }

        private static string GetGroupName(string caller, string? other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }
    }
}
