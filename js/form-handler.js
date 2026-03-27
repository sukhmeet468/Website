/* ═══════════════════════════════════════════════════════════════
   INDUS AUTOMATION — Form Handler
   Uses EmailJS to send real email notifications from the browser.
   No backend required. Free tier = 200 emails/month.
   
   SETUP INSTRUCTIONS:
   1. Go to https://www.emailjs.com/ and create a free account
   2. Add an Email Service (Gmail, Outlook, etc.)
   3. Create an Email Template with variables:
      {{from_name}}, {{from_email}}, {{phone}}, {{service}}, {{message}}
   4. Replace the 3 IDs below with your actual IDs
   ═══════════════════════════════════════════════════════════════ */

// ──── CONFIGURATION (Replace these with your EmailJS IDs) ────
const EMAILJS_CONFIG = {
  publicKey:  'YOUR_PUBLIC_KEY',      // EmailJS → Account → API Keys
  serviceId:  'YOUR_SERVICE_ID',      // EmailJS → Email Services → Service ID
  templateId: 'YOUR_TEMPLATE_ID',     // EmailJS → Email Templates → Template ID
};

// ──── NOTIFICATION EMAIL (who receives form submissions) ────
const NOTIFY_EMAIL = 'info@indusautomation.ca'; // Change to your real email

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', () => {
  // Load EmailJS SDK
  if (EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
    loadEmailJS();
  }
  initContactForm();
});

/* ─── LOAD EMAILJS SDK ─── */
function loadEmailJS() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  script.onload = () => {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    console.log('[Indus] EmailJS initialized');
  };
  document.head.appendChild(script);
}

/* ─── INIT CONTACT FORM ─── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', handleSubmit);

  // Real-time validation
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) validateField(field);
    });
  });
}

/* ─── FIELD VALIDATION ─── */
function validateField(field) {
  const value = field.value.trim();
  let valid = true;

  if (field.required && !value) {
    valid = false;
  } else if (field.type === 'email' && value) {
    valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  } else if (field.type === 'tel' && value) {
    valid = /^[\d\s\-\(\)\+]{7,}$/.test(value);
  }

  field.classList.toggle('invalid', !valid);
  field.style.borderColor = valid ? '' : 'var(--red)';
  return valid;
}

/* ─── FORM SUBMIT HANDLER ─── */
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const statusEl = form.querySelector('.form-status') || createStatusElement(form);

  // Validate all fields
  let allValid = true;
  form.querySelectorAll('[required]').forEach(field => {
    if (!validateField(field)) allValid = false;
  });

  if (!allValid) {
    showStatus(statusEl, 'Please fill in all required fields.', 'error');
    return;
  }

  // Honeypot check (anti-spam)
  const honeypot = form.querySelector('[name="website"]');
  if (honeypot && honeypot.value) return; // Bot detected

  // Collect data
  const data = {
    from_name: form.querySelector('[name="name"]').value.trim(),
    from_email: form.querySelector('[name="email"]').value.trim(),
    phone: form.querySelector('[name="phone"]')?.value.trim() || 'Not provided',
    service: form.querySelector('[name="service"]')?.value || 'Not specified',
    message: form.querySelector('[name="message"]').value.trim(),
    to_email: NOTIFY_EMAIL,
  };

  // UI: loading state
  const origHTML = btn.innerHTML;
  btn.innerHTML = 'Sending...';
  btn.classList.add('loading');
  statusEl.style.display = 'none';

  try {
    if (EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY' && typeof emailjs !== 'undefined') {
      // ──── LIVE MODE: Send via EmailJS ────
      await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, data);
      showStatus(statusEl, 'Message sent successfully! We\'ll respond within one business day.', 'success');
      form.reset();
    } else {
      // ──── DEMO MODE: Simulate send ────
      await new Promise(resolve => setTimeout(resolve, 1500));
      showStatus(statusEl, 'Demo mode — EmailJS not configured. See form-handler.js to connect.', 'success');
      console.log('[Indus] Form data (demo):', data);
      form.reset();
    }
  } catch (error) {
    console.error('[Indus] Email send failed:', error);
    showStatus(statusEl, 'Something went wrong. Please call us at 204-943-0050 or try again.', 'error');
  } finally {
    btn.innerHTML = origHTML;
    btn.classList.remove('loading');
  }
}

/* ─── STATUS MESSAGE ─── */
function createStatusElement(form) {
  const el = document.createElement('div');
  el.className = 'form-status';
  form.appendChild(el);
  return el;
}

function showStatus(el, message, type) {
  el.textContent = message;
  el.className = `form-status ${type}`;
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
