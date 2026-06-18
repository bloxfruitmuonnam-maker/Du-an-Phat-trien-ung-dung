// =========================================================
// 1. XỬ LÝ LOGIC BỘ LỌC SẢN PHẨM (CODE CŨ CỦA BẠN)
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
// 2. XỬ LÝ ĐỒNG BỘ GIỎ HÀNG VÀ DROPDOWN HEADER (MỚI)
// =========================================================

// Khởi tạo giỏ hàng từ localStorage
let cart = JSON.parse(localStorage.getItem("maxxSportCart")) || [];

// Hàm cập nhật chữ hiển thị tổng số lượng & tổng tiền trên Header
function updateHeaderCart() {
  const headerCartInfo = document.getElementById("header-cart-info");
  if (!headerCartInfo) return;

  if (cart.length === 0) {
    headerCartInfo.innerText = "0 Sản phẩm: 0 đ";
    return;
  }

  let totalQuantity = 0;
  let totalAmount = 0;

  cart.forEach((item) => {
    totalQuantity += item.quantity;
    totalAmount += item.price * item.quantity;
  });

  headerCartInfo.innerText = `${totalQuantity} Sản phẩm: ${totalAmount.toLocaleString("vi-VN")} đ`;
}

// Hàm thêm sản phẩm từ trang Sản Phẩm vào giỏ
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: name, price: price, quantity: 1 });
  }

  // Lưu dữ liệu vào localStorage để các trang khác cùng đọc
  localStorage.setItem("maxxSportCart", JSON.stringify(cart));

  updateHeaderCart();

  // Nếu bảng chi tiết đang mở thì vẽ lại luôn dữ liệu mới
  const dropdown = document.getElementById("cart-dropdown");
  if (dropdown && dropdown.style.display === "block") {
    renderCartDropdown();
  }

  alert(`Đã thêm "${name}" vào giỏ hàng thành công!`);
}

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

// Hàm render (vẽ) danh sách sản phẩm trong bảng nhỏ và tạo nút Xóa
function renderCartDropdown() {
  const container = document.getElementById("cart-dropdown-items");
  if (!container) return;

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

// Hàm xử lý khi khách click vào nút ❌ trên Header để loại bỏ sản phẩm
function removeFromHeaderCart(index) {
  cart.splice(index, 1); // Xóa khỏi mảng dữ liệu

  localStorage.setItem("maxxSportCart", JSON.stringify(cart)); // Ghi đè lại localStorage sạch

  updateHeaderCart(); // Cập nhật lại số tiền trên Header chính
  renderCartDropdown(); // Cập nhật lại danh sách sản phẩm đang hiển thị trong bảng nhỏ
}

// Tự động chạy hàm cập nhật số liệu hiển thị Header ngay khi tải trang sản phẩm
updateHeaderCart();
