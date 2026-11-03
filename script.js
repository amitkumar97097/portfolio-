
/* =========================================================
   AMIT KUMAR — PREMIUM PORTFOLIO JAVASCRIPT
   Navigation | Animations | Service Modal | Form | UI
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const header = $("header");

  // 1. NAVBAR SCROLL EFFECT
  function updateHeader() {
    header?.classList.toggle("scrolled", window.scrollY > 35);
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  // 2. MOBILE MENU
  const nav = $("nav");
  const navMenu = $(".nav-links");

  if (nav && navMenu && !$(".portfolio-menu-toggle", nav)) {
    const toggle = document.createElement("button");

    toggle.type = "button";
    toggle.className = "portfolio-menu-toggle";
    toggle.setAttribute("aria-label", "Open navigation");
    toggle.setAttribute("aria-expanded", "false");

    toggle.innerHTML =
      '<span></span><span></span><span></span>';

    nav.appendChild(toggle);

    function closeMenu() {
      navMenu.classList.remove("open", "active");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
    }

    toggle.addEventListener("click", () => {
      const open =
        toggle.getAttribute("aria-expanded") !== "true";

      navMenu.classList.toggle("open", open);
      navMenu.classList.toggle("active", open);

      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute(
        "aria-label",
        open ? "Close navigation" : "Open navigation"
      );
    });

    $$(".nav-links a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", event => {
      if (!nav.contains(event.target)) {
        closeMenu();
      }
    });
  }

  // 3. SMOOTH SCROLLING
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", event => {
      const href = anchor.getAttribute("href");

      if (!href || href === "#") return;

      const target = $(href);

      if (!target) return;

      event.preventDefault();

      const offset = (header?.offsetHeight || 0) + 12;

      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        offset;

      window.scrollTo({
        top,
        behavior: reducedMotion ? "auto" : "smooth"
      });
    });
  });

  // 4. ACTIVE NAVIGATION
  const navAnchors = $$('.nav-links a[href^="#"]');

  const observedSections = navAnchors
    .map(link => $(link.getAttribute("href")))
    .filter(Boolean);

  if (
    "IntersectionObserver" in window &&
    observedSections.length
  ) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        navAnchors.forEach(link => {
          const active =
            link.getAttribute("href") ===
            `#${entry.target.id}`;

          link.classList.toggle("active", active);

          if (active) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    }, {
      rootMargin: "-25% 0px -65% 0px",
      threshold: 0
    });

    observedSections.forEach(section => {
      navObserver.observe(section);
    });
  }

  // 5. SCROLL REVEAL ANIMATIONS
  const revealItems = $$(`
    .section-title,
    .about-content,
    .experience-column,
    .project-card,
    .skills-content p,
    .leadership-item,
    .service-card,
    .contact-content
  `);

  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -20px 0px"
      }
    );

    revealItems.forEach(element => {
      element.classList.add("reveal-on-scroll");
      revealObserver.observe(element);
    });
  } else {
    revealItems.forEach(element => {
      element.classList.add("is-visible");
    });
  }

  // 6. SERVICE REQUEST MODAL
  const modal = $("#serviceModal");
  const serviceSelect = $("#serviceType");

  let lastFocused = null;

  function openModal(service = "") {
    if (!modal) {
      console.error(
        "Service modal #serviceModal is missing from index.html"
      );
      return;
    }

    lastFocused = document.activeElement;

    if (serviceSelect && service) {
      serviceSelect.value = service;
    }

    modal.classList.add("is-open", "active");
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add(
      "service-modal-open",
      "modal-open"
    );

    const firstInput = $(
      'input:not([type="hidden"]), select, textarea',
      modal
    );

    window.setTimeout(() => {
      firstInput?.focus();
    }, 100);
  }

  function closeModal() {
    if (!modal) return;

    modal.classList.remove("is-open", "active");
    modal.setAttribute("aria-hidden", "true");

    document.body.classList.remove(
      "service-modal-open",
      "modal-open"
    );

    if (lastFocused?.focus) {
      lastFocused.focus();
    }
  }

  // Event delegation: all service request buttons work.
  document.addEventListener("click", event => {
    const requestButton = event.target.closest(
      ".service-request-btn, [data-service]"
    );

    if (requestButton) {
      event.preventDefault();

      openModal(
        requestButton.getAttribute("data-service") || ""
      );

      return;
    }

    const closeButton = event.target.closest(
      "[data-close-service-modal], .service-modal-close"
    );

    if (closeButton) {
      event.preventDefault();
      closeModal();
      return;
    }

    // Close when clicking the modal backdrop.
    if (modal && event.target === modal) {
      closeModal();
    }
  });

  // Close modal with Escape key.
  document.addEventListener("keydown", event => {
    if (
      event.key === "Escape" &&
      modal &&
      (
        modal.classList.contains("is-open") ||
        modal.classList.contains("active")
      )
    ) {
      closeModal();
    }
  });

  // 7. SERVICE FORM VALIDATION
  const requestForm = $(".service-request-form");

  if (requestForm) {
    requestForm.addEventListener("submit", event => {
      if (!requestForm.checkValidity()) {
        event.preventDefault();
        requestForm.reportValidity();
        return;
      }

      const submitButton = $(
        'button[type="submit"]',
        requestForm
      );

      if (submitButton) {
        submitButton.disabled = true;

        submitButton.innerHTML =
          'Sending request… <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>';
      }
    });
  }

  // 8. PROFILE IMAGE FALLBACK
  const profile = $("#profileImage");

  if (profile) {
    profile.addEventListener("error", () => {
      const fallback = $("#profileFallback");

      if (fallback) {
        fallback.style.display = "flex";
      }

      profile.style.display = "none";
    }, { once: true });
  }

  // 9. BACK TO TOP BUTTON
  let topButton = $(
    ".back-to-top, .floating-action-btn"
  );

  if (!topButton) {
    topButton = document.createElement("button");

    topButton.type = "button";
    topButton.className = "portfolio-back-to-top";
    topButton.setAttribute("aria-label", "Back to top");

    topButton.innerHTML =
      '<i class="fas fa-arrow-up"></i>';

    document.body.appendChild(topButton);
  }

  function updateTopButton() {
    topButton.classList.toggle(
      "visible",
      window.scrollY > 450
    );
  }

  updateTopButton();

  window.addEventListener("scroll", updateTopButton, {
    passive: true
  });

  topButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth"
    });
  });

  // 10. AUTOMATIC FOOTER YEAR
  $$(
    "[data-current-year], #currentYear, .current-year"
  ).forEach(element => {
    element.textContent = String(
      new Date().getFullYear()
    );
  });

  // 11. INITIALIZE PORTFOLIO
  document.documentElement.classList.add("js-loaded");

  console.info(
    "Portfolio ready — service enquiry modal enabled."
  );
});
