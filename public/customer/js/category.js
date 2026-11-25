// Script for category.html?slug=clothing
// The filters live in the page URL (the form is a normal GET form), so a filtered page can be
// reloaded, bookmarked or shared. This script reads the URL, asks the API and shows the results.
const params = new URLSearchParams(location.search);
const slug = params.get('slug');
const PAGE_SIZE = 8; // products per page

const statusEl = document.getElementById('status');
const form = document.getElementById('filters');

// Banner, parent link and subcategory chips.
function showCategory(category) {
  document.title = `${category.name} · KRIDAMEL`;
  const banner = document.getElementById('banner');
  banner.style.setProperty('--theme', category.themeColor);
  banner.hidden = false;
  document.getElementById('category-name').textContent = category.name;
  document.getElementById('category-description').textContent = category.description || '';

  if (category.parent) {
    const parentLink = document.getElementById('parent-link');
    parentLink.href = `?slug=${encodeURIComponent(category.parent.slug)}`;
    parentLink.textContent = `← ${category.parent.name}`;
    parentLink.hidden = false;
  }

  const chips = category.children.map((child) => {
    const chip = document.createElement('a');
    chip.className = 'chip';
    chip.href = `?slug=${encodeURIComponent(child.slug)}`;
    chip.textContent = child.name;
    return chip;
  });
  document.getElementById('subcategories').replaceChildren(...chips);
}

// Puts the brands in the select and re-selects the filters that are in the URL.
function fillForm(brands) {
  const brandSelect = form.elements.brand;
  for (const brand of brands) {
    brandSelect.add(new Option(brand.name, brand._id));
  }
  form.elements.slug.value = slug;
  brandSelect.value = params.get('brand') || '';
  form.elements.min.value = params.get('min') || '';
  form.elements.max.value = params.get('max') || '';
  form.elements.inStock.checked = params.get('inStock') === 'true';
  form.elements.sort.value = params.get('sort') || 'newest';
  document.getElementById('clear-filters').href = `?slug=${encodeURIComponent(slug)}`;
  form.hidden = false;
}

// Turns the page URL into the API query. The form uses dollars; the API uses cents.
function apiQuery() {
  const query = new URLSearchParams({ category: slug, page: params.get('page') || '1', limit: String(PAGE_SIZE) });
  for (const name of ['brand', 'inStock', 'sort']) {
    if (params.get(name)) query.set(name, params.get(name));
  }
  if (params.get('min')) query.set('minPrice', Math.round(params.get('min') * 100));
  if (params.get('max')) query.set('maxPrice', Math.round(params.get('max') * 100));
  return query;
}

// "← Previous  Page 1 of 3  Next →" links that keep the current filters.
function showPagination(page, totalPages) {
  const links = [];
  const pageLink = (number, text) => {
    const copy = new URLSearchParams(params);
    copy.set('page', number);
    const link = document.createElement('a');
    link.href = `?${copy}`;
    link.textContent = text;
    return link;
  };
  if (page > 1) links.push(pageLink(page - 1, '← Previous'));
  if (totalPages > 1) {
    const info = document.createElement('span');
    info.textContent = `Page ${page} of ${totalPages}`;
    links.push(info);
  }
  if (page < totalPages) links.push(pageLink(page + 1, 'Next →'));
  document.getElementById('pagination').replaceChildren(...links);
}

async function loadCategoryPage() {
  if (!slug) {
    statusEl.textContent = 'No category selected.';
    return;
  }
  statusEl.textContent = 'Loading…';
  try {
    const [category, brands] = await Promise.all([
      api(`/api/categories/${encodeURIComponent(slug)}`),
      api('/api/brands'),
    ]);
    showCategory(category);
    fillForm(brands);

    const result = await api(`/api/products?${apiQuery()}`);
    showProducts(document.getElementById('products'), result.items, 'No products match these filters.');
    showPagination(result.page, result.totalPages);
    statusEl.textContent = `${result.total} product${result.total === 1 ? '' : 's'}`;
  } catch (err) {
    statusEl.textContent = err.status === 404 ? 'Category not found.' : `Could not load products: ${err.message}`;
    statusEl.classList.add('error');
  }
}

loadCategoryPage();
