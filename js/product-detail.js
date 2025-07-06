// Product detail page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        loadProductDetails(productId);
        loadRelatedProducts(productId);
    } else {
        // Redirect to homepage if no product ID
        window.location.href = 'index.html';
    }
    
    // Set up event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Header buttons
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
    
    // Search functionality
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

function loadProductDetails(productId) {
    const product = window.getProductById(productId);
    
    if (!product) {
        // Product not found, redirect to homepage
        window.location.href = 'index.html';
        return;
    }
    
    // Update page title
    document.title = `${product.name} - ShopHub`;
    
    // Update breadcrumb
    updateBreadcrumb(product);
    
    // Update product images
    updateProductImages(product);
    
    // Update product information
    updateProductInfo(product);
    
    // Set up product interactions
    setupProductInteractions(product);
    
    // Update cart count
    if (window.cart) {
        window.cart.updateCartCount();
    }
}

function updateBreadcrumb(product) {
    const breadcrumbCategory = document.getElementById('breadcrumbCategory');
    const breadcrumbProduct = document.getElementById('breadcrumbProduct');
    
    if (breadcrumbCategory) {
        const categoryName = product.category.charAt(0).toUpperCase() + product.category.slice(1);
        breadcrumbCategory.textContent = categoryName;
    }
    
    if (breadcrumbProduct) {
        breadcrumbProduct.textContent = product.name;
    }
}

