// Admin Panel Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check admin login
    checkAdminLogin();
    
    // Tab switching
    document.querySelectorAll('.admin-sidebar a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const sectionId = this.getAttribute('data-section');
            
            // Update active tab
            document.querySelectorAll('.admin-sidebar a').forEach(a => {
                a.classList.remove('active');
            });
            this.classList.add('active');
            
            // Update active section
            document.querySelectorAll('.admin-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(`${sectionId}-section`).classList.add('active');
            
            // Load section data if needed
            switch(sectionId) {
                case 'dashboard':
                    loadDashboardStats();
                    break;
                case 'products':
                    loadProductsTable();
                    break;
                case 'orders':
                    loadOrdersTable();
                    break;
                case 'custom-orders':
                    loadCustomOrdersTable();
                    break;
                case 'reviews':
                    loadReviewsTable();
                    break;
                case 'users':
                    loadUsersTable();
                    break;
            }
        });
    });
    
    // Product modal
    const productModal = document.getElementById('product-modal');
    const addProductBtn = document.getElementById('add-product-btn');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            document.getElementById('product-modal-title').textContent = 'Add New Product';
            document.getElementById('product-form').reset();
            document.getElementById('product-id').value = '';
            productModal.classList.add('active');
        });
    }
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            productModal.classList.remove('active');
            document.getElementById('order-modal').classList.remove('active');
        });
    });
    
    // Product form submission
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const productId = document.getElementById('product-id').value;
            const productData = {
                name: document.getElementById('product-name').value,
                price: parseInt(document.getElementById('product-price').value),
                category: document.getElementById('product-category').value,
                rating: parseInt(document.getElementById('product-rating').value),
                description: document.getElementById('product-description').value,
                image: document.getElementById('product-image').value
            };
            
            if (productId) {
                // Edit existing product
                const index = products.findIndex(p => p.id === parseInt(productId));
                if (index !== -1) {
                    products[index] = { ...products[index], ...productData };
                }
            } else {
                // Add new product
                const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
                products.push({
                    id: newId,
                    ...productData
                });
            }
            
            // Save to localStorage
            localStorage.setItem('products', JSON.stringify(products));
            
            // Close modal and refresh table
            productModal.classList.remove('active');
            loadProductsTable();
            showNotification('Product saved successfully!');
        });
    }
    
    // Settings form submission
    const settingsForm = document.getElementById('admin-settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Settings saved successfully!');
        });
    }
    
    // Logout
    const logoutBtn = document.getElementById('admin-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('adminLoggedIn');
            window.location.href = 'login.html';
        });
    }
    
    // Load initial section (dashboard)
    loadDashboardStats();
});

function checkAdminLogin() {
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isAdminLoggedIn) {
        window.location.href = 'login.html';
    }
}

function loadDashboardStats() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const customOrders = JSON.parse(localStorage.getItem('customOrders')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Calculate totals
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalUsers = users.length;
    
    // Update stats
    document.getElementById('total-sales').textContent = `₹${totalSales}`;
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('total-users').textContent = totalUsers;
    
    // Load recent orders
    const recentOrdersList = document.getElementById('recent-orders-list');
    if (recentOrdersList) {
        const recentOrders = orders.slice(0, 5).reverse();
        
        if (recentOrders.length > 0) {
            recentOrdersList.innerHTML = recentOrders.map(order => `
                <div class="recent-order">
                    <div class="order-info">
                        <div class="order-id">#${order.id}</div>
                        <div class="order-date">${new Date(order.date).toLocaleDateString()}</div>
                    </div>
                    <div class="order-amount">₹${order.total}</div>
                </div>
            `).join('');
        } else {
            recentOrdersList.innerHTML = '<p>No recent orders</p>';
        }
    }
}

function loadProductsTable() {
    const tableBody = document.getElementById('products-table-body');
    
    if (tableBody) {
        tableBody.innerHTML = products.map(product => `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}" class="product-thumbnail"></td>
                <td>${product.name}</td>
                <td>₹${product.price}</td>
                <td>${product.category}</td>
                <td>${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}</td>
                <td>
                    <button class="btn edit-product" data-id="${product.id}">Edit</button>
                    <button class="btn secondary delete-product" data-id="${product.id}">Delete</button>
                </td>
            </tr>
        `).join('');
        
        // Add event listeners to buttons
        document.querySelectorAll('.edit-product').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                editProduct(productId);
            });
        });
        
        document.querySelectorAll('.delete-product').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                deleteProduct(productId);
            });
        });
    }
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    const productModal = document.getElementById('product-modal');
    
    if (product) {
        document.getElementById('product-modal-title').textContent = 'Edit Product';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-rating').value = product.rating;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-image').value = product.image;
        
        productModal.classList.add('active');
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        const index = products.findIndex(p => p.id === productId);
        
        if (index !== -1) {
            products.splice(index, 1);
            localStorage.setItem('products', JSON.stringify(products));
            loadProductsTable();
            showNotification('Product deleted successfully!');
        }
    }
}

