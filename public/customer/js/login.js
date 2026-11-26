// Script for login.html (optionally login.html?next=/customer/cart.html)
const form = document.getElementById('login-form');
const statusEl = document.getElementById('status');

// Where to go after logging in. Only paths of OUR site are accepted ("/..."), never "//other-site.com",
// so nobody can build a login link that sends people to another website.
function nextPage() {
  const next = new URLSearchParams(location.search).get('next');
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/customer/account.html';
}

// Keep the "next" page when the visitor goes to register instead.
document.getElementById('register-link').href = `/customer/register.html${location.search}`;

form.addEventListener('submit', async (event) => {
  event.preventDefault(); // we send the form with JavaScript instead of reloading the page
  const button = form.querySelector('button');
  button.disabled = true;
  statusEl.className = 'status';
  statusEl.textContent = 'Logging in…';

  try {
    const { user } = await api('/api/auth/login', {
      method: 'POST',
      body: { email: form.elements.email.value, password: form.elements.password.value },
    });
    // Admins go to their dashboard; customers go back where they were (or to their account).
    location.href = user.role === 'admin' ? '/admin/' : nextPage();
  } catch (err) {
    statusEl.textContent = err.message; // e.g. "Invalid email or password"
    statusEl.classList.add('error');
    button.disabled = false;
  }
});
