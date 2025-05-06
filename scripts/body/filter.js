let products = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 10;
let cart = [];

const elements = {
  categoryMenu: document.getElementById(`categories`),
  productCardDiv: document.getElementById(`productCardsDiv`),
  prevPageBtn: document.getElementById(`prevPage`),
  nextPageBtn: document.getElementById(`nextPage`),
  cartItems: document.getElementById(`cartItems`),
  totalPrice: document.getElementById("totalPrice"),
};

async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.in/api/products");
    const data = await response.json();
    products = data.products;
    filteredProducts = products;
    displayCategories();
    showProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

function showProducts() {
    elements.productCardDiv.innerHTML = '';
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * productsPerPage, 
        currentPage * productsPerPage
    );
    
    paginatedProducts.forEach((product) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `

           <a href="https://www.neptun.mk/" class="card-link" target="_blank"></a>
            
            <!-- Regular card content -->
            <img src="${product.image}" alt="${product.title}">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-price">$${product.price}</p>
            
            <button onclick="addToCart(${product.id})" class="product-button">
                <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
        `;
        elements.productCardDiv.appendChild(productCard);
    });
    
    paginationButtons();
}
// Update the paginationButtons function to include current page display
function paginationButtons() {
    elements.prevPageBtn.style.display = currentPage === 1 ? "none" : "block";
    elements.nextPageBtn.style.display =
        productsPerPage * currentPage >= filteredProducts.length ? "none" : "block";
    
    // Remove any existing page indicator if it exists
    const existingIndicator = document.querySelector('.current-page');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Create and insert current page indicator
    const pageIndicator = document.createElement('span');
    pageIndicator.className = 'current-page';
    pageIndicator.textContent = `Page ${currentPage}`;
    elements.prevPageBtn.parentNode.insertBefore(pageIndicator, elements.nextPageBtn);
    
    elements.prevPageBtn.onclick = function () {
        if (currentPage > 1) {
            currentPage--;
            showProducts();
        }
    };
    
    elements.nextPageBtn.onclick = function () {
        if (currentPage < Math.ceil(filteredProducts.length / productsPerPage)) {
            currentPage++;
            showProducts();
        }
    };
}

function displayCategories() {
  const categories = [];
  for (const product of products) {
    if (!categories.includes(product.category)) {
      categories.push(product.category);
    }
  }
  categories.forEach((category) => {
    const categoryBtn = document.createElement(`button`);
    categoryBtn.className = `categoryBtn`;
    categoryBtn.textContent = category;
    categoryBtn.onclick = () => filterProducts(category);
    elements.categoryMenu.appendChild(categoryBtn);
  });
}

function filterProducts(category) {
  if (category === "all") {
    filteredProducts = products;
  } else {
    filteredProducts = products.filter(
      (product) => product.category === category
    );
  }
  currentPage = 1;
  showProducts();
}

function addToCart(productId) {
    const existingProductIndex = cart.findIndex((item) => item.id === productId);
    const product = products.find((p) => p.id === productId);
    
    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity++;
    } else if (product) {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    
    // Simple alert notification
    const alert = document.createElement('div');
    alert.className = 'simple-alert';
    alert.textContent = `Added ${product.title} to cart`;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.classList.add('show');
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 300);
        }, 2000);
    }, 10);
}

function showAddToCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <span>✓ Added to cart: ${productName}</span>
    `;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function updateCart() {
    elements.cartItems.innerHTML = ``;
    let totalPrice = 0;
  
    cart.forEach((item) => {
      const li = document.createElement(`li`);
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';
      li.style.padding = '8px';
      li.style.borderBottom = '1px solid #eee';
      
      li.innerHTML = `
        <span>${item.title} - $${item.price} x ${item.quantity}</span>
      `;
  
      const removeBtn = document.createElement("button");
      removeBtn.className = `removeBtn`;
      removeBtn.textContent = "Remove";
      removeBtn.onclick = () => removeFromCart(item.id);
      li.appendChild(removeBtn);
      elements.cartItems.appendChild(li);
  
      totalPrice += item.price * item.quantity;
    });
  
    elements.totalPrice.innerText = `$${totalPrice.toFixed(2)}`;
  }

function removeFromCart(productId) {
  const itemIndex = cart.findIndex((item) => item.id === productId);

  if (itemIndex > -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity--;
    } else {
      cart.splice(itemIndex, 1);
    }
  }
  updateCart();
}

function makePurchase() {
  const offcanvasElement = document.getElementById("offcanvasWithBothOptions");
  const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
  offcanvasInstance.hide();

  const blurOverlay = document.createElement(`div`);
  blurOverlay.className = `blur-overlay`;
  document.body.appendChild(blurOverlay);

  const thankYouDiv = document.createElement(`div`);
  thankYouDiv.className = `thankYouDiv`;
  thankYouDiv.innerHTML = `<img src="https://img.freepik.com/free-vector/thank-you-placard-concept-illustration_114360-13436.jpg">`;
  document.body.appendChild(thankYouDiv);

  const okBtn = document.createElement(`button`);
  okBtn.className = `okBtn`;
  okBtn.textContent = `MNOGU SI DOSADEN CAO`;
  okBtn.addEventListener(`click`, function () {
    thankYouDiv.remove();
    blurOverlay.remove();
  });
  thankYouDiv.appendChild(okBtn);

  blurOverlay.style.display = "block";
  thankYouDiv.style.display = "block";

  cart = [];
  updateCart();
}

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
});