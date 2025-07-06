// Sample product data
const products = [
    {
        id: '1',
        name: 'Premium Wireless Headphones',
        price: 299.99,
        image: 'https://images.pexels.com/photos/5081386/pexels-photo-5081386.jpeg?auto=compress&cs=tinysrgb&w=500',
        description: 'Experience superior sound quality with these premium wireless headphones featuring active noise cancellation, 30-hour battery life, and crystal-clear audio reproduction.',
        rating: 4.8,
        reviews: 2847,
        category: 'electronics',
        inStock: true,
        features: [
            'Active Noise Cancellation',
            '30-hour Battery Life',
            'Premium Audio Drivers',
            'Comfortable Over-ear Design',
            'Quick Charge Technology'
        ]
    },
    {
        id: '2',
        name: 'Smart Fitness Watch',
        price: 199.99,
        image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=500',
        description: 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring, GPS tracking, and comprehensive health insights.',
        rating: 4.6,
        reviews: 1523,
        category: 'electronics',
        inStock: true,
        features: [
            'Heart Rate Monitoring',
            'GPS Tracking',
            'Water Resistant',
            '7-day Battery Life',
            'Health Analytics'
        ]
    },
    {
        id: '3',
        name: 'Professional Camera Lens',
        price: 849.99,
        image: 'https://images.pexels.com/photos/32822410/pexels-photo-32822410.jpeg?auto=compress&cs=tinysrgb&w=500',
        description: 'Capture stunning photos with this professional-grade camera lens featuring superior optics and precision engineering.',
        rating: 4.9,
        reviews: 892,
        category: 'electronics',
        inStock: true,
        features: [
            'Superior Optics',
            'Weather Sealed',
            'Fast Autofocus',
            'Image Stabilization',
            'Professional Grade'
        ]
    },
    {
        id: '4',
        name: 'Gaming Mouse',
        price: 129.99,
        image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=500',
        description: 'Enhance your gaming experience with this mechanical keyboard featuring customizable RGB lighting and responsive switches.',
        rating: 4.7,
        reviews: 3421,
        category: 'electronics',
        inStock: true,
        features: [
            'Mechanical Switches',
            'RGB Backlighting',
            'Programmable Buttons',
            'Gaming Optimized',
            'Durable Construction'
        ]
    },
    {
        id: '5',
        name: 'Wireless Charging Pad',
        price: 39.99,
        image: 'https://images.pexels.com/photos/5083411/pexels-photo-5083411.jpeg?auto=compress&cs=tinysrgb&w=500',
        description: 'Convenient wireless charging solution compatible with all Qi-enabled devices.',
        rating: 4.4,
        reviews: 967,
        category: 'electronics',
        inStock: true,
        features: [
            'Qi Compatible',
            'Fast Charging',
            'LED Indicators',
            'Compact Design'
        ]
    },
    {
        id: '6',
        name: 'Premium Cotton T-Shirt',
        price: 24.99,
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=500',
        description: 'Comfortable and stylish cotton t-shirt perfect for everyday wear.',
        rating: 4.3,
        reviews: 756,
        category: 'clothing',
        inStock: true,
        features: [
            '100% Cotton',
            'Machine Washable',
            'Available in Multiple Colors',
            'Comfortable Fit'
        ]
    },
    {
        id: '7',
        name: 'Indoor Plant Pot Set',
        price: 49.99,
        image: 'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=500',
        description: 'Beautiful ceramic plant pots perfect for your home garden.',
        rating: 4.5,
        reviews: 432,
        category: 'home',
        inStock: true,
        features: [
            'Ceramic Material',
            'Drainage Holes',
            'Set of 3 Sizes',
            'Modern Design'
        ]
    },
    {
        id: '8',
        name: 'Yoga Mat',
        price: 34.99,
        image: 'https://images.pexels.com/photos/3458199/pexels-photo-3458199.jpeg?auto=compress&cs=tinysrgb&w=500',
        description: 'High-quality yoga mat for your daily practice and workouts.',
        rating: 4.6,
        reviews: 1234,
        category: 'sports',
        inStock: true,
        features: [
            'Non-slip Surface',
            'Eco-friendly Material',
            'Lightweight',
            'Easy to Clean'
        ]
    }
];

// Get products by category
function getProductsByCategory(category) {
    if (!category) return products;
    return products.filter(product => product.category === category);
}

// Get product by ID
function getProductById(id) {
    return products.find(product => product.id === id);
}

// Get related products
function getRelatedProducts(productId, category, limit = 4) {
    return products
        .filter(product => product.id !== productId && product.category === category)
        .slice(0, limit);
}

// Search products
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
}

// Sort products
function sortProducts(products, sortBy) {
    const productsCopy = [...products];
    
    switch (sortBy) {
        case 'price-low':
            return productsCopy.sort((a, b) => a.price - b.price);
        case 'price-high':
            return productsCopy.sort((a, b) => b.price - a.price);
        case 'rating':
            return productsCopy.sort((a, b) => b.rating - a.rating);
        case 'featured':
        default:
            return productsCopy;
    }
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<span class="star">★</span>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += '<span class="star">☆</span>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<span class="star empty">☆</span>';
    }
    
    return starsHTML;
}

// Format price
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

// Make functions available globally
window.products = products;
window.getProductsByCategory = getProductsByCategory;
window.getProductById = getProductById;
window.getRelatedProducts = getRelatedProducts;
window.searchProducts = searchProducts;
window.sortProducts = sortProducts;
window.generateStarRating = generateStarRating;
window.formatPrice = formatPrice;