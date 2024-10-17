

// JavaScript Variables
let products = [];
const productList = document.getElementById('product-list');
const productForm = document.getElementById('product-form');
const scannerSection = document.getElementById('scanner-section');
const notificationList = document.getElementById('notification-list');

// Add Product Event
productForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const productName = document.getElementById('product-name').value;
    const productImage = document.getElementById('product-image').files[0];
    const productQuantity = document.getElementById('product-quantity').value;
    const productExpiry = document.getElementById('product-expiry').value;
    const barcode = document.getElementById('barcode').value;

    // Create product object
    const product = {
        name: productName,
        image: URL.createObjectURL(productImage),
        quantity: productQuantity,
        expiry: productExpiry,
        barcode: barcode
    };

    // Add product to array and local storage
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));

    // Reset form
    productForm.reset();

    // Display products and check for expiry notifications
    displayProducts();
    checkForExpiryNotifications();
});

// Display products in a card format
function displayProducts() {
    productList.innerHTML = '';
    products = JSON.parse(localStorage.getItem('products')) || [];
    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" width="100">
            <p><b>${product.name}</b></p>
        `;

        // Add event listener for showing product details with edit option
        productCard.addEventListener('click', () => showProductDetails(index));

        productList.appendChild(productCard);
    });
}

// Show Product Details and allow editing
function showProductDetails(index) {
    const product = products[index];
    const daysLeft = calculateDaysLeft(product.expiry);

    const productDetails = `
        <form id="update-product-form">
            <label>Product Name:</label>
            <input type="text" id="update-product-name" value="${product.name}">
            
            <label>Quantity:</label>
            <input type="number" id="update-product-quantity" value="${product.quantity}">
            
            <label>Expiry Date:</label>
            <input type="date" id="update-product-expiry" value="${product.expiry}">

            <label>Barcode ID:</label>
            <input type="text" id="barcode" value="${product.barcode}">
            
            <p><b>Days until Expiry: ${daysLeft} days</b></p>
            
            <button type="button" onclick="updateProduct(${index})">Save Changes</button>
            <button type="button" onclick="displayProducts()">Cancel</button>
            <button onclick="deleteProduct(${index})">Delete Product</button>
        </form>
        
    `;

    document.getElementById('product-list').innerHTML = productDetails;
}

// Update product details
function updateProduct(index) {
    const updatedName = document.getElementById('update-product-name').value;
    const updatedQuantity = document.getElementById('update-product-quantity').value;
    const updatedExpiry = document.getElementById('update-product-expiry').value;

    // Update the selected product's details
    products[index].name = updatedName;
    products[index].quantity = updatedQuantity;
    products[index].expiry = updatedExpiry;

    // Update localStorage with new product details
    localStorage.setItem('products', JSON.stringify(products));

    // Go back to product list after saving
    displayProducts();
    checkForExpiryNotifications(); // Check expiry after update
}

// Calculate days left until expiry
function calculateDaysLeft(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Delete product
function deleteProduct(index) {
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    displayProducts();
    checkForExpiryNotifications(); // Check expiry after delete
}

// Open barcode scanner
document.getElementById('open-scanner').addEventListener('click', () => {
    scannerSection.style.display = 'block';
});

// Handle barcode scanning
document.getElementById('scan-button').addEventListener('click', () => {
    const barcodeInput = document.getElementById('barcode-scan-input').value;
    const product = products.find(p => p.barcode === barcodeInput);

    if (product && product.quantity > 0) {
        product.quantity--;
        alert(`${product.name} quantity reduced by 1. Remaining: ${product.quantity}`);
        localStorage.setItem('products', JSON.stringify(products));
        displayProducts();
        checkForExpiryNotifications();
    } else {
        alert('Product not found or out of stock!');
    }
});

// Check for products close to expiry (within 5 days)
function checkForExpiryNotifications() {
    notificationList.innerHTML = '';  // Clear previous notifications
    const products = JSON.parse(localStorage.getItem('products')) || [];

    const today = new Date();

    products.forEach(product => {
        const expiryDate = new Date(product.expiry);
        const daysLeft = calculateDaysLeft(product.expiry);

        if (daysLeft <= 20) {
            // Create notification item
            const notificationItem = document.createElement('li');
            notificationItem.classList.add('notification-item');

            // Create warning icon (you can use an SVG or an image)
            const warningIcon = document.createElement('img');
            warningIcon.src = '/Untitled-design.png'; // Replace with your warning icon path
            warningIcon.alt = 'Warning';
            warningIcon.classList.add('warning-icon');

            // Create notification text
            const notificationText = document.createElement('span');
            notificationText.classList.add('notification-text');
            notificationText.innerText = `Product "${product.name}" is close to expiry (in ${daysLeft} days).`;

            // Append icon and text to notification item
            notificationItem.appendChild(warningIcon);
            notificationItem.appendChild(notificationText);

            // Append notification item to the notification list
            notificationList.appendChild(notificationItem);
        }
    });
}


// Initial load
displayProducts();
checkForExpiryNotifications(); // Check expiry when page loads



// Search functionality
function applySearch() {
    const searchQuery = document.getElementById('search-bar').value.toLowerCase();

    // Get the products from local storage
    let filteredProducts = JSON.parse(localStorage.getItem('products')) || [];

    // Filter by name
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(searchQuery));
    }

    // Display the filtered products
    displayFilteredProducts(filteredProducts);
}

// Display filtered products
function displayFilteredProducts(productsToShow) {
    productList.innerHTML = '';
    productsToShow.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" width="100">
            <p>${product.name}</p>
        `;
        productCard.addEventListener('click', () => showProductDetails(index));
        productList.appendChild(productCard);
    });
}








