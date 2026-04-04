/* ============================
   CYRASENSE — Store
   ============================ */

const products = [
  { id: 1, emoji: '🌸', name: 'Ultra Soft Pads', brand: 'Whisper Ultra', price: 149, desc: 'Extra absorbent, leak-proof wings, 15 pads/pack' },
  { id: 2, emoji: '🌊', name: 'Menstrual Cup', brand: 'Sirona', price: 599, desc: 'Reusable, medical-grade silicone, up to 10 hrs protection' },
  { id: 3, emoji: '🌿', name: 'Organic Cotton Pads', brand: 'Carmesi', price: 249, desc: 'Chemical-free, hypoallergenic, biodegradable, 15 pads' },
  { id: 4, emoji: '💧', name: 'Period Panties', brand: 'Adira', price: 799, desc: '4-layer protection, reusable, machine washable, leak-free' },
  { id: 5, emoji: '🌙', name: 'Overnight Pads XL', brand: 'Stayfree', price: 189, desc: 'Extra-long, wings, 360° protection for peaceful sleep' },
  { id: 6, emoji: '🎀', name: 'Tampons (Regular)', brand: 'o.b. Pro Comfort', price: 259, desc: 'Applicator-free, smooth insertion, 16 tampons/pack' },
  { id: 7, emoji: '🫚', name: 'Period Pain Relief Oil', brand: 'Moody', price: 349, desc: 'Essential oil blend: lavender, clary sage, peppermint' },
  { id: 8, emoji: '🍫', name: 'Period Wellness Kit', brand: 'CyraSense', price: 999, desc: 'Dark chocolate, herbal tea, heating pad combo — feel better fast!' }
];

let cart = [];

function renderStore() {
  const grid = document.getElementById('store-grid');
  if (!grid) return;
  grid.innerHTML = '';

  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'store-card';
    const coinVal = Math.floor(p.price / 30) * 5;
    card.innerHTML = `
      <span class="store-product-img">${p.emoji}</span>
      <p class="store-product-name">${p.name}</p>
      <p class="store-product-brand">${p.brand}</p>
      <p class="store-product-price" style="font-size:0.75rem;color:var(--text-dim);margin-bottom:4px;">${p.desc}</p>
      <p class="store-price">₹${p.price}</p>
      <p class="store-coin-val">🪙 ${coinVal} coins = ₹${Math.floor(coinVal/100*5)} off</p>
      <button class="add-cart-btn" onclick="addToCart(${p.id})">Add to Cart 🛒</button>
    `;
    grid.appendChild(card);
  });
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(c => c.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  renderCart();
  showToast(`${product.emoji} ${product.name} added to cart!`);
}

function renderCart() {
  const cartSummary = document.getElementById('cart-summary');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total-price');
  const coinInfo = document.getElementById('coin-discount-info');

  if (cart.length === 0) {
    cartSummary.classList.add('hidden');
    return;
  }

  cartSummary.classList.remove('hidden');
  cartItems.innerHTML = '';

  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <span>${item.emoji} ${item.name} × ${item.qty}</span>
      <div style="display:flex;gap:8px;align-items:center;">
        <span style="color:var(--accent);font-weight:700;">₹${item.price * item.qty}</span>
        <button onclick="removeFromCart(${item.id})" style="background:none;border:none;color:var(--text-dim);cursor:pointer;font-size:1rem;">✕</button>
      </div>
    `;
    cartItems.appendChild(row);
  });

  // Coin discount
  const coinDiscount = Math.floor(AppState.coins / 500) * 5;
  const finalTotal = Math.max(0, total - coinDiscount);

  cartTotal.textContent = `₹${finalTotal}`;
  if (coinDiscount > 0) {
    coinInfo.textContent = `🪙 ${Math.floor(AppState.coins / 500) * 500} coins used = -₹${coinDiscount} discount applied!`;
  } else if (AppState.coins >= 500) {
    coinInfo.textContent = `🪙 You have enough coins for a ₹5 discount!`;
  } else {
    coinInfo.textContent = `🪙 Earn ${500 - AppState.coins} more coins for ₹5 off`;
  }

  cartSummary.scrollIntoView({ behavior: 'smooth' });
}

function removeFromCart(productId) {
  cart = cart.filter(c => c.id !== productId);
  renderCart();
}

function checkout() {
  if (cart.length === 0) return;

  // Apply coin discount
  const coinsUsed = Math.floor(AppState.coins / 500) * 500;
  if (coinsUsed > 0) {
    AppState.coins -= coinsUsed;
    saveState();
    updateCoinDisplays();
  }

  cart = [];
  renderCart();

  // Show success modal
  showToast('🎉 Order placed (Demo)! Thank you for shopping at CyraSense!');
}
