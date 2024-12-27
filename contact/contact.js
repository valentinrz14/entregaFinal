import { Header } from "../components/header/header.js";
import { Footer } from "../components/footer/footer.js";

async function initializeContact() {
  new Header();
  new Footer(document.body);

  const defaultReviews = [
    {
      name: "Carlos A",
      text: "Este es un excelente producto!",
      data: new Date().toLocaleDateString(),
    },
    {
      name: "Jesús B",
      text: "Muy buena calidad y servicio.",
      data: new Date().toLocaleDateString(),
    },
  ];

  const reviewsContainer = document.getElementById("reviews-container");
  const contactForm = document.getElementById("contact-form");

  let reviews = JSON.parse(localStorage.getItem("reviews")) || defaultReviews;

  const updateResenas = (reviewsData) => {
    reviewsContainer.innerHTML = "";

    if (reviewsData.length === 0) {
      reviewsContainer.className = "text-center";
      reviewsContainer.textContent = "Aún no hay reseñas.";
    } else {
      reviewsData.forEach((review) => {
        const reviewCard = document.createElement("div");
        reviewCard.classList.add("review-card");

        const reviewAuthor = document.createElement("p");
        reviewAuthor.classList.add("review-author");
        reviewAuthor.textContent = `${review.name} (`;

        const reviewDate = document.createElement("span");
        reviewDate.classList.add("review-date");
        reviewDate.textContent = `${review.date})`;

        reviewAuthor.appendChild(reviewDate);
        reviewCard.appendChild(reviewAuthor);

        const reviewText = document.createElement("p");
        reviewText.classList.add("review-text");
        reviewText.textContent = `"${review.text}"`;

        reviewCard.appendChild(reviewText);
        reviewsContainer.appendChild(reviewCard);
      });
    }
  };

  updateResenas(reviews);

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const reviewText = document.getElementById("review").value;

    const newReview = {
      name,
      text: reviewText,
      date: new Date().toLocaleDateString(),
    };

    reviews.push(newReview);
    localStorage.setItem("reviews", JSON.stringify(reviews));
    updateResenas(reviews);

    contactForm.reset();
  });
}

document.addEventListener("DOMContentLoaded", initializeContact);
