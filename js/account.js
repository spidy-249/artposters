// Account Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab button
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Update active tab content
            document.querySelectorAll('.account-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            // Load content if needed
            if (tabId === 'orders') {
                loadOrders();
            } else if (tabId === 'wishlist') {
                loadWishlist();
            } else if (tabId === 'details') {
                loadAccountDetails();
            }
        });
    });
    
    // Load initial tab (orders)
    loadOrders();
    
    // Account form submission
    const accountForm = document.getElementById('account-form');
    if (accountForm) {
        accountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('account-name').value;
            const email = document.getElementById('account-email').value;
            const phone = document.getElementById('account-phone').value;
            const password = document.getElementById('account-password').value;
            const passwordConfirm = document.getElementById('account-password-confirm').value;
            
            if (password && password !== passwordConfirm) {
                showNotification('Passwords do not match!');
                return;
            }
            
            // Save account details
            const user = {
                name: name,
                email: email,
                phone: phone,
                ...(password && { password: password }) // Only include if password is set
            };
            
            localStorage.setItem('currentUser', JSON.stringify(user));
            showNotification('Account details updated!');
        });
    }
});

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const ordersList = document.getElementById('orders-list');
    
    if (ordersList) {
        if (orders.length > 0) {
            ordersList.innerHTML = orders.map(order => `
                <div class="order">
                    <div class="order-header">
                        <div class="order-id">Order #${order.id}</div>
                        <div class="order-date">${new Date(order.date).toLocaleDateString()}</div>
                        <div class="order-status">${order.status}</div>
                        <div class="order-total">₹${order.total}</div>
                    </div>
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item">
                                <div class="item-image">
                                    <img src="${item.image}" alt="${item.name}">
                                </div>
                                <div class="item-details">
                                    <div class="item-name">${item.name}</div>
                                    <div class="item-quantity">Qty: ${item.quantity}</div>
                                    <div class="item-price">₹${item.price * item.quantity}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-actions">
                        <button class="btn">Track Order</button>
                        <button class="btn secondary">Reorder</button>
                    </div>
                </div>
            `).join('');
        } else {
            ordersList.innerHTML = '<p>You have no orders yet.</p>';
        }
    }
}

function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistItems = document.getElementById('wishlist-items');
    
    if (wishlistItems) {
        if (wishlist.length > 0) {
            wishlistItems.innerHTML = wishlist.map(item => `
                <div class="wishlist-item" data-id="${item.id}">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <div class="price">₹${item.price}</div>
                    </div>
                    <div class="item-actions">
                        <button class="btn add-to-cart">Add to Cart</button>
                        <button class="btn secondary remove-from-wishlist">Remove</button>
                    </div>
                </div>
            `).join('');
            
            // Add event listeners
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.closest('.wishlist-item').getAttribute('data-id'));
                    addToCart(productId);
                });
            });
            
            document.querySelectorAll('.remove-from-wishlist').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.closest('.wishlist-item').getAttribute('data-id'));
                    removeFromWishlist(productId);
                });
            });
        } else {
            wishlistItems.innerHTML = '<p>Your wishlist is empty.</p>';
        }
    }
}

function loadAccountDetails() {
    const user = JSON.parse(localStorage.getItem('currentUser')) || {};
    
    document.getElementById('account-name').value = user.name || '';
    document.getElementById('account-email').value = user.email || '';
    document.getElementById('account-phone').value = user.phone || '';
}

function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => item.id !== productId);
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    loadWishlist();
    showNotification('Item removed from wishlist');
}