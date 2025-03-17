using Microsoft.EntityFrameworkCore;
using mission11.Data;

//using mission11.Data;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreContext")));

builder.Services.AddCors();
builder.WebHost.ConfigureKestrel(options =>
{
    
    options.ListenLocalhost(4000);
    options.ListenLocalhost(5000, listenOptions =>
    {
        listenOptions.UseHttps();
    });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
// Allow requests from frontend port
app.UseCors(x => x.WithOrigins("http://localhost:3000"));
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();