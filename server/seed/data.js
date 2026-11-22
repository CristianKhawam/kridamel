// Demo data for the seed script. EVERYTHING here is fictitious:
// brands are invented, people are cartoon/anime characters, emails use the reserved example.com domain.

const categories = [
  { name: 'Clothing', slug: 'clothing', themeColor: '#2b4c7e', description: 'Everyday clothes for the whole family.',
    subcategories: [['Men', 'men'], ['Women', 'women'], ['Kids', 'kids'], ['Accessories', 'clothing-accessories']] },
  { name: 'Electronics', slug: 'electronics', themeColor: '#1b6e5a', description: 'Computers, phones and gadgets.',
    subcategories: [['Computers', 'computers'], ['Phones', 'phones'], ['Accessories', 'electronics-accessories']] },
  { name: 'Sports', slug: 'sports', themeColor: '#8b2f2f', description: 'Gear for training, the outdoors and the team.',
    subcategories: [['Fitness', 'fitness'], ['Outdoor', 'outdoor'], ['Team Sports', 'team-sports']] },
];

const brands = ['Polar Thread', 'Aurora Wear', 'Voltline', 'Pixelcore', 'Trailbound', 'Rinkside'];

const tags = [
  { name: 'New Arrival', slug: 'new-arrival' },
  { name: 'Best Seller', slug: 'best-seller' },
  { name: 'Sale', slug: 'sale' },
];

// Builds every size × colour combination. stocks[i] is used in order (cycling), so some variants
// end up with low stock (1–4) or out of stock (0) on purpose, to test those states.
function variants(skuPrefix, sizes, colors, stocks) {
  const list = [];
  for (const color of colors) {
    for (const size of sizes) {
      list.push({
        sku: [skuPrefix, color, size].filter(Boolean).join('-').replace(/\s+/g, '').toUpperCase(),
        attributes: { size: size || undefined, color: color || undefined },
        stock: stocks[list.length % stocks.length],
      });
    }
  }
  return list;
}

const S = ['S', 'M', 'L', 'XL'];
const KIDS = ['4', '6', '8', '10'];
const SHOES = ['8', '9', '10', '11'];
const ONE = [null]; // no size

