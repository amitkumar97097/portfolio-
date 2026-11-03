
/* =====================================================
   AMIT KUMAR - PREMIUM PORTFOLIO
   EMAILJS + SERVICE FORM + ANIMATIONS
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // ==========================================
    // 1. EMAILJS CONFIGURATION
    // ==========================================

    const EMAILJS_PUBLIC_KEY = "7Fo_A4YTaopbIbwMr";
    const EMAILJS_SERVICE_ID = "service_7kw9xdf";
    const EMAILJS_TEMPLATE_ID = "template_9jiucat";

    if (window.emailjs) {
        emailjs.init({
            publicKey: EMAILJS_PUBLIC_KEY
        });
    } else {
        console.error("EmailJS SDK not loaded!");
    }

    // ==========================================
    // 2. SELECTORS
    // ==========================================

    const header = document.querySelector("header");
    const nav = document.querySelector("nav");
    const navLinks = document.querySelector(".nav-links");

    const modal = document.getElementById("serviceModal");
    const serviceForm = document.querySelector(
        ".service-request-form"
    );

    const serviceSelect = document.getElementById(
        "serviceType"
    );

    const submitButton = document.querySelector(
        ".service-submit-btn"
    );

    // ==========================================
    // 3. MOBILE NAVIGATION
    // ==========================================

    if (nav && navLinks) {
        let menuButton = document.querySelector(
            ".portfolio-menu-toggle"
        );

        if (!menuButton) {
            menuButton = document.createElement("button");

            menuButton.type = "button";
            menuButton.className = "portfolio-menu-toggle";
            menuButton.setAttribute(
                "aria-label",
                "Open navigation"
            );
            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            menuButton.innerHTML =
                '<span></span><span></span><span></span>';

            nav.appendChild(menuButton);
        }

        function closeMenu() {
            navLinks.classList.remove("open", "active");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            menuButton.setAttribute(
                "aria-label",
                "Open navigation"
            );
        }

        menuButton.addEventListener("click", () => {
            const isOpen =
                menuButton.getAttribute("aria-expanded") !== "true";

            navLinks.classList.toggle("open", isOpen);
            navLinks.classList.toggle("active", isOpen);

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuButton.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", event => {
            if (!nav.contains(event.target)) {
                closeMenu();
            }
        });
    }

    // ==========================================
    // 4. NAVBAR SCROLL EFFECT
    // ==========================================

    function handleScroll() {
        if (header) {
            header.classList.toggle(
                "scrolled",
                window.scrollY > 40
            );
        }

        const topButton = document.querySelector(
            ".back-to-top"
        );

        if (topButton) {
            topButton.classList.toggle(
                "visible",
                window.scrollY > 400
            );
        }
    }

    window.addEventListener("scroll", handleScroll, {
        passive: true
    });

    handleScroll();

    // ==========================================
    // 5. SMOOTH SCROLLING
    // ==========================================

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            const offset =
                (header?.offsetHeight || 0) + 15;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                offset;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        });
    });

    // ==========================================
    // 6. ACTIVE NAVIGATION
    // ==========================================

    const sections = document.querySelectorAll(
        "section[id]"
    );

    const navigationLinks = document.querySelectorAll(
        '.nav-links a[href^="#"]'
    );

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    navigationLinks.forEach(link => {
                        const active =
                            link.getAttribute("href") ===
                            `#${entry.target.id}`;

                        link.classList.toggle("active", active);
                    });
                });
            },
            {
                rootMargin: "-30% 0px -60% 0px"
            }
        );

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // ==========================================
    // 7. SCROLL REVEAL ANIMATIONS
    // ==========================================

    const revealElements = document.querySelectorAll(`
        .project-card,
        .service-card,
        .experience-item,
        .leadership-item,
        .about-content,
        .skills-content,
        .section-title
    `);

    if (
        "IntersectionObserver" in window &&
        !window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {
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
                threshold: 0.1
            }
        );

        revealElements.forEach(element => {
            element.classList.add("reveal-on-scroll");
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(element => {
            element.classList.add("is-visible");
        });
    }

    // ==========================================
    // 8. SERVICE MODAL OPEN
    // ==========================================

    function openServiceModal(serviceName = "") {
        if (!modal) {
            console.error(
                "Service modal #serviceModal not found!"
            );
            return;
        }

        if (serviceSelect && serviceName) {
            serviceSelect.value = serviceName;
        }

        modal.classList.add("active", "is-open");

        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add(
            "modal-open",
            "service-modal-open"
        );

        const firstInput = modal.querySelector(
            'input:not([type="hidden"]), select, textarea'
        );

        setTimeout(() => {
            firstInput?.focus();
        }, 150);
    }

    // ==========================================
    // 9. SERVICE MODAL CLOSE
    // ==========================================

    function closeServiceModal() {
        if (!modal) return;

        modal.classList.remove("active", "is-open");

        modal.setAttribute("aria-hidden", "true");

        document.body.classList.remove(
            "modal-open",
            "service-modal-open"
        );
    }

    document.addEventListener("click", event => {
        const requestButton = event.target.closest(
            ".service-request-btn, [data-service]"
        );

        if (requestButton) {
            event.preventDefault();

            openServiceModal(
                requestButton.dataset.service || ""
            );

            return;
        }

        const closeButton = event.target.closest(
            "[data-close-service-modal], .service-modal-close"
        );

        if (closeButton) {
            event.preventDefault();
            closeServiceModal();
            return;
        }

        if (modal && event.target === modal) {
            closeServiceModal();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeServiceModal();
        }
    });

    // ==========================================
    // 10. EMAILJS SERVICE REQUEST FORM
    // ==========================================

    if (serviceForm) {
        serviceForm.addEventListener(
            "submit",
            async event => {
                event.preventDefault();

                if (!serviceForm.checkValidity()) {
                    serviceForm.reportValidity();
                    return;
                }

                if (!window.emailjs) {
                    alert(
                        "Email service is not loaded. Please refresh and try again."
                    );
                    return;
                }

                const originalButtonText =
                    submitButton?.innerHTML || "Send Request";

                if (submitButton) {
                    submitButton.disabled = true;

                    submitButton.innerHTML =
                        '<i class="fas fa-spinner fa-spin"></i> Sending...';
                }

                const formData = {
                    name: serviceForm.querySelector(
                        '[name="Name"]'
                    ).value.trim(),

                    email: serviceForm.querySelector(
                        '[name="Email"]'
                    ).value.trim(),

                    service: serviceForm.querySelector(
                        '[name="Service Required"]'
                    ).value,

                    budget: serviceForm.querySelector(
                        '[name="Estimated Budget"]'
                    ).value || "Not specified",

                    timeline: serviceForm.querySelector(
                        '[name="Expected Timeline"]'
                    ).value || "Not specified",

                    project_details: serviceForm.querySelector(
                        '[name="Project Details"]'
                    ).value.trim()
                };

                try {
                    const response = await emailjs.send(
                        EMAILJS_SERVICE_ID,
                        EMAILJS_TEMPLATE_ID,
                        formData
                    );

                    console.log(
                        "Email successfully sent:",
                        response.status,
                        response.text
                    );

                    alert(
                        "Thank you! Your project request has been sent successfully. I will contact you soon."
                    );

                    serviceForm.reset();

                    closeServiceModal();

                } catch (error) {
                    console.error(
                        "EmailJS sending error:",
                        error
                    );

                    alert(
                        "Unable to send your request right now. Please email me directly at amitraj02947@gmail.com."
                    );

                } finally {
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.innerHTML =
                            originalButtonText;
                    }
                }
            }
        );
    }

    // ==========================================
    // 11. PROFILE IMAGE FALLBACK
    // ==========================================

    const profileImage = document.getElementById(
        "profileImage"
    );

    if (profileImage) {
        profileImage.addEventListener("error", () => {
            profileImage.style.display = "none";

            const fallback = document.getElementById(
                "profileFallback"
            );

            if (fallback) {
                fallback.style.display = "flex";
            }
        });
    }

    // ==========================================
    // 12. BACK TO TOP
    // ==========================================

    const backToTop = document.querySelector(
        ".back-to-top"
    );

    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // ==========================================
    // 13. CURRENT YEAR
    // ==========================================

    document.querySelectorAll(
        "#currentYear, .current-year, [data-current-year]"
    ).forEach(element => {
        element.textContent = new Date().getFullYear();
    });

    // ==========================================
    // 14. IMAGE LOADING
    // ==========================================

    document.querySelectorAll("img").forEach(image => {
        image.addEventListener("error", () => {
            image.classList.add("image-error");
        });
    });

    // ==========================================
    // 15. INITIALIZATION
    // ==========================================

    document.documentElement.classList.add("js-loaded");

    console.log(
        "Amit Kumar Premium Portfolio initialized successfully!"
    );

});
