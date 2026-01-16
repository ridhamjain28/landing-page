// ================================
// Mobile Detection and Optimizations
// ================================
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// ================================
// Smooth Scroll Functionality
// ================================

document.addEventListener('DOMContentLoaded', function () {
    // Mobile-specific optimizations
    if (isMobile) {
        document.body.classList.add('is-mobile');
    }
    
    // Mobile Navigation Menu
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNavMenu = document.getElementById('mobileNavMenu');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    
    if (mobileMenuToggle && mobileNavMenu && closeMobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileNavMenu.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
        
        closeMobileMenu.addEventListener('click', function() {
            mobileNavMenu.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
        
        // Close menu when clicking on a link
        const navLinks = mobileNavMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
            
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileNavMenu.contains(event.target) && 
                !mobileMenuToggle.contains(event.target) && 
                mobileNavMenu.classList.contains('active')) {
                mobileNavMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
        
    // Smooth scroll for anchor links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]:not([href="#beta-form"]):not(.instant-scroll)');

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
    
    // Instant scroll for links that bypass sticky animations (like beta-form from mobile nav)
    const instantScrollLinks = document.querySelectorAll('.instant-scroll');
    
    instantScrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Instant jump - no smooth scroll behavior
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'instant'
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
    // Stacking Carousel - Desktop & Mobile
    // ================================
    const stackCards = Array.from(document.querySelectorAll('.stack-card'));
    const stackNextBtnDesktop = document.getElementById('stackNextBtnDesktop');
    const stackPrevBtnDesktop = document.getElementById('stackPrevBtnDesktop');
    const stackNextBtn = document.getElementById('stackNextBtn');
    const stackPrevBtn = document.getElementById('stackPrevBtn');
    const stackDots = document.querySelectorAll('.stack-dot');

    if (stackCards.length > 0) {
        const totalCards = stackCards.length;
        let currentIndex = 0;
        let isAnimating = false;
        
        // Initial setup
        updateStackPositions();
        updateNavigationState();

        // Desktop: Prev button
        if (stackPrevBtnDesktop) {
            stackPrevBtnDesktop.addEventListener('click', () => {
                if (!isAnimating && currentIndex > 0) {
                    goToCard(currentIndex - 1, 'prev');
                }
            });
        }
        
        // Desktop: Next button
        if (stackNextBtnDesktop) {
            stackNextBtnDesktop.addEventListener('click', () => {
                if (!isAnimating && currentIndex < totalCards - 1) {
                    goToCard(currentIndex + 1, 'next');
                }
            });
        }
        
        // Mobile: Next button
        if (stackNextBtn) {
            stackNextBtn.addEventListener('click', () => {
                if (!isAnimating && currentIndex < totalCards - 1) {
                    goToCard(currentIndex + 1, 'next');
                }
            });
        }
        
        // Mobile: Prev button
        if (stackPrevBtn) {
            stackPrevBtn.addEventListener('click', () => {
                if (!isAnimating && currentIndex > 0) {
                    goToCard(currentIndex - 1, 'prev');
                }
            });
        }
        
        // Dot click navigation
        stackDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (!isAnimating && index !== currentIndex) {
                    const direction = index > currentIndex ? 'next' : 'prev';
                    goToCard(index, direction);
                }
            });
        });
        
        // Swipe functionality
        let touchStartX = 0;
        let touchEndX = 0;
        
        const carouselContainer = document.querySelector('.stack-carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            carouselContainer.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });
        }
        
        function handleSwipe() {
            const swipeThreshold = 50;
            
            if (touchStartX - touchEndX > swipeThreshold) {
                // Swipe left - next card
                if (currentIndex < totalCards - 1) {
                    goToCard(currentIndex + 1, 'next');
                }
            } else if (touchEndX - touchStartX > swipeThreshold) {
                // Swipe right - previous card
                if (currentIndex > 0) {
                    goToCard(currentIndex - 1, 'prev');
                }
            }
        }
        
        // Unified card navigation for both desktop and mobile
        function goToCard(targetIndex, direction) {
            if (isAnimating) return;
            isAnimating = true;
            
            const currentCard = stackCards[currentIndex];
            const targetCard = stackCards[targetIndex];
            
            if (direction === 'next') {
                // Going forward: current card exits right, target rises from stack
                currentCard.classList.add('exit-right');
                
                setTimeout(() => {
                    currentCard.classList.remove('exit-right');
                    currentIndex = targetIndex;
                    updateStackPositions();
                    updateNavigationState();
                    isAnimating = false;
                }, 400);
            } else {
                // Going back: target card enters from right (where it exited to)
                // First update positions so target is in front but off-screen
                currentIndex = targetIndex;
                updateStackPositions();
                
                // Start target off-screen to the right
                targetCard.classList.add('enter-from-right');
                
                // Force reflow to ensure the class is applied
                void targetCard.offsetWidth;
                
                // Remove class to trigger animation back to position
                requestAnimationFrame(() => {
                    targetCard.classList.remove('enter-from-right');
                    targetCard.classList.add('entering');
                    
                    setTimeout(() => {
                        targetCard.classList.remove('entering');
                        updateNavigationState();
                        isAnimating = false;
                    }, 400);
                });
            }
        }

        function updateStackPositions() {
            stackCards.forEach((card, index) => {
                const pos = index - currentIndex;
                
                if (pos < 0) {
                    card.setAttribute('data-pos', '3');
                } else if (pos >= 0 && pos <= 3) {
                    card.setAttribute('data-pos', pos);
                } else {
                    card.setAttribute('data-pos', '3');
                }
            });
        }
        
        function updateNavigationState() {
            // Update dots
            stackDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
            
            // Update mobile button states
            if (stackPrevBtn) stackPrevBtn.disabled = currentIndex === 0;
            if (stackNextBtn) stackNextBtn.disabled = currentIndex === totalCards - 1;
            
            // Update desktop button states
            if (stackPrevBtnDesktop) stackPrevBtnDesktop.disabled = currentIndex === 0;
            if (stackNextBtnDesktop) stackNextBtnDesktop.disabled = currentIndex === totalCards - 1;
        }
    }

    // ================================
    // Console Message
    // ================================

    console.log('%c🚀 Startsphere Landing Page', 'font-size: 20px; font-weight: bold; color: #667eea;');
    console.log('%cThe digital trail for every team\'s effort', 'font-size: 14px; color: #6b7280;');
    console.log('%cInterested in beta testing? Click any "Join Beta Testing" button!', 'font-size: 12px; color: #764ba2;');

    // ================================
    // LAZY LOADING IMAGES
    // ================================
    
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Only load if data-src exists
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        
                        // Add loaded class for CSS transitions
                        img.classList.add('loaded');
                        
                        // Stop observing this image
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px', // Load 50px before entering viewport
            threshold: 0.01
        });
        
        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        // Load all images immediately
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }

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

// ================================
// Content Protection
// ================================

// Prevent right-click context menu
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// Prevent keyboard shortcuts for copying, saving, printing
document.addEventListener('keydown', function(e) {
    // Ctrl+C, Ctrl+X, Ctrl+V, Ctrl+S, Ctrl+P, Ctrl+A, Ctrl+U
    if (e.ctrlKey && (
        e.key === 'c' || e.key === 'C' ||
        e.key === 'x' || e.key === 'X' ||
        e.key === 'v' || e.key === 'V' ||
        e.key === 's' || e.key === 'S' ||
        e.key === 'p' || e.key === 'P' ||
        e.key === 'a' || e.key === 'A' ||
        e.key === 'u' || e.key === 'U'
    )) {
        e.preventDefault();
        return false;
    }
    // PrintScreen key
    if (e.key === 'PrintScreen') {
        e.preventDefault();
        return false;
    }
    // F12 Developer Tools
    if (e.key === 'F12') {
        e.preventDefault();
        return false;
    }
});

// Prevent drag and drop of images
document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getScrollPosition,
        isInViewport,
        scrollToElement
    };
}
