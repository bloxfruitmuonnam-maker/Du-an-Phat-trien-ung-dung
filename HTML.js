// =========================================================
// 1. XỬ LÝ SLIDER BANNER TỰ ĐỘNG VÀ THỦ CÔNG
// =========================================================
let slideIndex = 1;
let slideTimer;

// Chạy hàm hiển thị slide đầu tiên khi tải trang
showSlides(slideIndex);
// Bắt đầu chu trình tự động chuyển ảnh
autoSlides();

// Hàm điều khiển thủ công khi click vào chấm tròn
function currentSlide(n) {
  clearTimeout(slideTimer);
  showSlides((slideIndex = n));
  autoSlides();
}

// Hàm xử lý hiển thị ẩn/hiện logic
function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("slide");
  let dots = document.getElementsByClassName("dot");

  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

// Hàm tự động chuyển slide sau mỗi 3 giây
function autoSlides() {
  slideTimer = setTimeout(function () {
    slideIndex++;
    showSlides(slideIndex);
    autoSlides();
  }, 3000);
}

// =========================================================
// 2. XỬ LÝ CUỘN (SCROLL) DANH SÁCH SẢN PHẨM & THANH TIẾN TRÌNH
// =========================================================
document.addEventListener("DOMContentLoaded", function () {
  const productGrid = document.querySelector(".section-product-grid");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const progressBar = document.querySelector(".progress-bar-line");

  // Dừng lại nếu trang không có khối sản phẩm cuộn (tránh lỗi log)
  if (!productGrid) return;

  const scrollAmount = 300;

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      productGrid.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      productGrid.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
  }

  productGrid.addEventListener("scroll", () => {
    const maxScrollLeft = productGrid.scrollWidth - productGrid.clientWidth;
    const scrollPercentage = (productGrid.scrollLeft / maxScrollLeft) * 100;

    if (progressBar) {
      progressBar.style.width = scrollPercentage + "%";
    }

    if (prevBtn) {
      if (productGrid.scrollLeft === 0) {
        prevBtn.classList.remove("active");
      } else {
        prevBtn.classList.add("active");
      }
    }

    if (nextBtn) {
      if (productGrid.scrollLeft >= maxScrollLeft - 1) {
        nextBtn.classList.remove("active");
      } else {
        nextBtn.classList.add("active");
      }
    }
  });
});
