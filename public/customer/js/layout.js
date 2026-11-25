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
    <a href="/customer/login.html">Account</a>
    <a href="/customer/orders.html">Orders</a>
    <a href="/customer/cart.html">Cart</a>
  </nav>`;

document.getElementById('site-footer').textContent =
  '© 2026 KRIDAMEL · Your World. Your Store. · Prices in CAD';

// Underline the menu link of the page we are on.
for (const link of document.querySelectorAll('#site-header nav a')) {
  if (link.pathname + link.search === location.pathname + location.search) {
    link.setAttribute('aria-current', 'page');
  }
}
