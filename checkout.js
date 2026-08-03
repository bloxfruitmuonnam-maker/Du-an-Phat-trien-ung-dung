document.addEventListener("DOMContentLoaded", function () {
  const btnContinue = document.getElementById("btn-continue-shopping");
  if (btnContinue) {
    btnContinue.addEventListener("click", function () {
      window.location.href = "./sale.html";
    });
  }

  const purchaseForm = document.getElementById("purchase-form");
  if (purchaseForm) {
    purchaseForm.addEventListener("submit", function (e) {
      console.log("Đang gửi thông tin đơn hàng...");
    });
  }
});
