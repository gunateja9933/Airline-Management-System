// SmartWings Booking System JavaScript

let currentStep = 1;
let bookingData = {
    searchParams: {},
    selectedFlight: null,
    passengers: [],
    paymentInfo: {},
    confirmationCode: null
};

let mockFlights = [
    {
        id: 'SW101-001',
        flightNumber: 'SW101',
        airline: 'SmartWings',
        departure: { airport: 'JFK', city: 'New York', time: '08:30', gate: 'A12' },
        arrival: { airport: 'LAX', city: 'Los Angeles', time: '11:45', gate: 'B15' },
        duration: '5h 15m',
        price: { economy: 299, business: 799, first: 1299 },
        seats: { economy: 45, business: 12, first: 4 },
        aircraft: 'Boeing 737-800'
    },
    {
        id: 'SW102-001',
        flightNumber: 'SW102',
        airline: 'SmartWings',
        departure: { airport: 'JFK', city: 'New York', time: '14:20', gate: 'C8' },
        arrival: { airport: 'LAX', city: 'Los Angeles', time: '17:55', gate: 'A7' },
        duration: '5h 35m',
        price: { economy: 349, business: 899, first: 1399 },
        seats: { economy: 28, business: 8, first: 2 },
        aircraft: 'Airbus A321'
    },
    {
        id: 'SW103-001',
        flightNumber: 'SW103',
        airline: 'SmartWings',
        departure: { airport: 'JFK', city: 'New York', time: '19:15', gate: 'D4' },
        arrival: { airport: 'LAX', city: 'Los Angeles', time: '22:30', gate: 'C12' },
        duration: '5h 15m',
        price: { economy: 279, business: 749, first: 1199 },
        seats: { economy: 52, business: 15, first: 6 },
        aircraft: 'Boeing 777-200'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    initializeBooking();
});

function initializeBooking() {
    // Set minimum dates
    setMinimumDates();
    
    // Initialize trip type handlers
    initializeTripType();
    
    // Initialize passenger counters
    initializeCounters();
    
    // Set today's date as default
    setDefaultDates();
    
    console.log('Booking system initialized');
}

function setMinimumDates() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('departDate').min = today;
    document.getElementById('returnDate').min = today;
}

function setDefaultDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    document.getElementById('departDate').value = today.toISOString().split('T')[0];
    document.getElementById('returnDate').value = tomorrow.toISOString().split('T')[0];
}

function initializeTripType() {
    const tripTypeRadios = document.querySelectorAll('input[name="tripType"]');
    const returnDateGroup = document.getElementById('returnDateGroup');
    
    tripTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'oneway') {
                returnDateGroup.style.display = 'none';
                document.getElementById('returnDate').required = false;
            } else {
                returnDateGroup.style.display = 'block';
                document.getElementById('returnDate').required = true;
            }
        });
    });
}

function initializeCounters() {
    // Initialize counter values
    updateCounterDisplay('adults', 1);
    updateCounterDisplay('children', 0);
    updateCounterDisplay('infants', 0);
}

function swapCities() {
    const fromSelect = document.getElementById('fromCity');
    const toSelect = document.getElementById('toCity');
    
    const fromValue = fromSelect.value;
    const toValue = toSelect.value;
    
    fromSelect.value = toValue;
    toSelect.value = fromValue;
}

function updateCounter(type, delta) {
    const countElement = document.getElementById(type + 'Count');
    let currentCount = parseInt(countElement.textContent);
    let newCount = currentCount + delta;
    
    // Validation
    if (type === 'adults' && newCount < 1) return;
    if (newCount < 0) return;
    if (type === 'infants' && newCount > parseInt(document.getElementById('adultsCount').textContent)) {
        alert('Number of infants cannot exceed number of adults');
        return;
    }
    
    updateCounterDisplay(type, newCount);
}

function updateCounterDisplay(type, count) {
    document.getElementById(type + 'Count').textContent = count;
}

