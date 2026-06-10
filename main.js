/* ═══════════════════════════════════════
   CONFIGURACIÓN
   ─────────────────────────────────────
   Reemplaza SHEET_URL con la URL de tu
   Google Apps Script Web App (ver README)
═══════════════════════════════════════ */
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwpctWetnAT5OKHzUy1eOsRW1xKlqerMpz8zWV353GU1GtsZUxscZCYRLL5emXCgdcNtQ/exec';

/* ═══════════════════════════════════════
   NAVBAR — scroll effect
═══════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ═══════════════════════════════════════
   HAMBURGER MENU
═══════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.style.display === 'flex';
  mobileMenu.style.display = isOpen ? 'none' : 'flex';
  hamburger.classList.toggle('open', !isOpen);
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.style.display = 'none';
    hamburger.classList.remove('open');
  });
});

/* ═══════════════════════════════════════
   HERO PARTICLES
═══════════════════════════════════════ */
(function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${80 + Math.random() * 20}%;
      width: ${1 + Math.random() * 3}px;
      height: ${1 + Math.random() * 3}px;
      animation-duration: ${6 + Math.random() * 10}s;
      animation-delay: ${Math.random() * 8}s;
      opacity: 0;
    `;
    container.appendChild(p);
  }
})();

/* ═══════════════════════════════════════
   SCROLL ANIMATIONS (Intersection Observer)
═══════════════════════════════════════ */
const animElements = document.querySelectorAll(
  '.service-card, .step, .benefits-list li, .trust-item, ' +
  '.section-header, .nosotros-visual, .contact-info, .contact-form-wrap'
);

animElements.forEach((el, i) => {
  el.setAttribute('data-anim', '');
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('[data-anim]').forEach(el => observer.observe(el));

/* ═══════════════════════════════════════
   FORMULARIO → GOOGLE SHEETS
═══════════════════════════════════════ */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMsg = document.getElementById('formMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const telefono = form.telefono.value.trim();
  const correo = form.correo.value.trim();
  const asunto = form.asunto.value.trim();

  // Validación básica
  if (!telefono || !correo) {
    showMsg('Por favor completa los campos requeridos.', 'error');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo)) {
    showMsg('Por favor ingresa un correo electrónico válido.', 'error');
    return;
  }

  // Estado de carga
  setLoading(true);

  try {
    const params = new URLSearchParams();
    params.append('telefono', telefono);
    params.append('correo', correo);
    params.append('asunto', asunto || '(Sin descripción)');
    params.append('fecha', new Date().toLocaleString('es-GT', { timeZone: 'America/Guatemala' }));

    const res = await fetch(SHEET_URL, {
      method: 'POST',
      body: params,
    });

    showMsg('✅ Mensaje enviado correctamente. Nos comunicaremos contigo pronto.', 'success');
    form.reset();
  } catch (err) {
    showMsg('Ocurrió un error al enviar. Por favor intenta de nuevo o contáctanos directamente.', 'error');
  } finally {
    setLoading(false);
  }
});

function setLoading(loading) {
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  const btnArrow = submitBtn.querySelector('.btn-arrow');

  submitBtn.disabled = loading;
  btnText.style.display = loading ? 'none' : 'inline';
  btnLoading.style.display = loading ? 'inline-flex' : 'none';
  if (btnArrow) btnArrow.style.display = loading ? 'none' : 'inline';
}

function showMsg(msg, type) {
  formMsg.textContent = msg;
  formMsg.className = 'form-msg ' + type;
  formMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  if (type === 'success') {
    setTimeout(() => { formMsg.className = 'form-msg'; formMsg.textContent = ''; }, 6000);
  }
}

function fakeSend() {
  return new Promise(resolve => setTimeout(resolve, 1200));
}

/* ═══════════════════════════════════════
   SMOOTH SCROLL para links internos
═══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
