using Microsoft.Data.SqlClient;
using MySqlConnector;
using System.Data;
using System.Net;
using System.Security;
using System.Text.Json;

namespace APITorneo.Middleware
{
    public class ExceptionHandlerMiddleware(RequestDelegate next)
    {
        private readonly RequestDelegate _next = next;


        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception e)
            {
                // agregar logger
                await HandleExceptionAsync(context, e);
            }
        }

        public static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            // Definir valores por defecto
            Console.WriteLine("handling exception");
            HttpStatusCode statusCode = HttpStatusCode.InternalServerError;
            string errorMessage = "Error inesperado";
            string? stackTrace = exception.StackTrace; // Solo en desarrollo

            switch (exception)
            {
                // 🔹 Errores de autenticación
                case UnauthorizedAccessException:
                    statusCode = HttpStatusCode.Unauthorized;
                    errorMessage = "No tienes permisos para esta acción.";
                    break;

                case SecurityException:
                    statusCode = HttpStatusCode.Forbidden;
                    errorMessage = "Acceso denegado.";
                    break;

                // 🔹 Errores de validación de datos
                case ArgumentException or ArgumentNullException or ArgumentOutOfRangeException or FormatException:
                    statusCode = HttpStatusCode.BadRequest;
                    errorMessage = "Datos inválidos en la solicitud.";
                    break;

                case KeyNotFoundException:
                    statusCode = HttpStatusCode.NotFound;
                    errorMessage = "El recurso solicitado no existe.";
                    break;

                // 🔹 Errores de concurrencia y duplicados
                case InvalidOperationException:
                    statusCode = HttpStatusCode.Conflict;
                    errorMessage = "Conflicto con el estado actual de los datos.";
                    break;

                // 🔹 Errores de base de datos
                case MySqlException or SqlException:
                    statusCode = HttpStatusCode.InternalServerError;
                    errorMessage = "Error en la base de datos.";
                    //stackTrace = null; // No mostrar detalles de SQL en producción
                    break;

                case DBConcurrencyException:
                    statusCode = HttpStatusCode.Conflict;
                    errorMessage = "Error de concurrencia en la base de datos.";
                    break;

                // 🔹 Errores de tiempo de espera
                case TimeoutException:
                    statusCode = HttpStatusCode.RequestTimeout;
                    errorMessage = "La solicitud tardó demasiado en completarse.";
                    break;

                // 🔹 Errores generales
                default:
                    Console.WriteLine("default ex");
                    statusCode = HttpStatusCode.InternalServerError;
                    errorMessage = "Ocurrió un error inesperado.";
                    break;
            }


            // Configura el código de estado HTTP y contenido de respuesta
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;
            var response = new
            {
                StatusCode = (int)statusCode,
                //ExceptionType= exception.GetType(),
                Message = $"{exception.GetType()}: {errorMessage}",
                Detail = exception.Message,
            };

            Console.WriteLine(response.ToString());
            Console.WriteLine($"StackTrace:\n {stackTrace}");
            Console.WriteLine("--------------------------------------------------------------------------------------\n\n");

            // Devuelve un JSON con el mensaje de error
            return context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}
