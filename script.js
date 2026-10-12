document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('header');
  const profileImg = document.getElementById('profileImage');
  const techIcons = document.querySelectorAll('.tech-icon');
  const projectCards = document.querySelectorAll('.project-card');
  const backToTopBtn = document.querySelector('.back-to-top');

  /* Header scroll effect */
  const updateScrollUI = () => {
    const scrolled = window.scrollY > 50;
    if (header) header.classList.toggle('scrolled', scrolled);
    if (backToTopBtn) backToTopBtn.classList.toggle('active', window.scrollY > 300);
  };

  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });

  /* Smooth in-page navigation; account for the sticky header */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      let target;
      try {
        target = document.querySelector(href);
      } catch (_) {
        return;
      }
      if (!target) return;

      event.preventDefault();
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
      window.scrollTo({ top: Math.max(0, targetTop), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* Profile photo: crop and subtle hover effect */
  if (profileImg) {
    profileImg.style.objectPosition = 'center 20%';
    profileImg.addEventListener('error', () => {
      profileImg.classList.add('image-unavailable');
      // The browser's alt text remains available if the local image path is incorrect.
      console.warn('Profile image could not be loaded. Check that profile.jpg is beside index.html.');
    });
    profileImg.addEventListener('load', () => profileImg.classList.remove('image-unavailable'));

    const profileContainer = profileImg.closest('.profile-img-container');
    if (profileContainer && !prefersReducedMotion) {
      profileContainer.addEventListener('pointermove', (event) => {
        if (event.pointerType === 'touch') return;
        const rect = profileContainer.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        profileImg.style.transform = `scale(1.035) translate(${x * 4}px, ${y * 4}px)`;
      });
      profileContainer.addEventListener('pointerleave', () => {
        profileImg.style.transform = '';
      });
    }
  }

  /* Reveal sections and cards when they enter the viewport */
  const revealElements = document.querySelectorAll(
    '.section, .project-card, .experience-item, .contact-item, .leadership-item'
  );

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    revealElements.forEach((element) => element.classList.add('reveal-on-scroll'));

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  /* Tech icon reveal and tooltip accessibility */
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const iconObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    techIcons.forEach((icon) => {
      icon.classList.add('tech-icon-reveal');
      iconObserver.observe(icon);
      const tooltip = icon.getAttribute('data-tooltip');
      if (tooltip && !icon.hasAttribute('aria-label')) icon.setAttribute('aria-label', tooltip);
    });
  }

  /* Project card tilt on pointer devices only */
  if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    projectCards.forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 5;
        const rotateX = (0.5 - y) * 5;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* Back-to-top button */
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* Optional GitHub chart. Values below are illustrative, not live GitHub data. */
  const githubCanvas = document.getElementById('githubChart');
  if (githubCanvas && typeof window.Chart === 'function') {
    try {
      new window.Chart(githubCanvas, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Illustrative Contributions',
            data: [12, 19, 8, 15, 22, 18, 25, 12, 19, 27, 15, 20],
            backgroundColor: 'rgba(56, 189, 248, 0.72)',
            borderColor: '#38bdf8',
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: prefersReducedMotion ? false : { duration: 700 },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.12)' }, ticks: { color: '#b6c7df' } },
            x: { grid: { display: false }, ticks: { color: '#b6c7df' } }
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
      });
    } catch (error) {
      console.error('GitHub chart could not be initialized:', error);
    }
  }
});
