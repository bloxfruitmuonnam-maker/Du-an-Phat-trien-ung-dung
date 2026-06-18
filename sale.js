// Lấy dữ liệu từ kho lưu trữ localStorage khi vừa mở trang, nếu chưa có thì gán mảng rỗng
let cart = JSON.parse(localStorage.getItem("maxxSportCart")) || [];

// Hàm thêm sản phẩm vào giỏ
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: name, price: price, quantity: 1 });
  }
  localStorage.setItem("maxxSportCart", JSON.stringify(cart));

  updateCartUI();
  document
    .getElementById("checkout-area")
    .scrollIntoView({ behavior: "smooth" });

  // Tự động cuộn mượt xuống khu vực đặt hàng
  document
    .getElementById("checkout-area")
    .scrollIntoView({ behavior: "smooth" });
}

// Hàm xóa bớt sản phẩm khỏi giỏ
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("maxxSportCart", JSON.stringify(cart));
  updateCartUI();
}

// Định dạng số tiền VND
function formatMoney(amount) {
  return amount.toLocaleString("vi-VN") + " đ";
}

// Hàm cập nhật toàn bộ giao diện giỏ hàng
function updateCartUI() {
  const cartContent = document.getElementById("cart-content");
  const cartTotal = document.getElementById("cart-total");
  const formCartDetails = document.getElementById("form-cart-details");
  const formCartTotal = document.getElementById("form-cart-total");
  const headerCartInfo = document.getElementById("header-cart-info"); // Lấy thẻ trên Header

  if (cart.length === 0) {
    cartContent.innerHTML =
      '<p class="empty-cart-msg">Chưa có sản phẩm nào được chọn.</p>';
    cartTotal.innerText = "Tổng cộng: 0 đ";
    formCartDetails.value = "";
    formCartTotal.value = "";
    headerCartInfo.innerText = "0 Sản phẩm: 0 đ"; // Đồng bộ Header
    return;
  }

  let html = "";
  let total = 0;
  let totalQuantity = 0;
  let textDetails = "";

  cart.forEach((item, index) => {
    let itemTotal = item.price * item.quantity;
    total += itemTotal;
    totalQuantity += item.quantity;
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
  cartTotal.innerText = "Tổng cộng: " + formatMoney(total);
  formCartDetails.value = textDetails;
  formCartTotal.value = formatMoney(total);

  // Đồng bộ số lượng và tiền lên thanh Header
  headerCartInfo.innerText = `${totalQuantity} Sản phẩm: ${formatMoney(total)}`;
}

// Chặn gửi form nếu giỏ hàng rỗng
document
  .getElementById("purchase-form")
  .addEventListener("submit", function (e) {
    if (cart.length === 0) {
      e.preventDefault();
      alert(
        "Vui lòng thêm ít nhất một sản phẩm vào giỏ hàng trước khi đặt mua!",
      );
    }
  });

// KHỞI TẠO GIỎ HÀNG KHI MỞ TRANG
updateCartUI();
