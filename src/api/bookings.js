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
  try {
    const response = await getDharmshalaBookingList({
      fromDate: formattedFromDate,
      toDate: formattedToDate,
    });
    const bookings = response.results;
    if (date === null) {
      return bookings;
    }
    return bookings;
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
