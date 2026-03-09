using BackendFacturas.Repositories;

using BackendFacturas.Services;
using Swashbuckle.AspNetCore;



var builder = WebApplication.CreateBuilder(args);

// Configuración de CORS para desarrollo
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowFrontend",
		policy => policy.WithOrigins("http://localhost:3000")
						.AllowAnyHeader()
						.AllowAnyMethod());
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IInvoiceRepository, InvoiceRepository>();
builder.Services.AddScoped<InvoiceService>();


var app = builder.Build();


if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
	app.UseCors("AllowFrontend");
}

app.MapControllers();

app.Run();
