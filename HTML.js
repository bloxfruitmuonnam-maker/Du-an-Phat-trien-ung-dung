let slideIndex = 1;
let slideTimer;

showSlides(slideIndex);
autoSlides();

function currentSlide(n) {
  clearTimeout(slideTimer);
  showSlides((slideIndex = n));
  autoSlides();
}

function showSlides(n) {
  const slides = document.getElementsByClassName("slide");
  const dots = document.getElementsByClassName("dot");

  if (!slides.length) return;

  if (n > slides.length) slideIndex = 1;
  if (n < 1) slideIndex = slides.length;

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  if (slides[slideIndex - 1]) {
    slides[slideIndex - 1].style.display = "block";
  }
  if (dots[slideIndex - 1]) {
    dots[slideIndex - 1].className += " active";
  }
}

function autoSlides() {
  slideTimer = setTimeout(function () {
    slideIndex++;
    showSlides(slideIndex);
    autoSlides();
  }, 3000);
}

function renderProducts(products) {
  const container = document.getElementById("product-list");
  if (!container) return;

  container.innerHTML = "";

  if (!products || products.length === 0) {
    container.innerHTML = "<p>Không tìm thấy sản phẩm nào phù hợp!</p>";
    return;
  }

  products.forEach((product) => {
    const productCard = `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="price">${product.price.toLocaleString("vi-VN")} đ</p>
        <a href="${product.detailUrl}">Xem chi tiết</a>
      </div>
    `;
    container.innerHTML += productCard;
  });
}

async function handleSearch() {
  const categoryEl = document.getElementById("searchCategory");
  const keywordEl = document.getElementById("searchInput");

  const category = categoryEl ? categoryEl.value : "all";
  const keyword = keywordEl ? keywordEl.value.trim() : "";

  try {
    const url = new URL("http://localhost:3000/api/products");

    if (category && category !== "all") {
      url.searchParams.append("category", category);
    }
    if (keyword !== "") {
      url.searchParams.append("keyword", keyword);
    }

    const response = await fetch(url);
    const filteredProducts = await response.json();

    renderProducts(filteredProducts);
  } catch (err) {
    console.error("Lỗi khi tìm kiếm:", err);
    alert("Không thể tìm kiếm lúc này!");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const productGrids = document.querySelectorAll(".section-product-grid");

  productGrids.forEach((productGrid) => {
    const sectionContainer = productGrid.parentElement;
    const prevBtn = sectionContainer.querySelector(".prev-btn");
    const nextBtn = sectionContainer.querySelector(".next-btn");
    const progressBar = sectionContainer.querySelector(".progress-bar-line");
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
      let scrollPercentage = 0;

      if (maxScrollLeft > 0) {
        scrollPercentage = (productGrid.scrollLeft / maxScrollLeft) * 100;
      }

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
        if (Math.ceil(productGrid.scrollLeft) >= maxScrollLeft) {
          nextBtn.classList.remove("active");
        } else {
          nextBtn.classList.add("active");
        }
      }
    });
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navLogin = document.getElementById("nav-login");
  const navRegister = document.getElementById("nav-register");
  const navAdmin = document.getElementById("nav-admin");
  const navUser = document.getElementById("nav-user");
  const navLogout = document.getElementById("nav-logout");
  const userDisplayName = document.getElementById("user-display-name");
  const btnLogout = document.getElementById("btn-logout");

  if (token && user) {
    if (navLogin) navLogin.style.display = "none";
    if (navRegister) navRegister.style.display = "none";

    if (navUser) {
      navUser.style.display = "inline-block";
      if (userDisplayName && user.username) {
        userDisplayName.textContent = user.username.toUpperCase();
      }
    }
    if (navLogout) navLogout.style.display = "inline-block";

    if (user.role === "admin" && navAdmin) {
      navAdmin.style.display = "inline-block";
    }
  } else {
    if (navLogin) navLogin.style.display = "block";
    if (navRegister) navRegister.style.display = "block";
    if (navAdmin) navAdmin.style.display = "none";
    if (navUser) navUser.style.display = "none";
    if (navLogout) navLogout.style.display = "none";
  }

  if (btnLogout) {
    btnLogout.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      alert("Đã đăng xuất thành công!");
      window.location.reload();
    });
  }

  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", handleSearch);
  }

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        handleSearch();
      }
    });
  }
});
