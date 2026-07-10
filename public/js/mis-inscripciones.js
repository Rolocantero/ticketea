// Mis Inscripciones - JavaScript

const emailInput = document.getElementById('email-input');
const resultadosSection = document.getElementById('resultados-section');
const resultadosTitulo = document.getElementById('resultados-titulo');
const tableBody = document.getElementById('inscripciones-table-body');
const toastContainer = document.getElementById('toast-container');

// Auto-fill email if logged in
const user = getUser();
if (user && emailInput) {
  emailInput.value = user.email;
  setTimeout(buscarInscripciones, 300);
}

// Buscar inscripciones por email
async function buscarInscripciones() {
  const email = emailInput.value.trim();
  if (!email) {
    showToast('Ingresá un correo electrónico', 'error');
    return;
  }

  resultadosSection.style.display = 'block';
  tableBody.innerHTML = `
    <tr>
      <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">
        Buscando...
      </td>
    </tr>
  `;
  lucide.createIcons();

  try {
    const response = await fetch(`/api/bookings?email=${encodeURIComponent(email)}`);
    if (!response.ok) throw new Error('Error al buscar inscripciones');
    const bookings = await response.json();
    renderInscripciones(bookings, email);
  } catch (error) {
    showToast(error.message, 'error');
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: var(--accent-danger); padding: 2rem;">
          Error al cargar inscripciones.
        </td>
      </tr>
    `;
  }
}

function renderInscripciones(bookings, email) {
  resultadosTitulo.textContent = `Inscripciones de ${email}`;

  if (bookings.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">
          No tenés inscripciones activas.
        </td>
      </tr>
    `;
    lucide.createIcons();
    return;
  }

  tableBody.innerHTML = bookings.map(booking => {
    const event = booking.Event;
    let fechaHtml = '-';
    if (event && event.date) {
      fechaHtml = new Date(event.date).toLocaleDateString('es-ES', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    }

    return `
      <tr>
        <td>
          <div style="font-weight: 500;">${event ? event.title : 'Evento eliminado'}</div>
          ${event && event.location ? `<div style="font-size: 0.75rem; color: var(--text-secondary);">${event.location}</div>` : ''}
        </td>
        <td style="color: var(--text-secondary); font-size: 0.9rem;">${fechaHtml}</td>
        <td><span style="font-weight: 600;">${booking.ticketsCount}</span></td>
        <td>
          <button class="btn btn-primary" style="background: var(--accent-danger); width: auto; padding: 0.5rem 1rem; font-size: 0.85rem;" onclick="cancelarInscripcion('${booking.id}')">
            <i data-lucide="x-circle" style="width: 14px; height: 14px;"></i> Cancelar
          </button>
        </td>
      </tr>
    `;
  }).join('');

  lucide.createIcons();
}

// Cancelar inscripción
async function cancelarInscripcion(bookingId) {
  if (!confirm('¿Estás seguro de cancelar tu inscripción? Los asientos se liberarán.')) {
    return;
  }

  try {
    const response = await fetch(`/api/bookings/${bookingId}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al cancelar');
    }

    showToast('Inscripción cancelada con éxito', 'success');
    // Recargar la lista
    buscarInscripciones();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Permitir buscar con Enter
emailInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') buscarInscripciones();
});

// Toast Utility
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i>
    <span>${message}</span>
  `;
  toastContainer.appendChild(toast);
  lucide.createIcons();
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
