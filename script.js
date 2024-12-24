document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");
  const cartIcon = document.getElementById("cart-icon");
  const cartCount = document.getElementById("cart-count");
  const cartModal = document.getElementById("cart-modal");
  const closeCart = document.getElementById("close-cart");
  const cartBackdrop = document.getElementById("cart-backdrop");
  const cartItemsList = document.getElementById("cart-items-list");

  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const saveCart = () => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    sessionStorage.setItem("cartLastUpdated", new Date().toISOString());
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) =>
        total + parseFloat(item.price.replace("$", "")) * item.quantity,
      0
    );
  };

  fetch("https://api.escuelajs.co/api/v1/products")
    .then((response) => response.json())
    .then((products) => {
      products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("col-lg-4", "col-md-6", "col-sm-12");
        productCard.innerHTML = `
          <div class="product-card">
            <div class="card-img-container">
              <img src="${
                product.images?.[0].includes("[")
                  ? "https://i.imgur.com/BenysVH.jpeg"
                  : product.images?.[0]
              }" alt="${product.title}">
            </div>
            <div class="card-body">
              <h5 class="card-title">${product.title}</h5>
              <p class="card-text">${product.description.substring(
                0,
                100
              )}...</p>
              <div class="card-price">$${product.price}</div>
              <button class="btn btn-primary btn-add-to-cart" 
                      data-product-id="${product.id}">Añadir al carrito</button>
            </div>
          </div>
        `;
        productList.appendChild(productCard);
      });
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      productList.innerHTML = `
        <div class="col-12 text-center">
          <p class="text-danger">Error al cargar los productos. Por favor, intente más tarde.</p>
        </div>
      `;
    });

  const updateItemQuantity = (index, newQuantity) => {
    if (newQuantity < 1) {
      cartItems.splice(index, 1);
    } else {
      cartItems[index].quantity = newQuantity;
    }
    saveCart();
    updateCart();
  };

  document.body.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-add-to-cart")) {
      const productCard = event.target.closest(".product-card");
      const productId = event.target.dataset.productId;
      const title = productCard.querySelector(".card-title").textContent;
      const price = productCard.querySelector(".card-price").textContent;
      const image = productCard.querySelector(".card-img-container img").src;

      const existingItemIndex = cartItems.findIndex(
        (item) => item.productId === productId
      );

      if (existingItemIndex >= 0) {
        cartItems[existingItemIndex].quantity += 1;
      } else {
        cartItems.push({
          productId,
          title,
          price,
          image,
          quantity: 1,
        });
      }

      saveCart();
      updateCart();

      cartCount.classList.remove("bounce");
      void cartCount.offsetWidth; 
      cartCount.classList.add("bounce");
    }
  });

  const updateCart = () => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cartItems.length === 0) {
      cartItemsList.innerHTML = `
        <div class="text-center text-muted py-3">
          El carrito está vacío
        </div>
      `;
      return;
    }

    cartItemsList.innerHTML = `
      ${cartItems
        .map(
          (item, index) => `
        <div class="cart-item d-flex align-items-center p-2 border-bottom">
          <img src="${
            item.image.includes("[")
              ? "https://i.imgur.com/BenysVH.jpeg"
              : item.image
          }" alt="${item.title}" 
               style="width: 50px; height: 50px; object-fit: cover;" 
               class="me-2 rounded" />
          <div class="flex-grow-1">
            <p class="mb-0 fw-medium">${item.title}</p>
            <small class="text-muted">${item.price}</small>
            <div class="quantity-controls mt-1">
              <button class="btn btn-sm btn-outline-secondary quantity-btn" 
                      data-action="decrease" data-index="${index}">-</button>
              <span class="mx-2">${item.quantity}</span>
              <button class="btn btn-sm btn-outline-secondary quantity-btn" 
                      data-action="increase" data-index="${index}">+</button>
            </div>
          </div>
          <button class="btn btn-outline-danger btn-sm remove-item" 
                  data-index="${index}" aria-label="Eliminar item">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      `
        )
        .join("")}
      <div class="cart-total p-3 border-top">
        <h6 class="d-flex justify-content-between">
          Total: <span>$${calculateTotal().toFixed(2)}</span>
        </h6>
      </div>
    `;
  };

  cartItemsList.addEventListener("click", (event) => {
    const button = event.target.closest(".quantity-btn");
    const removeButton = event.target.closest(".remove-item");

    if (button) {
      const index = parseInt(button.dataset.index);
      const action = button.dataset.action;
      const currentQuantity = cartItems[index].quantity;

      if (action === "increase") {
        updateItemQuantity(index, currentQuantity + 1);
      } else if (action === "decrease") {
        updateItemQuantity(index, currentQuantity - 1);
      }
    } else if (removeButton) {
      const index = parseInt(removeButton.dataset.index);
      cartItems.splice(index, 1);
      saveCart();
      updateCart();
    }
  });

  cartIcon.addEventListener("click", () => {
    cartModal.classList.add("open");
    cartBackdrop.classList.add("show");
    document.body.style.overflow = "hidden";
  });

  const closeCartModal = () => {
    cartModal.classList.remove("open");
    cartBackdrop.classList.remove("show");
    document.body.style.overflow = "";
  };

  closeCart.addEventListener("click", closeCartModal);
  cartBackdrop.addEventListener("click", closeCartModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && cartModal.classList.contains("open")) {
      closeCartModal();
    }
  });
  updateCart();
});
