import { Header } from "./components/header/header.js";
import { Footer } from "./components/footer/footer.js";
import { toggleLoader, getProductImage } from "./utls/index.js";

async function initializeApp() {
  try {
    const header = new Header();
    const footerContainer = document.body;

    const loader = document.getElementById("loader");
    const productList = document.getElementById("product-list");

    if (!loader || !productList) {
      console.error("Elementos necesarios no encontrados");
      return;
    }

    const fetchProducts = async () => {
      toggleLoader(true);
      try {
        const response = await fetch(
          "https://api.escuelajs.co/api/v1/products"
        );
        const products = await response.json();
        renderProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
        productList.innerHTML = `<div class="col-12 text-center">
        <p class="text-danger">Error al cargar los productos. Por favor, intente más tarde.</p>
      </div>`;
      } finally {
        toggleLoader(false);
      }
    };

    const renderProducts = (products) => {
      productList.innerHTML = "";

      products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("col-lg-4", "col-md-6", "col-sm-12", "mb-3");
        productCard.innerHTML = `
      <div class="product-card clickable" data-product-id="${product.id}">
        <div class="card-img-container">
          <img loading="lazy" src="${getProductImage(product)}" alt="${
          product.title
        }">
        </div>
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">${product.description.substring(0, 100)}...</p>
          <div class="card-price">$${product.price}</div>
          <button class="btn btn-primary btn-add-to-cart" data-product-id="${
            product.id
          }">Añadir al carrito</button>
        </div>
    </div>
      `;

        const addToCartBtn = productCard.querySelector(".btn-add-to-cart");
        if (addToCartBtn) {
          addToCartBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            header.addToCart(product);
          });
        }

        const cardElement = productCard.querySelector(".product-card");
        if (cardElement) {
          cardElement.addEventListener("click", () => {
            window.location.href = `./product-detail/product.html?id=${product.id}`;
          });
        }

        productList.appendChild(productCard);
      });
    };

    await fetchProducts();
    new Footer(footerContainer);
  } catch (error) {
    console.error("Error al inicializar la aplicación:", error);
  }
}

document.addEventListener("DOMContentLoaded", initializeApp);
