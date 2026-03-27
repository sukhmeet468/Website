/* ═══════════════════════════════════════════════════════════════
   INDUS AUTOMATION — Form Handler (Formspree)
   Sends real emails WITH file attachments. No backend needed.
   Free tier: 50 submissions/month. Paid plans for more.

   SETUP (2 minutes):
   1. Go to https://formspree.io and sign up (free)
   2. Click "New Form" → name it "Indus Contact Form"
   3. Copy your Form ID (looks like: xyzabcde)
   4. Paste it below replacing YOUR_FORM_ID
   5. Done — emails with attachments will flow to your inbox
   ═══════════════════════════════════════════════════════════════ */

const FORMSPREE_ID = 'xojpjvdo';

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

  // Honeypot check
  const honeypot = form.querySelector('[name="website"]');
  if (honeypot && honeypot.value) return;

  // Build FormData (supports file uploads)
  const formData = new FormData();

  // Text fields
  formData.append('Name', form.querySelector('[name="name"]').value.trim());
  formData.append('Email', form.querySelector('[name="email"]').value.trim());
  formData.append('Phone', form.querySelector('[name="phone"]')?.value.trim() || 'Not provided');
  formData.append('Company', form.querySelector('[name="company"]')?.value.trim() || 'Not provided');
  formData.append('Service', form.querySelector('[name="service"]')?.value || 'Not specified');
  formData.append('Industry', form.querySelector('[name="industry"]')?.value || 'Not specified');
  formData.append('Timeline', form.querySelector('[name="timeline"]')?.value || 'Not specified');
  formData.append('Message', form.querySelector('[name="message"]').value.trim());

  // Checkboxes
  const prefs = [];
  if (form.querySelector('[name="request_quote"]')?.checked) prefs.push('Formal Quote Requested');
  if (form.querySelector('[name="request_callback"]')?.checked) prefs.push('Callback Requested');
  if (form.querySelector('[name="is_emergency"]')?.checked) prefs.push('EMERGENCY / URGENT');
  if (prefs.length) formData.append('Preferences', prefs.join(', '));

  // File attachments
  const files = typeof window.getUploadedFiles === 'function' ? window.getUploadedFiles() : [];
  files.forEach((file, i) => {
    formData.append(`attachment_${i + 1}`, file, file.name);
  });

  // Formspree metadata
  formData.append('_subject', 'New Quote Request from ' + form.querySelector('[name="name"]').value.trim());
  formData.append('_replyto', form.querySelector('[name="email"]').value.trim());

  // Loading state
  const origHTML = btn.innerHTML;
  btn.innerHTML = 'Sending...';
  btn.classList.add('loading');
  statusEl.style.display = 'none';

  try {
    if (FORMSPREE_ID === 'YOUR_FORM_ID') {
      // ── DEMO MODE ──
      await new Promise(r => setTimeout(r, 1500));
      showStatus(statusEl, 'Demo mode — Formspree not configured yet. Open js/form-handler.js and paste your Form ID.', 'success');
      console.log('[Indus] Form data (demo):', Object.fromEntries(formData));
      console.log('[Indus] Files attached:', files.map(f => f.name));
    } else {
      // ── LIVE MODE — Send to Formspree ──
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        showStatus(statusEl, 'Message sent successfully! We\'ll respond within one business day.', 'success');
        form.reset();
        // Clear file uploads
        if (document.getElementById('fileList')) document.getElementById('fileList').innerHTML = '';
        if (typeof window.getUploadedFiles === 'function') {
          const fileArr = window.getUploadedFiles();
          fileArr.length = 0;
        }
      } else {
        const data = await response.json();
        const errorMsg = data.errors ? data.errors.map(e => e.message).join(', ') : 'Something went wrong.';
        showStatus(statusEl, errorMsg + ' Please call us at 204-943-0050.', 'error');
      }
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
