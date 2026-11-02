// ========================================
// Supplementary Class Scheduling System
// Version 1.0 - Initial UI
// ========================================

// 1. Store booking records
let bookings = JSON.parse(localStorage.getItem("classBookings")) || [];

// 2. Save bookings to browser storage
function saveBookings() {
    localStorage.setItem("classBookings", JSON.stringify(bookings));
}

// 3. Display a welcome message when the page loads
document.addEventListener("DOMContentLoaded", function () {
    console.log("Supplementary Class Scheduling System is ready!");

    // Connect the booking form if it exists
    const bookingForm = document.getElementById("bookingForm");

    if (bookingForm) {
        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault();
            createBooking();
        });
    }

    displayBookings();
});

// 4. Create a new class booking
function createBooking() {
    const studentName = document.getElementById("studentName")?.value.trim();
    const subject = document.getElementById("subject")?.value.trim();
    const teacher = document.getElementById("teacher")?.value.trim();
    const date = document.getElementById("classDate")?.value;
    const startTime = document.getElementById("startTime")?.value;
    const endTime = document.getElementById("endTime")?.value;
    const venue = document.getElementById("venue")?.value.trim();

    // Check that all required fields have been entered
    if (
        !studentName ||
        !subject ||
        !teacher ||
        !date ||
        !startTime ||
        !endTime ||
        !venue
    ) {
        alert("Please complete all booking fields.");
        return;
    }

    // Check that the end time is later than the start time
    if (endTime <= startTime) {
        alert("The end time must be later than the start time.");
        return;
    }

    // Check whether the teacher has another booking at the same time
    const teacherConflict = bookings.some(function (booking) {
        return (
            booking.teacher.toLowerCase() === teacher.toLowerCase() &&
            booking.date === date &&
            startTime < booking.endTime &&
            endTime > booking.startTime
        );
    });

    if (teacherConflict) {
        alert("This teacher already has a booking during that time.");
        return;
    }

    // Check whether the venue is already booked
    const venueConflict = bookings.some(function (booking) {
        return (
            booking.venue.toLowerCase() === venue.toLowerCase() &&
            booking.date === date &&
            startTime < booking.endTime &&
            endTime > booking.startTime
        );
    });

    if (venueConflict) {
        alert("This venue is already booked during that time.");
        return;
    }

    // Create a new booking record
    const newBooking = {
        id: Date.now(),
        studentName: studentName,
        subject: subject,
        teacher: teacher,
        date: date,
        startTime: startTime,
        endTime: endTime,
        venue: venue
    };

    bookings.push(newBooking);

    saveBookings();
    displayBookings();

    // Clear the form after successful booking
    document.getElementById("bookingForm").reset();

    alert("Class booking created successfully!");
}

// 5. Display all bookings on the page
function displayBookings() {
    const bookingList = document.getElementById("bookingList");

    // The HTML page may not have a booking list yet
    if (!bookingList) {
        return;
    }

    bookingList.replaceChildren();

    if (bookings.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No class bookings yet.";
        bookingList.appendChild(message);
        return;
    }

    // Sort bookings by date and start time
    const sortedBookings = [...bookings].sort(function (a, b) {
        return (
            a.date.localeCompare(b.date) ||
            a.startTime.localeCompare(b.startTime)
        );
    });

    sortedBookings.forEach(function (booking) {
        const card = document.createElement("div");
        card.className = "booking-card";

        const title = document.createElement("h3");
        title.textContent = booking.subject;

        const details = document.createElement("p");
        details.textContent =
            `Student: ${booking.studentName} | ` +
            `Teacher: ${booking.teacher}`;

        const schedule = document.createElement("p");
        schedule.textContent =
            `${booking.date} | ${booking.startTime}–${booking.endTime}`;

        const location = document.createElement("p");
        location.textContent = `Venue: ${booking.venue}`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Booking";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", function () {
            deleteBooking(booking.id);
        });

        card.append(title, details, schedule, location, deleteButton);
        bookingList.appendChild(card);
    });
}

// 6. Delete a booking
function deleteBooking(bookingId) {
    const confirmed = confirm("Are you sure you want to delete this booking?");

    if (!confirmed) {
        return;
    }

    bookings = bookings.filter(function (booking) {
        return booking.id !== bookingId;
    });

    saveBookings();
    displayBookings();

    alert("Booking deleted successfully.");
}