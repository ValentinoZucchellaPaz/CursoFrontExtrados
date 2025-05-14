namespace Models.Entidades
{
    public class Usuario
    {
        public int Id { get; set; }
        public required string Nombre { get; set; }
        public required string Pais { get; set; }
        public required string Email { get; set; }
        public required string Contraseña { get; set; }
        public required string Salt { get; set; }
        private string _role;
        public string Role
        {
            get => _role;
            init
            {
                if (!Enum.TryParse<UserRole>(value, true, out var parsedRole) || !Enum.IsDefined(typeof(UserRole), parsedRole))
                {
                    throw new ArgumentException($"Rol inválido: {value}");
                }
                _role = value;
            }
        }
        public int? Id_creador { get; set; }
        public string? Alias { get; set; }
        public string? Avatar { get; set; }
        public bool Activo { get; set; }
    }
}
