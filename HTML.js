let slideIndex = 1;
let slideTimer;

// Chạy hàm hiển thị slide đầu tiên khi tải trang
showSlides(slideIndex);
// Bắt đầu chu trình tự động chuyển ảnh
autoSlides();

// Hàm điều khiển thủ công khi click vào chấm tròn
function currentSlide(n) {
  // Xóa thời gian chờ tự động cũ để tránh bị xung đột thời gian với cú click tay
  clearTimeout(slideTimer);
  showSlides((slideIndex = n));
  // Sau khi click xong, khởi động lại bộ đếm tự động
  autoSlides();
}

// Hàm xử lý hiển thị ẩn/hiện logic
function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("slide");
  let dots = document.getElementsByClassName("dot");

  // Nếu vượt quá số lượng slide thì quay lại slide đầu
  if (n > slides.length) {
    slideIndex = 1;
  }
  // Nếu nhỏ hơn 1 thì nhảy tới slide cuối cùng
  if (n < 1) {
    slideIndex = slides.length;
  }

  // Ẩn toàn bộ tất cả các slide
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  // Gỡ bỏ trạng thái sáng "active" của tất cả các chấm tròn
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  // Hiển thị slide hiện tại và làm sáng chấm tương ứng
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

// Hàm tự động chuyển slide sau mỗi 4 giây
function autoSlides() {
  slideTimer = setTimeout(function () {
    slideIndex++;
    showSlides(slideIndex);
    autoSlides(); // Lặp lại quy trình
  }, 3000); // 4000ms = 4 giây (Bạn có thể đổi thành 3000 hoặc 5000 tùy ý)
}

document.addEventListener("DOMContentLoaded", function () {
  // 1. Lấy các phần tử HTML cần thiết
  const productGrid = document.querySelector(".section-product-grid");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const progressBar = document.querySelector(".progress-bar-line");

  // Số pixel sẽ cuộn đi mỗi lần bấm nút (bạn có thể tăng giảm tùy ý)
  const scrollAmount = 300;

  // 2. Xử lý sự kiện khi bấm nút Next (›)
  nextBtn.addEventListener("click", () => {
    productGrid.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });

  // 3. Xử lý sự kiện khi bấm nút Prev (‹)
  prevBtn.addEventListener("click", () => {
    productGrid.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  // 4. Xử lý thanh tiến trình (Progress Bar) chạy theo khi cuộn chuột hoặc bấm nút
  productGrid.addEventListener("scroll", () => {
    // Tính toán khoảng cách có thể cuộn tối đa
    const maxScrollLeft = productGrid.scrollWidth - productGrid.clientWidth;

    // Tính toán phần trăm đã cuộn
    const scrollPercentage = (productGrid.scrollLeft / maxScrollLeft) * 100;

    // Cập nhật độ dài của thanh màu đỏ
    progressBar.style.width = scrollPercentage + "%";

    // (Tùy chọn) Đổi màu nút bấm để biết đang ở đầu hay cuối danh sách
    if (productGrid.scrollLeft === 0) {
      prevBtn.classList.remove("active");
    } else {
      prevBtn.classList.add("active");
    }

    if (productGrid.scrollLeft >= maxScrollLeft - 1) {
      nextBtn.classList.remove("active");
    } else {
      nextBtn.classList.add("active");
    }
  });
});
// 1. Tự động lấy mảng giỏ hàng từ localStorage khi vừa mở trang (nếu chưa có thì mặc định mảng rỗng [])
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 2. Hàm hỗ trợ định dạng số tiền VND (Ví dụ: 500000 -> 500.000 đ)
function formatMoney(amount) {
  return amount.toLocaleString("vi-VN") + " đ";
}

// 3. Hàm chính: Vẽ giao diện giỏ hàng thu nhỏ ở Header dựa trên mảng dữ liệu
function updateHeaderCartUI() {
  const cartCountEl = document.getElementById("header-cart-count");
  const cartTotalEl = document.getElementById("header-cart-total");
  const dropdownContentEl = document.getElementById("header-dropdown-content");

  if (!cartCountEl || !cartTotalEl || !dropdownContentEl) return;

  // Nếu giỏ hàng rỗng
  if (cart.length === 0) {
    cartCountEl.innerText = "0";
    cartTotalEl.innerText = "0 đ";
    dropdownContentEl.innerHTML =
      '<p class="empty-cart-msg">Chưa có sản phẩm nào.</p>';
    return;
  }

  let totalItems = 0;
  let totalPrice = 0;
  let html = "";

  // Duyệt qua từng sản phẩm để tính tổng tiền và tạo code HTML hiển thị
  cart.forEach((item, index) => {
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;

    html += `
      <div class="cart-dropdown-item">
        <div>
          <strong>${item.name}</strong> <br>
          <small>${formatMoney(item.price)} x ${item.quantity}</small>
        </div>
        <div>
          <span>${formatMoney(item.price * item.quantity)}</span>
          <span class="cart-dropdown-item-remove" onclick="removeProductFromHeader(${index})">❌</span>
        </div>
      </div>
    `;
  });

  // Đổ dữ liệu đã xử lý ra màn hình hiển thị
  cartCountEl.innerText = totalItems;
  cartTotalEl.innerText = formatMoney(totalPrice);
  dropdownContentEl.innerHTML = html;
}

// 4. Hàm xử lý Bật/Tắt (Đóng/Mở) bảng thả xuống khi nhấn vào Giỏ hàng
function toggleHeaderCart() {
  const dropdown = document.getElementById("header-cart-dropdown");
  if (dropdown) {
    dropdown.classList.toggle("show");
  }
}

// 5. Hàm xử lý Xóa sản phẩm trực tiếp ngay trong bảng Dropdown ở Header
function removeProductFromHeader(index) {
  cart.splice(index, 1); // Xóa phần tử khỏi mảng
  localStorage.setItem("cart", JSON.stringify(cart)); // Cập nhật lại bộ nhớ trình duyệt ngay lập tức
  updateHeaderCartUI(); // Vẽ lại giao diện sau khi xóa
}

// 6. Tiện ích: Tự động ẩn bảng giỏ hàng thả xuống nếu người dùng click chuột ra ngoài vùng giỏ hàng
window.addEventListener("click", function (e) {
  const wrapper = document.querySelector(".header-cart-wrapper");
  const dropdown = document.getElementById("header-cart-dropdown");
  if (wrapper && dropdown && !wrapper.contains(e.target)) {
    dropdown.classList.remove("show");
  }
});

// 7. Lắng nghe sự kiện trang web tải xong (DOM Ready) để chạy hàm khởi tạo giao diện
document.addEventListener("DOMContentLoaded", updateHeaderCartUI);
