using Dapper;
using MySqlConnector;
using System.Data;

namespace Services.Helpers
{
    public class DbHelper (string connectionString)
    {
        private string _connectionString = connectionString;
        public async Task<IDbConnection> GetConnectionAsync()
        {
            var conn = new MySqlConnection(_connectionString);
            await conn.OpenAsync();
            return conn;
        }

        public async Task<IDbTransaction> BeginTransactionAsync(IDbConnection connection)
        {
            return await Task.FromResult(connection.BeginTransaction());
        }

        public async Task<int> ExecuteAsync(string query, object? parametros = null, IDbTransaction? transaction = null)
        {
            if (transaction == null || transaction.Connection == null) return await ExecuteWithNewConnectionAsync(query, parametros);
            return await transaction.Connection.ExecuteAsync(query, parametros, transaction);
        }

        public async Task<T?> QuerySingleOrDefaultAsync<T>(string query, object? parametros = null, IDbTransaction? transaction = null)
        {
            if(transaction == null || transaction.Connection == null) return await QuerySingleOrDefaultWithNewConnectionAsync<T>(query, parametros);
            return await transaction.Connection.QuerySingleOrDefaultAsync<T>(query, parametros, transaction);
        }

        public async Task<IEnumerable<T>> QueryAsync<T>(string query, object? parametros = null, IDbTransaction? transaction = null)
        {
            if(transaction == null || transaction.Connection == null) return await QueryWithNewConnectionAsync<T>(query, parametros);
            return await transaction.Connection.QueryAsync<T>(query, parametros, transaction);
        }

        public async Task<T?> ExecuteScalarAsync<T>(string query, object? parametros = null, IDbTransaction? transaction = null)
        {
            if(transaction == null || transaction.Connection == null) return await ExecuteScalarWithNewConnectionAsync<T>(query, parametros);
            return await transaction.Connection.ExecuteScalarAsync<T>(query, parametros, transaction);
        }

        // Métodos privados para manejar operaciones sin transacciones
        private async Task<int> ExecuteWithNewConnectionAsync(string query, object? parametros)
        {
            using var conn = await GetConnectionAsync();
            return await conn.ExecuteAsync(query, parametros);
        }

        private async Task<T?> QuerySingleOrDefaultWithNewConnectionAsync<T>(string query, object? parametros)
        {
            using var conn = await GetConnectionAsync();
            return await conn.QuerySingleOrDefaultAsync<T>(query, parametros);
        }

        private async Task<IEnumerable<T>> QueryWithNewConnectionAsync<T>(string query, object? parametros)
        {
            using var conn = await GetConnectionAsync();
            return await conn.QueryAsync<T>(query, parametros);
        }

        private async Task<T?> ExecuteScalarWithNewConnectionAsync<T>(string query, object? parametros)
        {
            using var conn = await GetConnectionAsync();
            return await conn.ExecuteScalarAsync<T>(query, parametros);
        }
    }
}
