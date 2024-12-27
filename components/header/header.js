export class Header {
  constructor() {
    this.cartItems = this.getCartItems();
    this.initializeHeader();
  }

  areElementsInitialized() {
    return (
      this.cartIcon &&
      this.cartCount &&
      this.cartModal &&
      this.closeCart &&
      this.cartBackdrop &&
      this.cartItemsList
    );
  }

  async initializeHeader() {
    try {
      const response = await fetch("/components/header/header.html");
      const headerHtml = await response.text();

      document.body.insertAdjacentHTML("afterbegin", headerHtml);

      await new Promise((resolve) => setTimeout(resolve, 0));

      this.initializeElements();

      if (this.areElementsInitialized()) {
        this.initializeEventListeners();
        this.updateCart();
      } else {
        console.error(
          "No se pudieron inicializar todos los elementos del header"
        );
      }
    } catch (error) {
      console.error("Error al inicializar el header:", error);
    }
  }

  initializeElements() {
    this.cartIcon = document.getElementById("cart-icon");
    this.cartCount = document.getElementById("cart-count");
    this.cartModal = document.getElementById("cart-modal");
    this.closeCart = document.getElementById("close-cart");
    this.cartBackdrop = document.getElementById("cart-backdrop");
    this.cartItemsList = document.getElementById("cart-items-list");
  }

  async initializeEventListeners() {
    this.cartIcon.addEventListener("click", () => this.openCartModal());
    this.closeCart.addEventListener("click", () => this.closeCartModal());
    this.cartBackdrop.addEventListener("click", () => this.closeCartModal());
    this.cartItemsList.addEventListener("click", (e) =>
      this.handleCartActions(e)
    );

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.cartModal.classList.contains("open")) {
        this.closeCartModal()
      }
    });
  }

  openCartModal() {
    this.cartModal.classList.add("open");
    this.cartBackdrop.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  closeCartModal() {
    this.cartModal.classList.remove("open");
    this.cartBackdrop.classList.remove("show");
    document.body.style.overflow = "";
  }

  getCartItems() {
    return JSON.parse(localStorage.getItem("cartItems")) || [];
  }

  saveCart() {
    localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
    sessionStorage.setItem("cartLastUpdated", new Date().toISOString());
  }

  calculateTotal() {
    return this.cartItems.reduce(
      (total, item) =>
        total + parseFloat(item.price.replace("$", "")) * item.quantity,
      0
    );
  }

  getProductImage(product) {
    const defaultImage = "https://i.imgur.com/BenysVH.jpeg";
    return product.images?.[0]?.includes("[")
      ? defaultImage
      : product.images?.[0] || defaultImage;
  }

  updateCart() {
    const totalItems = this.cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    this.cartCount.textContent = totalItems;

    if (this.cartItems.length === 0) {
      this.cartItemsList.innerHTML = `<div class="text-center text-muted py-3">El carrito está vacío</div>`;
      return;
    }

    this.cartItemsList.innerHTML =
      this.cartItems
        .map(
          (item, index) => `
        <div class="cart-item d-flex align-items-center p-2 border-bottom">
          <img loading="lazy" src="${this.getProductImage(item)}" alt="${
            item.title
          }" 
               style="width: 50px; height: 50px; object-fit: cover;" class="me-2 rounded" />
          <div class="flex-grow-1">
            <p class="mb-0 fw-medium">${item.title}</p>
            <small class="text-muted">${item.price}</small>
            <div class="quantity-controls mt-1">
              <button class="btn btn-sm btn-outline-secondary quantity-btn" data-action="decrease" data-index="${index}">-</button>
              <span class="mx-2">${item.quantity}</span>
              <button class="btn btn-sm btn-outline-secondary quantity-btn" data-action="increase" data-index="${index}">+</button>
            </div>
          </div>
        </div>
      `
        )
        .join("") +
      `<div class="cart-total p-3 border-top">
        <h6 class="d-flex justify-content-between">
          Total: <span>$${this.calculateTotal().toFixed(2)}</span>
        </h6>
       </div>`;
  }

  handleCartActions(event) {
    const button = event.target.closest(".quantity-btn");
    const removeButton = event.target.closest(".remove-item");

    if (button) {
      const index = parseInt(button.dataset.index);
      const action = button.dataset.action;
      const currentQuantity = this.cartItems[index].quantity;

      if (action === "increase") {
        this.updateItemQuantity(index, currentQuantity + 1);
      } else if (action === "decrease") {
        this.updateItemQuantity(index, currentQuantity - 1);
      }
    } else if (removeButton) {
      const index = parseInt(removeButton.dataset.index);
      this.cartItems.splice(index, 1);
      this.saveCart();
      this.updateCart();
    }
  }

  updateItemQuantity(index, newQuantity) {
    if (newQuantity < 1) {
      this.cartItems.splice(index, 1);
    } else {
      this.cartItems[index].quantity = newQuantity;
    }
    this.saveCart();
    this.updateCart();
  }

 
  addToCart(product) {
    const existingItemIndex = this.cartItems.findIndex(
      (item) => item.productId === product.id
    );

    if (existingItemIndex >= 0) {
      this.cartItems[existingItemIndex].quantity += 1;
    } else {
      this.cartItems.push({
        productId: product.id,
        title: product.title,
        price: `$${product.price}`,
        images: product.images,
        quantity: 1,
      });
    }

    this.saveCart();
    this.updateCart();

    this.cartCount.classList.remove("bounce");
    void this.cartCount.offsetWidth;
    this.cartCount.classList.add("bounce");
  }
}
