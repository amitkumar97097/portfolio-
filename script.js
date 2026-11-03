/* =========================================================
   AMIT KUMAR — PORTFOLIO INTERACTIONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // Mobile navigation
  const nav = document.querySelector("nav");
  const navLinks = document.querySelectorAll(".nav-links a");

  const menuButton = document.querySelector(
    ".menu-toggle, .hamburger, .menu-btn"
  );

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      nav.classList.toggle("active");
      menuButton.setAttribute(
        "aria-expanded",
        nav.classList.contains("active")
      );
    });
  }

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      nav?.classList.remove("active");
    });
  });

  // Navbar scroll effect
  const header = document.querySelector("header");

  function handleScroll() {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 40);
    }
  }

  window.addEventListener("scroll", handleScroll, {
    passive: true
  });

  handleScroll();

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const target = document.querySelector(
        link.getAttribute("href")
      );

      if (target) {
        event.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  // Active navigation
  const sections = document.querySelectorAll("section[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        navLinks.forEach(link => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    }, {
      rootMargin: "-35% 0px -55% 0px"
    });

    sections.forEach(section => {
      sectionObserver.observe(section);
    });
  }

  // Scroll reveal animation
  const revealElements = document.querySelectorAll(
    ".project-card, .service-card, .experience-item, " +
    ".leadership-item, .about-content, .skills-content"
  );

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach(element => {
      element.classList.add("reveal");
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(element => {
      element.classList.add("visible");
    });
  }

  // Typing effect
  const typingElement = document.querySelector(".typing-text");

  if (typingElement) {
    const roles = [
      "Software Developer",
      "Full Stack Developer",
      "AI/ML Enthusiast",
      "Problem Solver"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeEffect() {
      const currentRole = roles[roleIndex];

      typingElement.textContent = currentRole.substring(
        0,
        charIndex
      );

      if (!deleting) {
        charIndex++;

        if (charIndex > currentRole.length) {
          deleting = true;
          setTimeout(typeEffect, 1200);
          return;
        }
      } else {
        charIndex--;

        if (charIndex < 0) {
          charIndex = 0;
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }

      setTimeout(typeEffect, deleting ? 45 : 90);
    }

    typeEffect();
  }

  // Service request modal
  const modal = document.getElementById("serviceModal");

  const serviceButtons = document.querySelectorAll(
    ".service-request-btn, [data-service]"
  );

  const closeButtons = document.querySelectorAll(
    "[data-close-service-modal]"
  );

  const serviceSelect = document.getElementById("serviceType");

  function openModal(serviceName = "") {
    if (!modal) return;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    if (serviceSelect && serviceName) {
      serviceSelect.value = serviceName;
    }

    const firstInput = modal.querySelector(
      "input, select, textarea"
    );

    setTimeout(() => firstInput?.focus(), 150);
  }

  function closeModal() {
    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  serviceButtons.forEach(button => {
    button.addEventListener("click", () => {
      openModal(button.dataset.service || "");
    });
  });

  closeButtons.forEach(button => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  // Service form validation
  const serviceForm = document.querySelector(
    ".service-request-form"
  );

  if (serviceForm) {
    serviceForm.addEventListener("submit", event => {
      if (!serviceForm.checkValidity()) {
        event.preventDefault();
        serviceForm.reportValidity();
      }
    });
  }

  // Contact links and current year
  document.querySelectorAll(".current-year").forEach(element => {
    element.textContent = new Date().getFullYear();
  });

  // Back to top (if button exists)
  const backToTop = document.querySelector(".back-to-top");

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  console.log("Amit Kumar Portfolio Loaded Successfully 🚀");
});
