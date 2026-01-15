// ================================
// Smooth Scroll Functionality
// ================================

document.addEventListener('DOMContentLoaded', function () {
    // Smooth scroll for anchor links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]:not([href="#beta-form"])');

    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just '#'
            if (href === '#') return;

            e.preventDefault();

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 20; // 20px offset for better visibility

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ================================
    // Intersection Observer for Animations
    // ================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and sections for scroll animations
    const animateElements = document.querySelectorAll('.problem-card, .feature-card, .benefit-item, .audience-card, .testimonial-card, .faq-item');

    animateElements.forEach((el, index) => {
        // Set initial state
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;

        // Observe element
        observer.observe(el);
    });

    // ================================
    // CTA Click Tracking (for future analytics)
    // ================================

    const ctaButtons = document.querySelectorAll('.btn-primary');

    ctaButtons.forEach(button => {
        button.addEventListener('click', function () {
            // For now, just log. In production, send to analytics
            console.log('CTA clicked:', this.textContent.trim());

            // If it's a beta form link, you can add additional tracking here
            if (this.getAttribute('href') === '#beta-form') {
                console.log('Beta form CTA clicked');
            }
        });
    });

    // ================================
    // Scroll Progress Indicator (subtle)
    // ================================

    let scrollProgress = 0;

    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        scrollProgress = (scrollTop / (documentHeight - windowHeight)) * 100;

        // Can be used to show a progress bar or change header behavior
        // For now, we'll use it to add a class to body when scrolled
        if (scrollTop > 100) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    });

    // ================================
    // Dynamic Stats Counter (optional enhancement)
    // ================================

    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 16);
    }

    // Animate stats when they come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const number = entry.target.querySelector('.stat-number');
                if (number && number.textContent.includes('500')) {
                    entry.target.classList.add('animated');
                    number.textContent = '0';
                    animateCounter(number, 500);
                }
            }
        });
    }, { threshold: 0.5 });

    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => statsObserver.observe(item));

    // ================================
    // Dynamic Copyright Year
    // ================================

    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ================================
    // Beta Form Handling (Web3Forms)
    // ================================
    const form = document.getElementById('betaSignup');
    const result = document.getElementById('formResult');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            result.style.display = 'block';
            result.innerHTML = 'Sending...';
            result.style.color = 'var(--text-color-primary)';

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
                .then(async (response) => {
                    let json = await response.json();
                    if (response.status == 200) {
                        result.innerHTML = 'Check your inbox – your beta invite is on the way within 24 hours! 🚀';
                        result.style.color = '#10b981'; // Success Green
                    } else {
                        console.log(response);
                        result.innerHTML = json.message;
                        result.style.color = '#ef4444'; // Error Red
                    }
                })
                .catch(error => {
                    console.log(error);
                    result.innerHTML = 'Something went wrong!';
                    result.style.color = '#ef4444';
                })
                .then(function () {
                    form.reset();
                });
        });
    }

    // ================================
    // Spotlight Effect (Premium Hover)
    // ================================
    const spotlightCards = document.querySelectorAll('.spotlight-card, .feature-row, .audience-card, .compact-card, .benefit-item'); // Auto-target these

    spotlightCards.forEach(card => {
        // Ensure they have the class for CSS targeting if not already
        card.classList.add('spotlight-card');

        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ================================
    // Infinite Stacking Carousel
    // ================================
    const stackContainer = document.getElementById('stackCarousel');
    const nextBtn = document.getElementById('nextCardBtn');

    if (stackContainer && nextBtn) {
        // Prevent rapid clicks
        let isAnimating = false;

        nextBtn.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;

            const cards = stackContainer.querySelectorAll('.stack-card');
            if (cards.length > 0) {
                const frontCard = cards[0];

                // 1. Animate Out
                frontCard.classList.add('exit');

                // 2. Move to Back after transition
                setTimeout(() => {
                    stackContainer.appendChild(frontCard);
                    frontCard.classList.remove('exit');
                    // Reset styling/state if needed
                    isAnimating = false;

                    // Refresh Lucide icons if needed (though DOM move usually keeps them)
                    if (window.lucide) window.lucide.createIcons();
                }, 400); // Matches .stack-card.exit transition duration
            }
        });
    }

    // ================================
    // Console Message
    // ================================

    console.log('%c🚀 Startsphere Landing Page', 'font-size: 20px; font-weight: bold; color: #667eea;');
    console.log('%cThe digital trail for every team\'s effort', 'font-size: 14px; color: #6b7280;');
    console.log('%cInterested in beta testing? Click any "Join Beta Testing" button!', 'font-size: 12px; color: #764ba2;');

});

// ================================
// Utility Functions
// ================================

// Get current scroll position
function getScrollPosition() {
    return window.pageYOffset || document.documentElement.scrollTop;
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Smooth scroll to element
function scrollToElement(element, offset = 0) {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getScrollPosition,
        isInViewport,
        scrollToElement
    };
}