function searchFlights(event) {
    event.preventDefault();
    
    if (!validateSearchForm()) {
        return;
    }
    
    // Collect search parameters
    bookingData.searchParams = {
        from: document.getElementById('fromCity').value,
        to: document.getElementById('toCity').value,
        departure: document.getElementById('departDate').value,
        return: document.getElementById('returnDate').value,
        adults: parseInt(document.getElementById('adultsCount').textContent),
        children: parseInt(document.getElementById('childrenCount').textContent),
        infants: parseInt(document.getElementById('infantsCount').textContent),
        class: document.getElementById('travelClass').value,
        tripType: document.querySelector('input[name=\"tripType\"]:checked').value
    };
    
    // Show loading
    showLoadingSpinner('Searching for flights...');
    
    // Simulate API call delay
    setTimeout(() => {
        hideLoadingSpinner();
        displayFlightResults();
        nextStep();
    }, 2000);
}

function validateSearchForm() {
    const from = document.getElementById('fromCity').value;
    const to = document.getElementById('toCity').value;
    const departure = document.getElementById('departDate').value;
    
    if (!from || !to || !departure) {
        showAlert('Please fill in all required fields', 'error');
        return false;
    }
    
    if (from === to) {
        showAlert('Origin and destination cannot be the same', 'error');
        return false;
    }
    
    const departureDate = new Date(departure);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (departureDate < today) {
        showAlert('Departure date cannot be in the past', 'error');
        return false;
    }
    
    return true;
}

function displayFlightResults() {
    const resultsContainer = document.getElementById('flightResults');
    resultsContainer.innerHTML = '';
    
    mockFlights.forEach(flight => {
        const flightCard = createFlightCard(flight);
        resultsContainer.appendChild(flightCard);
    });
}

function createFlightCard(flight) {
    const card = document.createElement('div');
    card.className = 'flight-card';
    
    const selectedClass = bookingData.searchParams.class;
    const price = flight.price[selectedClass];
    const availableSeats = flight.seats[selectedClass];
    
    card.innerHTML = `
        <div class="flight-info">
            <div class="flight-header">
                <h3>${flight.flightNumber}</h3>
                <span class="aircraft">${flight.aircraft}</span>
            </div>
            
            <div class="flight-route">
                <div class="departure">
                    <div class="time">${flight.departure.time}</div>
                    <div class="airport">${flight.departure.airport}</div>
                    <div class="city">${flight.departure.city}</div>
                </div>
                
                <div class="flight-duration">
                    <div class="duration">${flight.duration}</div>
                    <div class="line"></div>
                </div>
                
                <div class="arrival">
                    <div class="time">${flight.arrival.time}</div>
                    <div class="airport">${flight.arrival.airport}</div>
                    <div class="city">${flight.arrival.city}</div>
                </div>
            </div>
            
            <div class="flight-details">
                <div class="price">
                    <span class="amount">$${price}</span>
                    <span class="per-person">per person</span>
                </div>
                <div class="seats-available">${availableSeats} seats left</div>
            </div>
        </div>
        
        <button class="btn btn-primary select-flight-btn" onclick="selectFlight('${flight.id}')">
            Select Flight
        </button>
    `;
    
    return card;
}

function selectFlight(flightId) {
    bookingData.selectedFlight = mockFlights.find(f => f.id === flightId);
    
    if (!bookingData.selectedFlight) {
        showAlert('Flight not found', 'error');
        return;
    }
    
    showAlert('Flight selected successfully', 'success');
    generatePassengerForms();
    nextStep();
}

function generatePassengerForms() {
    const container = document.getElementById('passengerForms');
    container.innerHTML = '';
    
    const totalPassengers = bookingData.searchParams.adults + 
                           bookingData.searchParams.children + 
                           bookingData.searchParams.infants;
    
    for (let i = 0; i < totalPassengers; i++) {
        let passengerType = '';
        if (i < bookingData.searchParams.adults) {
            passengerType = 'Adult';
        } else if (i < bookingData.searchParams.adults + bookingData.searchParams.children) {
            passengerType = 'Child';
        } else {
            passengerType = 'Infant';
        }
        
        const form = createPassengerForm(i + 1, passengerType);
        container.appendChild(form);
    }
}

