let cart = JSON.parse(localStorage.getItem("maxxSportCart")) || [];

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function updateHeaderCart() {
  const headerCartInfo = document.getElementById("header-cart-info");
  if (!headerCartInfo) return;

  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmt = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  headerCartInfo.innerText = `${totalQty} Sản phẩm: ${totalAmt.toLocaleString("vi-VN")} đ`;

  const dropdownContent = document.getElementById("header-dropdown-content");
  if (dropdownContent) {
    if (cart.length === 0) {
      dropdownContent.innerHTML =
        '<p style="padding: 10px; color: #888; text-align:center;">Giỏ hàng trống</p>';
      return;
    }
    dropdownContent.innerHTML = cart
      .map(
        (item, index) => `
        <div class="cart-item" style="display: flex; justify-content: space-between; padding: 5px 10px; border-bottom: 1px solid #eee;">
            <span>${escapeHTML(item.name)} (x${item.quantity})</span>
            <span class="remove-btn" onclick="removeFromCart(${index})" style="cursor: pointer;">❌</span>
        </div>
      `,
      )
      .join("");
  }
}

function addToCart(name, price, qty = 1) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += qty;
  } else {
    cart.push({ name: name, price: price, quantity: qty });
  }

  localStorage.setItem("maxxSportCart", JSON.stringify(cart));
  updateHeaderCart();
  alert(`Đã thêm ${qty} x "${name}" vào giỏ hàng thành công!`);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("maxxSportCart", JSON.stringify(cart));
  updateHeaderCart();
  renderCheckoutPage();
}

function changeQuantity(index, delta) {
  const newQuantity = cart[index].quantity + delta;

  if (newQuantity <= 0) {
    const confirmDelete = confirm(
      `Bạn có muốn xóa sản phẩm "${cart[index].name}" khỏi giỏ hàng không?`,
    );
    if (confirmDelete) {
      removeFromCart(index);
    }
    return;
  }

  cart[index].quantity = newQuantity;
  localStorage.setItem("maxxSportCart", JSON.stringify(cart));
  updateHeaderCart();
  renderCheckoutPage();
}

function renderCheckoutPage() {
  const cartContent = document.getElementById("cart-content");
  const cartTotal = document.getElementById("cart-total");
  const formCartDetails = document.getElementById("form-cart-details");
  const formCartTotal = document.getElementById("form-cart-total");

  if (!cartContent) return;

  if (cart.length === 0) {
    cartContent.innerHTML =
      '<p class="empty-cart-msg" style="color:#888; padding:20px 0; text-align:center;">Giỏ hàng trống. Vui lòng quay lại chọn sản phẩm.</p>';
    if (cartTotal) cartTotal.innerText = "Tổng cộng: 0 đ";
    if (formCartDetails) formCartDetails.value = "";
    if (formCartTotal) formCartTotal.value = "0 đ";
    return;
  }

  let html =
    '<div class="checkout-list" style="max-height: 400px; overflow-y: auto;">';
  let total = 0;
  let textForFormspree = "";

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    textForFormspree += `- ${item.name} (Số lượng: ${item.quantity}) - Đơn giá: ${item.price.toLocaleString("vi-VN")}đ\n`;

    html += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
            <div style="flex: 1; padding-right: 10px;">
                <div style="font-weight: bold; color: #333; margin-bottom: 5px;">${escapeHTML(item.name)}</div>
                <div style="display: inline-flex; align-items: center; border: 1px solid #ccc; border-radius: 4px; overflow: hidden; background: #fff;">
                    <button type="button" onclick="changeQuantity(${index}, -1)" style="padding: 3px 10px; background: #f5f5f5; border: none; cursor: pointer; font-weight: bold; font-size: 14px;">-</button>
                    <span style="padding: 3px 12px; min-width: 25px; text-align: center; font-size: 14px; font-weight: bold; background: #fff;">${item.quantity}</span>
                    <button type="button" onclick="changeQuantity(${index}, 1)" style="padding: 3px 10px; background: #f5f5f5; border: none; cursor: pointer; font-weight: bold; font-size: 14px;">+</button>
                </div>
            </div>
            <div style="display: flex; align-items: center;">
                <span style="color: #e4393c; font-weight: bold; margin-right: 15px;">${itemTotal.toLocaleString("vi-VN")} đ</span>
                <button type="button" onclick="removeFromCart(${index})" style="background: none; border: none; color: #ff4d4d; cursor: pointer; font-size: 13px; font-weight: bold;">[Xóa]</button>
            </div>
        </div>
    `;
  });
  html += "</div>";

  cartContent.innerHTML = html;
  if (cartTotal)
    cartTotal.innerText = `Tổng cộng: ${total.toLocaleString("vi-VN")} đ`;
  if (formCartDetails) formCartDetails.value = textForFormspree;
  if (formCartTotal) formCartTotal.value = `${total.toLocaleString("vi-VN")} đ`;
}

function toggleHeaderCart() {
  const dropdown = document.getElementById("header-cart-dropdown");
  if (dropdown) {
    dropdown.style.display =
      dropdown.style.display === "none" ? "block" : "none";
  }
}

function renderSuccessMessage(orderId) {
  const cartContent = document.getElementById("cart-content");
  const cartTotal = document.getElementById("cart-total");
  const formCartDetails = document.getElementById("form-cart-details");
  const formCartTotal = document.getElementById("form-cart-total");

  if (cartTotal) cartTotal.style.display = "none";
  if (formCartDetails) formCartDetails.value = "";
  if (formCartTotal) formCartTotal.value = "";

  if (cartContent) {
    cartContent.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; background: #f9f9f9; border-radius: 8px; border: 1px solid #e0e0e0; margin: 20px 0;">
        <div style="font-size: 50px; color: #4CAF50; margin-bottom: 10px;">✔</div>
        <h2 style="color: #333; margin-bottom: 10px;">Đặt hàng thành công!</h2>
        <p style="color: #666; font-size: 15px; margin-bottom: 5px;">Cảm ơn bạn đã mua hàng tại MaxxSport.</p>
        ${orderId ? `<p style="color: #888; font-size: 13px; margin-bottom: 20px;">Mã đơn hàng: <strong>${orderId}</strong></p>` : ""}
        <a href="index.html" style="display: inline-block; padding: 10px 20px; background: #e4393c; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">Quay lại trang chính</a>
      </div>
    `;
  }
}

async function processCheckout(event) {
  if (event) event.preventDefault();

  if (cart.length === 0) {
    alert("Giỏ hàng của bạn đang trống!");
    return;
  }

  const customerNameInput = document.getElementById("customer-name");
  const customerName = customerNameInput
    ? customerNameInput.value
    : "Khách hàng";

  const cartItems = cart.map((item) => ({
    name: item.name,
    quantity: item.quantity,
  }));

  try {
    const response = await fetch("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartItems, customerName }),
    });

    const result = await response.json();

    if (response.ok) {
      cart = [];
      localStorage.removeItem("maxxSportCart");
      updateHeaderCart();
      renderSuccessMessage(result.order ? result.order._id : null);
    } else {
      alert("Lỗi: " + result.message);
    }
  } catch (error) {
    alert("Không thể kết nối đến máy chủ thanh toán!");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  updateHeaderCart();
  renderCheckoutPage();

  const form = document.querySelector("form");
  if (form && form.querySelector("#form-cart-details")) {
    form.addEventListener("submit", processCheckout);
  }
});
