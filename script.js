document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
  
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
  
    // Profile image adjustment
    const profileImg = document.getElementById('profileImage');
    if (profileImg) {
        profileImg.style.objectPosition = 'center 20%';
        profileImg.addEventListener('mouseenter', () => {
            profileImg.style.transform = 'scale(1.03)';
        });
        profileImg.addEventListener('mouseleave', () => {
            profileImg.style.transform = 'scale(1)';
        });
    }
  
    // GitHub Chart
    const githubCtx = document.getElementById('githubChart');
    if (githubCtx) {
        const githubChart = new Chart(githubCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'GitHub Contributions',
                    data: [12, 19, 8, 15, 22, 18, 25, 12, 19, 27, 15, 20],
                    backgroundColor: '#2563eb',
                    borderColor: '#1d4ed8',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleColor: '#f8fafc',
                        bodyColor: '#f8fafc',
                        borderColor: '#64748b',
                        borderWidth: 1,
                        padding: 10
                    }
                }
            }
        });
    }
  
    // Animate tech icons when they come into view
    const techIcons = document.querySelectorAll('.tech-icon');
    const animateIcons = () => {
        techIcons.forEach(icon => {
            const iconPosition = icon.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (iconPosition < screenPosition) {
                icon.classList.add('floating');
            }
        });
    };
  
    // Run once on load
    animateIcons();
    
    // Run on scroll
    window.addEventListener('scroll', animateIcons);
  
    // Animate elements when scrolling
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.section, .project-card, .experience-item, .contact-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
  
    // Set initial state for animated elements
    document.querySelectorAll('.section, .project-card, .experience-item, .contact-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
  
    // Run once on load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
  
    // Project cards tilt effect
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 20;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 20;
            card.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg) translateY(-10px) scale(1.02)`;
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'all 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
        });
    });
  
    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });
  
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
  });