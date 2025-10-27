package com.smartwings.model;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

/**
 * Booking Entity
 * Represents a flight booking in the airline system
 */
@Entity
@Table(name = "bookings")
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Confirmation code is required")
    @Size(max = 20, message = "Confirmation code must be at most 20 characters")
    @Column(name = "confirmation_code", unique = true, nullable = false)
    private String confirmationCode;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @NotBlank(message = "Contact email is required")
    @Email(message = "Invalid email format")
    @Column(name = "contact_email", nullable = false)
    private String contactEmail;
    
    @Size(max = 20, message = "Contact phone must be at most 20 characters")
    @Column(name = "contact_phone")
    private String contactPhone;
    
    @NotBlank(message = "Travel class is required")
    @Column(name = "travel_class", nullable = false)
    private String travelClass;
    
    @Min(value = 1, message = "Number of passengers must be at least 1")
    @Column(name = "num_passengers", nullable = false)
    private Integer numPassengers;
    
    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Total amount must be greater than 0")
    @Column(name = "total_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BookingStatus status = BookingStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    
    @Column(name = "payment_method")
    private String paymentMethod;
    
    @Column(name = "payment_reference")
    private String paymentReference;
    
    @Size(max = 1000, message = "Special requests must be at most 1000 characters")
    @Column(name = "special_requests", length = 1000)
    private String specialRequests;
    
    @Column(name = "booking_date", nullable = false)
    private LocalDateTime bookingDate;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Passenger> passengers;
    
    // Lifecycle methods
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        bookingDate = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public Booking() {}
    
    public Booking(String confirmationCode, Flight flight, String contactEmail, 
                   String travelClass, Integer numPassengers, BigDecimal totalAmount) {
        this.confirmationCode = confirmationCode;
        this.flight = flight;
        this.contactEmail = contactEmail;
        this.travelClass = travelClass;
        this.numPassengers = numPassengers;
        this.totalAmount = totalAmount;
    }
    
    // Business methods
    public boolean canBeCancelled() {
        return status == BookingStatus.CONFIRMED && 
               flight.getDepartureTime().isAfter(LocalDateTime.now().plusHours(24));
    }
    
    public boolean canBeModified() {
        return status == BookingStatus.CONFIRMED && 
               flight.getDepartureTime().isAfter(LocalDateTime.now().plusHours(2));
    }
    
    public void confirm() {
        this.status = BookingStatus.CONFIRMED;
        this.paymentStatus = PaymentStatus.COMPLETED;
    }
    
    public void cancel() {
        this.status = BookingStatus.CANCELLED;
    }
    
    public BigDecimal calculateRefundAmount() {
        if (!canBeCancelled()) {
            return BigDecimal.ZERO;
        }
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime departure = flight.getDepartureTime();
        long hoursUntilDeparture = java.time.Duration.between(now, departure).toHours();
        
        if (hoursUntilDeparture > 168) { // More than 7 days
            return totalAmount.multiply(new BigDecimal("0.9")); // 90% refund
        } else if (hoursUntilDeparture > 48) { // More than 2 days
            return totalAmount.multiply(new BigDecimal("0.75")); // 75% refund
        } else { // Less than 2 days
            return totalAmount.multiply(new BigDecimal("0.5")); // 50% refund
        }
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getConfirmationCode() { return confirmationCode; }
    public void setConfirmationCode(String confirmationCode) { this.confirmationCode = confirmationCode; }
    
    public Flight getFlight() { return flight; }
    public void setFlight(Flight flight) { this.flight = flight; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    
    public String getTravelClass() { return travelClass; }
    public void setTravelClass(String travelClass) { this.travelClass = travelClass; }
    
    public Integer getNumPassengers() { return numPassengers; }
    public void setNumPassengers(Integer numPassengers) { this.numPassengers = numPassengers; }
    
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
    
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    
    public String getPaymentReference() { return paymentReference; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }
    
    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }
    
    public LocalDateTime getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDateTime bookingDate) { this.bookingDate = bookingDate; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<Passenger> getPassengers() { return passengers; }
    public void setPassengers(List<Passenger> passengers) { this.passengers = passengers; }
    
    // equals, hashCode, toString
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Booking booking = (Booking) o;
        return Objects.equals(confirmationCode, booking.confirmationCode);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(confirmationCode);
    }
    
    @Override
    public String toString() {
        return "Booking{" +
                "id=" + id +
                ", confirmationCode='" + confirmationCode + '\'' +
                ", contactEmail='" + contactEmail + '\'' +
                ", numPassengers=" + numPassengers +
                ", totalAmount=" + totalAmount +
                ", status=" + status +
                '}';
    }
}

/**
 * Booking Status Enumeration
 */
enum BookingStatus {
    PENDING,
    CONFIRMED,
    CANCELLED,
    COMPLETED,
    NO_SHOW
}

/**
 * Payment Status Enumeration
 */
enum PaymentStatus {
    PENDING,
    PROCESSING,
    COMPLETED,
    FAILED,
    REFUNDED,
    PARTIALLY_REFUNDED
}