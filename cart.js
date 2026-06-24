// 1. Lấy dữ liệu từ localStorage dùng chung cho toàn bộ website
let cart = JSON.parse(localStorage.getItem("maxxSportCart")) || [];

// 2. Hàm cập nhật con số trên Header (Hiển thị ở MỌI TRANG)
function updateHeaderCart() {
  const headerCartInfo = document.getElementById("header-cart-info");
  if (!headerCartInfo) return; // Nếu trang nào không có giỏ hàng thì bỏ qua tránh lỗi

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

// 3. Hàm Thêm vào giỏ (Dùng chung cho cả trang Sản phẩm, Trang chủ, Trang Sale)
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: name, price: price, quantity: 1 });
  }

  // Lưu vào kho chung
  localStorage.setItem("maxxSportCart", JSON.stringify(cart));

  // Cập nhật số liệu trên thanh Header ngay lập tức
  updateHeaderCart();

  // Hiển thị thông báo
  alert(`Đã thêm "${name}" vào giỏ hàng thành công!`);

  // (Dành riêng cho trang Sale) Nếu đang ở trang Sale, tự cuộn xuống bảng thanh toán
  const checkoutArea = document.getElementById("checkout-area");
  if (checkoutArea) {
    checkoutArea.scrollIntoView({ behavior: "smooth" });
    // Nếu trang Sale có hàm updateCartUI thì gọi để vẽ lại bảng
    if (typeof updateCartUI === "function") {
      updateCartUI();
    }
  }
}

// 4. Khởi tạo ngay khi trang vừa tải xong
document.addEventListener("DOMContentLoaded", function () {
  updateHeaderCart();
});
// 1. Đóng/mở bảng giỏ hàng
function toggleHeaderCart() {
  const dropdown = document.getElementById("header-cart-dropdown");
  dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
}

// 2. Render danh sách sản phẩm và nút xóa
function updateHeaderCart() {
  const headerCartInfo = document.getElementById("header-cart-info");
  const dropdownContent = document.getElementById("header-dropdown-content");

  // Cập nhật text hiển thị tổng quát
  let totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  let totalAmt = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  headerCartInfo.innerText = `${totalQty} Sản phẩm: ${totalAmt.toLocaleString()} đ`;

  // Render danh sách trong dropdown
  dropdownContent.innerHTML = cart
    .map(
      (item, index) => `
        <div class="cart-item">
            <span>${item.name} (x${item.quantity})</span>
            <span class="remove-btn" onclick="removeFromCart(${index})">❌</span>
        </div>
    `,
    )
    .join("");
}

// 3. Hàm xóa sản phẩm
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("maxxSportCart", JSON.stringify(cart));
  updateHeaderCart(); // Cập nhật lại giao diện ngay lập tức
}
