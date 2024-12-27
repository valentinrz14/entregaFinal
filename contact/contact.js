import { Header } from "../components/header/header.js";
import { Footer } from "../components/footer/footer.js";

document.addEventListener("DOMContentLoaded", () => {
  new Header();
  new Footer(document.body);

  const reviewsContainer = document.getElementById("reviews-container");
  const contactForm = document.getElementById("contact-form");
  const successModal = new bootstrap.Modal(
    document.getElementById("successModal")
  );

  const defaultReviews = [
    {
      name: "Carlos A",
      text: "Este es un excelente producto!",
      date: new Date().toLocaleDateString(),
    },
    {
      name: "Jesús B",
      text: "Muy buena calidad y servicio.",
      date: new Date().toLocaleDateString(),
    },
  ];

  let reviews = JSON.parse(localStorage.getItem("reviews")) || defaultReviews;

  const renderReviews = () => {
    reviewsContainer.innerHTML = reviews.length
      ? reviews
          .map(
            (review) => `
            <div class="card mb-3 shadow-sm">
              <div class="card-body">
                <h5 class="card-title">${review.name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${review.date}</h6>
                <p class="card-text">"${review.text}"</p>
              </div>
            </div>
          `
          )
          .join("")
      : '<p class="text-center text-muted">Aún no hay reseñas.</p>';
  };

  renderReviews();

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const reviewText = document.getElementById("review").value;

    const newReview = {
      name,
      text: reviewText,
      date: new Date().toLocaleDateString(),
    };
    reviews.push(newReview);
    localStorage.setItem("reviews", JSON.stringify(reviews));
    renderReviews();

    try {
      const response = await fetch("https://formspree.io/f/xkgnznla", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Nombre: name,
          Email: email,
          Review: reviewText,
        }),
      });

      if (response.ok) {
        successModal.show();
        contactForm.reset();
      } else {
        throw new Error("Error al enviar el correo");
      }
    } catch (error) {
      console.error("Hubo un problema al enviar el correo: ", error);
    }
  });
});
