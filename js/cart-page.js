document.addEventListener('DOMContentLoaded', function() {
    initializeCartPage();
    setupEventListeners();
    loadCartItems();
});

function initializeCartPage() {
    if (window.cart) {
        window.cart.updateCartCount();
    }
}

function setupEventListeners() {
    const signInBtn = document.getElementById('signInBtn');
    const cartBtn = document.getElementById('cartBtn');
    
    if (signInBtn) {
        signInBtn.addEventListener('click', function() {
            window.location.href = 'signin.html';
        });
    }
    
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
}

function loadCartItems() {
    const cartContent = document.getElementById('cartContent');
    const emptyCart = document.getElementById('emptyCart');
    
    if (!window.cart) return;
    
    const cartItems = window.cart.getItems();
    
    if (cartItems.length === 0) {
        if (cartContent) cartContent.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartContent) cartContent.style.display = 'block';
    
    const cartHTML = `
        <div class="cart-items">
            ${cartItems.map(item => generateCartItemHTML(item)).join('')}
        </div>
        <div class="cart-summary">
            ${generateCartSummaryHTML()}
        </div>
    `;
    
    if (cartContent) {
        cartContent.innerHTML = cartHTML;
    }
    
    setupCartItemInteractions();
}

function generateCartItemHTML(item) {
    const { product, quantity } = item;
    const itemTotal = product.price * quantity;
    
    return `
        <div class="cart-item" data-product-id="${product.id}">
            <div class="cart-item-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="cart-item-info">
                <h3 class="cart-item-name">
                    <a href="product.html?id=${product.id}">${product.name}</a>
                </h3>
                <div class="cart-item-price">${window.formatPrice(product.price)}</div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn decrease" data-product-id="${product.id}">-</button>
                        <input type="number" class="quantity-input" value="${quantity}" min="1" max="99" data-product-id="${product.id}">
                        <button class="quantity-btn increase" data-product-id="${product.id}">+</button>
                    </div>
                    <button class="remove-item-btn" data-product-id="${product.id}">Remove</button>
                </div>
            </div>
            <div class="cart-item-actions">
                <div class="cart-item-total">${window.formatPrice(itemTotal)}</div>
            </div>
        </div>
    `;
}

function generateCartSummaryHTML() {
    const cartItems = window.cart.getItems();
    const subtotal = window.cart.getTotalPrice();
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    return `
        <h3>Order Summary</h3>
        <div class="summary-row">
            <span>Subtotal (${window.cart.getTotalItems()} items)</span>
            <span>${window.formatPrice(subtotal)}</span>
        </div>
        <div class="summary-row">
            <span>Shipping</span>
            <span>${shipping === 0 ? 'FREE' : window.formatPrice(shipping)}</span>
        </div>
        <div class="summary-row">
            <span>Tax</span>
            <span>${window.formatPrice(tax)}</span>
        </div>
        <div class="summary-row total">
            <span>Total</span>
            <span>${window.formatPrice(total)}</span>
        </div>
        <button class="checkout-btn" onclick="proceedToCheckout()">
            Proceed to Checkout
        </button>
        <div class="continue-shopping">
            <a href="index.html">← Continue Shopping</a>
        </div>
    `;
}

function setupCartItemInteractions() {
    const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
    const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const removeButtons = document.querySelectorAll('.remove-item-btn');
    
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const currentItem = window.cart.getItems().find(item => item.product.id === productId);
            
            if (currentItem && currentItem.quantity > 1) {
                window.cart.updateQuantity(productId, currentItem.quantity - 1);
                loadCartItems();
            }
        });
    });
    
    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const currentItem = window.cart.getItems().find(item => item.product.id === productId);
            
            if (currentItem && currentItem.quantity < 99) {
                window.cart.updateQuantity(productId, currentItem.quantity + 1);
                loadCartItems();
            }
        });
    });
    
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const productId = this.dataset.productId;
            const newQuantity = parseInt(this.value);
            
            if (newQuantity >= 1 && newQuantity <= 99) {
                window.cart.updateQuantity(productId, newQuantity);
                loadCartItems();
            } else {
                const currentItem = window.cart.getItems().find(item => item.product.id === productId);
                if (currentItem) {
                    this.value = currentItem.quantity;
                }
            }
        });
        
        input.addEventListener('keypress', function(e) {
            if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter'].includes(e.key)) {
                e.preventDefault();
            }
        });
    });
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            
            if (confirm('Are you sure you want to remove this item from your cart?')) {
                window.cart.removeItem(productId);
                loadCartItems();
            }
        });
    });
}

function proceedToCheckout() {
    const total = window.cart.getTotalPrice();
    const shipping = total > 50 ? 0 : 9.99;
    const tax = total * 0.08;
    const finalTotal = total + shipping + tax;
    
    alert(`Thank you for your order!\n\nOrder Total: ${window.formatPrice(finalTotal)}\n\nThis is a demo - no actual payment has been processed.`);
    
    window.cart.clearCart();
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query) {
        window.location.href = `index.html?search=${encodeURIComponent(query)}`;
    }
}

window.proceedToCheckout = proceedToCheckout;