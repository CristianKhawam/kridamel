// Run with: npm test
// These tests call validate() on new documents, so they check the schema rules without a database.
const test = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');

// Returns the validation errors of a document ({} if it is valid).
async function errorsOf(doc) {
  try {
    await doc.validate();
    return {};
  } catch (err) {
    return err.errors;
  }
}

const id = () => new mongoose.Types.ObjectId();
const validProduct = () => ({
  name: 'Cotton Crew T-Shirt',
  slug: 'cotton-crew-t-shirt',
  category: id(),
  brand: id(),
  price: 1999,
  variants: [{ sku: 'TSH-WHT-M', attributes: { size: 'M', color: 'White' }, stock: 10 }],
});

test('a valid product passes validation', async () => {
  assert.deepStrictEqual(await errorsOf(new Product(validProduct())), {});
});

test('product without required fields is rejected', async () => {
  const errors = await errorsOf(new Product({}));
  for (const field of ['name', 'slug', 'category', 'brand', 'price']) {
    assert.ok(errors[field], `${field} should be required`);
  }
});

test('prices must be whole cents', async () => {
  const errors = await errorsOf(new Product({ ...validProduct(), price: 19.99 }));
  assert.ok(errors.price);
});

test('sale price must be lower than the price', async () => {
  assert.ok((await errorsOf(new Product({ ...validProduct(), salePrice: 2500 }))).salePrice);
  assert.deepStrictEqual(await errorsOf(new Product({ ...validProduct(), salePrice: 1499 })), {});
});

test('product needs at least one variant and stock cannot be negative', async () => {
  assert.ok((await errorsOf(new Product({ ...validProduct(), variants: [] }))).variants);
  const errors = await errorsOf(new Product({ ...validProduct(), variants: [{ sku: 'X-1', stock: -1 }] }));
  assert.ok(errors['variants.0.stock']);
});

test('user email must be valid and role is limited', async () => {
  const errors = await errorsOf(new User({ name: 'SpongeBob', email: 'not-an-email', passwordHash: 'x', role: 'superuser' }));
  assert.ok(errors.email);
  assert.ok(errors.role);
});

test('new users are customers by default', () => {
  assert.strictEqual(new User({ name: 'Ash', email: 'ash@example.com', passwordHash: 'x' }).role, 'customer');
});

test('passwordHash is never included in JSON', () => {
  const json = new User({ name: 'Naruto', email: 'naruto@example.com', passwordHash: 'secret-hash' }).toJSON();
  assert.strictEqual(json.passwordHash, undefined);
  assert.strictEqual(json.email, 'naruto@example.com');
});

test('category theme colour must be a hex colour', async () => {
  const errors = await errorsOf(new Category({ name: 'Clothing', slug: 'clothing', themeColor: 'blue' }));
  assert.ok(errors.themeColor);
});