function createPassengerForm(index, type) {
    const form = document.createElement('div');
    form.className = 'passenger-form';
    
    form.innerHTML = `
        <h3>Passenger ${index} - ${type}</h3>
        <div class="form-row">
            <div class="form-group">
                <label for="passenger${index}_title">Title</label>
                <select id="passenger${index}_title" name="title" required>
                    <option value="">Select Title</option>
                    <option value="mr">Mr.</option>
                    <option value="mrs">Mrs.</option>
                    <option value="ms">Ms.</option>
                    <option value="dr">Dr.</option>
                </select>
            </div>
            <div class="form-group">
                <label for="passenger${index}_firstName">First Name</label>
                <input type="text" id="passenger${index}_firstName" name="firstName" required>
            </div>
            <div class="form-group">
                <label for="passenger${index}_lastName">Last Name</label>
                <input type="text" id="passenger${index}_lastName" name="lastName" required>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label for="passenger${index}_dob">Date of Birth</label>
                <input type="date" id="passenger${index}_dob" name="dob" required>
            </div>
            <div class="form-group">
                <label for="passenger${index}_gender">Gender</label>
                <select id="passenger${index}_gender" name="gender" required>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="passenger${index}_nationality">Nationality</label>
                <select id="passenger${index}_nationality" name="nationality" required>
                    <option value="">Select Nationality</option>
                    <option value="us">United States</option>
                    <option value="ca">Canada</option>
                    <option value="mx">Mexico</option>
                    <option value="uk">United Kingdom</option>
                    <option value="de">Germany</option>
                </select>
            </div>
        </div>
        
        ${type !== 'Infant' ? `
        <div class="form-row">
            <div class="form-group">
                <label for="passenger${index}_passport">Passport Number</label>
                <input type="text" id="passenger${index}_passport" name="passport" required>
            </div>
            <div class="form-group">
                <label for="passenger${index}_passportExpiry">Passport Expiry</label>
                <input type="date" id="passenger${index}_passportExpiry" name="passportExpiry" required>
            </div>
        </div>
        ` : ''}
        
        <div class="special-requests">
            <h4>Special Requests</h4>
            <div class="checkbox-group">
                <label><input type="checkbox" name="wheelchair"> Wheelchair Assistance</label>
                <label><input type="checkbox" name="meal_vegetarian"> Vegetarian Meal</label>
                <label><input type="checkbox" name="meal_vegan"> Vegan Meal</label>
                <label><input type="checkbox" name="meal_kosher"> Kosher Meal</label>
                <label><input type="checkbox" name="seat_extra_legroom"> Extra Legroom Seat (+$50)</label>
            </div>
        </div>
    `;
    
    return form;
}

