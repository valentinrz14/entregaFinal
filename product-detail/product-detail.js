import { Header } from "../components/header/header.js";
import { Footer } from "../components/footer/footer.js";
import { toggleLoader, getProductImageDetail } from "../utls/index.js";

async function initializeProductDetail() {
  try {
    new Header();
    new Footer(document.body);
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!loader || !productId) {
      alert(
        "Error el producto que esta tratando de buscar no se encuentra. Por favor, intente más tarde"
      );
      return;
    }

    const renderProductDetail = (product) => {
      const carouselImages = document.getElementById("carousel-images");
      carouselImages.innerHTML = "";

      product.images.forEach((image, index) => {
        const div = document.createElement("div");
        div.className = `carousel-item ${index === 0 ? "active" : ""}`;
        div.innerHTML = `<img src="${getProductImageDetail(
          image
        )}" class="d-block w-100" alt="${product.title}" />`;
        carouselImages.appendChild(div);
      });

      document.getElementById("detail-title").textContent = product.title;
      document.getElementById("detail-description").textContent =
        product.description;
      document.getElementById("detail-price").textContent = `$${product.price}`;
    };

    const fetchProduct = async () => {
      toggleLoader(true);
      try {
        const response = await fetch(
          `https://api.escuelajs.co/api/v1/products/${productId}`
        );
        const product = await response.json();
        renderProductDetail(product);
      } catch (error) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "col-12 text-center";
        errorDiv.innerHTML = `<p class="text-danger">Error al cargar los productos. Por favor, intente más tarde.</p>`;
        document.querySelector("main").appendChild(errorDiv);
      } finally {
        toggleLoader(false);
      }
    };

    await fetchProduct();
  } catch (error) {
    console.error("Error al inicializar la aplicación:", error);
  }
}

document.addEventListener("DOMContentLoaded", initializeProductDetail);
