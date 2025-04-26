// Products Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    loadAllProducts();
    
    // Filter and sort functionality
    document.getElementById('category').addEventListener('change', filterProducts);
    document.getElementById('sort').addEventListener('change', filterProducts);
});

function loadAllProducts() {
    const allProductsContainer = document.getElementById('all-products');
    
    if (allProductsContainer) {
        allProductsContainer.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}" data-category="${product.category}" data-price="${product.price}" data-rating="${product.rating}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="price">₹${product.price}</div>
                    <div class="rating">${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}</div>
                    <button class="btn add-to-cart">Add to Cart</button>
                    <button class="btn secondary add-to-wishlist">Wishlist</button>
                    <a href="product-detail.html?id=${product.id}" class="btn view-details">View Details</a>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.closest('.product-card').getAttribute('data-id'));
                addToCart(productId);
            });
        });
        
        document.querySelectorAll('.add-to-wishlist').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.closest('.product-card').getAttribute('data-id'));
                addToWishlist(productId);
            });
        });
    }
}

function filterProducts() {
    const categoryFilter = document.getElementById('category').value;
    const sortFilter = document.getElementById('sort').value;
    
    let filteredProducts = [...products];
    
    // Apply category filter
    if (categoryFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
    }
    
    // Apply sort filter
    switch(sortFilter) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // Default sorting (by ID or as they are in the array)
            break;
    }
    
    // Update the display
    const allProductsContainer = document.getElementById('all-products');
    allProductsContainer.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}" data-category="${product.category}" data-price="${product.price}" data-rating="${product.rating}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="price">₹${product.price}</div>
                <div class="rating">${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}</div>
                <button class="btn add-to-cart">Add to Cart</button>
                <button class="btn secondary add-to-wishlist">Wishlist</button>
                <a href="product-detail.html?id=${product.id}" class="btn view-details">View Details</a>
            </div>
        </div>
    `).join('');
    
    // Reattach event listeners
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.closest('.product-card').getAttribute('data-id'));
            addToCart(productId);
        });
    });
    
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.closest('.product-card').getAttribute('data-id'));
            addToWishlist(productId);
        });
    });
}