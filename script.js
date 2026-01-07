// ================================
// Smooth Scroll Functionality
// ================================

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]:not([href="#beta-form"])');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
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
    const animateElements = document.querySelectorAll('.problem-card, .feature-card, .benefit-item, .audience-card');
    
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
        button.addEventListener('click', function() {
            // For now, just log. In production, send to analytics
            console.log('CTA clicked:', this.textContent.trim());
            
            // If it's a beta form link, you can add additional tracking here
            if (this.getAttribute('href') === '#beta-form') {
                console.log('Beta form CTA clicked - ready for Google Form integration');
                // TODO: Replace with actual Google Form URL
                // For now, show an alert
                setTimeout(() => {
                    alert('Beta testing form will be integrated here. Thank you for your interest in Startsphere!');
                }, 100);
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
    // Mobile Menu Toggle (if needed in future)
    // ================================
    
    // Placeholder for mobile navigation if header navigation is added
    
    // ================================
    // Form Validation (for when Google Form is integrated)
    // ================================
    
    // This is a placeholder for future form integration
    // When the Google Form is embedded, you can add validation here
    
    // ================================
    // Performance Optimization
    // ================================
    
    // Debounce function for scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Apply debounce to scroll handler if needed for performance
    const debouncedScroll = debounce(() => {
        // Additional scroll-based logic can go here
    }, 100);
    
    window.addEventListener('scroll', debouncedScroll);
    
    // ================================
    // Lazy Loading for Future Images
    // ================================
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        // Observe all images with data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
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
