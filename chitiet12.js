function changeImage(element) {
  document.getElementById("current-image").src = element.src;

  const thumbs = document.querySelectorAll(".thumb");
  thumbs.forEach((thumb) => thumb.classList.remove("active"));
  element.classList.add("active");
}

function increaseQty() {
  const qtyInput =
    document.getElementById("qty") || document.querySelector(".quantity-input");
  if (qtyInput) {
    let currentValue = parseInt(qtyInput.value) || 1;
    qtyInput.value = currentValue + 1;
  }
}

function decreaseQty() {
  const qtyInput =
    document.getElementById("qty") || document.querySelector(".quantity-input");
  if (qtyInput) {
    let currentValue = parseInt(qtyInput.value) || 1;
    if (currentValue > 1) {
      qtyInput.value = currentValue - 1;
    }
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
  const sizeButtons = document.querySelectorAll(".size-btn");
  const selectedSizeInput = document.getElementById("selected-size");

  sizeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      sizeButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      if (selectedSizeInput) {
        selectedSizeInput.value = this.textContent;
      }
    });
  });

  const btnMinus = document.querySelector(".btn-minus");
  const btnPlus = document.querySelector(".btn-plus");
  if (btnMinus) btnMinus.addEventListener("click", decreaseQty);
  if (btnPlus) btnPlus.addEventListener("click", increaseQty);

  const btnAddCart = document.querySelector(".btn-add-cart");
  const btnBuyNow = document.querySelector(".btn-buy-now");

  function getShoeDetails() {
    const titleEl = document.querySelector(".product-title");
    const baseName = titleEl ? titleEl.innerText.trim() : "Sản phẩm thể thao";

    const priceEl = document.querySelector(".product-price");
    let price = 0;
    if (priceEl) {
      const priceText = priceEl.innerText.replace(/[^0-9]/g, "");
      price = parseInt(priceText) || 0;
    }

    const qtyInput =
      document.getElementById("qty") ||
      document.querySelector(".quantity-input");
    const quantity = qtyInput ? parseInt(qtyInput.value) : 1;

    const size = selectedSizeInput ? selectedSizeInput.value : "";

    return { baseName, price, quantity, size };
  }

  function handleAddToCart(isBuyNow = false) {
    const product = getShoeDetails();

    if (!product.size) {
      alert("Vui lòng chọn size giày trước khi tiến hành!");
      return;
    }

    const finalProductName = `${product.baseName} - Size ${product.size}`;

    if (typeof addToCart === "function") {
      addToCart(finalProductName, product.price, product.quantity);

      if (isBuyNow) {
        window.location.href = "./checkout.html";
      }
    } else {
      console.error(
        "Lỗi: Chưa tìm thấy hàm addToCart. Hãy đảm bảo bạn đã nhúng cart.js trước chitiet5.js trong file HTML.",
      );
    }
  }

  if (btnAddCart) {
    btnAddCart.addEventListener("click", () => handleAddToCart(false));
  }

  if (btnBuyNow) {
    btnBuyNow.addEventListener("click", () => handleAddToCart(true));
  }
});