// [name, subcategory slug, brand, price, salePrice, tags, featured, soldCount, ratingAvg, variants, description]
// Prices are in cents.
const products = [
  // Clothing – Men
  ['Classic Flannel Shirt', 'men', 'Polar Thread', 4999, null, ['best-seller'], true, 120, 4.6, variants('FLN', S, ['Red', 'Blue'], [12, 8, 3, 0]), 'Soft brushed-cotton flannel for cold Canadian mornings.'],
  ['Slim Fit Chinos', 'men', 'Aurora Wear', 5999, 4499, ['sale'], false, 64, 4.2, variants('CHN', S, ['Khaki', 'Navy'], [10, 6, 2, 9]), 'Stretch chinos that work for the office and the weekend.'],
  ['Puffer Winter Jacket', 'men', 'Polar Thread', 14999, null, ['new-arrival'], true, 35, 4.8, variants('PFJ', S, ['Black', 'Olive'], [5, 4, 0, 7]), 'Warm, light and water-resistant down-alternative jacket.'],
  // Clothing – Women
  ['Cable Knit Sweater', 'women', 'Aurora Wear', 6999, null, ['new-arrival'], true, 48, 4.7, variants('CKS', S, ['Cream', 'Sage'], [9, 7, 4, 2]), 'Chunky knit sweater in a relaxed fit.'],
  ['High-Rise Denim Jeans', 'women', 'Polar Thread', 7499, 5999, ['sale', 'best-seller'], false, 140, 4.5, variants('HRJ', S, ['Indigo', 'Black'], [14, 0, 6, 3]), 'Comfortable stretch denim with a high waist.'],
  ['Quilted Vest', 'women', 'Aurora Wear', 5499, null, [], false, 22, 4.1, variants('QVS', S, ['Navy', 'Burgundy'], [6, 5, 3, 1]), 'Lightweight layer for spring and fall.'],
  // Clothing – Kids
  ['Kids Rain Jacket', 'kids', 'Polar Thread', 3999, null, ['new-arrival'], false, 30, 4.4, variants('KRJ', KIDS, ['Yellow', 'Blue'], [8, 6, 0, 4]), 'Bright, waterproof jacket for puddle days.'],
  ['Kids Graphic Hoodie', 'kids', 'Aurora Wear', 2999, 2499, ['sale'], false, 55, 4.3, variants('KGH', KIDS, ['Grey', 'Green'], [10, 7, 5, 2]), 'Cozy fleece hoodie with a moose print.'],
  // Clothing – Accessories
  ['Wool Toque', 'clothing-accessories', 'Polar Thread', 1999, null, ['best-seller'], true, 210, 4.9, variants('TOQ', ONE, ['Red', 'Grey', 'Black'], [25, 3, 0]), 'The classic Canadian winter hat.'],
  ['Leather Belt', 'clothing-accessories', 'Aurora Wear', 3499, null, [], false, 18, 4.0, variants('BLT', ['32', '34', '36'], ['Brown'], [6, 4, 2]), 'Full-grain leather belt with a brushed buckle.'],

  // Electronics – Computers
  ['Pixelcore Book 14 Laptop', 'computers', 'Pixelcore', 89999, 79999, ['sale', 'best-seller'], true, 42, 4.6, variants('PCB14', ['8GB/256GB', '16GB/512GB'], ['Silver'], [7, 3]), '14-inch everyday laptop with all-day battery.'],
  ['Voltline Desktop Tower', 'computers', 'Voltline', 119999, null, ['new-arrival'], false, 12, 4.4, variants('VDT', ['16GB/1TB'], ['Black'], [4]), 'Quiet tower for school, work and light gaming.'],
  ['Pixelcore 27" Monitor', 'computers', 'Pixelcore', 32999, null, [], false, 26, 4.5, variants('PCM27', ONE, ['Black'], [0]), '27-inch QHD display with adjustable stand.'],
  // Electronics – Phones
  ['Voltline V12 Smartphone', 'phones', 'Voltline', 69999, null, ['new-arrival', 'best-seller'], true, 88, 4.7, variants('VV12', ['128GB', '256GB'], ['Midnight', 'Glacier'], [9, 5, 2, 0]), '6.1-inch phone with a great camera and fast charging.'],
  ['Pixelcore Lite Phone', 'phones', 'Pixelcore', 34999, 29999, ['sale'], false, 51, 4.2, variants('PCL', ['64GB', '128GB'], ['Black', 'Blue'], [12, 7, 3, 6]), 'Affordable phone with a big battery.'],
  ['Voltline Flip', 'phones', 'Voltline', 99999, null, [], false, 9, 4.0, variants('VFL', ['256GB'], ['Lavender', 'Graphite'], [2, 1]), 'Foldable phone that fits in any pocket.'],
  // Electronics – Accessories
  ['Wireless Earbuds Pro', 'electronics-accessories', 'Voltline', 12999, 9999, ['sale', 'best-seller'], true, 175, 4.6, variants('WEP', ONE, ['White', 'Black'], [30, 0]), 'Noise-cancelling earbuds with a 24-hour case.'],
  ['65W USB-C Charger', 'electronics-accessories', 'Pixelcore', 3999, null, [], false, 96, 4.5, variants('UCC65', ONE, ['White'], [40]), 'Fast charger for laptops and phones.'],
  ['Portable Power Bank', 'electronics-accessories', 'Voltline', 4999, null, ['new-arrival'], false, 60, 4.3, variants('PPB', ['10000mAh', '20000mAh'], ['Black'], [15, 4]), 'Keep your phone charged on the go.'],

  // Sports – Fitness
  ['Adjustable Dumbbell Set', 'fitness', 'Trailbound', 24999, null, ['best-seller'], true, 70, 4.7, variants('ADS', ['5-25 lb', '5-50 lb'], [null], [6, 2]), 'Replaces a full rack of dumbbells.'],
  ['Yoga Mat Plus', 'fitness', 'Trailbound', 4499, 3499, ['sale'], false, 130, 4.5, variants('YMP', ONE, ['Teal', 'Purple', 'Black'], [20, 9, 0]), 'Extra-thick, non-slip mat.'],
  ['Running Shoes Glide', 'fitness', 'Trailbound', 12999, null, ['new-arrival'], true, 58, 4.6, variants('RSG', SHOES, ['Black', 'Coral'], [6, 8, 3, 0]), 'Light, cushioned shoes for road running.'],
  ['Resistance Band Kit', 'fitness', 'Rinkside', 2999, null, [], false, 85, 4.3, variants('RBK', ONE, [null], [50]), 'Five bands from light to extra heavy.'],
  // Sports – Outdoor
  ['Trail Hiking Boots', 'outdoor', 'Trailbound', 17999, 14999, ['sale'], false, 44, 4.8, variants('THB', SHOES, ['Brown'], [5, 0, 7, 2]), 'Waterproof boots for rocky trails.'],
  ['3-Season Tent', 'outdoor', 'Trailbound', 27999, null, ['best-seller'], true, 31, 4.6, variants('TNT3', ['2-person', '4-person'], ['Green'], [4, 3]), 'Easy-pitch tent for camping trips.'],
  ['Insulated Water Bottle', 'outdoor', 'Polar Thread', 2999, null, [], false, 160, 4.7, variants('IWB', ['750ml'], ['Steel', 'Red', 'Forest'], [35, 12, 1]), 'Keeps drinks cold for 24 hours.'],
  ['Trekking Backpack 40L', 'outdoor', 'Trailbound', 13999, null, ['new-arrival'], false, 19, 4.4, variants('TBP40', ONE, ['Orange', 'Charcoal'], [6, 0]), 'Comfortable pack for multi-day hikes.'],
  // Sports – Team Sports
  ['Pro Hockey Stick', 'team-sports', 'Rinkside', 18999, null, ['best-seller'], true, 66, 4.8, variants('PHS', ['Left', 'Right'], ['Black'], [8, 4]), 'Light carbon stick with a mid kick point.'],
  ['Official Size Soccer Ball', 'team-sports', 'Rinkside', 3499, 2799, ['sale'], false, 102, 4.5, variants('SBL', ['Size 4', 'Size 5'], ['White'], [18, 25]), 'Durable match ball for grass and turf.'],
  ['Basketball Indoor/Outdoor', 'team-sports', 'Rinkside', 3999, null, [], false, 74, 4.4, variants('BBL', ['Size 7'], ['Orange'], [0]), 'Grippy ball for any court.'],
];

// Demo accounts. These passwords are only for the demo; they are listed in the README.
const users = [
  { name: 'Store Admin', email: 'admin@example.com', password: 'Admin123!', role: 'admin' },
  { name: 'SpongeBob SquarePants', email: 'spongebob@example.com', password: 'Customer123!', role: 'customer', phone: '403-555-0101',
    addresses: [{ label: 'Home', line1: '124 Conch Street', city: 'Bikini Bottom', province: 'AB', postalCode: 'T0L 1B0', isDefault: true }] },
  { name: 'Ash Ketchum', email: 'ash.ketchum@example.com', password: 'Customer123!', role: 'customer', phone: '403-555-0102',
    addresses: [{ label: 'Home', line1: '1 Route One', city: 'Pallet Town', province: 'AB', postalCode: 'T0K 0A0', isDefault: true }] },
];

const coupons = [
  { code: 'WELCOME10', type: 'percent', value: 10 },
  { code: 'SAVE5', type: 'fixed', value: 500, minSubtotal: 5000 },
];

module.exports = { categories, brands, tags, products, users, coupons };
