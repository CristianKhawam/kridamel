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

test('a broken cookie value counts as no cookie (instead of crashing)', () => {
  assert.strictEqual(readCookie({ headers: { cookie: 'token=%E0%A4%A' } }, 'token'), undefined);
});
