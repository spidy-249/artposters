// Checkout Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load order summary
    loadOrderSummary();
    
    // Payment method toggle
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('credit-card-form').style.display = 
                this.value === 'credit-card' ? 'block' : 'none';
        });
    });
    
    // Step navigation
    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = document.querySelector('.checkout-step:not([style*="display: none"])');
            const nextStepId = currentStep.id === 'step-1' ? 'step-2' : 'step-3';
            
            if (nextStepId === 'step-3') {
                // Place order
                placeOrder();
            }
            
            currentStep.style.display = 'none';
            document.getElementById(nextStepId).style.display = 'block';
            
            // Update step indicators
            document.querySelectorAll('.step').forEach(step => {
                step.classList.remove('active');
                if (parseInt(step.getAttribute('data-step')) <= 
                    parseInt(nextStepId.split('-')[1])) {
                    step.classList.add('active');
                }
            });
        });
    });
    
    document.querySelectorAll('.prev-step').forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = document.querySelector('.checkout-step:not([style*="display: none"])');
            const prevStepId = currentStep.id === 'step-2' ? 'step-1' : 'step-2';
            
            currentStep.style.display = 'none';
            document.getElementById(prevStepId).style.display = 'block';
            
            // Update step indicators
            document.querySelectorAll('.step').forEach(step => {
                step.classList.remove('active');
                if (parseInt(step.getAttribute('data-step')) <= 
                    parseInt(prevStepId.split('-')[1])) {
                    step.classList.add('active');
                }
            });
        });
    });
});

function loadOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderSummary = document.getElementById('order-summary-items');
    const confirmationItems = document.getElementById('confirmation-items');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 50; // Fixed shipping cost
    const total = subtotal + shipping;
    
    if (orderSummary) {
        orderSummary.innerHTML = cart.map(item => `
            <div class="order-item">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-quantity">Qty: ${item.quantity}</div>
                </div>
                <div class="item-price">₹${item.price * item.quantity}</div>
            </div>
        `).join('');
        
        document.getElementById('order-subtotal').textContent = `₹${subtotal}`;
        document.getElementById('order-shipping').textContent = `₹${shipping}`;
        document.getElementById('order-total').textContent = `₹${total}`;
    }
    
    if (confirmationItems) {
        confirmationItems.innerHTML = cart.map(item => `
            <div class="order-item">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-quantity">Qty: ${item.quantity}</div>
                </div>
                <div class="item-price">₹${item.price * item.quantity}</div>
            </div>
        `).join('');
        
        document.getElementById('confirmation-total').textContent = `₹${total}`;
    }
}

function placeOrder() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const form = document.getElementById('checkout-form');
    const formData = new FormData(form);
    const orderData = {
        id: `REACT-${Date.now()}`,
        items: cart,
        shipping: {
            name: formData.get('full-name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            zip: formData.get('zip'),
            country: formData.get('country'),
            method: formData.get('shipping-method')
        },
        payment: {
            method: formData.get('payment-method'),
            details: formData.get('payment-method') === 'credit-card' ? {
                cardNumber: formData.get('card-number'),
                expiry: formData.get('card-expiry'),
                cvv: formData.get('card-cvv'),
                name: formData.get('card-name')
            } : null
        },
        date: new Date().toISOString(),
        status: 'Processing'
    };
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = orderData.shipping.method === 'express' ? 100 : 50;
    orderData.total = subtotal + shipping;
    
    // Save order to localStorage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Update confirmation page
    document.getElementById('order-id').textContent = orderData.id;
    document.getElementById('confirmation-email').textContent = orderData.shipping.email;
    document.getElementById('confirmation-total').textContent = `₹${orderData.total}`;
    
    // Display shipping address
    const shippingAddress = document.getElementById('shipping-address');
    shippingAddress.innerHTML = `
        <p>${orderData.shipping.name}</p>
        <p>${orderData.shipping.address}</p>
        <p>${orderData.shipping.city}, ${orderData.shipping.state} ${orderData.shipping.zip}</p>
        <p>${orderData.shipping.country}</p>
        <p>Phone: ${orderData.shipping.phone}</p>
    `;
    
    // Clear cart
    localStorage.removeItem('cart');
    updateCartCount();
}