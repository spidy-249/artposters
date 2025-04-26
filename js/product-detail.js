// Product Detail Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (productId) {
        loadProductDetails(productId);
        loadProductReviews(productId);
    } else {
        // Redirect if no product ID
        window.location.href = 'products.html';
    }
    
    // Review form submission
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const reviewerName = document.getElementById('reviewer-name').value;
            const reviewRating = parseInt(document.getElementById('review-rating').value);
            const reviewText = document.getElementById('review-text').value;
            
            if (reviewerName && reviewText) {
                addReview(productId, reviewerName, reviewRating, reviewText);
                reviewForm.reset();
            }
        });
    }
});

function loadProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    const productDetailContainer = document.getElementById('product-detail-container');
    
    if (product && productDetailContainer) {
        productDetailContainer.innerHTML = `
            <div class="product-detail-grid">
                <div class="product-image-large">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info-detail">
                    <h2>${product.name}</h2>
                    <div class="price">₹${product.price}</div>
                    <div class="category">Category: ${product.category}</div>
                    <div class="rating">Rating: ${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}</div>
                    <p class="description">${product.description}</p>
                    
                    <div class="product-actions">
                        <div class="quantity-selector">
                            <button class="quantity-btn minus">-</button>
                            <input type="number" value="1" min="1" class="quantity-input">
                            <button class="quantity-btn plus">+</button>
                        </div>
                        <button class="btn add-to-cart-detail">Add to Cart</button>
                        <button class="btn secondary add-to-wishlist-detail">Add to Wishlist</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        document.querySelector('.add-to-cart-detail').addEventListener('click', function() {
            const quantity = parseInt(document.querySelector('.quantity-input').value);
            addToCart(productId, quantity);
        });
        
        document.querySelector('.add-to-wishlist-detail').addEventListener('click', function() {
            addToWishlist(productId);
        });
        
        // Quantity selector
        document.querySelector('.quantity-btn.minus').addEventListener('click', function() {
            const input = document.querySelector('.quantity-input');
            if (parseInt(input.value) > 1) {
                input.value = parseInt(input.value) - 1;
            }
        });
        
        document.querySelector('.quantity-btn.plus').addEventListener('click', function() {
            const input = document.querySelector('.quantity-input');
            input.value = parseInt(input.value) + 1;
        });
    }
}

function loadProductReviews(productId) {
    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const productReviews = reviews.filter(review => review.productId === productId);
    const reviewsList = document.getElementById('reviews-list');
    
    if (reviewsList) {
        if (productReviews.length > 0) {
            reviewsList.innerHTML = productReviews.map(review => `
                <div class="review">
                    <div class="review-header">
                        <div class="reviewer-name">${review.reviewerName}</div>
                        <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                        <div class="review-date">${review.date}</div>
                    </div>
                    <div class="review-text">${review.text}</div>
                </div>
            `).join('');
        } else {
            reviewsList.innerHTML = '<p>No reviews yet. Be the first to review!</p>';
        }
    }
}

function addReview(productId, reviewerName, rating, text) {
    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    
    const newReview = {
        id: Date.now(),
        productId: productId,
        reviewerName: reviewerName,
        rating: rating,
        text: text,
        date: new Date().toLocaleDateString()
    };
    
    reviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    // Reload reviews
    loadProductReviews(productId);
    
    // Show notification
    showNotification('Thank you for your review!');
}

// Modified addToCart to accept quantity
function addToCart(productId, quantity = 1) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.id === productId);
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show notification
    showNotification(`${quantity} ${product.name} added to cart!`);
}