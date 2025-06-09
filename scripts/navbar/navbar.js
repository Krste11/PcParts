let allProducts = [];

async function fetchProducts() {
    try {
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();
        allProducts = data.products;
        console.log(allProducts);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

function displaySearchDropdown(query) {
    const filtered = allProducts.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase())
    );

    const dropdown = document.getElementById("searchDropdown");
    dropdown.innerHTML = "";

    if (filtered.length > 0) {
        filtered.forEach(product => {
            const shortTitle = product.title.length > 30 ? product.title.substring(0, 30) + "..." : product.title;

            const item = document.createElement("div");
            item.classList.add("dropdown-item");
            item.innerHTML = `
                <img src="${product.image}" alt="${shortTitle}">
                <p>${shortTitle}</p>
            `;
            dropdown.appendChild(item);

            item.addEventListener("click", () => {
                window.location.href = "https://www.anhoch.com";
                console.log(`Selected product: ${product.title}`);
                dropdown.style.display = "none"; // Optionally hide the dropdown after selecting a product
            });
        });
        dropdown.style.display = "block";
    } else {
        dropdown.style.display = "none";
    }
}

function displayFilteredProducts(query) {
    const filtered = allProducts.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase())
    );

    const productCardDiv = document.getElementById("productCardsDiv");
    productCardDiv.innerHTML = "";  // Clear previous products

    if (filtered.length > 0) {
        filtered.forEach(product => {
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
            productCardDiv.appendChild(productCard);
        });
    } else {
        productCardDiv.innerHTML = "<p>No products found matching your search.</p>";
    }
}

document.getElementById("searchInput").addEventListener("input", (event) => {
    const query = event.target.value.trim();
    if (query) {
        displaySearchDropdown(query);  // Show the dropdown with suggestions
    } else {
        document.getElementById("searchDropdown").style.display = "none"; // Hide the dropdown if input is empty
    }
});

// Add this new functionality to the search button
document.querySelector('.search-bar button').addEventListener("click", () => {
    const searchInput = document.getElementById("searchInput");
    const query = searchInput.value.trim();
    if (query) {
        displayFilteredProducts(query);  // Filter and show products as cards
    }
});

// Add functionality to search when "Enter" is pressed
document.getElementById("searchInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const query = event.target.value.trim();
        if (query) {
            displayFilteredProducts(query);  // Filter and show products as cards
        }
    }
});

// Close the dropdown when clicking outside
document.addEventListener("click", (event) => {
    const dropdown = document.getElementById("searchDropdown");
    const searchInput = document.getElementById("searchInput");

    // Check if the click is outside the search input or the dropdown
    if (!searchInput.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = "none";
    }
});

// Fetch the products when the page loads
fetchProducts();
