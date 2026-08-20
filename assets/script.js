// ========== PRODUCT DATA ==========
const products = [
    { id: 1, name: "iPhone 15 Pro", price: 12000000, img: "https://picsum.photos/seed/phone/400/400", rating: 4.9, oldPrice: 14000000 },
    { id: 2, name: "MacBook Pro 16", price: 25000000, img: "https://picsum.photos/seed/macbook/400/400", rating: 4.8, oldPrice: 28000000 },
    { id: 3, name: "AirPods Pro 2", price: 1500000, img: "https://picsum.photos/seed/airpods/400/400", rating: 4.7, oldPrice: 1800000 },
    { id: 4, name: "Apple Watch Ultra", price: 8000000, img: "https://picsum.photos/seed/watch/400/400", rating: 4.6, oldPrice: 9000000 },
    { id: 5, name: "Samsung Galaxy S24", price: 10000000, img: "https://picsum.photos/seed/samsung/400/400", rating: 4.5, oldPrice: 12000000 },
    { id: 6, name: "iPad Pro 12.9", price: 14000000, img: "https://picsum.photos/seed/ipad/400/400", rating: 4.8, oldPrice: 16000000 },
    { id: 7, name: "Sony WH-1000XM5", price: 3500000, img: "https://picsum.photos/seed/sony/400/400", rating: 4.9, oldPrice: 4000000 },
    { id: 8, name: "Dell XPS 15", price: 18000000, img: "https://picsum.photos/seed/dell/400/400", rating: 4.4, oldPrice: 20000000 },
];

// ========== STATE ==========
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let isDark = localStorage.getItem('dark') === 'true';

// ========== DOM REFS ==========
const productsEl = document.getElementById('products');
const searchInput = document.getElementById('search');
const cartEl = document.getElementById('cart');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsEl = document.getElementById('cartItems');
const totalEl = document.getElementById('total');
const countEl = document.getElementById('count');
const modalEl = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const toastEl = document.getElementById('toast');
const sidebarEl = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// ========== RENDER PRODUCTS ==========
function renderProducts(list) {
    productsEl.innerHTML = '';
    list.forEach((p, index) => {
        const stars = '⭐'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? '⭐' : '');
        productsEl.innerHTML += `
            <div class="card" style="animation-delay: ${index * 0.05}s" onclick="openModal(${JSON.stringify(p).replace(/"/g, '&quot;')})">
                <img src="${p.img}" alt="${p.name}" class="card-img" loading="lazy">
                <h4>${p.name}</h4>
                <div class="rating">${stars} ${p.rating}</div>
                <div>
                    <span class="price">${p.price.toLocaleString()} UZS</span>
                    ${p.oldPrice ? `<span class="old-price">${p.oldPrice.toLocaleString()}</span>` : ''}
                </div>
            </div>
        `;
    });
}

// ========== SEARCH ==========
searchInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase().trim();
    const filtered = products.filter(p => p.name.toLowerCase().includes(val));
    renderProducts(filtered);
});

// ========== CART FUNCTIONS ==========
function renderCart() {
    if (cart.length === 0) {
        cartItemsEl.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        cartItemsEl.innerHTML = '';
        cart.forEach((item, index) => {
            cartItemsEl.innerHTML += `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <span>${item.price.toLocaleString()} UZS</span>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
        });
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalEl.textContent = `Total: ${total.toLocaleString()} UZS`;
    countEl.textContent = cart.length;
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
    const exists = cart.find(item => item.id === product.id);
    if (exists) {
        showToast('Already in cart!', 'info');
        return;
    }
    cart.push({ ...product });
    renderCart();
    showToast(`${product.name} added to cart!`, 'success');
}

function removeFromCart(index) {
    const name = cart[index].name;
    cart.splice(index, 1);
    renderCart();
    showToast(`${name} removed from cart`, 'warning');
}

function toggleCart() {
    cartEl.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    document.body.style.overflow = cartEl.classList.contains('active') ? 'hidden' : '';
}

function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    showToast(`Order placed! Total: ${total.toLocaleString()} UZS`, 'success');
    cart = [];
    renderCart();
    toggleCart();
}

// ========== SIDEBAR ==========
function toggleSidebar() {
    sidebarEl.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
    document.body.style.overflow = sidebarEl.classList.contains('active') ? 'hidden' : '';
}

// ========== MODAL ==========
function openModal(product) {
    modalEl.classList.add('show');
    modalContent.innerHTML = `
        <img src="${product.img}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p style="color: var(--text-secondary); margin-bottom: 4px;">⭐ ${product.rating}</p>
        <div class="price">${product.price.toLocaleString()} UZS</div>
        ${product.oldPrice ? `<p style="color: var(--text-secondary); text-decoration: line-through; margin-bottom: 8px;">${product.oldPrice.toLocaleString()} UZS</p>` : ''}
        <button class="btn-primary" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')}); closeModal();">
            <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
        <button onclick="closeModal()" style="margin-top: 10px; background: none; border: none; color: var(--text-secondary); cursor: pointer; padding: 8px;">
            Close
        </button>
    `;
}

function closeModal() {
    modalEl.classList.remove('show');
}

modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeModal();
});

// ========== TOAST ==========
function showToast(message, type = 'success') {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-triangle-exclamation',
        info: 'fa-info-circle'
    };
    toastEl.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
    toastEl.className = 'toast show';
    clearTimeout(toastEl._timeout);
    toastEl._timeout = setTimeout(() => {
        toastEl.classList.remove('show');
    }, 3000);
}

// ========== DARK MODE ==========
function toggleDark() {
    isDark = !isDark;
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem('dark', isDark);
    const icon = document.querySelector('#themeToggle i');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

// ========== INIT ==========
if (isDark) {
    document.body.classList.add('dark');
    document.querySelector('#themeToggle i').className = 'fas fa-sun';
}

renderProducts(products);
renderCart();

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        if (cartEl.classList.contains('active')) toggleCart();
        if (sidebarEl.classList.contains('active')) toggleSidebar();
    }
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
});

console.log('🛒 Uzum Market Pro loaded successfully!');
console.log('💡 Shortcuts: ESC - close modals, Ctrl+K - search');