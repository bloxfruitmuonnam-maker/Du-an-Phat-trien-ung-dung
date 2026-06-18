/**
 * Shop SPSP - Bộ lọc danh mục tin tức mượt mà
 */
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const newsCards = document.querySelectorAll(".news-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 1. Cập nhật trạng thái active cho nút bấm
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // 2. Lấy bộ lọc được chọn
      const target = button.getAttribute("data-target");

      // 3. Ẩn/Hiện bài viết tương ứng bằng hiệu ứng Scale & Opacity
      newsCards.forEach((card) => {
        const category = card.getAttribute("data-category");

        if (target === "all" || category === target) {
          card.style.display = "block";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.95)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300); // Khớp thời gian với transition css
        }
      });
    });
  });
});
