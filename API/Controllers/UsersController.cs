﻿using API.DTOs;
using API.Enums;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class UsersController(IUserRepository<AppUser> userRepository,
        PhotoService photoService) : BaseApiController
    {
        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var user = await userRepository.GetUserByIdAsync(id);

            if (user == null) return NotFound();

            bool hasDeletedSomething = userRepository.Delete(user);

            if (!hasDeletedSomething)
            {
                return StatusCode(500, "Failed to delete the user. Please try again.");
            }

            return Ok();
        }

        [Authorize]
        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            var user = await userRepository.GetMemberAsync(username);

            if (user == null) return NotFound();

            return Ok(user);
        }

        [Authorize]
        [HttpPut]
        public async Task<ActionResult> UpdateUser([FromForm] MemberUpdateDto memberUpdateData)
        {
            var username = User.GetUserName();

            if (memberUpdateData == null || username == null)
            {
                return BadRequest();
            }

            UpdateResult updateResult = await userRepository.UpdateMemberAsync(username, memberUpdateData);

            // Delete Images
            if (memberUpdateData.ImagesToDelete != null && memberUpdateData.ImagesToDelete.Count > 0)
            {
                foreach (var imageToDelete in memberUpdateData.ImagesToDelete)
                {
                    if (!String.IsNullOrEmpty(imageToDelete.PublicId))
                    {
                        await photoService.DeleteImageAsync(imageToDelete.PublicId);
                    };

                    await userRepository.DeleteUserPhotoByDbIdAsync(username, imageToDelete.DbId);
                }
            }

            // Upload Images
            if (memberUpdateData.ImagesToUpload != null && memberUpdateData.ImagesToUpload.Count > 0)
            {
                foreach (var image in memberUpdateData.ImagesToUpload)
                {
                    if (image.PhotoFile.Length == 0) continue;

                    var result = await photoService.UploadImageAsync(image.PhotoFile);

                    if (result.Error != null) continue;

                    var photo = new Photo
                    {
                        IsMain = image.IsMain,
                        PublicId = result.PublicId,
                        Url = (result.Url).ToString()
                    };

                    await userRepository.AddUserPhotoAsync(username, photo);
                }
            }

            return Ok();
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
        {
            userParams.CurrentUsername = User.GetUserName();

            var users = await userRepository.GetMembersAsync(userParams);

            Response.AddPaginationHeader(users);

            return Ok(users);
        }
    }
}
