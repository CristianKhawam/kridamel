// Script for product.html?slug=classic-flannel-shirt
// Shows the product and lets the customer pick a variant (colour, size…).
// Each variant has its own stock, so the stock message and the button change with the selection.
const slug = new URLSearchParams(location.search).get('slug');
const statusEl = document.getElementById('status');
const LABELS = { color: 'Colour', size: 'Size' };

let product; // filled after loading
const selected = {}; // the chosen value per attribute, e.g. { color: 'Black', size: 'M' }

// Attributes this product's variants use, e.g. ['color', 'size'] (some products have none).
function attributeNames() {
  return ['color', 'size'].filter((name) => product.variants.some((v) => v.attributes?.[name]));
}

// Different values of one attribute, in the order they appear: ['Black', 'Olive'].
function valuesOf(name) {
  return [...new Set(product.variants.map((v) => v.attributes?.[name]))];
}

// The variant matching every selected attribute, or undefined if something is not chosen yet.
function selectedVariant() {
  const names = attributeNames();
  if (names.some((name) => !selected[name])) return undefined;
  return product.variants.find((v) => names.every((name) => v.attributes?.[name] === selected[name]));
}

function showProduct() {
  document.title = `${product.name} · KRIDAMEL`;

  // Gallery: main image + thumbnails when there is more than one image.
  const mainImage = document.getElementById('main-image');
  mainImage.src = product.images[0];
  mainImage.alt = product.name;
  if (product.images.length > 1) {
    const thumbs = product.images.map((url) => {
      const button = document.createElement('button');
      button.type = 'button';
      const img = document.createElement('img');
      img.src = url;
      img.alt = '';
      button.append(img);
      button.addEventListener('click', () => { mainImage.src = url; });
      return button;
    });
    document.getElementById('thumbnails').replaceChildren(...thumbs);
  }

  const categoryLink = document.getElementById('category-link');
  categoryLink.href = `/customer/category.html?slug=${encodeURIComponent(product.category.slug)}`;
  categoryLink.textContent = `← ${product.category.name}`;

  document.getElementById('product-name').textContent = product.name;
  document.getElementById('product-brand').textContent = product.brand.name;
  document.getElementById('product-description').textContent = product.description || '';

  const price = document.getElementById('product-price');
  if (product.salePrice) {
    const sale = document.createElement('strong');
    sale.textContent = formatPrice(product.salePrice);
    const regular = document.createElement('s');
    regular.textContent = formatPrice(product.price);
    price.append(sale, ' ', regular, ` Save ${formatPrice(product.price - product.salePrice)}`);
  } else {
    price.textContent = formatPrice(product.price);
  }

  const tags = product.tags.map((tag) => {
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.textContent = tag.name;
    return chip;
  });
  document.getElementById('product-tags').replaceChildren(...tags);

  // If an attribute has only one value (e.g. one colour), choose it automatically.
  for (const name of attributeNames()) {
    const values = valuesOf(name);
    if (values.length === 1) selected[name] = values[0];
  }

  showOptions();
  updateStock();
  document.getElementById('product').hidden = false;
}

// One group of buttons per attribute. The chosen button gets aria-pressed="true".
function showOptions() {
  const groups = attributeNames().map((name) => {
    const group = document.createElement('fieldset');
    group.className = 'option-group';
    const legend = document.createElement('legend');
    legend.textContent = `${LABELS[name]}: ${selected[name] || 'choose one'}`;
    group.append(legend);

    for (const value of valuesOf(name)) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'option';
      button.textContent = value;
      button.setAttribute('aria-pressed', String(selected[name] === value));
      button.addEventListener('click', () => {
        selected[name] = value;
        showOptions();
        updateStock();
      });
      group.append(button);
    }
    return group;
  });
  document.getElementById('options').replaceChildren(...groups);
}

// Stock message + enable/disable "Add to cart" for the selected variant.
function updateStock() {
  const stockEl = document.getElementById('stock');
  const button = document.getElementById('add-to-cart');
  const quantity = document.getElementById('quantity');
  const variant = selectedVariant();

  stockEl.className = 'stock';
  if (!variant) {
    const missing = attributeNames().filter((name) => !selected[name]).map((name) => LABELS[name].toLowerCase());
    stockEl.textContent = `Choose a ${missing.join(' and ')}.`;
    button.disabled = true;
  } else if (variant.stock === 0) {
    stockEl.textContent = 'Out of stock';
    stockEl.classList.add('out');
    button.disabled = true;
  } else {
    stockEl.textContent = variant.stock <= variant.lowStockThreshold ? `Only ${variant.stock} left` : 'In stock';
    stockEl.classList.add(variant.stock <= variant.lowStockThreshold ? 'low' : 'ok');
    button.disabled = false;
    quantity.max = variant.stock;
    if (Number(quantity.value) > variant.stock) quantity.value = variant.stock;
  }
}

document.getElementById('add-to-cart').addEventListener('click', () => {
  const variant = selectedVariant();
  const quantity = Number(document.getElementById('quantity').value);
  const message = document.getElementById('cart-message');
  if (!variant || variant.stock === 0) return; // the button is disabled in this case anyway
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > variant.stock) {
    message.textContent = `Choose a quantity between 1 and ${variant.stock}.`;
    return;
  }
  // shortcut: the cart API arrives in Checkpoint 3 (issues #12 and #13); then call
  // api('/api/cart/items', { method: 'POST', body: { productId: product._id, variantId: variant._id, quantity } })
  message.textContent = 'The cart will be available soon.';
});

async function loadProduct() {
  if (!slug) {
    statusEl.textContent = 'No product selected.';
    return;
  }
  statusEl.textContent = 'Loading…';
  try {
    product = await api(`/api/products/${encodeURIComponent(slug)}`);
    showProduct();
    statusEl.textContent = '';
  } catch (err) {
    statusEl.classList.add('error');
    if (err.status === 404) {
      statusEl.textContent = 'Product not found. ';
      const home = document.createElement('a');
      home.href = '/customer/';
      home.textContent = 'Back to the store';
      statusEl.append(home);
    } else {
      statusEl.textContent = `Could not load the product: ${err.message}`;
    }
  }
}

loadProduct();
