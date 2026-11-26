// Script for register.html
const form = document.getElementById('register-form');
const statusEl = document.getElementById('status');
const PROFILE_FIELDS = ['name', 'phone', 'address.line1', 'address.city', 'address.province', 'address.postalCode'];
let profiles = [];

// Fill the "Demo profile" select with the fictitious profiles from the API.
async function loadProfiles() {
  try {
    profiles = await api('/api/auth/demo-profiles');
    for (const profile of profiles) {
      form.elements.profile.add(new Option(profile.name, profile.id));
    }
  } catch {
    // Without profiles the form still works: the visitor types their own details.
  }
}

// Choosing a profile fills name, phone and address and makes them read-only.
// Choosing "None" empties them and lets the visitor type.
form.elements.profile.addEventListener('change', () => {
  const profile = profiles.find((p) => p.id === form.elements.profile.value);
  const values = profile
    ? { name: profile.name, phone: profile.phone, ...Object.fromEntries(Object.entries(profile.address).map(([k, v]) => [`address.${k}`, v])) }
    : {};
  for (const field of PROFILE_FIELDS) {
    form.elements[field].value = values[field] || '';
    form.elements[field].readOnly = Boolean(profile);
  }
  clearFieldErrors(form);
});

// Builds the request body. The address is only sent if at least one part was filled.
function formData() {
  const value = (name) => form.elements[name].value.trim();
  const body = { name: value('name'), email: value('email'), password: form.elements.password.value };
  if (value('phone')) body.phone = value('phone');
  const address = {
    line1: value('address.line1'),
    city: value('address.city'),
    province: value('address.province'),
    postalCode: value('address.postalCode'),
  };
  if (Object.values(address).some(Boolean)) body.address = address;
  return body;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = form.querySelector('button');
  button.disabled = true;
  statusEl.className = 'status';
  statusEl.textContent = 'Creating your account…';
  clearFieldErrors(form);

  try {
    await api('/api/auth/register', { method: 'POST', body: formData() });
    location.href = '/customer/account.html';
  } catch (err) {
    statusEl.textContent = err.message;
    statusEl.classList.add('error');
    if (err.status === 409) {
      showFieldErrors(form, [{ field: 'email', message: 'is already registered: log in instead' }]);
    } else {
      showFieldErrors(form, err.details); // messages next to each wrong field
    }
    button.disabled = false;
  }
});

loadProfiles();
