// Script for index.html (home page).
// Pattern every page follows: show "loading", call the API with api(), then show the data or the error.
const statusEl = document.getElementById('status');

// One card per top-level category, coloured with the category's theme colour.
function categoryCard(category) {
  const card = document.createElement('a');
  card.className = 'card category-card';
  card.href = `/customer/category.html?slug=${encodeURIComponent(category.slug)}`;
  card.style.setProperty('--theme', category.themeColor);

  const image = document.createElement('img');
  image.src = category.cardImageUrl;
  image.alt = '';

  const name = document.createElement('h3');
  name.textContent = category.name;

  const link = document.createElement('span');
  link.textContent = 'Shop now →';

  card.append(image, name, link);
  return card;
}

async function loadHome() {
  statusEl.textContent = 'Loading…';
  try {
    // The three requests run at the same time.
    const [categories, featured, bestSellers] = await Promise.all([
      api('/api/categories'),
      api('/api/products?featured=true&limit=8'),
      api('/api/products?sort=best_selling&limit=8'),
    ]);

    document.getElementById('categories').replaceChildren(...categories.map(categoryCard));
    showProducts(document.getElementById('featured'), featured.items, 'No featured products yet.');
    showProducts(document.getElementById('best-sellers'), bestSellers.items, 'No products yet.');
    statusEl.textContent = '';
  } catch (err) {
    statusEl.textContent = `Could not load the store: ${err.message}`;
    statusEl.classList.add('error');
  }
}

loadHome();
