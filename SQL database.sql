-- SmartWings Airline Management System Database Schema
-- Created: 2024-10-16
-- Description: Complete database schema for the airline management system

-- Create database
CREATE DATABASE IF NOT EXISTS smartwings;
USE smartwings;

-- Users table for authentication and user management
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('USER', 'ADMIN', 'STAFF') DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
);

-- Flights table for flight information
CREATE TABLE flights (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    flight_number VARCHAR(10) UNIQUE NOT NULL,
    airline VARCHAR(50) NOT NULL,
    origin_airport VARCHAR(10) NOT NULL,
    origin_city VARCHAR(100) NOT NULL,
    destination_airport VARCHAR(10) NOT NULL,
    destination_city VARCHAR(100) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    aircraft_type VARCHAR(50) NOT NULL,
    economy_price DECIMAL(10, 2) NOT NULL,
    business_price DECIMAL(10, 2),
    first_class_price DECIMAL(10, 2),
    economy_seats INT NOT NULL,
    business_seats INT DEFAULT 0,
    first_class_seats INT DEFAULT 0,
    economy_available INT,
    business_available INT,
    first_class_available INT,
    status ENUM('SCHEDULED', 'BOARDING', 'DEPARTED', 'IN_FLIGHT', 'ARRIVED', 'DELAYED', 'CANCELLED') DEFAULT 'SCHEDULED',
    gate VARCHAR(10),
    terminal VARCHAR(10),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_flights_number (flight_number),
    INDEX idx_flights_route (origin_airport, destination_airport),
    INDEX idx_flights_departure (departure_time),
    INDEX idx_flights_status (status)
);

-- Bookings table for flight reservations
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    confirmation_code VARCHAR(20) UNIQUE NOT NULL,
    flight_id BIGINT NOT NULL,
    user_id BIGINT,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20),
    travel_class VARCHAR(20) NOT NULL,
    num_passengers INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW') DEFAULT 'PENDING',
    payment_status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED') DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    special_requests TEXT,
    booking_date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_bookings_confirmation (confirmation_code),
    INDEX idx_bookings_flight (flight_id),
    INDEX idx_bookings_user (user_id),
    INDEX idx_bookings_status (status),
    INDEX idx_bookings_payment_status (payment_status)
);

-- Passengers table for individual passenger details
CREATE TABLE passengers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    title VARCHAR(10) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    nationality VARCHAR(50),
    passport_number VARCHAR(50),
    passport_expiry DATE,
    seat_number VARCHAR(10),
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    
    INDEX idx_passengers_booking (booking_id),
    INDEX idx_passengers_passport (passport_number)
);

-- Staff table for airline staff management
CREATE TABLE staff (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    user_id BIGINT,
    department VARCHAR(50) NOT NULL,
    position VARCHAR(100) NOT NULL,
    salary DECIMAL(10, 2),
    hire_date DATE NOT NULL,
    manager_id BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES staff(id) ON DELETE SET NULL,
    
    INDEX idx_staff_employee_id (employee_id),
    INDEX idx_staff_department (department),
    INDEX idx_staff_user (user_id)
);

-- Aircraft table for aircraft information
CREATE TABLE aircraft (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    aircraft_code VARCHAR(20) UNIQUE NOT NULL,
    model VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(50) NOT NULL,
    total_seats INT NOT NULL,
    economy_seats INT NOT NULL,
    business_seats INT DEFAULT 0,
    first_class_seats INT DEFAULT 0,
    year_manufactured INT,
    status ENUM('ACTIVE', 'MAINTENANCE', 'RETIRED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_aircraft_code (aircraft_code),
    INDEX idx_aircraft_status (status)
);

-- Airports table for airport information
CREATE TABLE airports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    airport_code VARCHAR(10) UNIQUE NOT NULL,
    airport_name VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    timezone VARCHAR(50),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_airports_code (airport_code),
    INDEX idx_airports_city (city),
    INDEX idx_airports_country (country)
);

-- Contact messages table for customer inquiries
CREATE TABLE contact_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reference_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    booking_reference VARCHAR(20),
    message TEXT NOT NULL,
    status ENUM('NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') DEFAULT 'NEW',
    assigned_to BIGINT,
    newsletter_subscription BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_contact_reference (reference_id),
    INDEX idx_contact_status (status),
    INDEX idx_contact_email (email)
);

-- Payment transactions table
CREATE TABLE payment_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    gateway_response TEXT,
    processed_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    
    INDEX idx_payment_booking (booking_id),
    INDEX idx_payment_transaction (transaction_id),
    INDEX idx_payment_status (status)
);

-- Flight schedules table for recurring flights
CREATE TABLE flight_schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    schedule_name VARCHAR(100) NOT NULL,
    flight_number_template VARCHAR(10) NOT NULL,
    origin_airport VARCHAR(10) NOT NULL,
    destination_airport VARCHAR(10) NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    days_of_week VARCHAR(7) NOT NULL, -- Binary string: 1=Monday, 7=Sunday
    aircraft_type VARCHAR(50) NOT NULL,
    economy_price DECIMAL(10, 2) NOT NULL,
    business_price DECIMAL(10, 2),
    first_class_price DECIMAL(10, 2),
    effective_from DATE NOT NULL,
    effective_until DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_schedules_route (origin_airport, destination_airport),
    INDEX idx_schedules_active (is_active)
);

