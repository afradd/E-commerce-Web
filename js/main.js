document.addEventListener('DOMContentLoaded', function() {
    initializeHomepage();
    setupEventListeners();
    loadProducts();
});

function initializeHomepage() {
    if (window.cart) {
        cart.updateCartCount();
    }
}

function setupEventListeners() {
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
    const signInBtn = document.getElementById('signInBtn');
    const cartBtn = document.getElementById('cartBtn');
    if (signInBtn) {
        signInBtn.addEventListener('click', function() {
            window.location.href = 'signin.html';
        });
    }
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            window.location.href = 'cart.html';
        });
    }
}

function loadProducts() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    displayProducts(window.products);
}

function displayProducts(productsToShow) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    if (productsToShow.length === 0) {
        productGrid.innerHTML = `
            <div class="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your search</p>
            </div>
        `;
        return;
    }
    const productsHTML = productsToShow.map(product => {
        const starsHTML = window.generateStarRating(product.rating);
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-rating">
                        <div class="stars">${starsHTML}</div>
                        <span class="rating-text">${product.rating} (${product.reviews})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">${window.formatPrice(product.price)}</span>
                    </div>
                    <button class="add-to-cart" onclick="addToCart('${product.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    }).join('');
    productGrid.innerHTML = productsHTML;
    const productCards = productGrid.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.closest('.add-to-cart')) {
                return;
            }
            const productId = this.dataset.productId;
            window.location.href = `product.html?id=${productId}`;
        });
    });
}

function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    if (query) {
        const searchResults = window.searchProducts(query);
        displayProducts(searchResults);
        const productsHeader = document.querySelector('.products-header h2');
        if (productsHeader) {
            productsHeader.textContent = `Search Results for "${query}"`;
        }
    } else {
        displayProducts(window.products);
        const productsHeader = document.querySelector('.products-header h2');
        if (productsHeader) {
            productsHeader.textContent = 'Products';
        }
    }
}

function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function addToCart(productId) {
    const product = window.getProductById(productId);
    if (product && window.cart) {
        window.cart.addItem(product, 1);
        const button = event.target.closest('.add-to-cart');
        if (button) {
            const originalText = button.innerHTML;
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
                Added!
            `;
            button.disabled = true;
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
            }, 1500);
        }
    }
}

window.addToCart = addToCart;
window.scrollToProducts = scrollToProducts;