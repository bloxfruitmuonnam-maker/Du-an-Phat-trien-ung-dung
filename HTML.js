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

function autoSlides() {
  slideTimer = setTimeout(function () {
    slideIndex++;
    showSlides(slideIndex);
    autoSlides();
  }, 3000);
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
});
