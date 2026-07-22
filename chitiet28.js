function changeImage(element) {
  const newSrc = element.src;
  document.getElementById("current-image").src = newSrc;

  const thumbs = document.querySelectorAll(".thumb");
  thumbs.forEach((thumb) => thumb.classList.remove("active"));
  element.classList.add("active");
}

function increaseQty() {
  const qtyInput = document.getElementById("qty");
  let currentValue = parseInt(qtyInput.value);
  qtyInput.value = currentValue + 1;
}

function decreaseQty() {
  const qtyInput = document.getElementById("qty");
  let currentValue = parseInt(qtyInput.value);
  if (currentValue > 1) {
    qtyInput.value = currentValue - 1;
  }
}

function openTab(evt, tabName) {
  const tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach((content) => content.classList.remove("active"));

  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach((btn) => btn.classList.remove("active"));

  document.getElementById(tabName).classList.add("active");
  evt.currentTarget.classList.add("active");
}

document.addEventListener("DOMContentLoaded", function () {
  const btnAddCart = document.querySelector(".btn-add-cart");
  const btnBuyNow = document.querySelector(".btn-buy-now");

  let selectedColor = "";

  const colorButtons = document.querySelectorAll(".color-btn");
  const colorNameDisplay = document.getElementById("selected-color-name");

  colorButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      colorButtons.forEach((b) => b.classList.remove("selected"));

      this.classList.add("selected");

      selectedColor = this.getAttribute("data-color");
      colorNameDisplay.textContent = selectedColor;
      colorNameDisplay.style.color = "#333";
    });
  });

  function getProductDetails() {
    const qtyInput = document.getElementById("qty");
    return {
      name: "Balo Proton",
      price: 2950000,
      quantity: parseInt(qtyInput.value) || 1,
      color: selectedColor,
    };
  }

  if (btnAddCart) {
    btnAddCart.addEventListener("click", function () {
      const product = getProductDetails();

      if (!product.color) {
        alert("Vui lòng chọn màu sắc trước khi thêm vào giỏ hàng!");
        return;
      }

      if (typeof addToCart === "function") {
        const finalProductName = `${product.name} - Màu ${product.color}`;
        addToCart(finalProductName, product.price, product.quantity);
        alert(`Đã thêm ${finalProductName} vào giỏ hàng!`);
      } else {
        console.error("Lỗi: Chưa nhúng file cart.js trước file chitiet1.js!");
      }
    });
  }

  if (btnBuyNow) {
    btnBuyNow.addEventListener("click", function () {
      const product = getProductDetails();

      if (!product.color) {
        alert("Vui lòng chọn màu sắc trước khi mua hàng!");
        return;
      }

      if (typeof addToCart === "function") {
        const finalProductName = `${product.name} - Màu ${product.color}`;
        addToCart(finalProductName, product.price, product.quantity);
        window.location.href = "./checkout.html";
      }
    });
  }
});
