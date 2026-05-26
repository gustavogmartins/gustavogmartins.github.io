const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const themeToggle = document.querySelector("[data-theme-toggle]");
const root = document.documentElement;
const storageKey = "portfolio-theme";

function getPreferredTheme() {
  const savedTheme = localStorage.getItem(storageKey);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  const isDark = theme === "dark";

  root.dataset.theme = isDark ? "dark" : "light";

  if (!themeToggle) {
    return;
  }

  const icon = themeToggle.querySelector(".theme-toggle-icon");
  const label = themeToggle.querySelector(".theme-toggle-label");

  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");

  if (icon) {
    icon.textContent = isDark ? "☀️" : "🌙";
  }

  if (label) {
    label.textContent = isDark ? "Light" : "Dark";
  }
}

applyTheme(getPreferredTheme());

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = root.dataset.theme === "dark" ? "dark" : "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    localStorage.setItem(storageKey, nextTheme);
    applyTheme(nextTheme);
  });
}

const carousels = document.querySelectorAll("[data-carousel]");

carousels.forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
  const prevButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const dotsContainer = carousel.querySelector("[data-carousel-dots]");

  if (slides.length === 0) {
    return;
  }

  let activeIndex = slides.findIndex((slide) =>
    slide.classList.contains("is-active")
  );

  if (activeIndex < 0) {
    activeIndex = 0;
    slides[0].classList.add("is-active");
  }

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Go to slide ${index + 1}`);

    dot.addEventListener("click", () => {
      setActiveSlide(index);
      restartAutoPlay();
    });

    dotsContainer?.appendChild(dot);

    return dot;
  });

  function setActiveSlide(index) {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
    });
  }

  function goToNextSlide() {
    setActiveSlide(activeIndex + 1);
  }

  prevButton?.addEventListener("click", () => {
    setActiveSlide(activeIndex - 1);
    restartAutoPlay();
  });

  nextButton?.addEventListener("click", () => {
    goToNextSlide();
    restartAutoPlay();
  });

  setActiveSlide(activeIndex);

  let autoPlayInterval;

  function startAutoPlay() {
    if (slides.length <= 1) {
      return;
    }

    autoPlayInterval = setInterval(() => {
      goToNextSlide();
    }, 5000);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  function restartAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  carousel.addEventListener("mouseenter", stopAutoPlay);
  carousel.addEventListener("mouseleave", startAutoPlay);

  carousel.addEventListener("focusin", stopAutoPlay);
  carousel.addEventListener("focusout", startAutoPlay);

  startAutoPlay();
});