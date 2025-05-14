using APITorneo.Middleware;
using Configuration;
using Data_Access.DAOUsuario;
using Data_Access.DAOCartas;
using Data_Access.DAOTorneo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Services.AuthService;
using Services.Helpers;
using Services.UsuarioService;
using System.Text;
using Services.TorneoService;
using Data_Access.DAORefreshToken;
using Services.InfoService;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ---------CONFIG----------

//  AUTH
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Issuer"],
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]))
        };
    });

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("*").AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin();
    });
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (connectionString == null) throw new Exception("No se configuró la coneccion a db");

// DbHelper
builder.Services.AddSingleton(new DbHelper(connectionString));

// DI - DAOS -- no son mas singleton xq usan el mismo singleton para hacer todas las consultas a db (db helper)
builder.Services.AddScoped<IDAOCartas, DAOCartas>();
builder.Services.AddScoped<IDAOUsuario, DAOUsuario>();
builder.Services.AddScoped<IDAOTorneo, DAOTorneo>();
builder.Services.AddScoped<IDAORefreshToken, DAORefreshToken>();

// DI - SERVICES
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<ITorneoService, TorneoService>();
builder.Services.AddScoped<IInfoService,  InfoService>();

// OPTIONS
builder.Services.Configure<JwtConfig>(builder.Configuration.GetSection("Jwt"));


// ---------CONFIG----------

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<ExceptionHandlerMiddleware>(); //custom middleware

app.MapControllers();

app.Run();
