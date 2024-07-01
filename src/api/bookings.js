const bookings = {
  "2024-07": [
    { id: 1, title: "Mr. Singh", checkIn: "2024-06-18", checkOut: "2024-06-19", guests: 3, propertyId: 1 ,phoneNo:"745212323"},
    { id: 2, title: "Rahul and Priya", checkIn: "2024-06-19", checkOut: "2024-06-21", guests: 4, propertyId: 2 ,phoneNo:"745212323"},
    { id: 3, title: "Sharma Family", checkIn: "2024-06-20", checkOut: "2024-06-21", guests: 5, propertyId: 3 ,phoneNo:"745212323"},
    { id: 4, title: "A. Kumar", checkIn: "2024-06-21", checkOut: "2024-06-22", guests: 1, propertyId: 4,phoneNo:"745212323" },
    { id: 5, title: "Ravi Patel", checkIn: "2024-06-22", checkOut: "2024-06-26", guests: 2, propertyId: 5 ,phoneNo:"745212323"},
    { id: 6, title: "Arjun & Meera", checkIn: "2024-06-23", checkOut: "2024-06-24", guests: 2, propertyId: 6 ,phoneNo:"745212323"},
    { id: 7, title: "Ms. Reddy", checkIn: "2024-06-24", checkOut: "2024-06-25", guests: 2, propertyId: 1,phoneNo:"745212323" },
    { id: 8, title: "Ms. Reddy", checkIn: "2024-06-20", checkOut: "2024-06-21", guests: 2, propertyId: 5,phoneNo:"745212323" },
    { id: 9, title: "Raj Malhotra", checkIn: "2024-06-25", checkOut: "2024-06-29", guests: 3, propertyId: 7,phoneNo:"745212323" },
    { id: 10, title: "Dr. Srinivasan", checkIn: "2024-06-26", checkOut: "2024-06-27", guests: 4, propertyId: 8,phoneNo:"745212323" },
    { id: 11, title: "Ms. Kapoor", checkIn: "2024-06-27", checkOut: "2024-06-28", guests: 2, propertyId: 9 ,phoneNo:"745212323"},
    { id: 12, title: "Dr. Verma", checkIn: "2024-06-28", checkOut: "2024-06-30", guests: 1, propertyId: 10 ,phoneNo:"745212323"},
    { id: 13, title: "Mr. Yadav", checkIn: "2024-06-29", checkOut: "2024-06-30", guests: 2, propertyId: 11 ,phoneNo:"745212323"},
    { id: 14, title: "Capt. Joshi", checkIn: "2024-06-30", checkOut: "2024-07-01", guests: 3, propertyId: 12,phoneNo:"745212323" },
    { id: 15, title: "Mr. Bhatt", checkIn: "2024-06-30", checkOut: "2024-07-01", guests: 4, propertyId: 13 ,phoneNo:"745212323"}
  ],
};

export const fetchBookings = (year, month) => {
  const monthKey = `${year}-${month.toString().padStart(2, "0")}`;
  return Promise.resolve(bookings[monthKey] || []);
};

export const createBooking = (bookingData) => {
  return new Promise((resolve, reject) => {
    try {
      // Generate a new ID (in a real scenario, this would be done by the backend)
      const newId = Math.max(...bookings["2024-06"].map(b => b.id)) + 1;

      // Create the new booking object
      const newBooking = {
        id: newId,
        title: bookingData.title,
        checkIn: bookingData.checkIn.toISOString().split('T')[0], // Format as YYYY-MM-DD
        checkOut: bookingData.checkOut.toISOString().split('T')[0], // Format as YYYY-MM-DD
        guests: bookingData.guests,
        propertyId: bookingData.propertyId,
        phone: bookingData.phoneNo,
      };

      // Add the new booking to the appropriate month
      const monthKey = newBooking.checkIn.substring(0, 7); // Get YYYY-MM from the checkIn date
      if (!bookings[monthKey]) {
        bookings[monthKey] = [];
      }
      bookings[monthKey].push(newBooking);

      // Simulate a delay to mimic an API call
      setTimeout(() => {
        resolve(newBooking);
      }, 500);
    } catch (error) {
      reject(error);
    }
  });
};
export const updateBooking = (updatedBookingData) => {
  return new Promise((resolve, reject) => {
    try {
      const { id, title, checkIn, checkOut, guests, propertyId, phoneNo } = updatedBookingData;

      // Find and update the existing booking in the bookings object
      let updatedBooking = null;
      for (const monthKey in bookings) {
        const bookingsInMonth = bookings[monthKey];
        const bookingToUpdate = bookingsInMonth.find(b => b.id === id);
        if (bookingToUpdate) {
          bookingToUpdate.title = title;
          bookingToUpdate.checkIn = checkIn.toISOString().split('T')[0];
          bookingToUpdate.checkOut = checkOut.toISOString().split('T')[0];
          bookingToUpdate.guests = guests;
          bookingToUpdate.propertyId = propertyId;
          bookingToUpdate.phoneNo = phoneNo;
          updatedBooking = bookingToUpdate;
          break;
        }
      }

      if (!updatedBooking) {
        reject(new Error(`Booking with id ${id} not found.`));
        return;
      }

      // Simulate a delay to mimic an API call
      setTimeout(() => {
        resolve(updatedBooking);
      }, 500);
    } catch (error) {
      reject(error);
    }
  });
};
