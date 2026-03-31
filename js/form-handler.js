/* ═══════════════════════════════════════════════════════════════
   INDUS AUTOMATION — Form Handler (Web3Forms + hCaptcha)
   On success: sets a flag in sessionStorage, redirects to
   /Website/thank-you.html. The flag is cleared on that page
   after rendering — so refresh sends user back to contact.
   ═══════════════════════════════════════════════════════════════ */

const WEB3FORMS_KEY = 'c5f0c2b9-dded-4a61-9544-2a514b6d6ad1';

document.addEventListener('DOMContentLoaded', () => {
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
});

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

/* ─── FORM SUBMIT ─── */
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const statusEl = form.querySelector('.form-status') || createStatusEl(form);

  // Validate required fields
  let allValid = true;
  form.querySelectorAll('[required]').forEach(field => {
    if (!validateField(field)) allValid = false;
  });
  if (!allValid) {
    showStatus(statusEl, 'Please fill in all required fields.', 'error');
    return;
  }

  // ── hCaptcha validation ──
  const hCaptchaField = form.querySelector('textarea[name="h-captcha-response"]');
  if (!hCaptchaField || !hCaptchaField.value) {
    showStatus(statusEl, 'Please complete the captcha verification.', 'error');
    return;
  }

  // Honeypot
  const honeypot = form.querySelector('[name="website"]');
  if (honeypot && honeypot.value) return;

  // Build FormData
  const formData = new FormData();
  formData.append('access_key', WEB3FORMS_KEY);
  formData.append('subject', 'New Quote Request from ' + form.querySelector('[name="name"]').value.trim());
  formData.append('from_name', 'Indus Automation Website');
  formData.append('botcheck', '');
  formData.append('h-captcha-response', hCaptchaField.value);
  formData.append('replyto', form.querySelector('[name="email"]').value.trim());

  formData.append('Name', form.querySelector('[name="name"]').value.trim());
  formData.append('Email', form.querySelector('[name="email"]').value.trim());
  formData.append('Phone', form.querySelector('[name="phone"]')?.value.trim() || 'Not provided');
  formData.append('Company', form.querySelector('[name="company"]')?.value.trim() || 'Not provided');
  formData.append('Service Requested', form.querySelector('[name="service"]')?.value || 'Not specified');
  formData.append('Industry', form.querySelector('[name="industry"]')?.value || 'Not specified');
  formData.append('Timeline', form.querySelector('[name="timeline"]')?.value || 'Not specified');
  formData.append('Message', form.querySelector('[name="message"]').value.trim());

  const prefs = [];
  if (form.querySelector('[name="request_quote"]')?.checked) prefs.push('Formal Quote Requested');
  if (form.querySelector('[name="request_callback"]')?.checked) prefs.push('Callback Requested');
  if (form.querySelector('[name="is_emergency"]')?.checked) prefs.push('⚠ EMERGENCY / URGENT');
  if (prefs.length) formData.append('Preferences', prefs.join(', '));

  // Loading state
  const origHTML = btn.innerHTML;
  btn.innerHTML = 'Sending...';
  btn.classList.add('loading');
  statusEl.style.display = 'none';

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      // Set flag and redirect to thank-you page
      sessionStorage.setItem('indus_form_submitted', 'true');
      window.location.href = '/Website/thank-you.html';
    } else {
      btn.innerHTML = origHTML;
      btn.classList.remove('loading');
      showStatus(statusEl, (result.message || 'Something went wrong.') + ' Please call us at 204-943-0050.', 'error');
    }
  } catch (error) {
    console.error('[Indus] Form submission failed:', error);
    btn.innerHTML = origHTML;
    btn.classList.remove('loading');
    showStatus(statusEl, 'Connection error. Please call us at 204-943-0050 or try again.', 'error');
  }
}

function createStatusEl(form) {
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
