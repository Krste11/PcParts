let products = [];
let cart = [];

// Elements
const elements = {
  categoryMenu: document.getElementById("categories"),
  productCardDiv: document.getElementById("productCardsDiv"),
  prevPageBtn: document.getElementById("prevPage"),
  nextPageBtn: document.getElementById("nextPage"),
  cartItems: document.getElementById("cartItems"),
  totalPrice: document.getElementById("totalPrice"),
};

// Load products from localStorage or the initial API
async function fetchProducts() {
  try {
    const response = await fetch("./base.json");
    const data = await response.json();
    products = data.products;

    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      cart = savedCart;
    }

    displayCategories();
    showProducts();
    updateCart();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Show products in a paginated manner
function showProducts() {
  elements.productCardDiv.innerHTML = "";
  const paginatedProducts = products.slice(0, 10); // Show the first 10 products for now

  paginatedProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
      <a href="https://www.neptun.mk/" class="card-link" target="_blank"></a>
      <img src="${product.image}" alt="${product.title}">
      <h3 class="product-title">${product.title}</h3>
      <div class="product-divider"></div>
      <p class="product-price">$${product.price}</p>
      <button onclick="addToCart(${product.id})" class="product-button">
        <i class="fas fa-cart-plus"></i> Add to Cart
      </button>
    `;
    elements.productCardDiv.appendChild(productCard);
  });

  paginationButtons();
}

// Add to cart functionality
function addToCart(productId) {
  const existingProductIndex = cart.findIndex((item) => item.id === productId);
  const product = products.find((p) => p.id === productId);

  if (existingProductIndex > -1) {
    cart[existingProductIndex].quantity++;
  } else if (product) {
    cart.push({ ...product, quantity: 1 });
  }

  // Save the updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Display the notification
  showAddToCartNotification(product.title);

  // Update the cart view
  updateCart();
}

// Function to show a notification when a product is added to the cart
function showAddToCartNotification(productName) {
  const notification = document.createElement("div");
  notification.className = "cart-notification";
  notification.innerHTML = `
    <span>✓ Added to cart: ${productName}</span>
  `;
  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Function to display categories and filter products by category
function displayCategories() {
  const categories = [];
  for (const product of products) {
    if (!categories.includes(product.category)) {
      categories.push(product.category);
    }
  }
  categories.forEach((category) => {
    const categoryBtn = document.createElement("button");
    categoryBtn.className = "categoryBtn";
    categoryBtn.textContent = category;
    categoryBtn.onclick = () => filterProducts(category);
    elements.categoryMenu.appendChild(categoryBtn);
  });
}

// Function to filter products by category
function filterProducts(category) {
  if (category === "all") {
    showProducts();
  } else {
    const filteredProducts = products.filter(
      (product) => product.category === category
    );
    showFilteredProducts(filteredProducts);
  }
}

// Show filtered products (based on category)
function showFilteredProducts(filteredProducts) {
  elements.productCardDiv.innerHTML = "";
  filteredProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
      <a href="https://www.neptun.mk/" class="card-link" target="_blank"></a>
      <img src="${product.image}" alt="${product.title}">
      <h3 class="product-title">${product.title}</h3>
      <div class="product-divider"></div>
      <p class="product-price">$${product.price}</p>
      <button onclick="addToCart(${product.id})" class="product-button">
        <i class="fas fa-cart-plus"></i> Add to Cart
      </button>
    `;
    elements.productCardDiv.appendChild(productCard);
  });
}

// Update the cart UI
function updateCart() {
  elements.cartItems.innerHTML = "";
  let totalPrice = 0;

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.padding = "8px";
    li.style.borderBottom = "1px solid #eee";

    li.innerHTML = `
      <span>${item.title} - $${item.price} x ${item.quantity}</span>
    `;

    const removeBtn = document.createElement("button");
    removeBtn.className = "removeBtn";
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => removeFromCart(item.id);
    li.appendChild(removeBtn);
    elements.cartItems.appendChild(li);

    totalPrice += item.price * item.quantity;
  });

  elements.totalPrice.innerText = `$${totalPrice.toFixed(2)}`;
}

// Remove item from cart
function removeFromCart(productId) {
  const itemIndex = cart.findIndex((item) => item.id === productId);

  if (itemIndex > -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity--;
    } else {
      cart.splice(itemIndex, 1);
    }
  }
  // Update the cart UI and save to localStorage
  updateCart();
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Clear cart
function clearCart() {
  cart = [];
  localStorage.removeItem("cart");
  updateCart();
}

// Make purchase and clear cart
function makePurchase() {
  const offcanvasElement = document.getElementById("offcanvasWithBothOptions");
  const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
  offcanvasInstance.hide();

  const blurOverlay = document.createElement("div");
  blurOverlay.className = "blur-overlay";
  document.body.appendChild(blurOverlay);

  const thankYouDiv = document.createElement("div");
  thankYouDiv.className = "thankYouDiv";
  thankYouDiv.innerHTML = `<img src="https://img.freepik.com/free-vector/thank-you-placard-concept-illustration_114360-13436.jpg">`;
  document.body.appendChild(thankYouDiv);

  const okBtn = document.createElement("button");
  okBtn.className = "okBtn";
  okBtn.textContent = "OK";
  okBtn.addEventListener("click", function () {
    thankYouDiv.remove();
    blurOverlay.remove();
  });
  thankYouDiv.appendChild(okBtn);

  blurOverlay.style.display = "block";
  thankYouDiv.style.display = "block";

  // Clear the cart and update localStorage
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

// Initialize the page on load
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
});
