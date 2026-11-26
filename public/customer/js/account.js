// Script for account.html (logged-in customers only)
async function loadAccount() {
  const user = await sessionReady; // from layout.js
  if (!user) return goToLogin();

  const address = user.addresses.find((a) => a.isDefault) || user.addresses[0];
  document.getElementById('account-name').textContent = user.name;
  document.getElementById('account-email').textContent = user.email;
  document.getElementById('account-phone').textContent = user.phone || '—';
  document.getElementById('account-address').textContent = address
    ? `${address.line1}, ${address.city} ${address.province} ${address.postalCode}`
    : '—';
  document.getElementById('account-since').textContent = new Date(user.createdAt).toLocaleDateString('en-CA');
  document.getElementById('account').hidden = false;
}

document.getElementById('logout').addEventListener('click', async () => {
  await api('/api/auth/logout', { method: 'POST' });
  location.href = '/customer/';
});

loadAccount();