function nextStep() {
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
    
    // Move to next step
    currentStep++;
    
    // Show next step
    document.getElementById(`step${currentStep}`).classList.add('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
    
    // Special handling for payment step
    if (currentStep === 4) {
        generateBookingSummary();
    }
}

function generateBookingSummary() {
    const summaryContainer = document.getElementById('bookingSummary');
    const flight = bookingData.selectedFlight;
    const params = bookingData.searchParams;
    
    const selectedClass = params.class;
    const price = flight.price[selectedClass];
    const totalPassengers = params.adults + params.children + params.infants;
    const totalPrice = price * totalPassengers;
    const taxes = Math.round(totalPrice * 0.15);
    const finalTotal = totalPrice + taxes;
    
    summaryContainer.innerHTML = `
        <div class="summary-item">
            <h4>Flight Details</h4>
            <p><strong>Flight:</strong> ${flight.flightNumber}</p>
            <p><strong>Route:</strong> ${flight.departure.city} → ${flight.arrival.city}</p>
            <p><strong>Date:</strong> ${formatDate(params.departure)}</p>
            <p><strong>Time:</strong> ${flight.departure.time} - ${flight.arrival.time}</p>
            <p><strong>Class:</strong> ${selectedClass.charAt(0).toUpperCase() + selectedClass.slice(1)}</p>
        </div>
        
        <div class="summary-item">
            <h4>Passengers</h4>
            <p>Adults: ${params.adults}</p>
            ${params.children > 0 ? `<p>Children: ${params.children}</p>` : ''}
            ${params.infants > 0 ? `<p>Infants: ${params.infants}</p>` : ''}
        </div>
        
        <div class="summary-item pricing">
            <h4>Price Breakdown</h4>
            <div class="price-row">
                <span>Base Fare (${totalPassengers} passengers)</span>
                <span>$${totalPrice}</span>
            </div>
            <div class="price-row">
                <span>Taxes & Fees</span>
                <span>$${taxes}</span>
            </div>
            <div class="price-row total">
                <span><strong>Total Amount</strong></span>
                <span><strong>$${finalTotal}</strong></span>
            </div>
        </div>
    `;
    
    bookingData.totalAmount = finalTotal;
}

function processPayment(event) {
    event.preventDefault();
    
    if (!validatePaymentForm()) {
        return;
    }
    
    showLoadingSpinner('Processing payment...');
    
    // Simulate payment processing
    setTimeout(() => {
        hideLoadingSpinner();
        
        // Generate confirmation
        bookingData.confirmationCode = generateConfirmationCode();
        
        showAlert('Payment successful!', 'success');
        generateConfirmationDetails();
        generateQRCode();
        nextStep();
    }, 3000);
}

function validatePaymentForm() {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const cardName = document.getElementById('cardName').value;
    
    if (!cardNumber || cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
        showAlert('Please enter a valid 16-digit card number', 'error');
        return false;
    }
    
    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
        showAlert('Please enter expiry date in MM/YY format', 'error');
        return false;
    }
    
    if (!cvv || cvv.length !== 3 || !/^\d+$/.test(cvv)) {
        showAlert('Please enter a valid 3-digit CVV', 'error');
        return false;
    }
    
    if (!cardName.trim()) {
        showAlert('Please enter the name on card', 'error');
        return false;
    }
    
    return true;
}

function generateConfirmationCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'SW';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateConfirmationDetails() {
    const detailsContainer = document.getElementById('confirmationDetails');
    const flight = bookingData.selectedFlight;
    const params = bookingData.searchParams;
    
    detailsContainer.innerHTML = `
        <div class="confirmation-card">
            <h3>Booking Confirmation</h3>
            <div class="confirmation-row">
                <span>Confirmation Code:</span>
                <span class="confirmation-code">${bookingData.confirmationCode}</span>
            </div>
            <div class="confirmation-row">
                <span>Flight:</span>
                <span>${flight.flightNumber}</span>
            </div>
            <div class="confirmation-row">
                <span>Route:</span>
                <span>${flight.departure.city} → ${flight.arrival.city}</span>
            </div>
            <div class="confirmation-row">
                <span>Date:</span>
                <span>${formatDate(params.departure)}</span>
            </div>
            <div class="confirmation-row">
                <span>Time:</span>
                <span>${flight.departure.time} - ${flight.arrival.time}</span>
            </div>
            <div class="confirmation-row">
                <span>Passengers:</span>
                <span>${params.adults + params.children + params.infants}</span>
            </div>
            <div class="confirmation-row">
                <span>Total Paid:</span>
                <span class="total-amount">$${bookingData.totalAmount}</span>
            </div>
        </div>
    `;
}

function generateQRCode() {
    const qrContainer = document.getElementById('qrCode');
    const qrData = {
        confirmationCode: bookingData.confirmationCode,
        flightNumber: bookingData.selectedFlight.flightNumber,
        passenger: 'John Doe', // This would be actual passenger name
        date: bookingData.searchParams.departure
    };
    
    // Using qrcode.js library
    if (typeof QRCode !== 'undefined') {
        QRCode.toCanvas(qrContainer, JSON.stringify(qrData), function (error) {
            if (error) {
                console.error('QR Code generation failed:', error);
                qrContainer.innerHTML = '<p>QR Code generation failed</p>';
            }
        });
    } else {
        // Fallback if QR library not loaded
        qrContainer.innerHTML = `
            <div class="qr-fallback">
                <i class="fas fa-qrcode"></i>
                <p>Confirmation: ${bookingData.confirmationCode}</p>
            </div>
        `;
    }
}

