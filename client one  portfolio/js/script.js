/* ============================================
   Portfolio Website - Custom JavaScript (EmailJS Fixed)
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  // Dark Mode Toggle
  const themeToggle = document.getElementById("theme-toggle");

  function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    themeToggle.querySelector("i").className =
      savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    themeToggle.querySelector("i").className =
      newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
  }

  if (themeToggle) {
    initTheme();
    themeToggle.addEventListener("click", toggleTheme);
  }

  // Initialize EmailJS first (must be before form handler)
  if (typeof emailjs !== "undefined") {
    emailjs.init("lMTXaQgLI2V5SSxG2");
  }

  /* ============================================
     Mobile Menu Toggle
     ============================================ */
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      menuToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (menuToggle) menuToggle.classList.remove("active");
      if (navMenu) navMenu.classList.remove("active");
    });
  });

  /* ============================================
     Navbar Scroll Effect
     ============================================ */
  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener("scroll", function () {
      navbar.classList.toggle("scrolled", window.scrollY > 50);
    });
  }

  /* ============================================
     Active Nav Link on Scroll
     ============================================ */
  const sections = document.querySelectorAll("section");
  window.addEventListener("scroll", function () {
    let current = "";
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 200) {
        current = section.id;
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === "#" + current,
      );
    });
  });

  /* ============================================
     Smooth Scrolling
     ============================================ */
  document.querySelectorAll('a[href^=\"#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  /* ============================================
     Scroll to Top
     ============================================ */
  const scrollBtn = document.getElementById("scroll-to-top");
  if (scrollBtn) {
    window.addEventListener("scroll", () => {
      scrollBtn.classList.toggle("visible", window.scrollY > 300);
    });
    scrollBtn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }

  /* ============================================
     Fade In Animation
     ============================================ */
  const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

  /* ============================================
     Contact Form + EmailJS (Main Fix)
     ============================================ */
  const form = document.getElementById("contact-form");
  if (form) {
    const inputs = {
      name: document.getElementById("name"),
      email: document.getElementById("email"),
      message: document.getElementById("message"),
      errors: {
        name: document.getElementById("name-error"),
        email: document.getElementById("email-error"),
        message: document.getElementById("message-error"),
      },
      success: document.getElementById("form-success"),
    };

    const emailRegex = /^.+@.+\\..+$/;

    // Clear errors on input
    Object.values(inputs.errors).forEach((error) => {
      if (error) error.textContent = "";
    });

    ["name", "email", "message"].forEach((key) => {
      if (inputs[key]) {
        inputs[key].addEventListener("input", () => {
          if (inputs.errors[key]) inputs.errors[key].textContent = "";
        });
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Reset UI
      Object.values(inputs.errors).forEach((error) => (error.textContent = ""));
      if (inputs.success) inputs.success.classList.remove("show");

      let valid = true;

      // Name
      if (!inputs.name.value.trim()) {
        if (inputs.errors.name)
          inputs.errors.name.textContent = "Name required";
        valid = false;
      } else if (inputs.name.value.trim().length < 2) {
        if (inputs.errors.name)
          inputs.errors.name.textContent = "Name too short";
        valid = false;
      }

      // Email - BYPASS VALIDATION (EmailJS handles it)
      // if (!inputs.email.value.trim()) {
      //   if (inputs.errors.email)
      //     inputs.errors.email.textContent = "Email required";
      //   valid = false;
      // } else if (!emailRegex.test(inputs.email.value.trim())) {
      //   if (inputs.errors.email)
      //     inputs.errors.email.textContent = "Invalid email";
      //   valid = false;
      // }

      // Message
      if (!inputs.message.value.trim()) {
        if (inputs.errors.message)
          inputs.errors.message.textContent = "Message required";
        valid = false;
      } else if (inputs.message.value.trim().length < 10) {
        if (inputs.errors.message)
          inputs.errors.message.textContent = "Message too short (10+ chars)";
        valid = false;
      }

      if (valid && typeof emailjs !== "undefined") {
        emailjs
          .sendForm("service_rsnabzg", "template_0k9vtnx", form)
          .then((res) => {
            console.log("Email sent!", res);
            if (inputs.success) {
              inputs.success.innerHTML =
                '<i class="fas fa-check-circle"></i> Message sent! Check your email.';
              inputs.success.classList.add("show");
            }
            form.reset();
          })
          .catch((err) => {
            console.error("EmailJS error:", err);
            if (inputs.success) {
              inputs.success.innerHTML =
                '<i class="fas fa-exclamation-triangle"></i> Send failed. Email directly to mhbsfwt44@gmail.com';
              inputs.success.classList.add("show");
            }
          });
      } else if (valid) {
        console.log("EmailJS not loaded");
        if (inputs.success) {
          inputs.success.innerHTML =
            '<i class="fas fa-exclamation-triangle"></i> Service unavailable. Email mhbsfwt44@gmail.com';
          inputs.success.classList.add("show");
        }
      }
    });
  }
});
