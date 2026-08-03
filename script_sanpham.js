const sortPriceSelect = document.getElementById("sort-price");
const brandCheckboxes = document.querySelectorAll(".brand-filter");
const categoryCheckboxes = document.querySelectorAll(".category-filter");
const productsGrid = document.getElementById("products-grid");
const paginationContainer = document.getElementById("pagination");

const itemsPerPage = 8;
let currentPage = 1;
let allProducts = [];
let filteredProducts = [];

async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:3000/api/products");
    allProducts = await response.json();
    filterProducts();
  } catch (err) {
    console.error("Lỗi khi tải sản phẩm:", err);
    if (productsGrid) {
      productsGrid.innerHTML =
        "<p>Không thể tải danh sách sản phẩm từ máy chủ.</p>";
    }
  }
}

function filterProducts() {
  const selectedBrands = Array.from(brandCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value.toLowerCase());

  const selectedCategories = Array.from(categoryCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value.toLowerCase());

  filteredProducts = allProducts.filter((product) => {
    const itemBrand = (product.brand || "").toLowerCase();
    const itemCategory = (product.category || "").toLowerCase();

    const matchBrand =
      selectedBrands.length === 0 || selectedBrands.includes(itemBrand);
    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(itemCategory);

    return matchBrand && matchCategory;
  });

  if (sortPriceSelect) {
    const sortValue = sortPriceSelect.value;
    if (sortValue === "asc") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === "desc") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }
  }

  currentPage = 1;
  renderPagination();
}

function displayPage(page) {
  currentPage = page;
  if (!productsGrid) return;

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productsToDisplay = filteredProducts.slice(startIndex, endIndex);

  if (productsToDisplay.length === 0) {
    productsGrid.innerHTML = "<p>Không tìm thấy sản phẩm nào phù hợp.</p>";
    return;
  }

  productsGrid.innerHTML = productsToDisplay
    .map((product) => {
      const inStock = product.stock > 0;
      const statusClass = inStock
        ? "product-status"
        : "product-status out-of-stock";
      const statusText = inStock ? "Còn hàng" : "Hết hàng";
      const disabledAttr = inStock ? "" : "disabled";
      const buttonText = inStock ? "Thêm vào giỏ" : "Hết hàng";

      const oldPriceHtml =
        product.oldPrice && product.oldPrice > 0
          ? `<span class="old-price">${product.oldPrice.toLocaleString("vi-VN")}đ</span>`
          : "";

      return `
        <a href="${product.detailUrl || "#"}" class="product-item" data-brand="${(product.brand || "").toLowerCase()}" data-category="${product.category || ""}">
          <div class="product-img-wrapper">
            <img src="${product.image}" alt="${product.name}" />
            ${product.isNewArrival ? '<span class="badge-new">NEW ARRIVAL</span>' : ""}
          </div>
          <div class="product-info">
            <span class="brand-name">${product.brand}</span>
            <h3 class="product-name">${product.name}</h3>
            <div class="price-box">
              ${oldPriceHtml}
              <span class="new-price">${product.price.toLocaleString("vi-VN")}đ</span>
            </div>
            <div class="${statusClass}">${statusText}</div>
            <button 
              class="btn-buy-now" 
              ${disabledAttr} 
              onclick="event.preventDefault(); ${inStock ? `addToCart('${product.name}', ${product.price})` : ""}">
              ${buttonText}
            </button>
          </div>
        </a>
      `;
    })
    .join("");

  updatePaginationButtons();
  productsGrid.scrollIntoView({ behavior: "smooth", block: "start" });
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
  fetchProducts();

  const toggleBrandsBtn = document.getElementById("toggle-brands-btn");
  if (toggleBrandsBtn) {
    toggleBrandsBtn.addEventListener("click", function () {
      const filterGroup = this.closest(".filter-group");
      if (filterGroup) {
        filterGroup.classList.toggle("show-all");
        this.innerText = filterGroup.classList.contains("show-all")
          ? "Thu gọn ▴"
          : "Xem thêm ▾";
      }
    });
  }
});
