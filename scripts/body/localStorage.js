document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cartItems");
  const totalPriceElement = document.getElementById("totalPrice");
  const checkoutBtn = document.getElementById("checkoutBtn");

  // Get cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  console.log("Cart fetched from localStorage:", cart);  // Debugging log

  // Function to update the cart display
  function updateCart() {
    console.log("Updating cart...");  // Debugging log
    cartItemsContainer.innerHTML = '';  // Clear existing cart items
    let totalPrice = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
      cart.forEach(item => {
        const cartItemDiv = document.createElement("div");
        cartItemDiv.className = "cart-item";
        cartItemDiv.innerHTML = `
          <div class="d-flex justify-content-between">
            <div>
              <img src="${item.image}" alt="${item.title}" class="cart-item-image">
              <span>${item.title} - $${item.price} x ${item.quantity}</span>
            </div>
            <button class="btn btn-danger btn-sm remove-btn" data-id="${item.id}">Remove</button>
          </div>
        `;
        cartItemsContainer.appendChild(cartItemDiv);

        totalPrice += item.price * item.quantity;
      });

      totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
    }
  }

  // Function to remove an item from the cart
  function removeFromCart(productId) {
    console.log(`Removing product with ID: ${productId}`);  // Debugging log
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));  // Save updated cart to localStorage
    updateCart();
  }

  // Event listener for removing items from the cart
  cartItemsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-btn")) {
      const productId = event.target.getAttribute("data-id");
      removeFromCart(productId);
    }
  });

  // Function to handle checkout
  checkoutBtn.addEventListener("click", () => {
    if (cart.length > 0) {
      alert("Proceeding to checkout...");
      // You can add a checkout functionality here (e.g., redirect to payment page)
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));  // Clear cart from localStorage
      updateCart();
    } else {
      alert("Your cart is empty.");
    }
  });

  // Update cart on page load
  updateCart();
});
