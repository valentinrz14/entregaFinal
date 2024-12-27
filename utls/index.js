export const toggleLoader = (isVisible) => {
  const loader = document.getElementById("loader");

  loader.style.display = isVisible ? "flex" : "none";
};

const defaultImage = "https://i.imgur.com/BenysVH.jpeg";

export const getProductImage = (product) => {
  return product.images?.[0]?.includes("[")
    ? defaultImage
    : product.images?.[0] || defaultImage;
};

export const getProductImageDetail = (image) => {
  return image.includes("[") ? defaultImage : image || defaultImage;
};
