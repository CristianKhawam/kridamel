// Run with: npm test
const test = require('node:test');
const assert = require('node:assert');
const errorHandler = require('./errorHandler');

// Minimal stand-in for Express's res object that records what was sent.
function fakeRes() {
  return {
    headersSent: false,
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; },
  };
}

test('unexpected error returns 500 without leaking details', (t) => {
  t.mock.method(console, 'error', () => {}); // keep test output clean
  const res = fakeRes();
  errorHandler(new Error('secret database password in message'), {}, res, () => {});
  assert.strictEqual(res.statusCode, 500);
  assert.deepStrictEqual(res.body, { error: 'Internal server error' });
});

test('invalid JSON body returns 400', () => {
  const res = fakeRes();
  errorHandler(Object.assign(new SyntaxError('Unexpected token'), { type: 'entity.parse.failed', status: 400 }), {}, res, () => {});
  assert.strictEqual(res.statusCode, 400);
  assert.deepStrictEqual(res.body, { error: 'Invalid JSON in request body' });
});

test('expected error keeps its status and message', () => {
  const res = fakeRes();
  errorHandler(Object.assign(new Error('Product not found'), { status: 404 }), {}, res, () => {});
  assert.strictEqual(res.statusCode, 404);
  assert.deepStrictEqual(res.body, { error: 'Product not found' });
});
