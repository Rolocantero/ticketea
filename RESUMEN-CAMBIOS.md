# Implementación: Cancelación de Inscripción a Eventos

## Issue #10 - @Rolocantero
Fecha: 05/07/2026

### Cambios realizados

#### Backend (`server.js`)
- **`GET /api/bookings?email=xxx`** — filtro de reservas por correo electrónico para que el usuario pueda ver sus inscripciones activas. Incluye datos del evento (título, fecha, ubicación).
- **`DELETE /api/bookings/:id`** — endpoint para cancelar una inscripción. Libera los asientos del evento y elimina la reserva, todo dentro de una transacción SQL.
- **Ruta `/mis-inscripciones`** — sirve la nueva página frontend.

#### Frontend
- **`public/mis-inscripciones.html`** — nueva página con:
  - Buscador de inscripciones por correo electrónico
  - Tabla con: evento, fecha, cantidad de entradas, botón Cancelar
  - Diálogo de confirmación antes de cancelar
  - Toast de notificación (éxito/error)
  - Recarga automática de la lista después de cancelar
- **`public/js/mis-inscripciones.js`** — lógica completa de búsqueda y cancelación
- **`public/index.html`** y **`public/dashboard.html`** — link "Mis Inscripciones" agregado al menú de navegación

### Cómo funciona
1. El usuario ingresa su correo en la página "Mis Inscripciones"
2. El sistema muestra todas sus reservas activas
3. Al presionar "Cancelar", se confirma la acción
4. Se elimina la reserva y los asientos vuelven a estar disponibles
5. Mensaje de confirmación y recarga de la lista

---

# Implementación: Sistema de Autenticación — Login y Registro de Usuarios

## Commit `fb8a1c3` - @Rolocantero
Fecha: 10/07/2026

### Cambios realizados

#### Backend (`server.js`)
- **Modelo `User`** — nuevo modelo Sequelize con campos: `id` (UUID), `name`, `email` (único), `password` (hasheado con bcryptjs, 10 rondas de salt).
- **`POST /api/auth/register`** — crea un nuevo usuario. Recibe `{ name, email, password }`. Valida que el email no exista, hashea la contraseña, devuelve token JWT + datos del usuario.
- **`POST /api/auth/login`** — inicia sesión. Recibe `{ email, password }`. Compara contraseña con bcrypt, devuelve token JWT + datos del usuario.
- **`GET /api/auth/me`** — endpoint protegido con middleware JWT. Devuelve los datos del usuario autenticado a partir del token.
- **Middleware `authMiddleware`** — verifica el header `Authorization: Bearer <token>`, decodifica el JWT y lo inyecta en `req.user`.

#### Frontend
- **`public/login.html`** — nueva página de inicio de sesión con formulario (email + contraseña), enlace a registro y toast de notificación.
- **`public/register.html`** — nueva página de registro con formulario (nombre + email + contraseña), enlace a inicio de sesión y toast de notificación.
- **`public/js/auth.js`** — script compartido que se carga en todas las páginas:
  - Funciones: `getToken()`, `getUser()`, `isLoggedIn()`, `logout()`, `showToast()`
  - Al cargar la página, detecta si hay token en `localStorage` y actualiza la navbar automáticamente
  - **Sin sesión:** muestra botones "Ingresar" y "Registrarse"
  - **Con sesión:** muestra nombre del usuario + botón "Salir"
- **`public/js/app.js`** — modificado: al abrir el modal de reserva, auto-completa `userName` y `userEmail` con los datos del usuario logueado.
- **`public/js/mis-inscripciones.js`** — modificado: si el usuario está logueado, auto-completa el email en el buscador y ejecuta la búsqueda automáticamente.
- **`public/index.html`**, **`public/dashboard.html`**, **`public/mis-inscripciones.html`** — agregada la inclusión de `auth.js`.

#### Dependencias agregadas
- `bcryptjs` — hasheo de contraseñas
- `jsonwebtoken` — generación y verificación de tokens JWT

### Cómo funciona
1. El usuario se registra en `/register` con nombre, email y contraseña
2. El sistema hashea la contraseña, guarda el usuario y devuelve un token JWT
3. El token se almacena en `localStorage` del navegador
4. En cada página, `auth.js` verifica el token y muestra la navbar correspondiente
5. Al reservar entradas, el formulario se auto-completa con nombre y email del usuario
6. En "Mis Inscripciones", busca automáticamente las reservas del usuario logueado
7. Al hacer clic en "Salir", se elimina el token y redirige al inicio
