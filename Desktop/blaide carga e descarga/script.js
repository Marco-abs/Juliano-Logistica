// Mobile Menu Toggle - Optimized
(function() {
    'use strict';
    
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!mobileMenu || !navMenu) return;
    
    // Toggle mobile menu
    mobileMenu.addEventListener('click', (e) => {
        e.preventDefault();
        const isActive = mobileMenu.classList.contains('active');
        
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
        mobileMenu.setAttribute('aria-expanded', !isActive);
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
            mobileMenu.setAttribute('aria-expanded', 'false');
        });
    });
})();

// Smooth scrolling for navigation links - Optimized
(function() {
    'use strict';
    
    const anchors = document.querySelectorAll('a[href^="#"]');
    if (!anchors.length) return;
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
})();

// Header scroll effect - Optimized with throttling
(function() {
    'use strict';
    
    let ticking = false;
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    function updateHeader() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#fff';
            header.style.backdropFilter = 'none';
        }
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
})();

// Contact Form Handling - Optimized
(function() {
    'use strict';
    
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    // Validation functions
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhone = (phone) => {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10 && cleanPhone.length <= 15;
    };
    
    // Real-time validation
    const emailField = contactForm.querySelector('#email');
    const phoneField = contactForm.querySelector('#phone');
    
    if (emailField) {
        emailField.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.style.borderColor = '#e74c3c';
                showFieldError(this, 'E-mail inválido');
            } else {
                this.style.borderColor = '#e0e0e0';
                hideFieldError(this);
            }
        });
    }
    
    if (phoneField) {
        phoneField.addEventListener('blur', function() {
            if (this.value && !validatePhone(this.value)) {
                this.style.borderColor = '#e74c3c';
                showFieldError(this, 'Telefone inválido');
            } else {
                this.style.borderColor = '#e0e0e0';
                hideFieldError(this);
            }
        });
    }
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const phone = formData.get('phone')?.trim();
        const message = formData.get('message')?.trim();
        
        // Validate form
        if (!name || !email || !phone || !message) {
            showNotification('Por favor, preencha todos os campos.', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showNotification('Por favor, insira um e-mail válido.', 'error');
            return;
        }
        
        if (!validatePhone(phone)) {
            showNotification('Por favor, insira um telefone válido.', 'error');
            return;
        }
        
        // Create WhatsApp message
        const whatsappMessage = `Olá! Gostaria de solicitar um orçamento.

*Dados do Cliente:*
Nome: ${name}
E-mail: ${email}
Telefone: ${phone}

*Mensagem:*
${message}

Aguardo retorno!`;
        
        // Encode message for URL
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappURL = `https://wa.me/5548996491352?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsappURL, '_blank', 'noopener,noreferrer');
        
        // Show success message
        showNotification('Redirecionando para o WhatsApp...', 'success');
        
        // Reset form
        this.reset();
    });
    
    // Helper functions
    function showFieldError(field, message) {
        hideFieldError(field);
        const error = document.createElement('div');
        error.className = 'field-error';
        error.textContent = message;
        error.style.cssText = 'color: #e74c3c; font-size: 0.9rem; margin-top: 5px;';
        field.parentNode.appendChild(error);
    }
    
    function hideFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
})();

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#25d366' : type === 'error' ? '#e74c3c' : '#2c5aa0'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Intersection Observer for animations
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

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .contact-item, .feature');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add loading animation to buttons
function addLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    button.disabled = true;
    
    return () => {
        button.innerHTML = originalText;
        button.disabled = false;
    };
}

// WhatsApp button click tracking
document.querySelectorAll('a[href*="wa.me"]').forEach(button => {
    button.addEventListener('click', () => {
        // You can add analytics tracking here if needed
        console.log('WhatsApp button clicked');
    });
});

// Form validation enhancement
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\(\)\-\+]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Real-time form validation
document.getElementById('email').addEventListener('blur', function() {
    if (this.value && !validateEmail(this.value)) {
        this.style.borderColor = '#e74c3c';
        showFieldError(this, 'E-mail inválido');
    } else {
        this.style.borderColor = '#e0e0e0';
        hideFieldError(this);
    }
});

document.getElementById('phone').addEventListener('blur', function() {
    if (this.value && !validatePhone(this.value)) {
        this.style.borderColor = '#e74c3c';
        showFieldError(this, 'Telefone inválido');
    } else {
        this.style.borderColor = '#e0e0e0';
        hideFieldError(this);
    }
});

function showFieldError(field, message) {
    hideFieldError(field);
    const error = document.createElement('div');
    error.className = 'field-error';
    error.textContent = message;
    error.style.cssText = 'color: #e74c3c; font-size: 0.9rem; margin-top: 5px;';
    field.parentNode.appendChild(error);
}

function hideFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Add smooth reveal animation for sections
const revealElements = document.querySelectorAll('.section-header, .about-content, .services-grid, .contact-content');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    revealObserver.observe(el);
});

// Add click-to-call functionality for phone numbers
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const phoneNumber = link.getAttribute('href').replace('tel:', '');
        window.open(`tel:${phoneNumber}`);
    });
});

console.log('Bleyd Cargas e Descargas - Site carregado com sucesso!');

