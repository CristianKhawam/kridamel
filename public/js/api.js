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
