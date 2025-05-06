let allProducts = [];

async function fetchProducts() {
    try {
        const response = await fetch("https://fakestoreapi.in/api/products");
        const data = await response.json();
        allProducts = data.products;
        console.log(allProducts);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

function displayFilteredProducts(query) {
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
                console.log(`Selected product: ${product.title}`);
                // Optionally, you could hide the dropdown after a product is selected
                dropdown.style.display = "none";
            });
        });
        dropdown.style.display = "block";
    } else {
        dropdown.style.display = "none";
    }
}

document.getElementById("searchInput").addEventListener("input", (event) => {
    const query = event.target.value.trim();
    if (query) {
        displayFilteredProducts(query);
    } else {
        document.getElementById("searchDropdown").style.display = "none";
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

fetchProducts();
