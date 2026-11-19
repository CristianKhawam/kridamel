// Header and footer for EVERY admin page.
// Change the menu or the footer here once and all admin pages update.
// Each page only needs <header id="site-header" class="site-header"></header>
// and <footer id="site-footer" class="site-footer"></footer>.

document.getElementById('site-header').innerHTML = `
  <a class="logo" href="/admin/">KRIDAMEL ADMIN</a>
  <nav>
    <a href="/admin/">Dashboard</a>
    <a href="/admin/products.html">Products</a>
    <a href="/admin/orders.html">Orders</a>
    <a href="/admin/inventory.html">Inventory</a>
    <a href="/admin/reports.html">Reports</a>
    <a href="/customer/">View store</a>
  </nav>`;

document.getElementById('site-footer').textContent = 'KRIDAMEL Admin panel';

// Underline the menu link of the page we are on.
for (const link of document.querySelectorAll('#site-header nav a')) {
  if (link.pathname === location.pathname) link.setAttribute('aria-current', 'page');
}
