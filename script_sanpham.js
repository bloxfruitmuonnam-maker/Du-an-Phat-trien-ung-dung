// =========================================================
// XỬ LÝ LOGIC BỘ LỌC SẢN PHẨM
// =========================================================
const brandCheckboxes = document.querySelectorAll(".brand-filter");
const categoryCheckboxes = document.querySelectorAll(".category-filter");
const productItems = document.querySelectorAll(".product-item");

function filterProducts() {
  const selectedBrands = Array.from(brandCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value.toLowerCase());

  const selectedCategories = Array.from(categoryCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value.toLowerCase());

  productItems.forEach((item) => {
    const itemBrand = item.getAttribute("data-brand").toLowerCase();
    const itemCategory = item.getAttribute("data-category").toLowerCase();

    const matchBrand =
      selectedBrands.length === 0 || selectedBrands.includes(itemBrand);
    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(itemCategory);

    if (matchBrand && matchCategory) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

brandCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", filterProducts);
});

categoryCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", filterProducts);
});

const toggleBtn = document.getElementById("toggle-brands-btn");
if (toggleBtn) {
  const filterGroup = toggleBtn.parentElement;
  toggleBtn.addEventListener("click", function () {
    filterGroup.classList.toggle("show-all");
    if (filterGroup.classList.contains("show-all")) {
      toggleBtn.innerText = "Thu gọn 🔼";
    } else {
      toggleBtn.innerText = "Xem thêm 🔽";
    }
  });
}

// =========================================================
// XỬ LÝ DROPDOWN GIỎ HÀNG (Dành riêng cho trang Sản phẩm/Trang chủ)
// =========================================================

// Hàm Ẩn / Hiện bảng giỏ hàng nhỏ khi bấm vào ô giỏ hàng ở Header
function toggleCartDropdown() {
  const dropdown = document.getElementById("cart-dropdown");
  if (!dropdown) return;

  if (dropdown.style.display === "none") {
    dropdown.style.display = "block";
    renderCartDropdown(); // Đổ dữ liệu vào bảng khi mở ra
  } else {
    dropdown.style.display = "none";
  }
}

// Hàm render (vẽ) danh sách sản phẩm trong bảng nhỏ
function renderCartDropdown() {
  const container = document.getElementById("cart-dropdown-items");
  if (!container) return;

  // Gọi mảng cart từ file cart.js dùng chung
  if (cart.length === 0) {
    container.innerHTML =
      '<p style="font-size:13px; color:#888; text-align:center; padding:15px 0;">Giỏ hàng của bạn đang trống.</p>';
    return;
  }

  let html = "";
  cart.forEach((item, index) => {
    html += `
            <div class="cart-dropdown-item">
                <div>
                    <strong>${item.name}</strong>
                    <small style="color:#666;">${item.price.toLocaleString("vi-VN")} đ x ${item.quantity}</small>
                </div>
                <span class="cart-dropdown-remove" onclick="removeFromHeaderCart(${index})">❌</span>
            </div>
        `;
  });
  container.innerHTML = html;
}

// Hàm xử lý khi khách click vào nút ❌ trên Header
function removeFromHeaderCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("maxxSportCart", JSON.stringify(cart));

  // Gọi hàm updateHeaderCart từ file cart.js
  if (typeof updateHeaderCart === "function") {
    updateHeaderCart();
  }
  renderCartDropdown();
}
