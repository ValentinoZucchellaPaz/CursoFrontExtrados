using System.ComponentModel.DataAnnotations;

namespace Models.DTO.Torneos.Request
{
    public class DTOCrearTorneo
    {
        //[CustomValidation(typeof(DTOCrearTorneo), "ValidateFechaInicio")]
        public required DateTime FechaInicio { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "Se debe poder jugar al menos durante 1 día")]
        public required int CantDias { get; set; }
        [Range(1, 10, ErrorMessage = "Se debe poder jugar al menos 1 hora por día y un máximo de 10hs por día")]
        public required int HorasPorDia { get; set; }
        public required string Pais { get; set; }
        [MinLength(1, ErrorMessage = "Debe proporcionar al menos una serie permitida.")]
        public required List<int> SeriesPermitidas { get; set; }
        [MinLength(1, ErrorMessage = "Debe proporcionar al menos un juez oficializador.")]
        public required List<int> JuecesOficializadores { get; set; }

        // Validación personalizada para FechaInicio y FechaFin -- comentado para poder probarlo
        //public static ValidationResult ValidateFechaInicio(DateTime fechaInicio, ValidationContext context)
        //{
        //    var instance = context.ObjectInstance as DTOCrearTorneo;
        //    if (instance == null || fechaInicio > DateTime.Now)
        //    {
        //        return ValidationResult.Success;
        //    }
        //    return new ValidationResult("La fecha de inicio no puede ser en el pasado");
        //}
    }
}
