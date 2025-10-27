// SmartWings Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

function initializeContactPage() {
    // Initialize FAQ functionality
    initializeFAQ();
    
    // Initialize contact form
    initializeContactForm();
    
    console.log('Contact page initialized');
}

function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            toggleFAQ(this);
        });
    });
}

function toggleFAQ(questionElement) {
    const faqItem = questionElement.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const icon = questionElement.querySelector('i');
    
    // Close other open FAQs
    document.querySelectorAll('.faq-answer.active').forEach(openAnswer => {
        if (openAnswer !== answer) {
            openAnswer.classList.remove('active');
            const openIcon = openAnswer.parentElement.querySelector('.faq-question i');
            openIcon.classList.remove('fa-chevron-up');
            openIcon.classList.add('fa-chevron-down');
        }
    });
    
    // Toggle current FAQ
    answer.classList.toggle('active');
    
    if (answer.classList.contains('active')) {
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    } else {
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    }
}

function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', submitContactForm);
    }
    
    // Initialize form validation
    addRealTimeValidation();
}

function addRealTimeValidation() {
    const requiredFields = document.querySelectorAll('#contactForm [required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            // Remove error styling when user starts typing
            this.classList.remove('error');
            const errorMsg = this.parentElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    });
    
    // Email validation
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', function() {
            validateEmail(this);
        });
    }
    
    // Phone validation
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('blur', function() {
            validatePhone(this);
        });
    }
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    } else if (field.name === 'phone' && value && !isValidPhone(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
    } else if (field.name === 'firstName' || field.name === 'lastName') {
        if (value && value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters';
        } else if (value && !/^[a-zA-Z\s]+$/.test(value)) {
            isValid = false;
            errorMessage = 'Name can only contain letters and spaces';
        }
    }
    
    showFieldValidation(field, isValid, errorMessage);
    return isValid;
}

function validateEmail(emailField) {
    const email = emailField.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    if (email && !isValidEmail(email)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    }
    
    showFieldValidation(emailField, isValid, errorMessage);
    return isValid;
}

function validatePhone(phoneField) {
    const phone = phoneField.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    if (phone && !isValidPhone(phone)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number (e.g., +1-555-123-4567)';
    }
    
    showFieldValidation(phoneField, isValid, errorMessage);
    return isValid;
}

function showFieldValidation(field, isValid, errorMessage) {
    // Remove existing error message
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    if (!isValid) {
        field.classList.add('error');
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        `;
        
        field.parentElement.appendChild(errorDiv);
    } else {
        field.classList.remove('error');
        field.classList.add('valid');
    }
}

function submitContactForm(event) {
    event.preventDefault();
    
    if (!validateContactForm()) {
        return;
    }
    
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // Collect form data
    const formData = collectFormData();
    
    // Simulate form submission
    setTimeout(() => {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Generate reference ID
        const referenceId = generateReferenceId();
        
        // Show success message
        showSuccessModal(referenceId);
        
        // Reset form
        resetContactForm();
        
        // Log submission (in real app, send to server)
        console.log('Contact form submitted:', formData);
        
    }, 2000);
}

function validateContactForm() {
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Additional validations
    const emailField = document.getElementById('email');
    if (emailField && !validateEmail(emailField)) {
        isValid = false;
    }
    
    const phoneField = document.getElementById('phone');
    if (phoneField && phoneField.value.trim() && !validatePhone(phoneField)) {
        isValid = false;
    }
    
    if (!isValid) {
        showAlert('Please correct the errors in the form before submitting.', 'error');
        
        // Scroll to first error
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }
    
    return isValid;
}

function collectFormData() {
    const form = document.getElementById('contactForm');
    const data = {};
    
    const fields = [
        'firstName', 'lastName', 'email', 'phone', 
        'subject', 'bookingRef', 'message'
    ];
    
    fields.forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            data[fieldName] = field.value.trim();
        }
    });
    
    // Newsletter subscription
    const newsletterCheckbox = form.querySelector('[name="newsletter"]');
    data.newsletter = newsletterCheckbox ? newsletterCheckbox.checked : false;
    
    // Add timestamp
    data.timestamp = new Date().toISOString();
    
    return data;
}

function generateReferenceId() {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `SW-${timestamp}-${randomPart}`.toUpperCase();
}

function showSuccessModal(referenceId) {
    const modal = document.getElementById('successModal');
    const referenceElement = document.getElementById('referenceId');
    
    if (modal && referenceElement) {
        referenceElement.textContent = referenceId;
        modal.classList.add('active');
        
        // Auto-close after 10 seconds
        setTimeout(() => {
            closeModal();
        }, 10000);
    } else {
        // Fallback if modal elements not found
        showAlert(`Message sent successfully! Reference ID: ${referenceId}`, 'success');
    }
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function resetContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.reset();
        
        // Remove validation classes
        form.querySelectorAll('.error, .valid').forEach(field => {
            field.classList.remove('error', 'valid');
        });
        
        // Remove error messages
        form.querySelectorAll('.error-message').forEach(msg => {
            msg.remove();
        });
    }
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Check for valid formats:
    // - 10 digits (US domestic)
    // - 11 digits (with country code)
    // - International format with +
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone) && (digitsOnly.length >= 10);
}

function showAlert(message, type = 'info') {
    // Use the main.js showAlert function if available
    if (window.SmartWings && window.SmartWings.showAlert) {
        window.SmartWings.showAlert(message, type);
    } else {
        // Fallback alert
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
        `;
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            if (document.body.contains(alertDiv)) {
                document.body.removeChild(alertDiv);
            }
        }, 5000);
    }
}

// Contact card animations
function initializeContactCards() {
    const cards = document.querySelectorAll('.contact-card');
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach((card, index) => {
        // Initial state
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        
        observer.observe(card);
    });
}

// Phone number formatting
function initializePhoneFormatting() {
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0,3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6,10)}`;
                }
            }
            
            this.value = value;
        });
    }
}

// Character counter for message field
function initializeMessageCounter() {
    const messageField = document.getElementById('message');
    if (messageField) {
        const maxLength = 1000;
        
        // Create counter element
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.875rem;
            color: #64748b;
            margin-top: 0.25rem;
        `;
        
        messageField.parentElement.appendChild(counter);
        
        function updateCounter() {
            const remaining = maxLength - messageField.value.length;
            counter.textContent = `${remaining} characters remaining`;
            
            if (remaining < 50) {
                counter.style.color = '#ef4444';
            } else if (remaining < 100) {
                counter.style.color = '#f59e0b';
            } else {
                counter.style.color = '#64748b';
            }
        }
        
        messageField.addEventListener('input', updateCounter);
        messageField.maxLength = maxLength;
        updateCounter();
    }
}

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeContactCards();
        initializePhoneFormatting();
        initializeMessageCounter();
    }, 100);
});

// Handle modal click outside to close
document.addEventListener('click', function(event) {
    const modal = document.getElementById('successModal');
    if (modal && event.target === modal) {
        closeModal();
    }
});

// Keyboard support for modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Export functions for global access
window.ContactPage = {
    toggleFAQ,
    closeModal,
    submitContactForm,
    showAlert
};