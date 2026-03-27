/* ═══════════════════════════════════════════════════════════════
   INDUS AUTOMATION — Form Handler (Web3Forms + hCaptcha)
   Sends real emails with spam protection. No backend needed.
   
   File uploads removed (Web3Forms Pro required).
   Users are directed to email attachments to info@indusautomation.com
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

  // ── hCaptcha validation — BLOCK submit if not completed ──
  const hCaptchaField = form.querySelector('textarea[name="h-captcha-response"]');
  if (!hCaptchaField || !hCaptchaField.value) {
    showStatus(statusEl, 'Please complete the captcha verification.', 'error');
    return;
  }

  // Honeypot check
  const honeypot = form.querySelector('[name="website"]');
  if (honeypot && honeypot.value) return;

  // Build FormData
  const formData = new FormData();

  // ── Web3Forms config ──
  formData.append('access_key', WEB3FORMS_KEY);
  formData.append('subject', 'New Quote Request from ' + form.querySelector('[name="name"]').value.trim());
  formData.append('from_name', 'Indus Automation Website');
  formData.append('botcheck', '');
  formData.append('h-captcha-response', hCaptchaField.value);
  formData.append('replyto', form.querySelector('[name="email"]').value.trim());

  // ── Contact fields ──
  formData.append('Name', form.querySelector('[name="name"]').value.trim());
  formData.append('Email', form.querySelector('[name="email"]').value.trim());
  formData.append('Phone', form.querySelector('[name="phone"]')?.value.trim() || 'Not provided');
  formData.append('Company', form.querySelector('[name="company"]')?.value.trim() || 'Not provided');
  formData.append('Service Requested', form.querySelector('[name="service"]')?.value || 'Not specified');
  formData.append('Industry', form.querySelector('[name="industry"]')?.value || 'Not specified');
  formData.append('Timeline', form.querySelector('[name="timeline"]')?.value || 'Not specified');
  formData.append('Message', form.querySelector('[name="message"]').value.trim());

  // ── Checkboxes ──
  const prefs = [];
  if (form.querySelector('[name="request_quote"]')?.checked) prefs.push('Formal Quote Requested');
  if (form.querySelector('[name="request_callback"]')?.checked) prefs.push('Callback Requested');
  if (form.querySelector('[name="is_emergency"]')?.checked) prefs.push('⚠ EMERGENCY / URGENT');
  if (prefs.length) formData.append('Preferences', prefs.join(', '));

  // ── Loading state ──
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
      showThankYou(form);
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

/* ─── THANK YOU MESSAGE (replaces form until page refresh) ─── */
function showThankYou(form) {
  const wrapper = form.parentElement;
  form.style.display = 'none';

  const thankYou = document.createElement('div');
  thankYou.className = 'thank-you-message';
  thankYou.innerHTML = `
    <div class="thank-you-icon">
      <svg viewBox="0 0 24 24" width="64" height="64" stroke="#e60000" fill="none" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 12l3 3 5-5"/>
      </svg>
    </div>
    <h2>Thank You!</h2>
    <p>Your message has been sent successfully. Our team will review your inquiry and respond within <strong>one business day</strong>.</p>
    <p class="thank-you-sub">If your request is urgent, don't wait — call us directly at <a href="tel:+12049430050">204-943-0050</a> (24-hour emergency support available).</p>
    <div class="thank-you-attach">
      <svg viewBox="0 0 24 24" width="20" height="20" stroke="#e60000" fill="none" stroke-width="1.5"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
      <span>Need to send drawings, specs, or documents? Email them to <a href="mailto:info@indusautomation.com">info@indusautomation.com</a> and reference your inquiry.</span>
    </div>
  `;
  wrapper.appendChild(thankYou);
  wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ─── HELPERS ─── */
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
