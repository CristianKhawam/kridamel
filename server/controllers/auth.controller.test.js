// Run with: npm test
const test = require('node:test');
const assert = require('node:assert');
const { validateRegister } = require('./auth.controller');
const { readCookie } = require('../middleware/requireAuth');

test('valid registration data has no errors', () => {
  assert.deepStrictEqual(validateRegister({ name: 'Naruto Uzumaki', email: 'naruto@example.com', password: 'ramen1234' }), []);
});

test('bad registration data reports every field', () => {
  const fields = validateRegister({ name: 'N', email: 'nope', password: 'short', phone: 123 }).map((e) => e.field);
  assert.deepStrictEqual(fields, ['name', 'email', 'password', 'phone']);
});

test('missing fields are reported, not crashing', () => {
  assert.strictEqual(validateRegister({}).length, 3);
});

test('readCookie finds the token among other cookies', () => {
  const req = { headers: { cookie: 'theme=dark; token=abc.def.ghi; lang=en' } };
  assert.strictEqual(readCookie(req, 'token'), 'abc.def.ghi');
  assert.strictEqual(readCookie({ headers: {} }, 'token'), undefined);
});

test('address is optional, but complete and with a Canadian postal code when sent', () => {
  const base = { name: 'Naruto Uzumaki', email: 'naruto@example.com', password: 'ramen1234' };
  const good = { line1: '7 Ichiraku Lane', city: 'Hidden Leaf Village', province: 'AB', postalCode: 'T0J 2N0' };
  assert.deepStrictEqual(validateRegister({ ...base, address: good }), []);
  const fields = validateRegister({ ...base, address: { ...good, city: '', postalCode: '12345' } }).map((e) => e.field);
  assert.deepStrictEqual(fields, ['address.city', 'address.postalCode']);
});

test('a broken cookie value counts as no cookie (instead of crashing)', () => {
  assert.strictEqual(readCookie({ headers: { cookie: 'token=%E0%A4%A' } }, 'token'), undefined);
});
