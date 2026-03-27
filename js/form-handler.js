/* ═══════════════════════════════════════════════════════════════
   INDUS AUTOMATION — Form Handler (Web3Forms + hCaptcha)
   Sends real emails WITH file attachments + spam protection.
   Free: Unlimited submissions. No backend needed.

   SETUP (3 minutes):
   1. Go to https://web3forms.com
   2. Enter your email → you'll receive an Access Key via email
   3. Paste that Access Key below replacing YOUR_ACCESS_KEY
   4. Done — emails flow to your inbox, captcha blocks bots
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

  // Honeypot check (backup spam filter)
  const honeypot = form.querySelector('[name="website"]');
  if (honeypot && honeypot.value) return;

  // Build FormData object for submission
  const formData = new FormData();

  // ── Web3Forms required fields ──
  formData.append('access_key', 'c5f0c2b9-dded-4a61-9544-2a514b6d6ad1');
  formData.append('subject', 'New Quote Request from ' + (form.querySelector('[name="name"]').value.trim()));
  formData.append('from_name', 'Indus Automation Website');

  // Enable hCaptcha verification (built into Web3Forms)
  formData.append('botcheck', '');

  // Get hCaptcha response token if widget is present
  const hcaptchaResponse = form.querySelector('[name="h-captcha-response"]');
  if (hcaptchaResponse && hcaptchaResponse.value) {
    formData.append('h-captcha-response', hcaptchaResponse.value);
  }

  // ── Contact fields ──
  formData.append('Name', form.querySelector('[name="name"]').value.trim());
  formData.append('Email', form.querySelector('[name="email"]').value.trim());
  formData.append('Phone', form.querySelector('[name="phone"]')?.value.trim() || 'Not provided');
  formData.append('Company', form.querySelector('[name="company"]')?.value.trim() || 'Not provided');
  formData.append('Service Requested', form.querySelector('[name="service"]')?.value || 'Not specified');
  formData.append('Industry', form.querySelector('[name="industry"]')?.value || 'Not specified');
  formData.append('Timeline', form.querySelector('[name="timeline"]')?.value || 'Not specified');
  formData.append('Message', form.querySelector('[name="message"]').value.trim());

  // Reply-to so you can hit Reply in your email client
  formData.append('replyto', form.querySelector('[name="email"]').value.trim());

  // ── Checkboxes ──
  const prefs = [];
  if (form.querySelector('[name="request_quote"]')?.checked) prefs.push('Formal Quote Requested');
  if (form.querySelector('[name="request_callback"]')?.checked) prefs.push('Callback Requested');
  if (form.querySelector('[name="is_emergency"]')?.checked) prefs.push('⚠ EMERGENCY / URGENT');
  if (prefs.length) formData.append('Preferences', prefs.join(', '));

  // ── File attachments ──
  const files = typeof window.getUploadedFiles === 'function' ? window.getUploadedFiles() : [];
  files.forEach((file, i) => {
    formData.append(`attachment`, file, file.name);
  });

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
        showStatus(statusEl, 'Message sent successfully! We\'ll respond within one business day.', 'success');
        form.reset();

        // Reset hCaptcha widget
        if (typeof hcaptcha !== 'undefined') hcaptcha.reset();

        // Clear file uploads
        const fileList = document.getElementById('fileList');
        if (fileList) fileList.innerHTML = '';
        if (typeof window.getUploadedFiles === 'function') {
          window.getUploadedFiles().length = 0;
        }
      } else {
        showStatus(statusEl, (result.message || 'Something went wrong.') + ' Please call us at 204-943-0050.', 'error');
      }
  } catch (error) {
    console.error('[Indus] Form submission failed:', error);
    showStatus(statusEl, 'Connection error. Please call us at 204-943-0050 or try again.', 'error');
  } finally {
    btn.innerHTML = origHTML;
    btn.classList.remove('loading');
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
