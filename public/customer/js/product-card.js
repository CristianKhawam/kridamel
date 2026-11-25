// Builds the product card used in every product grid (home, category, search).
// Load it after /js/api.js (it uses formatPrice) and before the page script.
// Text is set with textContent, so product data can never inject HTML.

function productCard(product) {
  const card = document.createElement('a');
  card.className = 'card product-card';
  card.href = `/customer/product.html?slug=${encodeURIComponent(product.slug)}`;

  const image = document.createElement('img');
  image.src = product.images[0];
  image.alt = product.name;
  image.loading = 'lazy';

  const name = document.createElement('h3');
  name.textContent = product.name;

  const brand = document.createElement('p');
  brand.className = 'muted';
  brand.textContent = product.brand ? product.brand.name : '';

  const price = document.createElement('p');
  price.className = 'price';
  if (product.salePrice) {
    const sale = document.createElement('strong');
    sale.textContent = formatPrice(product.salePrice);
    const regular = document.createElement('s');
    regular.textContent = formatPrice(product.price);
    price.append(sale, ' ', regular);
  } else {
    price.textContent = formatPrice(product.price);
  }

  card.append(image, name, brand, price);

  if (!product.variants.some((v) => v.stock > 0)) {
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = 'Out of stock';
    card.append(badge);
  }
  return card;
}

// Puts a list of products into a grid element, or a message if the list is empty.
function showProducts(gridEl, products, emptyMessage) {
  gridEl.replaceChildren(...products.map(productCard));
  if (products.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'muted';
    empty.textContent = emptyMessage;
    gridEl.append(empty);
  }
}
