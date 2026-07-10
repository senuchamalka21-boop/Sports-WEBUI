const products = [
    { id: 1, name: 'Pro Basketball', price: 49.99, icon: 'fa-basketball-ball', category: 'basketball', badge: '⚡ sale' },
    { id: 2, name: 'Elite Football', price: 39.95, icon: 'fa-futbol', category: 'football', badge: 'new' },
    { id: 3, name: 'Pro Baseball', price: 29.90, icon: 'fa-baseball-ball', category: 'baseball', badge: '🔥' },
    { id: 4, name: 'Ice Hockey', price: 59.00, icon: 'fa-hockey-puck', category: 'hockey', badge: 'pro' },
    { id: 5, name: 'Running Kit', price: 79.99, icon: 'fa-running', category: 'running', badge: '🌿' },
    { id: 6, name: 'Ping Pong', price: 19.99, icon: 'fa-table-tennis', category: 'tennis', badge: '+' },
    { id: 7, name: 'Volleyball', price: 34.50, icon: 'fa-volleyball-ball', category: 'volleyball', badge: 'sale' },
    { id: 8, name: 'Golf Set', price: 89.00, icon: 'fa-golf-ball', category: 'golf', badge: 'premium' }
];

let cart = [];
let currentUser = null;
let currentPage = 'home';

const pageContainer = document.getElementById('page-container');
const navLinks = document.querySelectorAll('.nav-links a');
const navCartBadge = document.getElementById('navCartBadge');
const loginIcon = document.getElementById('loginIcon');
const loginModal = document.getElementById('loginModal');
const closeLogin = document.getElementById('closeLogin');
const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginMessage = document.getElementById('loginMessage');
const userStatus = document.getElementById('userStatus');
const toast = document.getElementById('toast');

function renderPage(page) {
    const pages = {
        home: `
            <section class="page active-page">
                <div class="hero-box">
                    <h2><i class="fas fa-bolt"></i> Gear up. Dominate.</h2>
                    <p>ProTricks – premium sports equipment for champions. From basketball to running, we deliver pro-level gear.</p>
                    <div class="hero-badges">
                        <span><i class="fas fa-trophy"></i> 100+ pro items</span>
                        <span><i class="fas fa-shield-alt"></i> secure checkout</span>
                    </div>
                </div>
                <div class="category-title"><i class="fas fa-star"></i> Featured · top picks</div>
                <div class="product-grid" id="featuredGrid"></div>
            </section>
        `,
        products: `
            <section class="page active-page">
                <div class="category-title"><i class="fas fa-tshirt"></i> All sports gear</div>
                <div class="product-grid" id="productGrid"></div>
            </section>
        `,
        cart: `
            <section class="page active-page cart-page">
                <div class="category-title">
                    <i class="fas fa-shopping-cart"></i> Your Shopping Cart
                </div>
                <div id="cartPageContent">
                    <div id="cartPageItems"></div>
                </div>
            </section>
        `,
        about: `
            <section class="page active-page">
                <div class="hero-box">
                    <h2><i class="fas fa-users"></i> About ProTricks</h2>
                    <p>We are a team of sports enthusiasts dedicated to bringing you the highest quality gear. Founded in 2020, we combine innovation with performance.</p>
                </div>
                <div class="about-grid">
                    <div class="about-card"><i class="fas fa-medal"></i><h3>Mission</h3><p>Empower athletes with pro-grade equipment that enhances performance.</p></div>
                    <div class="about-card"><i class="fas fa-eye"></i><h3>Vision</h3><p>Become the most trusted sports brand worldwide, known for quality and security.</p></div>
                    <div class="about-card"><i class="fas fa-shield-alt"></i><h3>Security</h3><p>We encrypt every transaction and protect your data with advanced 2FA.</p></div>
                </div>
            </section>
        `,
        contact: `
            <section class="page active-page">
                <div class="hero-box">
                    <h2><i class="fas fa-paper-plane"></i> Contact us</h2>
                    <p>We’d love to hear from you. Reach out for support, partnerships, or just to say hi!</p>
                </div>
                <div class="contact-grid">
                    <div><i class="fas fa-envelope"></i><h4>Email</h4><p>support@protricks.com</p></div>
                    <div><i class="fas fa-phone-alt"></i><h4>Phone</h4><p>+1 (800) 555‑SPORT</p></div>
                    <div><i class="fas fa-map-marker-alt"></i><h4>HQ</h4><p>123 Champion Ave, Sports City</p></div>
                </div>
            </section>
        `
    };

    pageContainer.innerHTML = pages[page] || pages.home;

    if (page === 'home' || page === 'products') {
        renderProducts(page);
    }

    if (page === 'cart') {
        renderCartPage();
    }

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) link.classList.add('active');
    });

    currentPage = page;
    updateCartBadges();
}

