// Main JavaScript for both pages

// Exit intent popup
let exitIntentShown = false;

function initExitIntent() {
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0 && !exitIntentShown) {
            showExitPopup();
            exitIntentShown = true;
        }
    });
}

function showExitPopup() {
    const popup = document.getElementById('exitPopup');
    if (popup) {
        popup.style.display = 'flex';
    }
}

function closePopup() {
    const popup = document.getElementById('exitPopup');
    if (popup) {
        popup.style.display = 'none';
    }
}

// Get checklist from popup
function getChecklist() {
    const email = document.getElementById('popupEmail').value;
    
    if (!validateEmail(email)) {
        showError('Введите корректный email');
        return;
    }
    
    // Send email (mock)
    console.log('Sending checklist to:', email);
    showSuccess('Чек-лист отправлен на ваш email!');
    
    // Close popup
    closePopup();
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Lazy loading images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Animate on scroll
function initAnimateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(el => elementObserver.observe(el));
}

// Phone mask
function initPhoneMask() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            if (value.length > 0) {
                if (value[0] === '7' || value[0] === '8') {
                    value = '7' + value.slice(1);
                } else if (value[0] !== '7') {
                    value = '7' + value;
                }
                
                if (value.length >= 1) {
                    formattedValue = '+' + value.slice(0, 1);
                }
                if (value.length >= 2) {
                    formattedValue += ' (' + value.slice(1, 4);
                }
                if (value.length >= 5) {
                    formattedValue += ') ' + value.slice(4, 7);
                }
                if (value.length >= 8) {
                    formattedValue += '-' + value.slice(7, 9);
                }
                if (value.length >= 10) {
                    formattedValue += '-' + value.slice(9, 11);
                }
            }
            
            e.target.value = formattedValue;
        });
    });
}

// Sticky navigation
function initStickyNav() {
    const nav = document.querySelector('.navigation');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            nav.classList.add('scrolled');
            
            if (scrollTop > lastScrollTop) {
                // Scrolling down
                nav.classList.add('hidden');
            } else {
                // Scrolling up
                nav.classList.remove('hidden');
            }
        } else {
            nav.classList.remove('scrolled', 'hidden');
        }
        
        lastScrollTop = scrollTop;
    });
}

// Preloader
function initPreloader() {
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 300);
            }, 500);
        }
    });
}

// Dynamic counter animation
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Initialize counters when visible
function initCounters() {
    const counters = document.querySelectorAll('.counter-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const target = parseInt(entry.target.textContent);
                animateCounter(entry.target, target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// Create placeholder images (for demo)
function createPlaceholderImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        if (!img.complete || img.naturalHeight === 0) {
            // Create placeholder based on image name
            const src = img.src || img.getAttribute('src');
            if (src && src.includes('.svg')) {
                // Create SVG placeholder
                createSVGPlaceholder(img);
            } else {
                // Create image placeholder
                img.src = `https://via.placeholder.com/400x400/9F7AEA/FFFFFF?text=${encodeURIComponent(img.alt || 'Image')}`;
            }
        }
    });
}

// Create SVG placeholders for animal icons
function createSVGPlaceholder(img) {
    const animals = {
        'lion.svg': '🦁',
        'colibri.svg': '🐦',
        'owl.svg': '🦉',
        'dolphin.svg': '🐬',
        'eagle.svg': '🦅',
        'cat.svg': '🐱',
        'arrow-transform.svg': '➡️',
        'whatsapp.svg': '💬'
    };
    
    const filename = img.src.split('/').pop();
    const emoji = animals[filename] || '📷';
    
    // Create a data URL with emoji
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="#f0f0f0" rx="10"/>
            <text x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
        </svg>
    `;
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svg);
}

// Track scroll depth
function trackScrollDepth() {
    const depths = [25, 50, 75, 100];
    const tracked = new Set();
    
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.pageYOffset / scrollHeight) * 100;
        
        depths.forEach(depth => {
            if (scrolled >= depth && !tracked.has(depth)) {
                tracked.add(depth);
                console.log(`Scrolled ${depth}%`);
                
                // Track in analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll_depth', {
                        'event_category': 'engagement',
                        'event_label': `${depth}%`
                    });
                }
            }
        });
    });
}

// Initialize all functions
document.addEventListener('DOMContentLoaded', () => {
    initExitIntent();
    initSmoothScroll();
    initLazyLoading();
    initAnimateOnScroll();
    initPhoneMask();
    initStickyNav();
    initCounters();
    createPlaceholderImages();
    trackScrollDepth();
});

// Add navigation styles
const navStyle = document.createElement('style');
navStyle.textContent = `
    .navigation.scrolled {
        padding: 10px 0;
        background-color: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(10px);
    }
    
    .navigation.hidden {
        transform: translateY(-100%);
    }
    
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }
    
    .animate-on-scroll.animated {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(navStyle);

// Utility function exports
window.validateEmail = function(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

window.validatePhone = function(phone) {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
};

window.showError = function(message) {
    const toast = document.createElement('div');
    toast.className = 'toast error';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
};

window.showSuccess = function(message) {
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}; 