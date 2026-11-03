
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ==========================================
  // 1. ELEMENT SELECTORS
  // ==========================================

  const navbar = document.querySelector(".navbar");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelectorAll(".nav-links a");
  const backToTop = document.querySelector(".back-to-top");

  // ==========================================
  // 2. MOBILE NAVIGATION
  // ==========================================

  if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
      navbar.classList.toggle("active");

      const isOpen = navbar.classList.contains("active");
      menuToggle.setAttribute("aria-expanded", isOpen);
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navbar.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (event) => {
      if (
        navbar.classList.contains("active") &&
        !navbar.contains(event.target)
      ) {
        navbar.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ==========================================
  // 3. NAVBAR SCROLL EFFECT
  // ==========================================

  const handleNavbarScroll = () => {
    if (!navbar) return;

    navbar.classList.toggle("scrolled", window.scrollY > 40);

    if (backToTop) {
      backToTop.classList.toggle("visible", window.scrollY > 400);
    }
  };

  window.addEventListener("scroll", handleNavbarScroll, {
    passive: true
  });

  handleNavbarScroll();

  // ==========================================
  // 4. SMOOTH SCROLLING
  // ==========================================

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  // ==========================================
  // 5. ACTIVE NAVIGATION ON SCROLL
  // ==========================================

  const sections = document.querySelectorAll("section[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const currentId = entry.target.id;

          navLinks.forEach((link) => {
            const isActive =
              link.getAttribute("href") === `#${currentId}`;

            link.classList.toggle("active", isActive);
          });
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px"
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // ==========================================
  // 6. SCROLL REVEAL ANIMATIONS
  // ==========================================

  const revealElements = document.querySelectorAll(
    ".reveal, .project-card, .skill-card, .experience-card, .education-card"
  );

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element) => {
      element.classList.add("reveal");
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // ==========================================
  // 7. TYPING EFFECT
  // ==========================================

  const typingElement = document.querySelector(".typing-text");

  if (typingElement) {
    const roles = [
      "Software Developer",
      "Full Stack Developer",
      "AI & ML Enthusiast",
      "Problem Solver"
    ];

    let roleIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    const typeEffect = () => {
      const currentRole = roles[roleIndex];

      if (!deleting) {
        typingElement.textContent = currentRole.slice(
          0,
          characterIndex + 1
        );

        characterIndex++;

        if (characterIndex === currentRole.length) {
          deleting = true;
          setTimeout(typeEffect, 1300);
          return;
        }
      } else {
        typingElement.textContent = currentRole.slice(
          0,
          characterIndex - 1
        );

        characterIndex--;

        if (characterIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }

      setTimeout(typeEffect, deleting ? 45 : 85);
    };

    typeEffect();
  }

  // ==========================================
  // 8. BACK TO TOP BUTTON
  // ==========================================

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // ==========================================
  // 9. SERVICE REQUEST MODAL
  // ==========================================

  const serviceModal = document.querySelector(
    "#serviceModal, .service-modal"
  );

  const openModalButtons = document.querySelectorAll(
    ".open-service-modal, [data-open-modal]"
  );

  const closeModalButtons = document.querySelectorAll(
    ".close-modal, [data-close-modal]"
  );

  const openModal = () => {
    if (!serviceModal) return;

    serviceModal.classList.add("active");
    serviceModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    const firstInput = serviceModal.querySelector(
      "input, select, textarea"
    );

    if (firstInput) {
      setTimeout(() => firstInput.focus(), 150);
    }
  };

  const closeModal = () => {
    if (!serviceModal) return;

    serviceModal.classList.remove("active");
    serviceModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  openModalButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openModal();
    });
  });

  closeModalButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  if (serviceModal) {
    serviceModal.addEventListener("click", (event) => {
      if (event.target === serviceModal) {
        closeModal();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  // ==========================================
  // 10. SERVICE SELECTION
  // ==========================================

  const serviceSelect = document.querySelector(
    "#service, #serviceType, [name='service']"
  );

  document.querySelectorAll("[data-service]").forEach((button) => {
    button.addEventListener("click", () => {
      const selectedService = button.dataset.service;

      if (serviceSelect && selectedService) {
        serviceSelect.value = selectedService;
      }

      openModal();
    });
  });

  // ==========================================
  // 11. CONTACT FORM VALIDATION
  // ==========================================

  const forms = document.querySelectorAll(
    ".contact-form, .service-form, #contactForm, #serviceForm"
  );

  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      const emailInput = form.querySelector('input[type="email"]');
      const nameInput = form.querySelector(
        'input[name="name"], input[name="fullName"]'
      );

      if (nameInput && !nameInput.value.trim()) {
        event.preventDefault();
        alert("Please enter your name.");
        nameInput.focus();
        return;
      }

      if (
        emailInput &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())
      ) {
        event.preventDefault();
        alert("Please enter a valid email address.");
        emailInput.focus();
      }
    });
  });

  // ==========================================
  // 12. CURRENT YEAR
  // ==========================================

  document.querySelectorAll(".current-year").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  // ==========================================
  // 13. IMAGE LAZY LOADING
  // ==========================================

  document.querySelectorAll("img").forEach((image) => {
    if (!image.hasAttribute("loading")) {
      image.setAttribute("loading", "lazy");
    }

    image.addEventListener("error", () => {
      image.classList.add("image-error");
    });
  });

  // ==========================================
  // 14. BUTTON CLICK FEEDBACK
  // ==========================================

  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.add("clicked");

      setTimeout(() => {
        button.classList.remove("clicked");
      }, 250);
    });
  });

  console.log("Portfolio initialized successfully 🚀");
});
