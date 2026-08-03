document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchCategory = document.getElementById("searchCategory");
  const searchBtn = document.getElementById("searchBtn");

  const productCards = document.querySelectorAll(".product-item");

  function filterProducts() {
    const keyword = searchInput.value.trim().toLowerCase();

    const category = searchCategory.value;

    productCards.forEach((card) => {
      const productName =
        card.querySelector(".product-name")?.textContent.toLowerCase() || "";

      const productCategory = card.getAttribute("data-category") || "all";

      const matchesKeyword = productName.includes(keyword);
      const matchesCategory =
        category === "all" || productCategory === category;

      if (matchesKeyword && matchesCategory) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  }

  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    filterProducts();
  });

  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      filterProducts();
    }
  });

  searchCategory.addEventListener("change", filterProducts);
});
