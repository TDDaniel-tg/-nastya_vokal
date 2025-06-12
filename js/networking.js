// Networking Page JavaScript

// Scroll to form
function scrollToForm() {
    document.getElementById('form').scrollIntoView({ behavior: 'smooth' });
}

// Select tariff
function selectTariff(type) {
    // Save selected tariff
    localStorage.setItem('selectedTariff', type);
    
    // Scroll to form
    scrollToForm();
    
    // Highlight selected tariff in form
    const formTitle = document.querySelector('.final-left h2');
    if (type === 'vip') {
        formTitle.textContent = 'Начните зарабатывать голосом через 21 день (VIP)';
    }
}

// Play video testimonial
function playVideo(videoId) {
    // In real implementation, this would open a video modal
    console.log('Playing video:', videoId);
    
    // Create video modal
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-modal-content">
            <button class="video-close" onclick="closeVideoModal()">×</button>
            <iframe width="560" height="315" 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Close video modal
function closeVideoModal() {
    const modal = document.querySelector('.video-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Show all reviews
function showAllReviews() {
    // In real implementation, this would load more reviews
    alert('Здесь будут показаны все отзывы');
}

// Get guide from exit popup
function getGuide() {
    const email = document.getElementById('popupEmail').value;
    
    if (!validateEmail(email)) {
        showError('Введите корректный email');
        return;
    }
    
    // Send email (mock)
    console.log('Sending guide to:', email);
    showSuccess('Гайд отправлен на ваш email!');
    
    // Close popup
    closePopup();
}

// Close modal
function closeModal() {
    const modal = document.getElementById('roiModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ROI Calculator
function initROICalculator() {
    const inputs = ['avgCheck', 'speechCount', 'conversion'];
    
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', calculateROI);
        }
    });
    
    // Initial calculation
    calculateROI();
}

function calculateROI() {
    const avgCheck = parseInt(document.getElementById('avgCheck').value) || 50000;
    const speechCount = parseInt(document.getElementById('speechCount').value) || 4;
    const conversion = parseInt(document.getElementById('conversion').value) || 10;
    
    // Calculate potential income
    const clientsPerMonth = speechCount * (conversion / 100);
    const monthlyIncome = clientsPerMonth * avgCheck;
    
    // Update result
    const resultElement = document.getElementById('roiResult');
    if (resultElement) {
        resultElement.textContent = formatMoney(monthlyIncome);
    }
}

// Format money
function formatMoney(amount) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Form submission
function initForm() {
    const form = document.getElementById('diagnosticForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateFormData(data)) {
        return;
    }
    
    // Add selected tariff
    data.tariff = localStorage.getItem('selectedTariff') || 'online';
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Отправка...';
    submitButton.disabled = true;
    
    try {
        // Send data (mock API call)
        await sendFormData(data);
        
        // Show success message
        showSuccess('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
        
        // Reset form
        e.target.reset();
        
        // Track conversion
        trackConversion('diagnostic_form', data);
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showError('Произошла ошибка. Попробуйте еще раз.');
    } finally {
        // Restore button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Validate form data
function validateFormData(data) {
    if (!data.name || data.name.trim().length < 2) {
        showError('Введите ваше имя');
        return false;
    }
    
    if (!data.phone || !validatePhone(data.phone)) {
        showError('Введите корректный телефон');
        return false;
    }
    
    if (!data.time) {
        showError('Выберите удобное время звонка');
        return false;
    }
    
    return true;
}

// Mock API call
async function sendFormData(data) {
    return new Promise((resolve) => {
        setTimeout(resolve, 1500);
    });
}

// Track conversion
function trackConversion(event, data) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', event, {
            'event_category': 'form',
            'event_label': data.tariff
        });
    }
    
    // Yandex Metrika
    if (typeof ym !== 'undefined') {
        ym(12345678, 'reachGoal', event);
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead');
    }
}

// Floating banner
function initFloatingBanner() {
    let lastScrollTop = 0;
    const banner = document.getElementById('floatingBanner');
    
    if (!banner) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show banner when scrolling down past 500px
        if (scrollTop > 500 && scrollTop > lastScrollTop) {
            banner.style.display = 'block';
            setTimeout(() => {
                banner.classList.add('show');
            }, 10);
        }
        
        // Hide when scrolling up
        if (scrollTop < lastScrollTop && banner.classList.contains('show')) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.style.display = 'none';
            }, 300);
        }
        
        lastScrollTop = scrollTop;
    });
}

// Open ROI Calculator
function openROICalculator() {
    const modal = document.getElementById('roiModal');
    if (modal) {
        modal.style.display = 'flex';
        initROICalculator();
    }
}

// Add calculator button
function addCalculatorButton() {
    const pricingSection = document.querySelector('.pricing');
    if (pricingSection) {
        const button = document.createElement('button');
        button.className = 'calculator-button';
        button.textContent = '🧮 Рассчитать ROI';
        button.onclick = openROICalculator;
        
        const container = pricingSection.querySelector('.container');
        container.appendChild(button);
    }
}

// Utility functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
}

function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'toast error';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function showSuccess(message) {
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initForm();
    initFloatingBanner();
    addCalculatorButton();
});

// Add styles for video modal
const style = document.createElement('style');
style.textContent = `
    .video-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.9);
        z-index: 3000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .video-modal.show {
        opacity: 1;
    }
    
    .video-modal-content {
        position: relative;
        width: 90%;
        max-width: 800px;
    }
    
    .video-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        font-size: 40px;
        color: white;
        cursor: pointer;
    }
    
    .video-modal iframe {
        width: 100%;
        height: 450px;
        border-radius: 10px;
    }
    
    .calculator-button {
        display: block;
        margin: 40px auto 0;
        padding: 15px 30px;
        background-color: var(--gold-accent);
        color: white;
        border: none;
        border-radius: 50px;
        font-weight: 600;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .calculator-button:hover {
        background-color: var(--gold-hover);
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
    }
    
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    }
    
    .toast.error {
        background-color: #FF5252;
    }
    
    .toast.success {
        background-color: #4CAF50;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 