// Cart Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    
    // Event delegation for quantity changes and remove buttons
    document.getElementById('cart-items-container').addEventListener('click', function(e) {
        if (e.target.classList.contains('quantity-btn')) {
            const itemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
            const isIncrease = e.target.classList.contains('plus');
            updateCartItemQuantity(itemId, isIncrease);
        }
        
        if (e.target.classList.contains('remove-item')) {
            const itemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
            removeFromCart(itemId);
        }
    });
});

function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        emptyCartMessage.style.display = 'block';
        checkoutBtn.style.display = 'none';
        return;
    }
    
    emptyCartMessage.style.display = 'none';
    cartItemsContainer.style.display = 'block';
    checkoutBtn.style.display = 'inline-block';
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <div class="price">₹${item.price}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn minus">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn plus">+</button>
            </div>
            <div class="cart-item-total">
                ₹${item.price * item.quantity}
            </div>
            <div class="cart-item-remove">
                <button class="remove-item">×</button>
            </div>
        </div>
    `).join('');
    
    updateCartSummary();
}

function updateCartItemQuantity(itemId, isIncrease) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        if (isIncrease) {
            cart[itemIndex].quantity += 1;
        } else {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
            } else {
                // Remove if quantity would go to 0
                cart.splice(itemIndex, 1);
            }
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        loadCartItems();
    }
}

function removeFromCart(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== itemId);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCartItems();
}

function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 50; // Fixed shipping cost
    const total = subtotal + shipping;
    
    document.getElementById('cart-subtotal').textContent = `₹${subtotal}`;
    document.getElementById('cart-shipping').textContent = `₹${shipping}`;
    document.getElementById('cart-total').textContent = `₹${total}`;
}