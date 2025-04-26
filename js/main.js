// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        this.classList.toggle('active');
    });

    // Load featured products
    loadFeaturedProducts();

    // Initialize cart count
    updateCartCount();
});

// Product data
const products = [
    {
        id: 1,
        name: "Spiderman: No Way Home",
        price: 499,
        image: "images/posters/spiderman-nowayhome.jpg",
        description: "Official poster from Spiderman: No Way Home movie",
        category: "Movie",
        rating: 5
    },
    {
        id: 2,
        name: "Amazing Spiderman #1",
        price: 599,
        image: "images/posters/amazing-spiderman-1.jpg",
        description: "Classic comic book cover art from Amazing Spiderman #1",
        category: "Comic",
        rating: 4
    },
    {
        id: 3,
        name: "Into the Spiderverse",
        price: 549,
        image: "images/posters/spiderverse.jpg",
        description: "Artistic poster from Spiderman: Into the Spiderverse",
        category: "Movie",
        rating: 5
    },
    {
        id: 4,
        name: "Spiderman PS4",
        price: 649,
        image: "images/posters/spiderman-ps4.jpg",
        description: "Poster from the popular Spiderman PS4 game",
        category: "Game",
        rating: 4
    }
];

// Load featured products
function loadFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featured-products');
    
    if (featuredProductsContainer) {
        // Show first 4 products as featured
        const featuredProducts = products.slice(0, 4);
        
        featuredProductsContainer.innerHTML = featuredProducts.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="price">₹${product.price}</div>
                    <button class="btn add-to-cart">Add to Cart</button>
                    <button class="btn secondary add-to-wishlist">Wishlist</button>
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

// Cart functionality
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.id === productId);
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show notification
    showNotification(`${product.name} added to cart!`);
}

function addToWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const product = products.find(p => p.id === productId);
    
    // Check if product already in wishlist
    const existingItem = wishlist.find(item => item.id === productId);
    
    if (!existingItem) {
        wishlist.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
        });
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showNotification(`${product.name} added to wishlist!`);
    } else {
        showNotification(`${product.name} is already in your wishlist!`);
    }
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification styles to head
const style = document.createElement('style');
style.textContent = `
.notification {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--primary-color);
    color: white;
    padding: 15px 25px;
    border-radius: 4px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.notification.show {
    opacity: 1;
}
`;
document.head.appendChild(style);