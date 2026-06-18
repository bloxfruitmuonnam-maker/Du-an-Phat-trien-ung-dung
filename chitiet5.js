// Tính năng 1: Chuyển đổi ảnh khi click vào Thumbnail
function changeImage(element) {
  // Lấy link ảnh từ thumbnail được click
  const newSrc = element.src;
  // Gán link đó cho ảnh chính
  document.getElementById("current-image").src = newSrc;

  // Cập nhật viền cho thumbnail đang được chọn (active)
  const thumbs = document.querySelectorAll(".thumb");
  thumbs.forEach((thumb) => thumb.classList.remove("active"));
  element.classList.add("active");
}

// Tính năng 2: Tăng giảm số lượng sản phẩm
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

// Tính năng 3: Chuyển đổi các Tabs (Mô tả / Đánh giá)
function openTab(evt, tabName) {
  // Ẩn tất cả nội dung của tab
  const tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach((content) => content.classList.remove("active"));

  // Xóa class active của tất cả các nút tab
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach((btn) => btn.classList.remove("active"));

  // Hiển thị tab được chọn và thêm class active cho nút vừa click
  document.getElementById(tabName).classList.add("active");
  evt.currentTarget.classList.add("active");
}

// ==========================================
// 1. XỬ LÝ CLICK CHỌN SIZE GIÀY
// ==========================================
const sizeButtons = document.querySelectorAll(".size-btn");
const selectedSizeInput = document.getElementById("selected-size");

sizeButtons.forEach((button) => {
  button.addEventListener("click", function () {
    // Bước A: Gỡ bỏ màu đen (class active) ở nút đang chọn cũ
    sizeButtons.forEach((btn) => btn.classList.remove("active"));

    // Bước B: Thêm màu đen (class active) vào nút vừa được click
    this.classList.add("active");

    // Bước C: Cập nhật giá trị size vào thẻ ẩn input để sau này gửi lên server/giỏ hàng
    selectedSizeInput.value = this.textContent;

    // Kiểm tra thử trên tab Console của trình duyệt
    console.log("Kích thước giày đã chọn: Size " + this.textContent);
  });
});

// ==========================================
// 2. XỬ LÝ TĂNG GIẢM SỐ LƯỢNG (- 1 +)
// ==========================================
const btnMinus = document.querySelector(".btn-minus");
const btnPlus = document.querySelector(".btn-plus");
const quantityInput = document.querySelector(".quantity-input");

btnMinus.addEventListener("click", () => {
  let currentQty = parseInt(quantityInput.value);
  if (currentQty > 1) {
    quantityInput.value = currentQty - 1;
  }
});

btnPlus.addEventListener("click", () => {
  let currentQty = parseInt(quantityInput.value);
  quantityInput.value = currentQty + 1;
});

// ==========================================
// 3. XỬ LÝ CLICK ĐỔI ẢNH CHÍNH (THUMBNAIL)
// ==========================================
function changeImage(element) {
  // Thay đổi thuộc tính src của ảnh lớn bằng src của ảnh nhỏ vừa click
  document.getElementById("current-image").src = element.src;

  // Xóa viền đen active ở tất cả các ảnh thumbnail nhỏ
  const thumbs = document.querySelectorAll(".thumb");
  thumbs.forEach((thumb) => thumb.classList.remove("active"));

  // Thêm viền đen active vào ảnh thumbnail vừa click
  element.classList.add("active");
}
