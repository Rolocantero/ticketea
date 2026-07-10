// Auth utilities for all pages

function getToken() {
  return localStorage.getItem('token');
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
}

function isLoggedIn() {
  return !!getToken();
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
}

// Toast utility (shared across pages)
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  if (typeof lucide !== 'undefined') lucide.createIcons();
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Update navbar auth UI on every page
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav-links');
  if (!nav) return;

  // Remove existing auth links
  const existing = nav.querySelector('.nav-auth');
  if (existing) existing.remove();

  const authDiv = document.createElement('div');
  authDiv.className = 'nav-auth';
  authDiv.style.cssText = 'display:flex;gap:0.75rem;align-items:center;margin-left:0.5rem;';

  const user = getUser();
  if (user) {
    authDiv.innerHTML = `
      <span style="color:var(--text-secondary);font-size:0.85rem;display:flex;align-items:center;gap:4px;">
        <i data-lucide="user" style="width:14px;height:14px;"></i> ${user.name}
      </span>
      <a href="#" onclick="logout();return false;" class="nav-link" style="color:var(--accent-danger);padding:0.4rem 0.8rem;font-size:0.85rem;">
        <i data-lucide="log-out" style="width:14px;height:14px;"></i> Salir
      </a>
    `;
  } else {
    authDiv.innerHTML = `
      <a href="/login" class="nav-link" style="padding:0.4rem 0.8rem;font-size:0.85rem;">
        <i data-lucide="log-in" style="width:14px;height:14px;"></i> Ingresar
      </a>
      <a href="/register" class="nav-link btn" style="padding:0.4rem 0.8rem;font-size:0.85rem;">
        Registrarse
      </a>
    `;
  }

  nav.appendChild(authDiv);
  if (typeof lucide !== 'undefined') lucide.createIcons();
});
