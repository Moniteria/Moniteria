document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Collect form data
    const title = document.getElementById('productTitle').value.trim();
    const price = document.getElementById('productPrice').value.trim();
    const imageFiles = document.getElementById('productImages').files; // Get uploaded files
    const colors = document.getElementById('productColor').value.split(',').map(color => color.trim());
    const sizes = document.getElementById('productSize').value.split(',').map(size => size.trim());

    if (!title || !price || imageFiles.length === 0 || colors.length === 0 || sizes.length === 0) {
        alert('Please fill in all fields before submitting.');
        return;
    }

    // Create an array to store image URLs (for the preview)
    const imageURLs = [];
    for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const reader = new FileReader();

        reader.onload = function(e) {
            // Push the image data URL to the array
            imageURLs.push(e.target.result);

            // Once all images are loaded, generate the HTML (if all files are processed)
            if (imageURLs.length === imageFiles.length) {
                generateHTML(title, price, imageURLs, colors, sizes);
            }
        };

        reader.readAsDataURL(file); // Read each file as a data URL
    }

    // Function to generate HTML for the product page
    function generateHTML(title, price, images, colors, sizes) {
        const generatedHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="/css/navbar.css">
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/phonestyles.css">
    <link rel="stylesheet" href="/css/productpage.css">
    <link rel="stylesheet" href="/css/ubuntuclasses.css">
    <link rel="stylesheet" href="/css/font.css">
    <link rel="shortcut icon" href="/img/favicon.ico" type="image/x-icon">
    <style>
        .color {
            width: 30px;
            height: 30px;
            display: inline-block;
            margin: 5px;
            cursor: pointer;
            border: 2px solid transparent; /* Default border */
        }
        .color.selected {
            border: 2px solid black; /* Black border for selected color */
        }
    </style>
</head>
<body>
<nav class="navbar">
    <div class="container">
        <div class="navbar-header">
            <button class="navbar-toggler" data-toggle="open-navbar1">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <a href="/index.html">
                <img src="/img/Logos/Logo(Transparent).jpeg" width="80">
            </a>
        </div>
        <div class="navbar-menu" id="open-navbar1">
            <ul class="navbar-nav">
                <li><a href="/index.html">Home</a></li>
                 <li><a href="/sweatpants.html">Sweatpants</a></li>
                <li>            
                <div class="cart-container">
                <a href="/cart.html">
                <img src="/img/cart-icon.png" alt="Cart" width="30">
                <span id="cartCount" class="cart-count">0</span>
                  </a>
                 </div>
                  </li>
                </ul>
        </div>
    </div>
</nav>

<div class="container">
    <div class="product-images">
        ${images.map(image => `<img class="product-image" width="60%" src="${image}" alt="${title}">`).join('')}
    </div>
    <div class="product-details">
        <h1 class="product-title">${title}</h1>
        <p>Price: <strong class="product-price">${price} EGP</strong></p>
        <div>
            <label for="color">Color:</label>
            <div class="color-options">
                ${colors.map(color => `<div class="color" style="background-color:${color}" title="${color}"></div>`).join('')}
            </div>
        </div>
        <div>
            <label for="size">Size:</label>
            <select id="size">
                ${sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
            </select>
        </div>
        <button class="buyButtonWhiteBG" onclick="addToCart()">ADD TO CART</button>
    </div>
</div>

<script>
// Add event listeners to color options
document.querySelectorAll('.color-options .color').forEach(colorDiv => {
    colorDiv.addEventListener('click', function() {
        document.querySelectorAll('.color-options .color').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// Add product to cart
function addToCart() {
    const title = document.querySelector('.product-title').textContent;
    const price = document.querySelector('.product-price').textContent;
    const selectedColor = document.querySelector('.color-options .selected');
    const color = selectedColor ? selectedColor.title : "No color selected";
    const size = document.querySelector('#size').value;
    const image = document.querySelector('.product-image').src;

    const product = { title, price, color, size, image, quantity: 1 };
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingProductIndex = cart.findIndex(item => item.title === product.title && item.size === product.size && item.color === product.color);
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Product added to cart!');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
}

window.onload = updateCartCount;
</script>
<script src="/js/navbar.js"></script>
</body>
</html>
    `;

        // Display the generated HTML in the preview section
        document.getElementById('generatedHTML').innerHTML = generatedHTML;

        // Create a Blob for download
        const blob = new Blob([generatedHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.replace(/\s+/g, '_')}.html`;
        link.click();
        URL.revokeObjectURL(url);
    }
});
