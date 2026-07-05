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
