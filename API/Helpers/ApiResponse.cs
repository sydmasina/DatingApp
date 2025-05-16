using API.Enums;

namespace API.Helpers
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = "";
        public T? Data { get; set; }
        public UpdateResult? ResultCode { get; set; }

        public static ApiResponse<T> Succes(T? data, string message = "OK",
            UpdateResult? resultCode = null)
        {
            var response = new ApiResponse<T>
            { Success = true, Message = message, Data = data, ResultCode = resultCode };

            return response;
        }

        public static ApiResponse<T> Fail(string message = "Something went wrong",
            UpdateResult? resultCode = null)
        {
            var response = new ApiResponse<T>
            { Success = false, Message = message, ResultCode = resultCode };

            return response;
        }
    }
}
