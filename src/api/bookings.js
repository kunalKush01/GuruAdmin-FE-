import moment from "moment";
import {
  getDharmshalaBookingList,
  createDharmshalaBooking,
  updateDharmshalaBooking,
} from "../api/dharmshala/dharmshalaInfo";

export const fetchBookings = async (
  year,
  month,
  date,
  days,
  formattedFromDate,
  formattedToDate
) => {
  // const monthKey = `${year}-${month.toString().padStart(2, "0")}`;

  try {
    const response = await getDharmshalaBookingList({
      fromDate: formattedFromDate,
      toDate: formattedToDate,
    });
    const bookings = response.results;
    if (date === null) {
      return bookings;
    }
    return bookings

    // const filteredBookings = bookings.filter((booking) => {
    //   const checkInDate = moment(booking.startDate, "DD-MM-YYYY");
    //   const checkOutDate = moment(booking.endDate, "DD-MM-YYYY");

    //   return (
    //     // ✅ Event starts within range
    //     (checkInDate.isSameOrAfter(formattedFromDate) &&
    //       checkInDate.isSameOrBefore(formattedToDate)) ||
    //     // ✅ Event ends within range
    //     (checkOutDate.isSameOrAfter(formattedFromDate) &&
    //       checkOutDate.isSameOrBefore(formattedToDate)) ||
    //     // ✅ Event ends exactly on the fromDate
    //     checkOutDate.isSame(formattedFromDate, "day")
    //   );
    // });

    // return filteredBookings;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};

export const createBooking = async (bookingData) => {
  try {
    const payload = {
      title: bookingData.bookingId,
      checkIn: bookingData.startDate.toISOString().split("T")[0],
      checkOut: bookingData.endDate.toISOString().split("T")[0],
      guests: bookingData.count,
      propertyId: bookingData.roomTypeId,
      //phone: bookingData.phoneNo,
    };
    const response = await createDharmshalaBooking(payload);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const updateBooking = async (updatedBookingData) => {
  try {
    const payload = {
      bookingId: updatedBookingData.bookingId,
      title: updatedBookingData.bookingId,
      checkIn: updatedBookingData.startDate.toISOString().split("T")[0],
      checkOut: updatedBookingData.endDate.toISOString().split("T")[0],
      guests: updatedBookingData.count,
      propertyId: updatedBookingData.roomTypeId,
      //phone: updatedBookingData.phoneNo,
    };
    const response = await updateDharmshalaBooking(payload);
    return response.data;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};
