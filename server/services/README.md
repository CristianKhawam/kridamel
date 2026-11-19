# server/services/

Reusable logic that is not tied to a single endpoint. Controllers call services; services never use `req` or `res`.

**Planned files**

| File | Does |
|---|---|
| `emailService.js` | Sends emails through the HTTP email API (password reset, order confirmed, ready for pickup) |
| `paymentService.js` | Simulated payment: `4242…` approved, `4000 0000 0000 0002` declined |
| `pricing.js` | Subtotal, coupon discount, 5% GST and total, all in cents |

```js
// server/services/pricing.js (example)
const GST_RATE = 0.05; // Alberta

exports.calcTax = (cents) => Math.round(cents * GST_RATE);
```

**Rules**
- Pure functions where possible (input in, result out), so they are easy to test.
- The email API key comes from `process.env.EMAIL_API_KEY`. If an email fails, log it and keep the order.
