// Run with: npm test
// Tests how the query string is turned into a MongoDB filter (no database needed).
const test = require('node:test');
const assert = require('node:assert');
const { parseProductQuery } = require('./products.controller');

test('no query: active products, newest first, page 1 of 12', () => {
  const r = parseProductQuery({});
  assert.deepStrictEqual(r.errors, []);
  assert.deepStrictEqual(r.filter, { isActive: true });
  assert.deepStrictEqual(r.sort, { createdAt: -1, _id: 1 });
  assert.strictEqual(r.page, 1);
  assert.strictEqual(r.limit, 12);
});

test('search text is escaped so symbols are searched literally', () => {
  const r = parseProductQuery({ q: 'a+b' });
  assert.deepStrictEqual(r.filter.name, { $regex: 'a\\+b', $options: 'i' });
});

test('size, colour and inStock match the same variant', () => {
  const r = parseProductQuery({ size: 'M', color: 'Black', inStock: 'true' });
  assert.deepStrictEqual(r.filter.variants, {
    $elemMatch: { 'attributes.size': 'M', 'attributes.color': 'Black', stock: { $gt: 0 } },
  });
});

test('price range uses the current price (sale price when there is one)', () => {
  const r = parseProductQuery({ minPrice: '1000', maxPrice: '5000' });
  assert.deepStrictEqual(r.filter.currentPrice, { $gte: 1000, $lte: 5000 });
});

test('invalid values are reported, not ignored', () => {
  const r = parseProductQuery({ sort: 'cheapest', page: '0', limit: '100', minPrice: 'abc', brand: 'nope', inStock: 'yes' });
  const fields = r.errors.map((e) => e.field).sort();
  assert.deepStrictEqual(fields, ['brand', 'inStock', 'limit', 'minPrice', 'page', 'sort']);
});

test('category and tag slugs are passed on to be looked up', () => {
  const r = parseProductQuery({ category: 'clothing', tag: 'sale' });
  assert.strictEqual(r.categorySlug, 'clothing');
  assert.strictEqual(r.tagSlug, 'sale');
});