function downloadTicket() {
    // Simulate ticket download
    showAlert('E-ticket download will start shortly', 'success');
    
    // In real implementation, this would generate and download a PDF
    const ticketData = {
        confirmationCode: bookingData.confirmationCode,
        flight: bookingData.selectedFlight,
        passengers: bookingData.passengers,
        total: bookingData.totalAmount
    };
    
    console.log('Downloading ticket:', ticketData);
}

function emailTicket() {
    const email = prompt('Enter your email address to receive the e-ticket:');
    if (email && isValidEmail(email)) {
        showAlert(`E-ticket will be sent to ${email}`, 'success');
        
        // In real implementation, this would trigger an email
        console.log('Sending ticket to:', email);
    } else if (email) {
        showAlert('Please enter a valid email address', 'error');
    }
}

// Utility Functions
function showLoadingSpinner(message) {
    const overlay = document.createElement('div');
    overlay.id = 'bookingLoader';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
    `;
    
    overlay.innerHTML = `
        <div class="spinner" style="
            width: 50px;
            height: 50px;
            border: 5px solid rgba(255,255,255,0.3);
            border-top: 5px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        "></div>
        <p style="font-size: 18px;">${message}</p>
    `;
    
    document.body.appendChild(overlay);
}

function hideLoadingSpinner() {
    const loader = document.getElementById('bookingLoader');
    if (loader) {
        document.body.removeChild(loader);
    }
}

function showAlert(message, type) {
    // Use the main.js showAlert function if available
    if (window.SmartWings && window.SmartWings.showAlert) {
        window.SmartWings.showAlert(message, type);
    } else {
        alert(message); // Fallback
    }
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Card number formatting
document.addEventListener('DOMContentLoaded', function() {
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryInput = document.getElementById('expiryDate');
    
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            let value = this.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            this.value = formattedValue;
        });
    }
    
    if (expiryInput) {
        expiryInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0,2) + '/' + value.substring(2,4);
            }
            this.value = value;
        });
    }
});

// Add flight card styles
const bookingStyles = document.createElement('style');
bookingStyles.textContent = `
    .flight-card {
        background: white;
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 20px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 2px solid transparent;
        transition: all 0.3s ease;
    }
    
    .flight-card:hover {
        border-color: #3b82f6;
        box-shadow: 0 8px 25px rgba(59,130,246,0.15);
    }
    
    .flight-route {
        display: flex;
        align-items: center;
        gap: 30px;
        margin: 20px 0;
    }
    
    .departure, .arrival {
        text-align: center;
    }
    
    .departure .time, .arrival .time {
        font-size: 24px;
        font-weight: 700;
        color: #1e3a8a;
    }
    
    .flight-duration {
        text-align: center;
        position: relative;
    }
    
    .line {
        height: 2px;
        width: 100px;
        background: #e2e8f0;
        margin-top: 5px;
        position: relative;
    }
    
    .line::after {
        content: '✈';
        position: absolute;
        right: -10px;
        top: -8px;
        color: #3b82f6;
    }
    
    .price .amount {
        font-size: 28px;
        font-weight: 700;
        color: #10b981;
    }
    
    .select-flight-btn {
        padding: 12px 24px;
        min-width: 140px;
    }
    
    .passenger-form {
        background: white;
        padding: 24px;
        border-radius: 12px;
        margin-bottom: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .checkbox-group {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 10px;
        margin-top: 10px;
    }
    
    .confirmation-card {
        background: white;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        margin-bottom: 20px;
    }
    
    .confirmation-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #f1f5f9;
    }
    
    .confirmation-code {
        font-family: monospace;
        font-weight: bold;
        color: #1e40af;
        font-size: 18px;
    }
    
    .qr-fallback {
        text-align: center;
        padding: 40px;
        border: 2px dashed #e2e8f0;
        border-radius: 12px;
    }
    
    .qr-fallback i {
        font-size: 48px;
        color: #64748b;
        margin-bottom: 16px;
    }
`;

document.head.appendChild(bookingStyles);