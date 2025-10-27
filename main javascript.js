// SmartWings Airline Management System - Main JavaScript

// Global variables
let currentUser = null;
let flightStatusData = [];
let chatbotActive = false;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    // Set minimum date for booking forms
    setMinimumDates();
    
    // Initialize mobile navigation
    initializeMobileNav();
    
    // Initialize flight status
    initializeFlightStatus();
    
    // Initialize chatbot
    initializeChatbot();
    
    // Initialize smooth scrolling
    initializeSmoothScroll();
    
    // Initialize form validations
    initializeFormValidation();
    
    console.log('SmartWings application initialized successfully!');
}

// Set minimum dates for date inputs
function setMinimumDates() {
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    
    dateInputs.forEach(input => {
        input.setAttribute('min', today);
    });
}

// Mobile Navigation
function initializeMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

// Flight Status Functionality
function initializeFlightStatus() {
    // Mock flight data
    flightStatusData = [
        {
            flight: 'SW101',
            route: 'NYC → LAX',
            status: 'on-time',
            time: '10:30 AM',
            gate: 'A12',
            terminal: '1'
        },
        {
            flight: 'SW102',
            route: 'LAX → CHI',
            status: 'delayed',
            time: '2:15 PM',
            gate: 'B8',
            terminal: '2'
        },
        {
            flight: 'SW103',
            route: 'CHI → MIA',
            status: 'on-time',
            time: '4:45 PM',
            gate: 'C5',
            terminal: '1'
        },
        {
            flight: 'SW104',
            route: 'MIA → SEA',
            status: 'cancelled',
            time: '7:20 PM',
            gate: 'D3',
            terminal: '2'
        },
        {
            flight: 'SW105',
            route: 'SEA → SFO',
            status: 'on-time',
            time: '9:10 PM',
            gate: 'E7',
            terminal: '3'
        }
    ];
    
    updateFlightStatusDisplay();
    
    // Update flight status every 30 seconds
    setInterval(updateFlightStatusDisplay, 30000);
}

function updateFlightStatusDisplay() {
    const statusList = document.getElementById('statusList');
    if (!statusList) return;
    
    statusList.innerHTML = '';
    
    flightStatusData.forEach(flight => {
        const statusItem = document.createElement('div');
        statusItem.className = 'status-item';
        
        const statusClass = `status-${flight.status.replace('-', '-')}`;
        
        statusItem.innerHTML = `
            <span class="flight-number">${flight.flight}</span>
            <span class="flight-route">${flight.route}</span>
            <span class="status-badge ${statusClass}">${flight.status.replace('-', ' ').toUpperCase()}</span>
            <span class="flight-time">${flight.time}</span>
        `;
        
        statusList.appendChild(statusItem);
    });
}

// Booking Form Functions
function showBookingForm() {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function showFlightStatus() {
    const statusSection = document.getElementById('status');
    if (statusSection) {
        statusSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Form Validation
function initializeFormValidation() {
    // Booking form validation
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateBookingForm()) {
                // Redirect to full booking page
                window.location.href = 'frontend/pages/booking.html';
            }
        });
    }
}

function validateBookingForm() {
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const departure = document.getElementById('departure').value;
    const passengers = document.getElementById('passengers').value;
    const travelClass = document.getElementById('class').value;
    
    // Basic validation
    if (!from || !to || !departure || !passengers || !travelClass) {
        showAlert('Please fill in all required fields.', 'error');
        return false;
    }
    
    if (from === to) {
        showAlert('Origin and destination cannot be the same.', 'error');
        return false;
    }
    
    // Date validation
    const today = new Date();
    const departureDate = new Date(departure);
    
    if (departureDate < today) {
        showAlert('Departure date cannot be in the past.', 'error');
        return false;
    }
    
    return true;
}