function updateProductImages(product) {
    const mainImage = document.getElementById('mainImage');
    const thumbnailContainer = document.getElementById('thumbnailImages');
    
    if (mainImage) {
        mainImage.src = product.image;
        mainImage.alt = product.name;
    }
    
    if (thumbnailContainer && product.images && product.images.length > 1) {
        const thumbnailsHTML = product.images.map((image, index) => `
            <div class="thumbnail ${index === 0 ? 'active' : ''}" data-image="${image}">
                <img src="${image}" alt="${product.name} - Image ${index + 1}">
            </div>
        `).join('');
        
        thumbnailContainer.innerHTML = thumbnailsHTML;
        
        // Add thumbnail click listeners
        const thumbnails = thumbnailContainer.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                const imageUrl = this.dataset.image;
                
                // Update main image
                if (mainImage) {
                    mainImage.src = imageUrl;
                }
                
                // Update active thumbnail
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
}

function updateProductInfo(product) {
    // Product name
    const productName = document.getElementById('productName');
    if (productName) {
        productName.textContent = product.name;
    }
    
    // Rating
    const productStars = document.getElementById('productStars');
    const productRating = document.getElementById('productRating');
    const productReviews = document.getElementById('productReviews');
    
    if (productStars) {
        productStars.innerHTML = window.generateStarRating(product.rating);
    }
    
    if (productRating) {
        productRating.textContent = product.rating;
    }
    
    if (productReviews) {
        productReviews.textContent = product.reviews.toLocaleString();
    }
    
    // Price
    const currentPrice = document.getElementById('currentPrice');
    const originalPrice = document.getElementById('originalPrice');
    
    if (currentPrice) {
        currentPrice.textContent = window.formatPrice(product.price);
    }
    
    if (originalPrice) {
        if (product.originalPrice) {
            originalPrice.textContent = window.formatPrice(product.originalPrice);
            originalPrice.style.display = 'inline';
        } else {
            originalPrice.style.display = 'none';
        }
    }
    
    // Stock status
    const stockStatus = document.getElementById('stockStatus');
    if (stockStatus) {
        if (product.inStock) {
            stockStatus.innerHTML = '<span class="in-stock">✓ In Stock</span>';
        } else {
            stockStatus.innerHTML = '<span class="out-of-stock">Out of Stock</span>';
        }
    }
    
    // Description
    const productDescription = document.getElementById('productDescription');
    if (productDescription) {
        productDescription.textContent = product.description;
    }
    
    // Features
    const featuresList = document.getElementById('featuresList');
    const featuresSection = document.getElementById('productFeatures');
    
    if (product.features && product.features.length > 0) {
        if (featuresList) {
            const featuresHTML = product.features.map(feature => `<li>${feature}</li>`).join('');
            featuresList.innerHTML = featuresHTML;
        }
        if (featuresSection) {
            featuresSection.style.display = 'block';
        }
    } else {
        if (featuresSection) {
            featuresSection.style.display = 'none';
        }
    }
}

function setupProductInteractions(product) {
    const addToCartBtn = document.getElementById('addToCartBtn');
    const buyNowBtn = document.getElementById('buyNowBtn');
    const quantitySelect = document.getElementById('quantity');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const quantity = parseInt(quantitySelect.value) || 1;
            
            if (window.cart) {
                window.cart.addItem(product, quantity);
                
                // Visual feedback
                const originalText = this.innerHTML;
                this.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    Added to Cart!
                `;
                this.disabled = true;
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 2000);
            }
        });
    }
    
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function() {
            const quantity = parseInt(quantitySelect.value) || 1;
            
            if (window.cart) {
                window.cart.addItem(product, quantity);
                // Redirect to cart page
                window.location.href = 'cart.html';
            }
        });
    }
    
    // Disable buttons if out of stock
    if (!product.inStock) {
        if (addToCartBtn) {
            addToCartBtn.disabled = true;
            addToCartBtn.textContent = 'Out of Stock';
        }
        if (buyNowBtn) {
            buyNowBtn.disabled = true;
            buyNowBtn.textContent = 'Out of Stock';
        }
    }
}

function loadRelatedProducts(currentProductId) {
    const product = window.getProductById(currentProductId);
    if (!product) return;
    
    const relatedProducts = window.getRelatedProducts(currentProductId, product.category, 4);
    const relatedProductsContainer = document.getElementById('relatedProducts');
    
    if (relatedProductsContainer && relatedProducts.length > 0) {
        const relatedHTML = relatedProducts.map(relatedProduct => {
            const discount = window.calculateDiscount(relatedProduct.originalPrice, relatedProduct.price);
            const starsHTML = window.generateStarRating(relatedProduct.rating);
            
            return `
                <div class="product-card" data-product-id="${relatedProduct.id}">
                    <div class="product-image">
                        <img src="${relatedProduct.image}" alt="${relatedProduct.name}" loading="lazy">
                        ${discount > 0 ? `<div class="discount-badge">${discount}% OFF</div>` : ''}
                    </div>
                    <div class="product-info">
                        <div class="product-category">${relatedProduct.category}</div>
                        <h3 class="product-name">${relatedProduct.name}</h3>
                        <div class="product-rating">
                            <div class="stars">${starsHTML}</div>
                            <span class="rating-text">${relatedProduct.rating} (${relatedProduct.reviews})</span>
                        </div>
                        <div class="product-price">
                            <span class="current-price">${window.formatPrice(relatedProduct.price)}</span>
                            ${relatedProduct.originalPrice ? `<span class="original-price">${window.formatPrice(relatedProduct.originalPrice)}</span>` : ''}
                        </div>
                        <button class="add-to-cart" onclick="addToCart('${relatedProduct.id}')">
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
        
        relatedProductsContainer.innerHTML = relatedHTML;
        
        // Add click listeners to related product cards
        const relatedCards = relatedProductsContainer.querySelectorAll('.product-card');
        relatedCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // Don't navigate if clicking on add to cart button
                if (e.target.closest('.add-to-cart')) {
                    return;
                }
                
                const productId = this.dataset.productId;
                window.location.href = `product.html?id=${productId}`;
            });
        });
    }
}

function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query) {
        // Redirect to homepage with search query
        window.location.href = `index.html?search=${encodeURIComponent(query)}`;
    }
}

function addToCart(productId) {
    const product = window.getProductById(productId);
    if (product && window.cart) {
        window.cart.addItem(product, 1);
        
        // Add visual feedback
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

// Make functions available globally
window.addToCart = addToCart;