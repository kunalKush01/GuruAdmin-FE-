import React, { useState, useEffect, useCallback, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  fetchBookings,
  createBooking,
  updateBooking,
} from "../../api/bookings";
import { fetchProperties, fetchPropertyTypes } from "../../api/properties";
import "./Calendar.css";
import "./bookingModal.css";
import guestIcon from "../../assets/images/icons/guestIcon.png";
import Switch from "react-toggle-switch";
import "react-toggle-switch/dist/css/switch.min.css";
import Swal from "sweetalert2";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { useHistory } from "react-router-dom";

const BookingModal = ({
  isOpen,
  onClose,
  initialDate,
  property,
  onCreateBooking,
  eventTitle,
  eventPhone,
  editEvent,
  eventId,
  eventGuest,
  onEditBooking,
  selectedCheckOutDate,
  selectedCheckInDate,
}) => {
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [checkIn, setCheckIn] = useState(initialDate || new Date());
  const [checkOut, setCheckOut] = useState(
    initialDate
      ? new Date(initialDate.getTime() + 24 * 60 * 60 * 1000)
      : new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  );
  const [success, onSuccess] = useState(false);

  useEffect(() => {
    if (editEvent) {
      setGuestName(eventTitle);
      setPhone(eventPhone);
      setGuestCount(eventGuest);
      setCheckIn(new Date(selectedCheckInDate));
      setCheckOut(new Date(selectedCheckOutDate));
    }
  }, [
    editEvent,
    eventTitle,
    eventPhone,
    eventGuest,
    initialDate,
    selectedCheckOutDate,
    selectedCheckInDate,
  ]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const bookingData = {
      propertyId: property._id,
      checkIn,
      checkOut,
      title: guestName,
      guests: guestCount,
      phoneNo: phone,
      id: editEvent ? eventId : undefined,
    };

    try {
      if (editEvent) {
        await onEditBooking(bookingData);
        Swal.fire({
          icon: "success",
          title: "Booking Updated",
          text: "The booking has been successfully updated.",
          confirmButtonColor: "#3f51b5",
        });
        onSuccess(false);
      } else {
        await onCreateBooking(bookingData);
        Swal.fire({
          icon: "success",
          title: "Booking Created",
          text: "The booking has been successfully created.",
          confirmButtonColor: "#3f51b5",
        });
        onSuccess(true);
      }
      onClose();
    } catch (error) {
      console.error("Error:", error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again.",
        confirmButtonColor: "#f44336",
      });
      onSuccess(false);
    }
  };
  if (!isOpen || !property) return null;

  return (
    <div
      className={`modal fade ${isOpen ? "show" : ""}`}
      style={{ display: isOpen ? "block" : "none" }}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div
        className={`modal-dialog ${isOpen ? "" : "hide-modal"}`}
        role="document"
      >
        <div className="modal-content">
          <div className="container">
            <div className="row">
              <div className="booking-form">
                <form onSubmit={handleSubmit} className="booking-form-modal">
                  <div className="form-header">
                    <h2
                      style={{
                        marginLeft: "-1.5px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {!editEvent ? "Create Booking" : "Edit Booking"}
                      <i
                        class="bi bi-x-lg"
                        onClick={() => {
                          onClose();
                        }}
                        style={{ cursor: "pointer" }}
                      ></i>
                    </h2>
                    <p
                      style={{
                        marginBottom: "0px",
                        fontWeight: "200",
                        color: "#333",
                      }}
                    >
                      Room Number: {property.roomNumber}
                    </p>
                  </div>
                  <div className="row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="guestName">
                        &nbsp;Guest Name:
                      </label>
                      <input
                        id="guestName"
                        className="form-control"
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="guestCount" className="form-label">
                          Number of Guests:
                        </label>
                        <input
                          id="guestCount"
                          className="form-control"
                          type="number"
                          value={guestCount}
                          onChange={(e) =>
                            setGuestCount(parseInt(e.target.value))
                          }
                          min="1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="phoneNum" className="form-label">
                          Phone:
                        </label>
                        <input
                          id="phoneNum"
                          className="form-control"
                          type="number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          // min="1"
                          // required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="checkIn" className="form-label">
                          Check-in Date:
                        </label>
                        <DatePicker
                          id="checkIn"
                          className="form-control"
                          selected={checkIn}
                          onChange={(date) => setCheckIn(date)}
                          selectsStart
                          startDate={checkIn}
                          endDate={checkOut}
                          minDate={new Date()}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="checkOut" className="form-label">
                          Check-out Date:
                        </label>
                        <DatePicker
                          id="checkOut"
                          className="form-control"
                          selected={checkOut}
                          onChange={(date) => setCheckOut(date)}
                          selectsEnd
                          startDate={checkIn}
                          endDate={checkOut}
                          minDate={checkIn}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row form-actions" id="form-btn">
                    <div className="col-md-12 mb-2">
                      <button type="submit" className="submit-btn">
                        {!editEvent ? "Create Booking" : "Update Booking"}
                      </button>
                    </div>
                    <div className="col-md-12">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSuccess(true);
                        }}
                        className="cancle-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const numPlaceholderRows = 14;
const numPlaceholderCells = 31;
const TOTAL_ROWS = 12;
const PlaceholderRows = ({ numRows, numCells }) => {
  const rows = Array.from({ length: numRows });
  const cells = Array.from({ length: numCells });

  return (
    <>
      {rows.map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="calendar-property-row"
          id="mobile-row-view"
        >
          <div className="property-cell"></div>
          <div className="separator" style={{ height: "40px" }} />
          <div className="day-cells-container">
            {cells.map((_, cellIndex) => (
              <div key={cellIndex} className="day-cell"></div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};
const Calendar = () => {
  const history = useHistory();
  const [events, setEvents] = useState([]);
  const [days, setDays] = useState([]);
  const [properties, setProperties] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iseditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCheckoutDate, setSelectedCheckoutDate] = useState(null);
  const [selectedCheckInDate, setSelectedCheckInDate] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [eventPhone, setEventPhone] = useState(null);
  const [eventTitle, setEventTitle] = useState(null);
  const [eventGuest, setEventGuest] = useState(null);
  const [toggleSwitch, setToggleSwitch] = useState(false);
  const [resizingEvent, setResizingEvent] = useState(null);
  const [resizeProperty, setResizeProperty] = useState(null);
  const [eventId, setEventId] = useState(null);
  const [filterEventDataDay, setFilterEventDataDay] = useState([]);
  const [weekDays, setWeekDays] = useState([]);
  const [isBookingResizeSuccess, setIsBookingResizeSuccess] = useState(false);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  //**filter event based on date selection */
  const filteredEvents = useMemo(() => {
    if (!events || events.length === 0) {
      return [];
    }
    const filteredData = events.filter((item) => {
      const checkInDate = new Date(item.startDate);
      const checkOutDate = new Date(item.endDate);

      const adjustedCheckIn = new Date(Math.max(checkInDate, fromDate));
      const adjustedCheckOut = new Date(Math.min(checkOutDate, toDate));

      const isInDateRange = adjustedCheckIn <= adjustedCheckOut;
      return isInDateRange;
    });
    return filteredData;
  }, [events, fromDate, toDate, days]);

  useEffect(() => {
    setFilterEventDataDay(filteredEvents);
  }, [fromDate, toDate, filteredEvents]);

  useEffect(() => {
    const fetchEvents = async () => {
      const year = fromDate ? fromDate.getFullYear() : new Date().getFullYear();
      const month = fromDate
        ? fromDate.getMonth() + 1
        : new Date().getMonth() + 1;
      const data = await fetchBookings(year, month);
      console.log(data)
      if (window.matchMedia("(max-width: 768px)").matches) {
        const formattedDays = weekDays.map((day) => ({
          date: new Date(day.date).toISOString().split("T")[0],
          isSelectable: day.isSelectable,
        }));

        const filteredData = data.filter((item) => {
          const matchingDate = formattedDays.find(
            (day) => day.date === item.startDate
          );
          return !!matchingDate;
        });
        setEvents(filteredData);
      } else {
        setEvents(data);
      }
    };
    fetchEvents();
  }, [weekDays, window.innerWidth]);
  useEffect(() => {
    const calculateWeeklyDays = (start, end) => {
      const newDays = [];
      let currentDate = new Date(start);
      while (currentDate <= end) {
        const isSelectable = true;
        newDays.push({ date: new Date(currentDate), isSelectable });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return newDays;
    };
    const handleResize = () => {
      const startDate = fromDate ? new Date(fromDate) : new Date();
      if (!fromDate) {
        startDate.setDate(startDate.getDate() - 7);
      }

      const endDate = toDate ? new Date(toDate) : new Date(startDate);
      if (!toDate) {
        endDate.setDate(
          startDate.getDate() + (window.innerWidth <= 768 ? 6 : 30)
        );
      }

      if (window.innerWidth <= 768) {
        const weeklyDays = calculateWeeklyDays(startDate, endDate);
        setWeekDays(weeklyDays);
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    if (!properties.length) {
      fetchProperties().then((data) => {
        setProperties(data.properties);
      });
    }

    if (!propertyTypes.length) {
      fetchPropertyTypes().then((types) => {
        setPropertyTypes(["All", ...types]);
      });
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [fromDate, toDate, properties.length, propertyTypes.length]);

  useEffect(() => {
    const startDate = fromDate ? new Date(fromDate) : new Date();
    if (!fromDate) {
      startDate.setDate(startDate.getDate() - 7);
    }

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 30);

    const datesArray = [];

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const isSelectable = true;
      datesArray.push({ date: new Date(currentDate), isSelectable });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setDays(datesArray);
  }, [fromDate, toDate]);

  const isToday = (day) => {
    const today = new Date();
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    );
  };
  const getTotalBookingsForDate = (date) => {
    return events.filter((event) => {
      const checkIn = new Date(event.startDate);
      const checkOut = new Date(event.endDate);
      return date >= checkIn && date < checkOut;
    }).length;
  };

  const handleFromDateChange = (date) => {
    if (window.matchMedia("(max-width: 768px)").matches) {
      if (
        toDate &&
        (date > toDate || (toDate - date) / (1000 * 60 * 60 * 24) > 6)
      ) {
        setToDate(null);
      }
    }
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    const startDate = new Date(fromDate);
    const endDate = new Date(date);
    const daysDiff = (endDate - startDate) / (1000 * 60 * 60 * 24);

    if (endDate < startDate) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "The end date cannot be earlier than the start date",
      });
      return;
    }

    if (window.matchMedia("(max-width: 768px)").matches) {
      if (daysDiff <= 6) {
        setToDate(date);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Date range should not exceed 7 days",
        });
      }
    } else {
      setToDate(date);
    }
  };

  const handleRoomTypeChange = (event) => {
    setSelectedRoomType(event.target.value);
  };

  const getRandomColor = () => {
    const colors = ["#4D9DE0", "#E15554", "#E1BC29", "#3BB273", "#7768AE"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return color;
  };

  const roundToDay = (date) => {
    const roundedDate = new Date(date);
    roundedDate.setHours(0, 0, 0, 0);
    return roundedDate;
  };

  const filteredProperties = useMemo(() => {
    let filteredProps = properties;

    if (selectedRoomType !== "All") {
      filteredProps = filteredProps.filter(
        (property) => property.roomTypeName === selectedRoomType
      );
    }

    if (showAvailableOnly) {
      filteredProps = filteredProps.filter(
        (property) =>
          !filteredEvents.some((event) => event.roomId._id === property._id)
      );
    }

    return filteredProps;
  }, [properties, selectedRoomType, showAvailableOnly, filteredEvents]);

  //**filter events */
  const filterEvents = events.filter((item) => {
    const filteredIds = filteredProperties.map((property) => property._id);
    return filteredIds.includes(item.roomId._id);
  });

  const getTotalGuestsForDate = (date) => {
    const eventsOnDate = filterEvents.filter((event) => {
      const checkIn = new Date(event.startDate);
      const checkOut = new Date(event.endDate);
      return date >= checkIn && date < checkOut;
    });

    const totalGuests = eventsOnDate.reduce((total, event) => {
      return total + event.guests;
    }, 0);
    return totalGuests;
  };

  const handleShowAvailableOnly = () => {
    setShowAvailableOnly(!showAvailableOnly);
  };

  // const handleCellClick = (date, property) => {
  //   setSelectedDate(date);
  //   setSelectedProperty(property);
  //   setIsModalOpen(true);
  // };

  const handleCellClick = (date, property) => {
    const formattedDate = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    history.push(
      `/booking/add?startDate=${formattedDate}&roomNumber=${property.roomNumber}&roomType=${property.roomTypeName}`
    );
  };

  const handleCellClickEdit = (
    date,
    property,
    title,
    phone,
    guests,
    eventId,
    //checkOut,
    //checkIn
    startDate,
    endDate
  ) => {
    setIsEditModalOpen(true);
    setSelectedDate(date);
    setSelectedCheckoutDate(endDate);
    setSelectedCheckInDate(startDate);
    setSelectedProperty(property);
    setEventPhone(phone);
    setEventTitle(title);
    setEventGuest(guests);
    setEventId(eventId);
  };

  const handleCreateBooking = async (bookingData) => {
    try {
      const newBooking = await createBooking(bookingData);
      setEvents((prevEvents) => [...prevEvents, newBooking]);
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };
  const handleUpdateBooking = async (updatedBookingData) => {
    try {
      const updatedBooking = await updateBooking(updatedBookingData);

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === updatedBooking.id ? updatedBooking : event
        )
      );
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  //**switch guest/properties */
  const handleToggle = (checked) => {
    setToggleSwitch(checked);
  };

  const isPastDate = (date) => {
    const today = new Date();
    const todayWithoutTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const dateWithoutTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    return dateWithoutTime < todayWithoutTime;
  };
  const lastPastDayIndex = days.reduce((lastIndex, day, index) => {
    if (isPastDate(new Date(day.date))) {
      return index;
    }
    return lastIndex;
  }, -1);

  //**Extend Your booking */
  const handleSuccess = (success) => {
    setIsBookingResizeSuccess(success);
  };
  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      const formattedStart = new Date(start);
      const formattedEnd = new Date(end);
      if (formattedEnd < formattedStart) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "End date cannot be before the start date (Check-in date).",
        });
        setIsEditModalOpen(false);
        return;
      }
      const conflictingEvents = events.filter((e) => {
        if (e.id === event.id || e.propertyId !== event.propertyId)
          return false;
        const eventStart = new Date(e.checkIn);
        const eventEnd = new Date(e.checkOut);
        return (
          (formattedStart >= eventStart && formattedStart <= eventEnd) ||
          (formattedEnd > eventStart && formattedEnd <= eventEnd) ||
          (formattedStart <= eventStart && formattedEnd >= eventEnd)
        );
      });

      if (conflictingEvents.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "The new dates overlap with another booking.",
        });
        setIsEditModalOpen(false);
        return;
      }
      handleCellClickEdit(
        formattedStart,
        resizeProperty,
        event.title,
        event.phoneNo,
        event.guests,
        event.id,
        formattedEnd,
        formattedStart
      );
      setEvents((prevEvents) => {
        const updatedEvents = prevEvents.map((prevEvent) => {
          if (prevEvent.id === event.id) {
            return {
              ...prevEvent,
              checkIn: formattedStart,
              checkOut: formattedEnd,
            };
          }
          return prevEvent;
        });
        if (isBookingResizeSuccess) {
          return updatedEvents;
        } else {
          return prevEvents;
        }
      });
    },
    [
      setIsEditModalOpen,
      handleCellClickEdit,
      setIsBookingResizeSuccess,
      handleSuccess,
    ]
  );
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (resizingEvent) {
        const cellWidth = 120;
        const daysOffset = Math.round(e.movementX / cellWidth);
        const newCheckOut = new Date(resizingEvent.checkOut);
        newCheckOut.setDate(newCheckOut.getDate() + daysOffset);

        setResizingEvent({
          ...resizingEvent,
          checkOut: newCheckOut,
        });

        resizeEvent({
          event: resizingEvent,
          start: resizingEvent.checkIn,
          end: newCheckOut,
        });
      }
    };

    const handleMouseUp = () => {
      setResizingEvent(null);
      document.removeEventListener("mousemove", handleMouseMove);
    };
    const handleMouseOut = (e) => {
      if (resizingEvent && !e.currentTarget.contains(e.relatedTarget)) {
        setResizingEvent(null);
        document.removeEventListener("mousemove", handleMouseMove);
      }
    };
    if (resizingEvent) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mouseout", handleMouseOut);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [resizingEvent, resizeEvent]);
  const startResizing = (event, property) => {
    setResizingEvent(event);
    setResizeProperty(property);
    setIsEditModalOpen(true);
  };

  const endResizing = () => {
    setResizingEvent(null);
  };
  //** add extra empty rows till height of the screen */
  const placeholderRowsNeeded = Math.max(
    TOTAL_ROWS - filteredProperties.length,
    0
  );
  return (
    <div className="calendar-container">
      <div className="calendar-filters">
        <div className="d-flex justify-content-between align-items-center">
          <img
            src={arrowLeft}
            className="me-2 cursor-pointer"
            onClick={() => history.push(`/booking/info/`)}
          />
        </div>
        <div
          className="calendar-filter"
          style={{
            display:
              window.matchMedia("(max-width: 768px)").matches &&
              (isModalOpen || iseditModalOpen)
                ? "none"
                : "flex",
          }}
        >
          <div className="date-picker-container">
            <div className="fromDate">
              <label htmlFor="from-date">From Date:</label>
              <DatePicker
                id="from-date"
                selected={fromDate}
                onChange={handleFromDateChange}
                dateFormat="MM/dd/yyyy"
                placeholderText="Select a date"
                className="custom-datepicker"
              />
            </div>
            <div className="toDate">
              <label htmlFor="to-date">To Date:</label>
              <DatePicker
                id="to-date"
                selected={toDate}
                onChange={handleToDateChange}
                dateFormat="MM/dd/yyyy"
                placeholderText="Select a date"
                className="custom-datepicker"
              />
            </div>
          </div>

          <div
            className="calendar-filter"
            style={{
              display:
                window.matchMedia("(max-width: 768px)").matches &&
                (isModalOpen || iseditModalOpen)
                  ? "none"
                  : "flex",
            }}
          >
            <div id="select_div" className="select-container">
              <label htmlFor="room-type">Room Type:</label>
              <select
                id="room-type"
                value={selectedRoomType}
                onChange={handleRoomTypeChange}
                className="custom-select"
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="availability-check"
              onClick={handleShowAvailableOnly}
            >
              {showAvailableOnly ? "Show All" : "Show Available Only"}
            </button>
          </div>
        </div>
      </div>
      <div className="calendar-row">
        <div className="calendar">
          {/*Header for desktop view */}
          <div className="calendar-header">
            <div className="header-cell property-header sticky">Rooms</div>
            <div
              className="separator"
              style={{ height: "50px", marginTop: "-10px" }}
            />
            {days.map((day) => (
              <div
                key={day.date.toISOString()}
                className={`header-cell ${
                  isToday(day.date) ? "today" : ""
                } sticky-header`}
              >
                {day.date.getDate()}
                {isToday(day.date) && (
                  <div className="current-date-highlight" />
                )}
              </div>
            ))}
          </div>
          {/* Header for mobile view */}
          {filteredProperties.length > 0 ? (
            <div className="calendar-header-mobile">
              <div className="header-cell-mobile property-header-mobile sticky">
                Week View
              </div>
            </div>
          ) : (
            <div className="calendar-header-mobile">
              <div className="header-cell-mobile property-header-mobile sticky"></div>
            </div>
          )}
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div key={property._id} className="calendar-property-row">
                <div className="property-cell sticky">
                  {property.roomNumber}
                </div>
                <div className="separator" style={{ height: "40px" }} />
                <div className="day-cells-container">
                  {(window.matchMedia("(max-width: 768px)").matches
                    ? weekDays
                    : days
                  ).map((day, index) => {
                    const dayStart = new Date(day.date).setHours(0, 0, 0, 0);
                    const dayEnd = new Date(day.date).setHours(23, 59, 59, 999);

                    const eventsForDay = events.filter(
                      (event) =>
                        event.propertyId === property._id &&
                        new Date(event.startDate).setHours(0, 0, 0, 0) <=
                          dayEnd &&
                        new Date(event.endDate).setHours(0, 0, 0, 0) >= dayStart
                    );
                    const hasEvents = eventsForDay.length > 0;
                    const backgroundColor = hasEvents
                      ? getRandomColor(eventsForDay[0]._id)
                      : "";
                    const isCheckInDate = eventsForDay.some(
                      (event) =>
                        new Date(event.startDate).setHours(0, 0, 0, 0) ===
                        dayStart
                    );
                    const isLastPastDay = index === lastPastDayIndex;
                    return (
                      <div
                        key={day.date.toISOString()}
                        className={`day-cell ${
                          day.isSelectable ? "" : "day-cell-grayed"
                        } ${
                          isPastDate(new Date(day.date)) ? "past-date" : ""
                        } ${isLastPastDay ? "last-past-day-cell" : ""}`}
                        onClick={() => {
                          if (!isPastDate(day.date) && !hasEvents) {
                            handleCellClick(day.date, property);
                          } else {
                            handleCellClickEdit(
                              day.date,
                              property,
                              eventsForDay[0].title,
                              eventsForDay[0].phoneNo,
                              eventsForDay[0].guests,
                              eventsForDay[0].id,
                              eventsForDay[0].checkOut,
                              eventsForDay[0].checkIn
                            );
                          }
                        }}
                        style={{
                          pointerEvents: isPastDate(day.date) ? "none" : "",
                          backgroundColor: window.matchMedia(
                            "(max-width: 768px)"
                          ).matches
                            ? backgroundColor
                            : "",
                        }}
                      >
                        {isPastDate(day.date) && (
                          <div className="overlay">
                            <span></span>
                          </div>
                        )}
                        <div className="day-price">
                          <div
                            className="overlayContentText"
                            style={{
                              display: backgroundColor ? "none" : "",
                              color:
                                day.date.toLocaleDateString("en-US", {
                                  weekday: "short",
                                }) === "Sun" ||
                                day.date.toLocaleDateString("en-US", {
                                  weekday: "short",
                                }) === "Sat"
                                  ? "#cc3322"
                                  : "",
                            }}
                          >
                            {day.date.getDate()}
                          </div>
                          <div
                            className="overlayContentDay"
                            style={{
                              display: backgroundColor ? "none" : "",
                              color:
                                day.date.toLocaleDateString("en-US", {
                                  weekday: "short",
                                }) === "Sun" ||
                                day.date.toLocaleDateString("en-US", {
                                  weekday: "short",
                                }) === "Sat"
                                  ? "#cc3322"
                                  : "",
                            }}
                          >
                            {day.date.toLocaleDateString("en-US", {
                              weekday: "short",
                            })}
                          </div>
                          {hasEvents && isCheckInDate && (
                            <div
                              className="event-title"
                              style={{
                                display: window.matchMedia("(max-width: 768px)")
                                  .matches
                                  ? "flex"
                                  : "none",
                                color: "black",
                                fontWeight: "600",
                              }}
                            >
                              {eventsForDay[0].title}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {/* Render events in desktop view */}
                  {(window.matchMedia("(max-width: 768px)").matches
                    ? []
                    : fromDate && toDate
                    ? filterEventDataDay
                    : events
                  )
                    .filter((event) => {
                      return event.roomId._id === property._id;
                    })
                    .filter((event) => {
                      const checkIn = new Date(event.startDate);
                      const checkOut = new Date(event.endDate);
                      const today = new Date();
                      const cutoffDate = new Date(today);
                      cutoffDate.setDate(today.getDate() - 7);

                      const isWithinDateRange =
                        (checkIn >= new Date(fromDate) ||
                          checkOut >= new Date(fromDate)) &&
                        (!toDate || checkIn <= new Date(toDate));
                      const isAfterCutoff =
                        checkIn >= cutoffDate || checkOut >= cutoffDate;

                      if (fromDate) {
                        return isWithinDateRange;
                      } else {
                        return isAfterCutoff;
                      }
                    })
                    .map((event) => {
                      const checkIn = roundToDay(new Date(event.startDate));
                      const checkOut = roundToDay(new Date(event.endDate));
                      const startOffset =
                        Math.max(
                          0,
                          (checkIn - roundToDay(days[0].date)) /
                            (24 * 60 * 60 * 1000)
                        ) + 0.5;
                      const endOffset =
                        Math.min(
                          days.length,
                          (checkOut - roundToDay(days[0].date)) /
                            (24 * 60 * 60 * 1000)
                        ) + 0.5;
                      const duration = endOffset - startOffset;

                      return (
                        <div
                          key={event._id}
                          style={{
                            display: "flex",
                            position: "absolute",
                            left: `${startOffset * 120}px`,
                            width: `${duration * 120}px`,
                            backgroundColor: getRandomColor(),
                            transition: "opacity 0.3s ease",
                            height: "40px",
                            margin: 0,
                            marginTop: "-9px",
                            padding: "0 10px",
                            boxSizing: "border-box",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            pointerEvents: "auto",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.opacity = 0.7;
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.opacity = 1.0;
                          }}
                          className="event"
                          onMouseDown={() => startResizing(event, property)}
                          onMouseUp={endResizing}
                        >
                          <span
                            style={{
                              fontSize:
                                !window.matchMedia("(max-width: 768px)")
                                  .matches && "13px",
                              fontWeight:
                                !window.matchMedia("(max-width: 768px)")
                                  .matches && "600",
                              flex: "1",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {event.bookingId}
                          </span>
                          <span
                            style={{
                              marginLeft: "10px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src={guestIcon}
                              alt="Guests"
                              className="guest-icon"
                            />
                            <span
                              style={{
                                fontSize:
                                  !window.matchMedia("(max-width: 768px)")
                                    .matches && "16px",
                              }}
                            >{` ${event.count}`}</span>
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))
          ) : (
            <PlaceholderRows
              numRows={numPlaceholderRows}
              numCells={numPlaceholderCells}
            />
          )}
          {placeholderRowsNeeded > 0 && (
            <PlaceholderRows
              numRows={placeholderRowsNeeded}
              numCells={numPlaceholderCells}
            />
          )}
          {/* Render empty rows for all properties */}

          {/* {properties.map((property) => {
            const isFiltered = filteredProperties.some(
              (fp) => fp._id === property._id
            );
            console.log(isFiltered);
            if (!isFiltered) {
              return (
                <div
                  key={property._id}
                  style={{
                    display: window.matchMedia("(max-width: 768px)").matches
                      ? "none"
                      : "",
                  }}
                  className="calendar-property-row empty-row"
                >
                  <div className="property-cell sticky"></div>
                  <div className="separator" />
                  <div className="day-cells-container">
                    {(window.matchMedia("(max-width: 768px)").matches
                      ? weekDays
                      : days
                    ).map((day, index, array) => {
                      const isLastPastDay = index === lastPastDayIndex;
                      return (
                        <div
                          key={day.date.toISOString()}
                          className={`day-cell ${
                            day.isSelectable ? "" : "day-cell-grayed"
                          } ${
                            isPastDate(new Date(day.date)) ? "past-date" : ""
                          } ${isLastPastDay ? "last-past-day-cell" : ""}`}
                        >
                          {isPastDate(day.date) && (
                            <div className="overlay">
                              <span></span>
                            </div>
                          )}
                          <div className="day-price">
                            <div className="overlayContentText"></div>
                            <div></div>
                            <div className="overlayContentDay"></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            } else {
              return null;
            }
          })} */}
          <div className="calendar-footer">
            <div className="footer-total-properties sticky d-flex justify-content-between align-items-center">
              <div>Total rooms: {filteredProperties.length}</div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Switch
                  checked={toggleSwitch}
                  onChange={handleToggle}
                  onColor="rgb(252, 219, 3)"
                />
              </div>
            </div>

            <div className="separator" style={{ height: "40px" }} />
            <div className="footer-days-container">
              {days.map((day) => (
                <div key={day.date.toISOString()} className="footer-cell">
                  {toggleSwitch
                    ? getTotalGuestsForDate(day.date)
                    : getTotalBookingsForDate(day.date)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && selectedDate && selectedProperty && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialDate={selectedDate}
          property={selectedProperty}
          onCreateBooking={handleCreateBooking}
        />
      )}
      {iseditModalOpen && selectedDate && selectedProperty && (
        <BookingModal
          isOpen={iseditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialDate={selectedDate}
          selectedCheckOutDate={selectedCheckoutDate}
          selectedCheckInDate={selectedCheckInDate}
          property={selectedProperty}
          eventTitle={eventTitle}
          eventPhone={eventPhone}
          editEvent={iseditModalOpen}
          eventGuest={eventGuest}
          eventId={eventId}
          onEditBooking={handleUpdateBooking}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default Calendar;
