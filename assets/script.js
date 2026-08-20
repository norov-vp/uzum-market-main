// =====================================================
// DATA
// =====================================================
const products = [
    { id: 1, name: "iPhone 15 Pro Max", price: 1299, oldPrice: 1499, rating: 4.8, category: "electronics", img: "https://via.placeholder.com/300x300/CC0000/FFFFFF?text=iPhone+15" },
    { id: 2, name: "Samsung Galaxy S24 Ultra", price: 1199, oldPrice: 1399, rating: 4.7, category: "electronics", img: "https://via.placeholder.com/300x300/990000/FFFFFF?text=Galaxy+S24" },
    { id: 3, name: "MacBook Pro 16\"", price: 1999, oldPrice: null, rating: 4.9, category: "electronics", img: "https://via.placeholder.com/300x300/800000/FFFFFF?text=MacBook+Pro" },
    { id: 4, name: "Sony WH-1000XM5", price: 399, oldPrice: 499, rating: 4.6, category: "electronics", img: "https://via.placeholder.com/300x300/CC0000/FFFFFF?text=Sony" },
    { id: 5, name: "Apple Watch Series 9", price: 499, oldPrice: null, rating: 4.8, category: "electronics", img: "https://via.placeholder.com/300x300/990000/FFFFFF?text=Apple+Watch" },
    { id: 6, name: "Nike Air Max 270", price: 149, oldPrice: 199, rating: 4.4, category: "footwear", img: "https://via.placeholder.com/300x300/CC0000/FFFFFF?text=Nike+Air+Max" },
    { id: 7, name: "Samsung 65\" QLED TV", price: 999, oldPrice: null, rating: 4.7, category: "electronics", img: "https://via.placeholder.com/300x300/990000/FFFFFF?text=Samsung+TV" },
    { id: 8, name: "Dyson V15 Vacuum", price: 699, oldPrice: 899, rating: 4.5, category: "home", img: "https://via.placeholder.com/300x300/800000/FFFFFF?text=Dyson+V15" }
];

// =====================================================
// STATE
// =====================================================
let cart = [];
let currentSlide = 0;

// =====================================================
// DOM ELEMENTS
// =====================================================
const preloader = document.getElementById('preloader');
const productGrid = document.getElementById('productGrid');
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const cartCount = document.getElementById('cartCount');
const searchInput = document.getElementById('searchInput');
const scrollBtn = document.getElementById('scrollTop');
const categoryLinks = document.querySelectorAll('.category-list a');

// =====================================================
// PRELOADER
// =====================================================
window.addEventListener('load', () => {
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 1200);
});

// =====================================================
// HERO SLIDER
// =====================================================
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.hero-dot');

function showHeroSlide(index) {
    heroSlides.forEach((s, i) => s.classList.toggle('active', i === index));
    heroDots.forEach((d, i) => d.classList.toggle('active', i === index));
}

heroDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        showHeroSlide(currentSlide);
    });
});

setInterval(() => {
    currentSlide = (currentSlide + 1) % heroSlides.length;
    showHeroSlide(currentSlide);
}, 6000);

// =====================================================
// PRODUCTS
// =====================================================
let currentCategory = 'all';

function renderProducts(category = 'all') {
    const filtered = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);

    productGrid.innerHTML = filtered.map(p => {
        const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
        return `
            <div class="product-card" data-id="${p.id}" data-category="${p.category}">
                ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
                <img src="${p.img}" alt="${p.name}" loading="lazy">
                <div class="product-title">${p.name}</div>
                <div class="product-price">
                    $${p.price}
                    ${p.oldPrice ? `<small>$${p.oldPrice}</small>` : ''}
                </div>
                <div class="rating">${'★'.repeat(Math.floor(p.rating))} (${p.rating})</div>
                <button class="add-to-cart" data-id="${p.id}">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        `;
    }).join('');

    // Add to cart events
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            addToCart(id);
            btn.innerHTML = '<i class="fas fa-check"></i> Added!';
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
            }, 1200);
        });
    });
}

// =====================================================
// CATEGORY FILTER
// =====================================================
categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        categoryLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        currentCategory = link.dataset.category;
        renderProducts(currentCategory);
    });
});

// =====================================================
// CART
// =====================================================
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
    showNotification(`${product.name} added to cart!`);
}

function updateCartUI() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = total;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        cartTotalPrice.textContent = '$0.00';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong>
                <span style="color:rgba(255,255,255,0.3);font-size:13px;"> ×${item.quantity}</span>
            </div>
            <div style="display:flex;align-items:center;gap:12px;">
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            cart = cart.filter(item => item.id !== parseInt(btn.dataset.id));
            updateCartUI();
        });
    });
    
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
}

// =====================================================
// NOTIFICATION
// =====================================================
function showNotification(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #1a1a2e;
        color: #fff;
        padding: 16px 28px;
        border-radius: 60px;
        box-shadow: 0 12px 40px rgba(0,0,0,0.4);
        font-weight: 600;
        z-index: 3000;
        font-size: 14px;
        border-left: 4px solid #ff1a1a;
        animation: slideUp 0.4s ease;
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    toast.innerHTML = `<i class="fas fa-check-circle" style="color:#00cc66;font-size:18px;"></i> ${msg}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(30px)';
        toast.style.transition = 'all 0.4s ease';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// =====================================================
// CART MODAL
// =====================================================
cartIcon.addEventListener('click', () => {
    cartModal.classList.add('open');
    updateCartUI();
});

closeCart.addEventListener('click', () => {
    cartModal.classList.remove('open');
});

cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) cartModal.classList.remove('open');
});

// =====================================================
// SEARCH
// =====================================================
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        const title = card.querySelector('.product-title').textContent.toLowerCase();
        card.style.display = title.includes(query) ? 'block' : 'none';
    });
});

// =====================================================
// SCROLL TO TOP
// =====================================================
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollBtn.classList.add('visible');
    } else {
        scrollBtn.classList.remove('visible');
    }
});

scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =====================================================
// COUNTDOWN TIMER
// =====================================================
function startCountdown() {
    let hours = 12;
    let minutes = 30;
    let seconds = 45;
    
    const hEl = document.getElementById('hours');
    const mEl = document.getElementById('minutes');
    const sEl = document.getElementById('seconds');
    
    setInterval(() => {
        seconds--;
        if (seconds < 0) {
            seconds = 59;
            minutes--;
            if (minutes < 0) {
                minutes = 59;
                hours--;
                if (hours < 0) {
                    hours = 23;
                }
            }
        }
        hEl.textContent = String(hours).padStart(2, '0');
        mEl.textContent = String(minutes).padStart(2, '0');
        sEl.textContent = String(seconds).padStart(2, '0');
    }, 1000);
}

// =====================================================
// INIT
// =====================================================
renderProducts();
startCountdown();
updateCartUI();

console.log('🚀 Uzum Market loaded successfully!');