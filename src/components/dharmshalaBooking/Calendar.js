import React, { useState, useEffect, useCallback, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchBookings } from "../../api/bookings";
import { fetchProperties, fetchPropertyTypes } from "../../api/properties";
import "../../assets/scss/common.scss";
import Switch from "react-ios-switch";
import guestIcon from "../../assets/images/icons/guestIcon.png";
import Swal from "sweetalert2";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { Rnd } from "react-rnd";

const numPlaceholderRows = 14;
const numPlaceholderCells = 31;
const TOTAL_ROWS = 14;
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
  const [toggleSwitch, setToggleSwitch] = useState(false);
  const [resizingEvent, setResizingEvent] = useState(null);
  const [resizeProperty, setResizeProperty] = useState(null);
  const [filterEventDataDay, setFilterEventDataDay] = useState([]);
  const [weekDays, setWeekDays] = useState([]);
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
    endDate.setDate(startDate.getDate() + 60);

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
  const convertDateFormat = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`; // "YYYY-MM-DD" format
  };

  const getTotalBookingsForDate = (date) => {
    return events.filter((event) => {
      const checkIn = moment(event.startDate, "DD-MM-YYYY").toDate();
      const checkOut = moment(event.endDate, "DD-MM-YYYY").toDate();
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
  const [eventColors, setEventColors] = useState({});
  const colorPalette = ["#4D9DE0", "#E15554", "#E1BC29", "#3BB273", "#7768AE"];
  const getColorForEvent = (index) => {
    return colorPalette[index % colorPalette.length]; // Cycle through the colors in order
  };
  useEffect(() => {
    const newColors = {};

    events.forEach((event, index) => {
      if (!newColors[event._id]) {
        newColors[event._id] = getColorForEvent(index); // Assign color based on index
      }
    });
    setEventColors((prevColors) => ({ ...prevColors, ...newColors }));
  }, [events]);
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
  const filterEvents =
    events &&
    events.filter((item) => {
      const filteredIds = filteredProperties.map((property) => property._id);
      const roomIds = item.rooms.map((room) => room.roomId);
      return roomIds.some((roomId) => filteredIds.includes(roomId));
    });
  const getTotalGuestsForDate = (date) => {
    const targetDate = moment(date);
    const eventsOnDate = filterEvents.filter((event) => {
      const checkIn = moment(event.startDate, "DD-MM-YYYY");
      const checkOut = moment(event.endDate, "DD-MM-YYYY");
      return targetDate.isBetween(checkIn, checkOut, null, "[]");
    });
    const totalGuests = eventsOnDate.reduce((total, event) => {
      const { men, women, children } = event.guestCount;
      return total + men + women + children;
    }, 0);
    return totalGuests;
  };
  const handleShowAvailableOnly = () => {
    setShowAvailableOnly(!showAvailableOnly);
  };
  const handleCellClick = (date, property) => {
    // const formattedDate = moment(date).format("DD MMM YYYY");
    history.push({
      pathname: `/booking/add`,
      state: { property: property, date: date },
    });
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
  const [conflicts, setConflicts] = useState(false);

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      const formattedStart = moment(start, "DD-MM-YYYY");
      const formattedEnd = moment(end, "DD-MM-YYYY");
console.log(formattedEnd)
      if (formattedEnd.isBefore(formattedStart)) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "End date cannot be before the start date (Check-in date).",
        });
        return;
      }

      const conflictingEvents = events.filter((existingEvent) => {
        const roomIdMatches = existingEvent.rooms.some(
          (room) => room.roomId === event.rooms[0].roomId
        );

        if (!roomIdMatches || existingEvent.bookingId === event.bookingId) {
          return false;
        }

        const existingEventStart = moment(
          existingEvent.startDate,
          "DD-MM-YYYY"
        );
        const existingEventEnd = moment(existingEvent.endDate, "DD-MM-YYYY");
        return (
          formattedStart.isBetween(
            existingEventStart,
            existingEventEnd,
            null,
            "[]"
          ) ||
          formattedEnd.isBetween(
            existingEventStart,
            existingEventEnd,
            null,
            "[]"
          ) ||
          (formattedStart.isBefore(existingEventStart) &&
            formattedEnd.isAfter(existingEventEnd))
        );
      });

      // Handle any conflicts
      if (conflictingEvents.length > 0) {
        setConflicts(true);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "The new dates overlap with another booking.",
        });
        return;
      }

      const updatedEvent = {
        ...event,
        startDate: formattedStart.format("DD-MM-YYYY"),
        endDate: formattedEnd.format("DD-MM-YYYY"),
      };

      // Update the events state
      setEvents((prevEvents) =>
        prevEvents.map((prevEvent) =>
          prevEvent.bookingId === event.bookingId
            ? {
                ...prevEvent,
                startDate: formattedStart.format("DD-MM-YYYY"),
                endDate: formattedEnd.format("DD-MM-YYYY"),
              }
            : prevEvent
        )
      );
      history.push({
        pathname: `/booking/edit/${updatedEvent._id}`,
        state: { bookingData: updatedEvent },
      });
    },
    [events, resizeProperty, setEvents, setConflicts]
  );
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (resizingEvent) {
        const cellWidth = 120;
        const daysOffset = Math.round(e.movementX / cellWidth);
        const newCheckOut = moment(resizingEvent.endDate, "DD-MM-YYYY");
        newCheckOut.add(daysOffset, "days");
        const formattedEndDate = newCheckOut.format("DD-MM-YYYY");
        setResizingEvent({
          ...resizingEvent,
          endDate: formattedEndDate,
        });
        resizeEvent({
          event: resizingEvent,
          start: resizingEvent.startDate,
          end: formattedEndDate,
        });
      }
    };

    const handleMouseUp = () => {
      setResizingEvent(null);
      document.removeEventListener("mousemove", handleMouseMove);
    };
    const handleMouseOut = (e) => {
      if (
        resizingEvent &&
        conflicts &&
        !e.currentTarget.contains(e.relatedTarget)
      ) {
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
  }, [resizingEvent, resizeEvent, conflicts]);
  const startResizing = (event, property) => {
    setResizingEvent(event);
    setResizeProperty(property);
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
            display: window.matchMedia("(max-width: 768px)").matches && "flex",
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
                window.matchMedia("(max-width: 768px)").matches && "flex",
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
                {day.date.getDate()}-
                {day.date.toLocaleString("default", { month: "short" })}
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
            filteredProperties.map((property) => {
              return (
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
                      const dayEnd = new Date(day.date).setHours(
                        23,
                        59,
                        59,
                        999
                      );
                      const eventsForDay = events.filter((event) => {
                        const filteredIds = property._id;
                        const roomIds = event.rooms.map((room) => room.roomId);
                        const eventStartDateStr = convertDateFormat(
                          event.startDate
                        );
                        const eventEndDateStr = convertDateFormat(
                          event.endDate
                        );
                        const eventStartDate = new Date(
                          eventStartDateStr
                        ).setHours(0, 0, 0, 0);
                        const eventEndDate = new Date(eventEndDateStr).setHours(
                          23,
                          59,
                          59,
                          999
                        );
                        return (
                          roomIds.includes(filteredIds) &&
                          eventStartDate <= dayEnd &&
                          eventEndDate >= dayStart
                        );
                      });

                      const hasEvents = eventsForDay.length > 0;
                      const backgroundColor = hasEvents
                        ? eventColors[eventsForDay[0]._id]
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
                                  display: window.matchMedia(
                                    "(max-width: 768px)"
                                  ).matches
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
                        const roomId = event.rooms.map((item) => {
                          return item.roomId;
                        });
                        return roomId.includes(property._id);
                      })
                      .filter((event) => {
                        const checkIn = new Date(
                          event.startDate.split("-").reverse().join("-")
                        ); // Convert to YYYY-MM-DD
                        const checkOut = new Date(
                          event.endDate.split("-").reverse().join("-")
                        );
                        const today = new Date();
                        const cutoffDate = new Date(today);
                        cutoffDate.setDate(today.getDate() - 7);

                        const isWithinDateRange =
                          (checkIn >= new Date(fromDate) ||
                            checkOut >= new Date(fromDate)) &&
                          (!toDate || checkIn <= new Date(toDate));
                        const isAfterCutoff =
                          checkIn >= cutoffDate || checkOut >= cutoffDate;

                        return fromDate ? isWithinDateRange : isAfterCutoff;
                      })
                      .map((event) => {
                        const checkIn = roundToDay(
                          new Date(
                            event.startDate.split("-").reverse().join("-")
                          )
                        );
                        const checkOut = roundToDay(
                          new Date(event.endDate.split("-").reverse().join("-"))
                        );
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
                        const backgroundColor = eventColors[event._id];
                        return (
                          <Rnd
                            key={event._id}
                            disableDragging={true}
                            default={{
                              x: startOffset * 120, // Initial left position
                              y: 0, // Fixed vertical position
                              width: `${duration * 120}px`, // Initial width based on event duration
                              height: "30px",
                            }}
                            size={{
                              width: `${duration * 120}px`,
                              height: "30px",
                            }}
                            position={{ x: startOffset * 120, y: 5 }}
                            minWidth={120} // Minimum size for resizing
                            maxWidth={days.length * 120} // Maximum size to prevent overflowing
                            bounds="parent"
                            enableResizing={{
                              top: false,
                              right: true, // Enable resizing from the right edge
                              bottom: false,
                              left: false, // Enable resizing from the left edge
                              topRight: false,
                              bottomRight: false,
                              bottomLeft: false,
                              topLeft: false,
                            }}
                            style={{
                              display: "flex",
                              position: "absolute",
                              backgroundColor: backgroundColor,
                              transition: "opacity 0.3s ease",
                              height: "30px",
                              margin: 0,
                              padding: "0 10px",
                              boxSizing: "border-box",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              pointerEvents: "auto",
                              borderRadius: "8px",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.opacity = 0.7;
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.opacity = 1.0;
                            }}
                            onMouseDown={() => startResizing(event, property)}
                            onMouseUp={endResizing}
                            onDoubleClick={(e) => {
                              history.push({
                                pathname: `/booking/edit/${event._id}`,
                                state: { bookingData: event },
                              });
                            }}
                            onResizeStop={(
                              e,
                              direction,
                              ref,
                              delta,
                              position
                            ) => {
                              const resizedWidth = parseFloat(ref.style.width);
                              const newDuration = Math.round(
                                resizedWidth / 120
                              );
                              const newCheckOut = moment(
                                event.startDate,
                                "DD-MM-YYYY"
                              )
                                .add(newDuration, "days")
                                .format("DD-MM-YYYY");

                              resizeEvent({
                                event,
                                start: event.startDate,
                                end: newCheckOut,
                              });
                            }}
                          >
                            <span
                              style={{
                                fontSize: !window.matchMedia(
                                  "(max-width: 768px)"
                                ).matches
                                  ? "13px"
                                  : "inherit",
                                fontWeight: !window.matchMedia(
                                  "(max-width: 768px)"
                                ).matches
                                  ? "600"
                                  : "inherit",
                                flex: "1",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                color: "white",
                                margin: "auto",
                              }}
                            >
                              {event?.userDetails?.name}
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
                                  color: "white",
                                  fontSize: !window.matchMedia(
                                    "(max-width: 768px)"
                                  ).matches
                                    ? "16px"
                                    : "inherit",
                                }}
                              >
                                {` ${event.count}`}
                              </span>
                            </span>
                          </Rnd>
                        );
                      })}
                  </div>
                </div>
              );
            })
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
    </div>
  );
};

export default Calendar;
