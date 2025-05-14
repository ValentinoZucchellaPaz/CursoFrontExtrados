namespace Models.Entidades
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public int User_id { get; set; }
        public string Token { get; set; }
        public DateTime Expiration_date { get; set; }
        public bool Is_revoked { get; set; }

    }
}
