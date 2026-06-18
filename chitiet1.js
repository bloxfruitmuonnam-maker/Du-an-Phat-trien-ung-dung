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
