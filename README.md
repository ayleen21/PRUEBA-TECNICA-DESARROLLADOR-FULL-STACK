# Prueba Técnica Desarrollador Full Stack

## Descripción

Este proyecto permite la consulta de facturas de clientes, migrando lógica legada a una arquitectura moderna desacoplada. Incluye un backend en .NET/C# y un frontend en Next.js/React con Tailwind CSS.

## Tecnologías Utilizadas

### Backend
- **.NET 10 (ASP.NET Core Web API)**
- **C#**
- Inyección de dependencias (DI)
- Patrón Repositorio
- DTOs (Data Transfer Objects)
- Swagger (Swashbuckle.AspNetCore)
- CORS configurado
- Principios SOLID
- Simulación de base de datos en memoria
- Controladores RESTful

### Frontend
- **Next.js (React 18+)**
- **Tailwind CSS**
- Fetch API
- Validación de formularios
- Tooltip de ayuda
- Animaciones suaves
- Tabla responsiva y ordenable
- Filtro rápido por monto
- Paginación
- Totales dinámicos
- Manejo de estados de carga y error

## Instrucciones de Ejecución

### Backend
1. Ve a la carpeta `BackendFacturas`.
2. Ejecuta:
   ```
   dotnet run
   ```
3. La API estará disponible en `http://localhost:5193` (verificar el puerto en consola).
4. Documentación y pruebas en `http://localhost:5193/swagger`.

### Frontend
1. Ve a la carpeta `frontend-facturas`.
2. Ejecuta:
   ```
   npm install
   npm run dev
   ```
3. Abre tu navegador en `http://localhost:3000`.

---

## Decisiones Arquitectónicas
- Se usó DTO para desacoplar el modelo de dominio de la respuesta de la API.
- El patrón repositorio permite cambiar la fuente de datos fácilmente.
- Tailwind CSS para un diseño moderno.
- El filtro de monto acepta separadores de miles.
- Se implementó paginación y ordenamiento.

---

## Preguntas Teóricas

1. Seguridad: El sistema anterior no tenía validación de tokens. ¿Cómo implementarías la seguridad en la nueva API .NET para asegurar que solo los usuarios autenticados de la compañía puedan consultar las facturas?

Para proteger la API lo primero sería implementar autenticación con JWT. El flujo sería: el usuario se autentica contra el sistema corporativo, el backend genera un token firmado y ese token se envía en cada petición en el header Authorization: Bearer <token>.
Además, configuraría autorización por roles en .NET, de modo que solo perfiles como Empleado o Admin puedan acceder al endpoint de facturas.
Finalmente, en Program.cs activaría la validación de tokens con AddAuthentication().AddJwtBearer(), de manera que el middleware se encargue de rechazar automáticamente cualquier request sin credenciales válidas.

2. Integración ERP: Si esta nueva API tuviera que integrarse con nuestro ERP corporativo (donde las consultas son pesadas y la base de datos es robusta, ej. un motor analítico avanzado), ¿qué estrategias usarías en el backend (.NET) o en Node.js para que la aplicación frontend no experimente tiempos de espera excesivos?

Si la API necesita conectarse con un ERP corporativo que maneja consultas pesadas, lo primero es evitar que el frontend se quede esperando demasiado. Para eso usaría estrategias como cachear resultados frecuentes en memoria o Redis, implementar paginación para no traer miles de registros de golpe y trabajar siempre con consultas asíncronas para que el servidor no se bloquee.

En casos donde las operaciones sean realmente costosas, se pueden encolar las peticiones y procesarlas en segundo plano, devolviendo el resultado cuando esté listo. También es clave optimizar las consultas en el ERP (índices, vistas) y exponer endpoints más ligeros a través de microservicios.

## Autor
Ayleen Orjuela Murillo(Prueba Técnica 2026)
