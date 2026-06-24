// =========================================================
// XỬ LÝ HIỂN THỊ BẢNG THANH TOÁN (Dành riêng cho trang Sale)
// =========================================================

// Định dạng số tiền VND
function formatMoney(amount) {
  return amount.toLocaleString("vi-VN") + " đ";
}

// Hàm xóa bớt sản phẩm khỏi giỏ trong bảng thanh toán
function removeFromCart(index) {
  // Biến cart được lấy từ file cart.js chung
  cart.splice(index, 1);
  localStorage.setItem("maxxSportCart", JSON.stringify(cart));

  // Gọi hàm updateHeaderCart từ file cart.js để cập nhật trên Header
  if (typeof updateHeaderCart === "function") {
    updateHeaderCart();
  }

  // Vẽ lại bảng thanh toán
  updateCartUI();
}

// Hàm cập nhật toàn bộ giao diện bảng giỏ hàng ở dưới form
function updateCartUI() {
  const cartContent = document.getElementById("cart-content");
  const cartTotal = document.getElementById("cart-total");
  const formCartDetails = document.getElementById("form-cart-details");
  const formCartTotal = document.getElementById("form-cart-total");

  if (!cartContent) return; // Nếu không tìm thấy vùng vẽ thì bỏ qua

  if (cart.length === 0) {
    cartContent.innerHTML =
      '<p class="empty-cart-msg">Chưa có sản phẩm nào được chọn.</p>';
    if (cartTotal) cartTotal.innerText = "Tổng cộng: 0 đ";
    if (formCartDetails) formCartDetails.value = "";
    if (formCartTotal) formCartTotal.value = "";
    return;
  }

  let html = "";
  let total = 0;
  let textDetails = "";

  cart.forEach((item, index) => {
    let itemTotal = item.price * item.quantity;
    total += itemTotal;
    textDetails += `${item.name} (SL: ${item.quantity}) - Giá: ${formatMoney(itemTotal)} | `;

    html += `
          <div class="cart-item">
            <div>
              <strong>${item.name}</strong> <br>
              <small>${formatMoney(item.price)} x ${item.quantity}</small>
            </div>
            <div>
              <span>${formatMoney(itemTotal)}</span>
              <span class="cart-item-remove" onclick="removeFromCart(${index})">❌ Xóa</span>
            </div>
          </div>
        `;
  });

  cartContent.innerHTML = html;
  if (cartTotal) cartTotal.innerText = "Tổng cộng: " + formatMoney(total);
  if (formCartDetails) formCartDetails.value = textDetails;
  if (formCartTotal) formCartTotal.value = formatMoney(total);
}

// Chặn gửi form nếu giỏ hàng rỗng
const purchaseForm = document.getElementById("purchase-form");
if (purchaseForm) {
  purchaseForm.addEventListener("submit", function (e) {
    if (cart.length === 0) {
      e.preventDefault();
      alert(
        "Vui lòng thêm ít nhất một sản phẩm vào giỏ hàng trước khi đặt mua!",
      );
    }
  });
}

// Khởi tạo bảng giỏ hàng khi mở trang
document.addEventListener("DOMContentLoaded", function () {
  updateCartUI();
});
