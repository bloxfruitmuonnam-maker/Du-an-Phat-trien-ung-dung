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

  function getProductDetails() {
    const qtyInput = document.getElementById("qty");
    return {
      name: "Pereus Liên Hoa",
      price: 2550000,
      quantity: parseInt(qtyInput.value) || 1,
    };
  }

  if (btnAddCart) {
    btnAddCart.addEventListener("click", function () {
      const product = getProductDetails();
      if (typeof addToCart === "function") {
        addToCart(product.name, product.price, product.quantity);
      } else {
        console.error("Lỗi: Chưa nhúng file cart.js trước file chitiet21.js!");
      }
    });
  }

  if (btnBuyNow) {
    btnBuyNow.addEventListener("click", function () {
      const product = getProductDetails();
      if (typeof addToCart === "function") {
        addToCart(product.name, product.price, product.quantity);

        window.location.href = "./checkout.html";
      }
    });
  }
});
