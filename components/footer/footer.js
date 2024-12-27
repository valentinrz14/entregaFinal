export class Footer {
  constructor(parentElement) {
    this.parentElement = parentElement;
    this.render();
  }

  render() {
    const footer = document.createElement("footer");
    footer.classList.add("text-center", "py-3", "bg-dark", "text-light");
    footer.innerHTML = `<p>&copy; 2024 Mi E-commerce. Todos los derechos reservados.</p>`;
    this.parentElement.appendChild(footer);
  }
}


