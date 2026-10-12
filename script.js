
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const header = document.querySelector('header');
  const profileImg = document.getElementById('profileImage');
  const techIcons = document.querySelectorAll('.tech-icon');
  const projectCards = document.querySelectorAll('.project-card');
  const backToTop = document.querySelector('.back-to-top');

  /* 1. Header scroll effect and back-to-top visibility */
  function updateScrollUI() {
    const scrollY = window.scrollY;

    if (header) {
      header.classList.toggle('scrolled', scrollY > 50);
    }

    if (backToTop) {
      backToTop.classList.toggle('active', scrollY > 300);
      backToTop.setAttribute(
        'aria-hidden',
        String(scrollY <= 300)
      );
    }
  }

  updateScrollUI();

  window.addEventListener('scroll', updateScrollUI, {
    passive: true
  });

  /* 2. Smooth scrolling for navigation links */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const href = anchor.getAttribute('href');

      if (!href || href === '#') return;

      let target;

      try {
        target = document.querySelector(href);
      } catch {
        return;
      }

      if (!target) return;

      event.preventDefault();

      const headerHeight = header
        ? header.getBoundingClientRect().height
        : 0;

      const targetTop =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        16;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: reducedMotion ? 'auto' : 'smooth'
      });
    });
  });

  /* 3. Highlight active navigation section */
  const navLinks = document.querySelectorAll(
    'nav a[href^="#"], .nav-links a[href^="#"]'
  );

  const navSections = [...navLinks]
    .map(link => {
      try {
        return document.querySelector(
          link.getAttribute('href')
        );
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && navSections.length) {
    const navObserver = new IntersectionObserver(entries => {
      const visibleSections = entries
        .filter(entry => entry.isIntersecting)
        .sort(
          (a, b) => b.intersectionRatio - a.intersectionRatio
        );

      if (!visibleSections.length) return;

      const activeId = visibleSections[0].target.id;

      navLinks.forEach(link => {
        const active =
          link.getAttribute('href') === `#${activeId}`;

        link.classList.toggle('active', active);

        if (active) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0, 0.15, 0.35, 0.6]
    });

    navSections.forEach(section => {
      navObserver.observe(section);
    });
  }

  /* 4. Optional mobile navigation menu */
  const menuToggle = document.querySelector(
    '.menu-toggle, .nav-toggle, .hamburger, #menuToggle'
  );

  const navMenu = document.querySelector('.nav-links');

  if (menuToggle && navMenu) {
    menuToggle.setAttribute('aria-expanded', 'false');

    menuToggle.addEventListener('click', () => {
      const isOpen =
        menuToggle.getAttribute('aria-expanded') !== 'true';

      menuToggle.setAttribute(
        'aria-expanded',
        String(isOpen)
      );

      navMenu.classList.toggle('open', isOpen);
      navMenu.classList.toggle('active', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open', 'active');
        document.body.classList.remove('menu-open');
      });
    });
  }

  /* 5. Reveal sections when they enter the viewport */
  const revealElements = document.querySelectorAll(
    '.section, main section, .project-card, ' +
    '.experience-item, .education-item, .contact-item, ' +
    '.leadership-item, .leadership-card, .skill-card, ' +
    '.skill-category, .timeline-item'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    revealElements.forEach(element => {
      element.classList.add('reveal-on-scroll');

      if (reducedMotion) {
        element.classList.add('is-visible');
      } else {
        revealObserver.observe(element);
      }
    });
  } else {
    revealElements.forEach(element => {
      element.classList.add('is-visible');
    });
  }

  /* 6. Tech stack icon animations */
  if ('IntersectionObserver' in window) {
    const iconObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );

    techIcons.forEach((icon, index) => {
      icon.classList.add('tech-icon-reveal');

      icon.style.setProperty(
        '--icon-delay',
        `${Math.min(index * 65, 390)}ms`
      );

      const tooltip =
        icon.getAttribute('data-tooltip') ||
        icon.getAttribute('title');

      if (tooltip && !icon.hasAttribute('aria-label')) {
        icon.setAttribute('aria-label', tooltip);
      }

      if (reducedMotion) {
        icon.classList.add('is-visible');
      } else {
        iconObserver.observe(icon);
      }
    });
  }

  /* 7. Profile photo interactions */
  if (profileImg) {
    profileImg.style.objectPosition = 'center 20%';

    function imageLoaded() {
      profileImg.classList.remove('image-unavailable');
    }

    function imageFailed() {
      profileImg.classList.add('image-unavailable');

      console.warn(
        'Profile image not loaded. Check the image path and filename.'
      );
    }

    profileImg.addEventListener('load', imageLoaded);
    profileImg.addEventListener('error', imageFailed);

    if (profileImg.complete) {
      if (profileImg.naturalWidth > 0) {
        imageLoaded();
      } else {
        imageFailed();
      }
    }

    const photoContainer = profileImg.closest(
      '.profile-img-container, .hero-image, ' +
      '.profile-frame, .profile-container'
    );

    if (
      photoContainer &&
      !reducedMotion &&
      window.matchMedia(
        '(hover: hover) and (pointer: fine)'
      ).matches
    ) {
      photoContainer.addEventListener('pointermove', event => {
        const rect = photoContainer.getBoundingClientRect();

        if (!rect.width || !rect.height) return;

        const x =
          (event.clientX - rect.left) / rect.width - 0.5;

        const y =
          (event.clientY - rect.top) / rect.height - 0.5;

        profileImg.style.transform =
          `scale(1.025) translate(${x * 4}px, ${y * 4}px)`;
      });

      photoContainer.addEventListener('pointerleave', () => {
        profileImg.style.transform = '';
      });
    }
  }

  /* 8. Social and tech icon hover effects */
  document.querySelectorAll(
    '.tech-icon, .social-links a, .social-icons a'
  ).forEach(element => {
    element.addEventListener('pointerenter', () => {
      element.classList.add('is-hovered');
    });

    element.addEventListener('pointerleave', () => {
      element.classList.remove('is-hovered');
    });

    element.addEventListener('focus', () => {
      element.classList.add('is-hovered');
    });

    element.addEventListener('blur', () => {
      element.classList.remove('is-hovered');
    });
  });

  /* 9. Professional 3D project card tilt */
  if (
    !reducedMotion &&
    window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches
  ) {
    projectCards.forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();

        if (!rect.width || !rect.height) return;

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        const rotateY = (x - 0.5) * 5;
        const rotateX = (0.5 - y) * 5;

        card.style.transform =
          `perspective(900px) rotateX(${rotateX}deg) ` +
          `rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* 10. Back-to-top button */
  if (backToTop) {
    backToTop.setAttribute(
      'aria-label',
      backToTop.getAttribute('aria-label') || 'Back to top'
    );

    backToTop.addEventListener('click', event => {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  /* 11. Optional scroll progress bar */
  const progressBar = document.querySelector(
    '#scrollProgress, .scroll-progress, [data-scroll-progress]'
  );

  if (progressBar) {
    let scheduled = false;

    const updateProgress = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      const percentage = maxScroll > 0
        ? (window.scrollY / maxScroll) * 100
        : 0;

      progressBar.style.width =
        `${Math.min(100, Math.max(0, percentage))}%`;

      scheduled = false;
    };

    window.addEventListener('scroll', () => {
      if (scheduled) return;

      scheduled = true;
      window.requestAnimationFrame(updateProgress);
    }, { passive: true });

    updateProgress();
  }

  /* 12. Optional animated counters
     Example: <span data-count="200" data-suffix="+">0</span>
  */
  const counters = document.querySelectorAll('[data-count]');

  function animateCounter(element) {
    const target = Number(element.dataset.count);

    if (!Number.isFinite(target)) return;

    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    const decimals = Math.max(
      0,
      Number(element.dataset.decimals) || 0
    );

    const duration = reducedMotion ? 0 : 1100;
    const startTime = performance.now();

    function draw(now) {
      const progress = duration
        ? Math.min((now - startTime) / duration, 1)
        : 1;

      const eased = 1 - Math.pow(1 - progress, 3);
      const value = (target * eased).toFixed(decimals);

      element.textContent = `${prefix}${value}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(draw);
      }
    }

    window.requestAnimationFrame(draw);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  }

  /* 13. Automatically update footer year */
  document.querySelectorAll(
    '[data-current-year], #currentYear, .current-year'
  ).forEach(element => {
    element.textContent = String(new Date().getFullYear());
  });

  /* 14. Optional GitHub chart
     Note: these are sample values, not live GitHub data.
  */
  const githubCanvas = document.getElementById('githubChart');

  if (githubCanvas && typeof window.Chart === 'function') {
    try {
      if (githubCanvas._portfolioChart) {
        githubCanvas._portfolioChart.destroy();
      }

      githubCanvas._portfolioChart = new window.Chart(
        githubCanvas,
        {
          type: 'bar',

          data: {
            labels: [
              'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ],

            datasets: [{
              label: 'Illustrative Contributions',
              data: [
                12, 19, 8, 15, 22, 18,
                25, 12, 19, 27, 15, 20
              ],
              backgroundColor: 'rgba(56, 189, 248, 0.72)',
              borderColor: '#38bdf8',
              borderWidth: 1,
              borderRadius: 6
            }]
          },

          options: {
            responsive: true,
            maintainAspectRatio: false,

            animation: reducedMotion
              ? false
              : { duration: 700 },

            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(148, 163, 184, 0.12)'
                },
                ticks: {
                  color: '#b6c7df',
                  precision: 0
                }
              },

              x: {
                grid: { display: false },
                ticks: { color: '#b6c7df' }
              }
            },

            plugins: {
              legend: { display: false },

              tooltip: {
                backgroundColor: '#0b1730',
                titleColor: '#f8fafc',
                bodyColor: '#e2e8f0',
                borderColor: '#38bdf8',
                borderWidth: 1,
                padding: 10
              }
            }
          }
        }
      );
    } catch (error) {
      console.error(
        'GitHub chart could not be initialized:',
        error
      );
    }
  }

  /* 15. Secure external links opening in a new tab */
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    const relValues = new Set(
      (link.getAttribute('rel') || '')
        .split(/\s+/)
        .filter(Boolean)
    );

    relValues.add('noopener');
    relValues.add('noreferrer');

    link.setAttribute('rel', [...relValues].join(' '));
  });

  /* 16. Optional copy-email button
     Example: <button data-copy-email="amit@example.com">Copy email</button>
  */
  document.querySelectorAll('[data-copy-email]').forEach(button => {
    button.addEventListener('click', async () => {
      const email = button.dataset.copyEmail;

      if (!email || !navigator.clipboard?.writeText) return;

      const previousText = button.textContent;

      try {
        await navigator.clipboard.writeText(email);
        button.textContent = 'Email copied!';

        window.setTimeout(() => {
          button.textContent = previousText;
        }, 1600);
      } catch (error) {
        console.warn('Could not copy email:', error);
      }
    });
  });

  /* 17. Basic form validation
     A backend or form service is required to actually send messages.
  */
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        form.reportValidity();
      }
    });
  });

  /* 18. Mark JavaScript as initialized */
  document.documentElement.classList.add('js-loaded');

  console.info(
    'Amit Kumar portfolio: interactions initialized successfully.'
  );
});
