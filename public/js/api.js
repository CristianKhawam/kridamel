// Shared helpers loaded on every page (before the page's own script).
// Every page calls the API through api() so errors are handled the same way everywhere.

/**
 * Calls our REST API and returns the JSON response.
 * Throws an Error with .status and .details when the server answers with an error.
 *
 *   const data = await api('/api/health');
 *   await api('/api/cart/items', { method: 'POST', body: { productId, variantId, quantity: 1 } });
 */
async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'same-origin', // sends the login cookie
  });

  const data = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    const err = new Error((data && data.error) || `Request failed (${res.status})`);
    err.status = res.status;
    err.details = data && data.details;
    throw err;
  }
  return data;
}

/** Formats integer cents as Canadian dollars: formatPrice(2499) → "$24.99" */
function formatPrice(cents) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(cents / 100);
}

/**
 * Shows the API's validation errors next to the form fields.
 * The API sends details like [{ field: 'email', message: 'must be a valid email' }];
 * each message appears under the input whose name is that field.
 */
function showFieldErrors(form, details = []) {
  clearFieldErrors(form);
  for (const { field, message } of details) {
    const input = form.elements[field];
    if (!input) continue;
    input.setAttribute('aria-invalid', 'true');
    const error = document.createElement('small');
    error.className = 'field-error';
    error.textContent = message;
    input.after(error);
  }
}

function clearFieldErrors(form) {
  form.querySelectorAll('.field-error').forEach((el) => el.remove());
  form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
}
