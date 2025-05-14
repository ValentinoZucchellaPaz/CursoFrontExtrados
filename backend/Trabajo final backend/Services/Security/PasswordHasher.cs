using System.Security.Cryptography;

namespace Services.Security
{
    public class PasswordHasher
    {
        public static (string hash, string salt) HashPassword(string password, int iterations = 600000)
        {
            const int keySize = 64; // Tamaño del hash en bytes
            var salt = RandomNumberGenerator.GetBytes(keySize); // Salt aleatorio

            var hash = Rfc2898DeriveBytes.Pbkdf2(
                password: password,
                salt: salt,
                iterations: iterations,
                hashAlgorithm: HashAlgorithmName.SHA256,
                outputLength: keySize);

            return (Convert.ToHexString(hash), Convert.ToHexString(salt));
        }

        public static bool VerifyPassword(string password, string hash, string salt, int iterations = 600000)
        {
            const int keySize = 64;

            var hashToCompare = Rfc2898DeriveBytes.Pbkdf2(
                password: password,
                salt: Convert.FromHexString(salt),
                iterations: iterations,
                hashAlgorithm: HashAlgorithmName.SHA256,
                outputLength: keySize);

            return CryptographicOperations.FixedTimeEquals(hashToCompare, Convert.FromHexString(hash));
        }
    }
}
