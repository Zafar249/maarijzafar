// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initSkillBars();
    initContactForm();
    initSmoothScrolling();
});

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Update active navigation link on scroll
    function updateActiveNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Listen for scroll events
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Set initial active link
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    let isMenuOpen = false;

    // Toggle mobile menu
    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        mobileMenu.classList.toggle('active', isMenuOpen);
        
        // Update icon
        const icon = mobileToggle.querySelector('i');
        icon.className = isMenuOpen ? 'fas fa-times' : 'fas fa-bars';
    }

    // Close mobile menu
    function closeMobileMenu() {
        isMenuOpen = false;
        mobileMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        icon.className = 'fas fa-bars';
    }

    // Event listeners
    mobileToggle.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking on nav links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (isMenuOpen && !mobileMenu.contains(event.target) && !mobileToggle.contains(event.target)) {
            closeMobileMenu();
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        // Add staggered delay
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe skill items
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(item);
    });
}

// Skill bars animation
function initSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.skill-progress');
                const width = progressBar.getAttribute('data-width');
                
                // Animate skill bar after a short delay
                setTimeout(() => {
                    progressBar.style.width = width + '%';
                }, 200);
                
                // Stop observing this element
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillItems.forEach(item => {
        skillObserver.observe(item);
    });
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    // Form validation
    function validateField(field) {
        const value = field.value.trim();
        const name = field.name;
        const errorElement = document.getElementById(`${name}-error`);
        
        // Clear previous error
        field.classList.remove('error');
        errorElement.textContent = '';

        // Validation rules
        if (!value) {
            showFieldError(field, errorElement, 'This field is required');
            return false;
        }

        if (name === 'email' && !isValidEmail(value)) {
            showFieldError(field, errorElement, 'Please enter a valid email address');
            return false;
        }

        return true;
    }

    function showFieldError(field, errorElement, message) {
        field.classList.add('error');
        errorElement.textContent = message;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Real-time validation
    const formInputs = form.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', () => validateField(input));
        
        // Clear error on input
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Validate all fields
        let isValid = true;
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showFormStatus('error', 'Please correct the errors above and try again.');
            return;
        }

        // Show loading state
        setSubmitButtonLoading(true);

        try {
            // Simulate form submission (replace with actual form handling)
            await simulateFormSubmission();
            
            // Show success message
            showFormStatus('success', 'Thank you! Your message has been sent successfully.');
            
            // Reset form
            form.reset();
            
        } catch (error) {
            showFormStatus('error', 'Sorry, there was an error sending your message. Please try again.');
        } finally {
            setSubmitButtonLoading(false);
            
            // Hide status message after 5 seconds
            setTimeout(() => {
                hideFormStatus();
            }, 5000);
        }
    });

    function setSubmitButtonLoading(loading) {
        const icon = submitBtn.querySelector('i');
        const text = submitBtn.querySelector('span');
        
        if (loading) {
            submitBtn.classList.add('btn-loading');
            submitBtn.disabled = true;
            icon.className = 'fas fa-spinner loading-spinner';
            text.textContent = 'Sending...';
        } else {
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
            icon.className = 'fas fa-paper-plane';
            text.textContent = 'Send Message';
        }
    }

    function showFormStatus(type, message) {
        formStatus.className = `form-status ${type}`;
        formStatus.textContent = message;
    }

    function hideFormStatus() {
        formStatus.className = 'form-status';
        formStatus.textContent = '';
    }

    // Simulate form submission (replace with actual implementation)
    function simulateFormSubmission() {
        return new Promise((resolve) => {
            setTimeout(resolve, 1500);
        });
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility functions
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

// Performance optimization for scroll events
const optimizedScrollHandler = debounce(function() {
    // Handle scroll-based functionality here if needed
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.98)';
    } else {
        navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
    }
});

// Add loading class to body until everything is ready
document.body.classList.add('loading');

window.addEventListener('load', function() {
    document.body.classList.remove('loading');
    
    // Trigger initial animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 0.6s ease-out forwards';
    }
});

// Handle resize events
window.addEventListener('resize', debounce(function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth >= 768) {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileToggle = document.getElementById('mobile-toggle');
        
        mobileMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        icon.className = 'fas fa-bars';
    }
}, 250));

// Keyboard navigation support
document.addEventListener('keydown', function(event) {
    // Close mobile menu on escape key
    if (event.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu.classList.contains('active')) {
            const mobileToggle = document.getElementById('mobile-toggle');
            mobileMenu.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            icon.className = 'fas fa-bars';
        }
    }
});

// Add focus management for accessibility
function initAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#home';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #3b82f6;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Manage focus for mobile menu
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileToggle.addEventListener('click', function() {
        setTimeout(() => {
            if (mobileMenu.classList.contains('active')) {
                const firstLink = mobileMenu.querySelector('.mobile-nav-link');
                if (firstLink) firstLink.focus();
            }
        }, 100);
    });
}

// Initialize accessibility features
initAccessibility();

// Console welcome message
console.log(`
🚀 Maarij Zafar's Portfolio Website
Built with HTML, CSS, and JavaScript
Contact: zafarmaarij@gmail.com
`);