// Custom Order Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Show/hide custom size field based on selection
    const sizeSelect = document.getElementById('size');
    const customSizeGroup = document.getElementById('custom-size-group');
    
    if (sizeSelect && customSizeGroup) {
        sizeSelect.addEventListener('change', function() {
            if (this.value === 'custom') {
                customSizeGroup.style.display = 'block';
            } else {
                customSizeGroup.style.display = 'none';
            }
        });
    }
    
    // Form submission
    const orderForm = document.getElementById('custom-order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                size: document.getElementById('size').value,
                customSize: document.getElementById('size').value === 'custom' ? document.getElementById('custom-size').value : '',
                theme: document.getElementById('theme').value,
                description: document.getElementById('description').value,
                budget: document.getElementById('budget').value,
                timeline: document.getElementById('timeline').value,
                date: new Date().toISOString(),
                status: 'Pending'
            };
            
            // Handle file uploads (note: this won't actually upload files without a server)
            const fileInput = document.getElementById('reference');
            if (fileInput.files.length > 0) {
                formData.files = [];
                for (let i = 0; i < fileInput.files.length; i++) {
                    formData.files.push(fileInput.files[i].name);
                }
            }
            
            // Save to localStorage
            let customOrders = JSON.parse(localStorage.getItem('customOrders')) || [];
            customOrders.push(formData);
            localStorage.setItem('customOrders', JSON.stringify(customOrders));
            
            // Show success message
            showNotification('Your custom order request has been submitted! We will contact you soon.');
            
            // Reset form
            orderForm.reset();
            customSizeGroup.style.display = 'none';
            
            // In a real app, you would send this data to a server
            console.log('Custom order submitted:', formData);
        });
    }
});