// Chatbot Functionality
function initializeChatbot() {
    const chatbotToggle = document.getElementById('openChatbot');
    const chatbot = document.getElementById('chatbot');
    const closeChatbot = document.getElementById('closeChatbot');
    const sendMessage = document.getElementById('sendMessage');
    const chatbotInput = document.getElementById('chatbotInput');
    
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', function() {
            if (chatbot) {
                chatbot.classList.add('active');
                chatbotActive = true;
            }
        });
    }
    
    if (closeChatbot) {
        closeChatbot.addEventListener('click', function() {
            if (chatbot) {
                chatbot.classList.remove('active');
                chatbotActive = false;
            }
        });
    }
    
    if (sendMessage && chatbotInput) {
        sendMessage.addEventListener('click', sendChatMessage);
        
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatbotInput');
    const messagesContainer = document.getElementById('chatbotMessages');
    
    if (!input || !messagesContainer) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    
    // Clear input
    input.value = '';
    
    // Simulate bot response after delay
    setTimeout(() => {
        const botResponse = generateBotResponse(message);
        addChatMessage(botResponse, 'bot');
    }, 1000);
}

function addChatMessage(message, type) {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateBotResponse(userMessage) {
    const responses = {
        'hello': 'Hello! Welcome to SmartWings. How can I assist you with your travel plans today?',
        'help': 'I can help you with flight bookings, check flight status, answer questions about our services, or connect you with customer support.',
        'book': 'I\'d be happy to help you book a flight! Please use our booking form above or visit our booking page for detailed search options.',
        'status': 'You can check real-time flight status in the Flight Status section above, or provide me with your flight number.',
        'cancel': 'For flight cancellations, please visit your booking management page or contact our customer service at +1 (555) 123-4567.',
        'baggage': 'Our baggage policy allows one carry-on bag for free. Checked baggage fees start at $30 for the first bag. Weight limit is 50lbs.',
        'contact': 'You can reach us at +1 (555) 123-4567 or email support@smartwings.com. We\'re available 24/7 for assistance.',
        'default': 'Thank you for your message. For complex inquiries, please contact our customer support team at +1 (555) 123-4567 or visit our contact page.'
    };
    
    const message = userMessage.toLowerCase();
    
    // Simple keyword matching
    for (const keyword in responses) {
        if (message.includes(keyword)) {
            return responses[keyword];
        }
    }
    
    return responses.default;
}

// Smooth Scrolling
function initializeSmoothScroll() {
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

// Utility Functions
function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        font-weight: 500;
        max-width: 300px;
        word-wrap: break-word;
        animation: slideIn 0.3s ease-out;
    `;
    
    alert.textContent = message;
    
    // Add to document
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (document.body.contains(alert)) {
                document.body.removeChild(alert);
            }
        }, 300);
    }, 5000);
}

// Add CSS animations for alerts
const style = document.createElement('style');
style.textContent = `
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
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format time
function formatTime(timeString) {
    const time = new Date(`2024-01-01 ${timeString}`);
    return time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Local Storage Helpers
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
    }
}

// Session Management
function setCurrentUser(userData) {
    currentUser = userData;
    saveToLocalStorage('currentUser', userData);
    updateUserInterface();
}

function getCurrentUser() {
    if (!currentUser) {
        currentUser = loadFromLocalStorage('currentUser');
    }
    return currentUser;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserInterface();
    window.location.href = 'index.html';
}

function updateUserInterface() {
    const user = getCurrentUser();
    const loginBtn = document.querySelector('.login-btn');
    
    if (user && loginBtn) {
        loginBtn.textContent = `Welcome, ${user.name}`;
        loginBtn.href = '#';
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showUserMenu();
        });
    }
}

function showUserMenu() {
    // Implementation for user menu dropdown
    console.log('User menu would be shown here');
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showAlert('An unexpected error occurred. Please refresh the page.', 'error');
});

// Performance Monitoring
window.addEventListener('load', function() {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
});

// Export functions for use in other modules
window.SmartWings = {
    showAlert,
    formatCurrency,
    formatDate,
    formatTime,
    setCurrentUser,
    getCurrentUser,
    logout,
    showBookingForm,
    showFlightStatus
};