const sortPriceSelect = document.getElementById("sort-price");
const brandCheckboxes = document.querySelectorAll(".brand-filter");
const categoryCheckboxes = document.querySelectorAll(".category-filter");
const productItems = document.querySelectorAll(".product-item");
const paginationContainer = document.getElementById("pagination");

const itemsPerPage = 8;
let currentPage = 1;
let filteredProducts = [];

function getProductPrice(item) {
  const priceElement =
    item.querySelector(".new-price") || item.querySelector(".product-price");
  if (!priceElement) return 0;

  const priceText = priceElement.innerText;
  return parseInt(priceText.replace(/[^\d]/g, ""));
}

function filterProducts() {
  const selectedBrands = Array.from(brandCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value.toLowerCase());

  const selectedCategories = Array.from(categoryCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value.toLowerCase());

  filteredProducts = [];

  productItems.forEach((item) => {
    const itemBrand = item.getAttribute("data-brand")
      ? item.getAttribute("data-brand").toLowerCase()
      : "";
    const itemCategory = item.getAttribute("data-category")
      ? item.getAttribute("data-category").toLowerCase()
      : "";

    const matchBrand =
      selectedBrands.length === 0 || selectedBrands.includes(itemBrand);
    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(itemCategory);

    item.style.display = "none";

    if (matchBrand && matchCategory) {
      filteredProducts.push(item);
    }
  });

  if (sortPriceSelect) {
    const sortValue = sortPriceSelect.value;
    if (sortValue === "asc") {
      filteredProducts.sort((a, b) => getProductPrice(a) - getProductPrice(b));
    } else if (sortValue === "desc") {
      filteredProducts.sort((a, b) => getProductPrice(b) - getProductPrice(a));
    }
  }

  filteredProducts.forEach((item, index) => {
    item.style.order = index;
  });

  currentPage = 1;
  renderPagination();
}

function displayPage(page) {
  currentPage = page;

  productItems.forEach((item) => (item.style.display = "none"));

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productsToDisplay = filteredProducts.slice(startIndex, endIndex);

  productsToDisplay.forEach((item) => {
    item.style.display = "flex";
  });

  updatePaginationButtons();

  const productSection = document.querySelector(".products-grid");
  if (productSection) {
    productSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function renderPagination() {
  if (!paginationContainer) return;
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (totalPages <= 1) {
    displayPage(1);
    return;
  }

  const prevBtn = document.createElement("button");
  prevBtn.className = "page-btn prev-btn";
  prevBtn.innerHTML = "❮";
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) displayPage(currentPage - 1);
  });
  paginationContainer.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.className = `page-btn num-btn page-${i}`;
    pageBtn.innerText = i;
    pageBtn.addEventListener("click", () => displayPage(i));
    paginationContainer.appendChild(pageBtn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.className = "page-btn next-btn";
  nextBtn.innerHTML = "❯";
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) displayPage(currentPage + 1);
  });
  paginationContainer.appendChild(nextBtn);

  displayPage(currentPage);
}

function updatePaginationButtons() {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const numButtons = paginationContainer.querySelectorAll(".num-btn");
  numButtons.forEach((btn) => {
    const pageNum = parseInt(btn.innerText);
    if (pageNum === currentPage) btn.classList.add("active");
    else btn.classList.remove("active");
  });

  const prevBtn = paginationContainer.querySelector(".prev-btn");
  const nextBtn = paginationContainer.querySelector(".next-btn");

  if (prevBtn) {
    if (currentPage === 1) prevBtn.classList.add("disabled");
    else prevBtn.classList.remove("disabled");
  }

  if (nextBtn) {
    if (currentPage === totalPages || totalPages === 0)
      nextBtn.classList.add("disabled");
    else nextBtn.classList.remove("disabled");
  }
}

brandCheckboxes.forEach((checkbox) =>
  checkbox.addEventListener("change", filterProducts),
);
categoryCheckboxes.forEach((checkbox) =>
  checkbox.addEventListener("change", filterProducts),
);

if (sortPriceSelect) {
  sortPriceSelect.addEventListener("change", filterProducts);
}

document.addEventListener("DOMContentLoaded", () => {
  filterProducts();
});

document.addEventListener("DOMContentLoaded", () => {
  const toggleBrandsBtn = document.getElementById("toggle-brands-btn");

  if (toggleBrandsBtn) {
    toggleBrandsBtn.addEventListener("click", function () {
      const filterGroup = this.closest(".filter-group");

      if (filterGroup) {
        filterGroup.classList.toggle("show-all");
        if (filterGroup.classList.contains("show-all")) {
          this.innerText = "Thu gọn ▴";
        } else {
          this.innerText = "Xem thêm ▾";
        }
      }
    });
  }
});