function renderProducts(page) {
    const gridId = page === 'home' ? 'featuredGrid' : 'productGrid';
    const grid = document.getElementById(gridId);
    if (!grid) return;

    const displayProducts = page === 'home' ? products.slice(0, 4) : products;

    grid.innerHTML = displayProducts.map(p => `
        <div class="product-card">
            <i class="fas ${p.icon}"></i>
            <h3>${p.name}</h3>
            <div class="price">$${p.price.toFixed(2)}</div>
            <span class="badge">${p.badge}</span>
            <button class="add-to-cart" data-id="${p.id}">
                <i class="fas fa-plus"></i> Add to Cart
            </button>
        </div>
    `).join('');

    grid.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            addToCart(id);
            this.textContent = ' ✓ In Cart';
            this.classList.add('in-cart');
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-plus"></i> Add to Cart';
                this.classList.remove('in-cart');
            }, 1500);
        });
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartBadges();
    showToast(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartBadges();
    if (currentPage === 'cart') renderCartPage();
}

function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    updateCartBadges();
    if (currentPage === 'cart') renderCartPage();
}

function updateCartBadges() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (navCartBadge) {
        navCartBadge.textContent = totalItems;
        navCartBadge.style.display = totalItems > 0 ? 'inline' : 'none';
    }
}

function renderCartPage() {
    const container = document.getElementById('cartPageItems');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Browse our products and add items you love!</p>
                <button class="btn btn-primary" onclick="renderPage('products')" style="margin-top:1rem;">
                    <i class="fas fa-arrow-left"></i> Start Shopping
                </button>
            </div>
        `;
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    container.innerHTML = `
        <div class="cart-items-list">
            ${cart.map(item => `
                <div class="cart-item-row">
                    <div class="item-info">
                        <i class="fas ${item.icon}"></i>
                        <div class="item-details">
                            <span class="item-name">${item.name}</span>
                            <span class="item-price">$${item.price.toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="item-actions">
                        <div class="qty-control">
                            <button onclick="updateQuantity(${item.id}, -1)">−</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="cart-summary">
            <div class="total-info">
                <span class="total-label">Total Items: <strong>${cart.reduce((s, i) => s + i.quantity, 0)}</strong></span>
                <span class="total-amount">$${total.toFixed(2)}</span>
            </div>
            <div class="summary-actions">
                <button class="btn btn-secondary" onclick="clearCart()">
                    <i class="fas fa-trash-alt"></i> Clear Cart
                </button>
                <button class="btn btn-primary" onclick="checkout()">
                    <i class="fas fa-check"></i> Proceed to Checkout
                </button>
            </div>
        </div>
    `;
}

function clearCart() {
    if (cart.length === 0) return;
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        updateCartBadges();
        renderCartPage();
        showToast('Cart cleared!');
    }
}

function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', true);
        return;
    }
    if (!currentUser) {
        showToast('Please login first!', true);
        openLogin();
        return;
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    showToast(`✅ Order placed! Total: $${total.toFixed(2)}`);
    cart = [];
    updateCartBadges();
    renderCartPage();
    setTimeout(() => renderPage('home'), 1000);
}

function openLogin() {
    loginModal.classList.add('show');
    loginMessage.textContent = '';
}

function closeLoginModal() {
    loginModal.classList.remove('show');
    loginMessage.textContent = '';
}

loginIcon.addEventListener('click', openLogin);
closeLogin.addEventListener('click', closeLoginModal);
loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) closeLoginModal();
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    if (email === 'senuchamalka21@gmail.com' && password === 'Admin@123') {
        currentUser = { email, name: 'Admin User' };
        userStatus.textContent = 'Admin';
        loginMessage.textContent = '✅ Login successful!';
        loginMessage.className = 'login-message success';
        showToast('Welcome back, Admin!');
        setTimeout(closeLoginModal, 800);
    } else {
        loginMessage.textContent = '❌ Invalid credentials. Use admin email and password.';
        loginMessage.className = 'login-message error';
    }
});

let toastTimeout;

function showToast(message, isError = false) {
    toast.textContent = message;
    toast.className = 'toast' + (isError ? ' error' : '');
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        renderPage(page);
    });
});

renderPage('home');
updateCartBadges();