-- Insert sample data
-- Sample airports
INSERT INTO airports (airport_code, airport_name, city, country, timezone) VALUES
('JFK', 'John F. Kennedy International Airport', 'New York', 'United States', 'America/New_York'),
('LAX', 'Los Angeles International Airport', 'Los Angeles', 'United States', 'America/Los_Angeles'),
('ORD', 'Chicago O\'Hare International Airport', 'Chicago', 'United States', 'America/Chicago'),
('MIA', 'Miami International Airport', 'Miami', 'United States', 'America/New_York'),
('SEA', 'Seattle-Tacoma International Airport', 'Seattle', 'United States', 'America/Los_Angeles'),
('SFO', 'San Francisco International Airport', 'San Francisco', 'United States', 'America/Los_Angeles'),
('BOS', 'Boston Logan International Airport', 'Boston', 'United States', 'America/New_York'),
('ATL', 'Hartsfield-Jackson Atlanta International Airport', 'Atlanta', 'United States', 'America/New_York');

-- Sample aircraft
INSERT INTO aircraft (aircraft_code, model, manufacturer, total_seats, economy_seats, business_seats, first_class_seats) VALUES
('SW-001', 'Boeing 737-800', 'Boeing', 189, 162, 21, 6),
('SW-002', 'Airbus A321', 'Airbus', 220, 185, 28, 7),
('SW-003', 'Boeing 777-200', 'Boeing', 314, 266, 37, 11),
('SW-004', 'Airbus A320', 'Airbus', 180, 150, 24, 6),
('SW-005', 'Boeing 787-9', 'Boeing', 296, 246, 35, 15);

-- Sample admin user (password should be hashed in production)
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('admin@smartwings.com', '$2a$10$example_hashed_password', 'Admin', 'User', 'ADMIN'),
('staff@smartwings.com', '$2a$10$example_hashed_password', 'Staff', 'Member', 'STAFF');

-- Sample flights
INSERT INTO flights (flight_number, airline, origin_airport, origin_city, destination_airport, destination_city, 
                    departure_time, arrival_time, aircraft_type, economy_price, business_price, first_class_price,
                    economy_seats, business_seats, first_class_seats, economy_available, business_available, first_class_available) VALUES
('SW101', 'SmartWings', 'JFK', 'New York', 'LAX', 'Los Angeles', 
 '2024-10-17 08:30:00', '2024-10-17 11:45:00', 'Boeing 737-800', 299.00, 799.00, 1299.00,
 162, 21, 6, 162, 21, 6),
('SW102', 'SmartWings', 'LAX', 'Los Angeles', 'ORD', 'Chicago',
 '2024-10-17 14:20:00', '2024-10-17 19:55:00', 'Airbus A321', 349.00, 899.00, 1399.00,
 185, 28, 7, 185, 28, 7),
('SW103', 'SmartWings', 'ORD', 'Chicago', 'MIA', 'Miami',
 '2024-10-17 19:15:00', '2024-10-17 23:30:00', 'Boeing 777-200', 279.00, 749.00, 1199.00,
 266, 37, 11, 266, 37, 11);

-- Create indexes for performance
CREATE INDEX idx_flights_departure_date ON flights (DATE(departure_time));
CREATE INDEX idx_bookings_booking_date ON bookings (DATE(booking_date));
CREATE INDEX idx_passengers_name ON passengers (last_name, first_name);

-- Create views for common queries
CREATE VIEW flight_summary AS
SELECT 
    f.id,
    f.flight_number,
    f.origin_city,
    f.destination_city,
    f.departure_time,
    f.arrival_time,
    f.status,
    f.gate,
    f.terminal,
    COUNT(b.id) as total_bookings,
    SUM(b.num_passengers) as total_passengers,
    (f.economy_seats - f.economy_available + f.business_seats - f.business_available + f.first_class_seats - f.first_class_available) as occupied_seats
FROM flights f
LEFT JOIN bookings b ON f.id = b.flight_id AND b.status = 'CONFIRMED'
GROUP BY f.id;

CREATE VIEW booking_details AS
SELECT 
    b.id,
    b.confirmation_code,
    b.contact_email,
    b.num_passengers,
    b.total_amount,
    b.status as booking_status,
    b.payment_status,
    f.flight_number,
    f.origin_city,
    f.destination_city,
    f.departure_time,
    f.arrival_time
FROM bookings b
JOIN flights f ON b.flight_id = f.id;

-- Database maintenance procedures
DELIMITER $$

CREATE PROCEDURE UpdateFlightStatuses()
BEGIN
    -- Update flight statuses based on current time
    UPDATE flights 
    SET status = 'DEPARTED' 
    WHERE status = 'SCHEDULED' 
    AND departure_time < NOW() 
    AND departure_time > DATE_SUB(NOW(), INTERVAL 6 HOUR);
    
    UPDATE flights 
    SET status = 'ARRIVED' 
    WHERE status = 'DEPARTED' 
    AND arrival_time < NOW();
END$$

CREATE PROCEDURE CleanupOldData()
BEGIN
    -- Archive old bookings (older than 2 years)
    DELETE FROM passengers WHERE booking_id IN (
        SELECT id FROM bookings WHERE created_at < DATE_SUB(NOW(), INTERVAL 2 YEAR)
    );
    
    DELETE FROM bookings WHERE created_at < DATE_SUB(NOW(), INTERVAL 2 YEAR);
    
    -- Archive old contact messages (older than 1 year and resolved)
    DELETE FROM contact_messages 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR) 
    AND status = 'RESOLVED';
END$$

DELIMITER ;

-- Create database user for application
-- CREATE USER 'smartwings_app'@'localhost' IDENTIFIED BY 'secure_password_here';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON smartwings.* TO 'smartwings_app'@'localhost';
-- FLUSH PRIVILEGES;

-- Performance optimization settings
-- SET GLOBAL innodb_buffer_pool_size = 1073741824; -- 1GB
-- SET GLOBAL query_cache_size = 268435456; -- 256MB
-- SET GLOBAL query_cache_type = 1;