function loadOrdersTable() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tableBody = document.getElementById('orders-table-body');
    
    if (tableBody) {
        tableBody.innerHTML = orders.reverse().map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${new Date(order.date).toLocaleDateString()}</td>
                <td>${order.shipping.name}</td>
                <td>₹${order.total}</td>
                <td>${order.status}</td>
                <td>
                    <button class="btn view-order" data-id="${order.id}">View</button>
                    <button class="btn secondary update-status" data-id="${order.id}">Update Status</button>
                </td>
            </tr>
        `).join('');
        
        // Add event listeners to buttons
        document.querySelectorAll('.view-order').forEach(button => {
            button.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                viewOrderDetails(orderId);
            });
        });
        
        document.querySelectorAll('.update-status').forEach(button => {
            button.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                updateOrderStatus(orderId);
            });
        });
    }
}

function viewOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    const orderModal = document.getElementById('order-modal');
    
    if (order) {
        document.getElementById('order-details-content').innerHTML = `
            <div class="order-info">
                <div class="info-row">
                    <span>Order ID:</span>
                    <span>${order.id}</span>
                </div>
                <div class="info-row">
                    <span>Date:</span>
                    <span>${new Date(order.date).toLocaleString()}</span>
                </div>
                <div class="info-row">
                    <span>Status:</span>
                    <span>${order.status}</span>
                </div>
                <div class="info-row">
                    <span>Total:</span>
                    <span>₹${order.total}</span>
                </div>
            </div>
            
            <div class="shipping-info">
                <h3>Shipping Information</h3>
                <p>${order.shipping.name}</p>
                <p>${order.shipping.address}</p>
                <p>${order.shipping.city}, ${order.shipping.state} ${order.shipping.zip}</p>
                <p>${order.shipping.country}</p>
                <p>Phone: ${order.shipping.phone}</p>
                <p>Email: ${order.shipping.email}</p>
            </div>
            
            <div class="payment-info">
                <h3>Payment Information</h3>
                <p>Method: ${order.payment.method}</p>
                ${order.payment.method === 'credit-card' ? `
                    <p>Card: **** **** **** ${order.payment.details.cardNumber.slice(-4)}</p>
                    <p>Expires: ${order.payment.details.expiry}</p>
                ` : ''}
            </div>
            
            <div class="order-items">
                <h3>Order Items</h3>
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
        `;
        
        orderModal.classList.add('active');
    }
}

function updateOrderStatus(orderId) {
    const newStatus = prompt('Enter new status (e.g., Processing, Shipped, Delivered):');
    
    if (newStatus) {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = newStatus;
            localStorage.setItem('orders', JSON.stringify(orders));
            loadOrdersTable();
            showNotification('Order status updated!');
        }
    }
}

function loadCustomOrdersTable() {
    const customOrders = JSON.parse(localStorage.getItem('customOrders')) || [];
    const tableBody = document.getElementById('custom-orders-table-body');
    
    if (tableBody) {
        tableBody.innerHTML = customOrders.reverse().map(order => `
            <tr>
                <td>${order.id || 'N/A'}</td>
                <td>${new Date(order.date).toLocaleDateString()}</td>
                <td>${order.name}</td>
                <td>${order.theme}</td>
                <td>${order.budget}</td>
                <td>${order.status || 'Pending'}</td>
                <td>
                    <button class="btn view-custom-order" data-id="${order.id || ''}">View</button>
                    <button class="btn secondary update-custom-status" data-id="${order.id || ''}">Update Status</button>
                </td>
            </tr>
        `).join('');
    }
}

function loadReviewsTable() {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const tableBody = document.getElementById('reviews-table-body');
    
    if (tableBody) {
        tableBody.innerHTML = reviews.reverse().map(review => `
            <tr>
                <td>${review.id}</td>
                <td>${products.find(p => p.id === review.productId)?.name || 'Product not found'}</td>
                <td>${review.reviewerName}</td>
                <td>${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</td>
                <td>${review.date}</td>
                <td>
                    <button class="btn view-review" data-id="${review.id}">View</button>
                    <button class="btn secondary delete-review" data-id="${review.id}">Delete</button>
                </td>
            </tr>
        `).join('');
    }
}

function loadUsersTable() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tableBody = document.getElementById('users-table-body');
    
    if (tableBody) {
        tableBody.innerHTML = users.map(user => {
            const userOrders = orders.filter(o => o.shipping.email === user.email);
            return `
                <tr>
                    <td>${user.id || 'N/A'}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone || 'N/A'}</td>
                    <td>${userOrders.length}</td>
                    <td>
                        <button class="btn view-user" data-email="${user.email}">View</button>
                    </td>
                </tr>
            `;
        }).join('');
    }
}