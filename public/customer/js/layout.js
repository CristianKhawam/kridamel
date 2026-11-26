// Header and footer for EVERY customer page.
// Change the menu or the footer here once and all customer pages update.
// Each page only needs <header id="site-header" class="site-header"></header>
// and <footer id="site-footer" class="site-footer"></footer>.

document.getElementById('site-header').innerHTML = `
  <a class="logo" href="/customer/">KRIDAMEL</a>
  <nav>
    <a href="/customer/category.html?slug=clothing">Clothing</a>
    <a href="/customer/category.html?slug=electronics">Electronics</a>
    <a href="/customer/category.html?slug=sports">Sports</a>
  </nav>
  <nav>
    <a id="account-link" href="/customer/login.html">Log in</a>
    <a href="/customer/orders.html">Orders</a>
    <a href="/customer/cart.html">Cart</a>
  </nav>`;

document.getElementById('site-footer').innerHTML = `
  <p>© 2026 KRIDAMEL · Your World. Your Store. · Prices in CAD</p>
  <p>Website by
    <a href="https://github.com/CristianKhawam" target="_blank" rel="noopener">Cristian Khawam</a>,
    <a href="https://github.com/dima-hadla" target="_blank" rel="noopener">Dima Hadla</a> and
    <a href="https://github.com/ArnaudArmel" target="_blank" rel="noopener">Arnaud Armel</a>
    · <a href="https://github.com/CristianKhawam/kridamel" target="_blank" rel="noopener">Source code on GitHub</a></p>
  <p>Images: simple placeholder drawings made with AI for this project.</p>
  <p class="footer-note">School project for SODV1251 – Bow Valley College. KRIDAMEL is not a real store:
    products, brands and prices are fictitious and no real payments are made.</p>`;

// Underline the menu link of the page we are on.
for (const link of document.querySelectorAll('#site-header nav a')) {
  if (link.pathname + link.search === location.pathname + location.search) {
    link.setAttribute('aria-current', 'page');
  }
}

// Who is logged in? The logged-in user, or null for a visitor.
// Pages that need a login wait for it:  const user = await sessionReady;
const sessionReady = api('/api/auth/me')
  .then((data) => data.user)
  .catch(() => null);

sessionReady.then((user) => {
  if (!user) return;
  const account = document.getElementById('account-link');
  account.href = '/customer/account.html';
  account.textContent = `Hi, ${user.name.split(' ')[0]}`;
  if (user.role === 'admin') {
    const admin = document.createElement('a');
    admin.href = '/admin/';
    admin.textContent = 'Admin';
    account.before(admin);
  }
});

// Sends a visitor to the login page and brings them back here afterwards.
function goToLogin() {
  location.href = `/customer/login.html?next=${encodeURIComponent(location.pathname + location.search)}`;
}
