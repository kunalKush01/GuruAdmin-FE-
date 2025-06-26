import React, { useState, useEffect, useCallback, useMemo } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { fetchBookings } from "../../api/bookings";
import { fetchProperties, fetchPropertyTypes } from "../../api/properties";
import "../../assets/scss/common.scss";
import Switch from "react-ios-switch";
import guestIcon from "../../assets/images/icons/guestIcon.png";
import arrPrev from "../../assets/images/icons/arrow-prev.svg";
import arrNext from "../../assets/images/icons/arrow-next.svg";
import Swal from "sweetalert2";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Rnd } from "react-rnd";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import { DatePicker, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { CustomReactSelect } from "../partials/customReactSelect";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button } from "reactstrap";

const CustomDatePicker = DatePicker.generatePicker(momentGenerateConfig);
const numPlaceholderRows = 14;
const numPlaceholderCells = window.innerWidth <= 768 ? 7 : 31;
const TOTAL_ROWS = 14;
const PlaceholderRows = ({ numRows, days = [] }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ensure days is always an array and handle undefined case
  const visibleDays = useMemo(
    () => (isMobile ? days.slice(0, 7) : days),
    [isMobile, days]
  );

  return (
    <>
      {Array.from({ length: numRows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="calendar-property-row"
          id="mobile-row-view"
        >
          <div className="property-cell"></div>
          <div className="separator" style={{ height: "40px" }} />
          <div className="day-cells-container">
            {visibleDays.map((_, cellIndex) => (
              <div key={cellIndex} className="day-cell"></div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

const Calendar = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [days, setDays] = useState([]);
  const [properties, setProperties] = useState([]);
  const [fromDate, setFromDate] = useState(moment().startOf("day"));
  const [toDate, setToDate] = useState(null);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("All");
  const [toggleSwitch, setToggleSwitch] = useState(false);
  const [resizingEvent, setResizingEvent] = useState(null);
  const [resizeProperty, setResizeProperty] = useState(null);
  const [weekDays, setWeekDays] = useState([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [currentMonth, setCurrentMonth] = useState("");
  const { t } = useTranslation();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (isDesktop && fromDate) {
      setToDate(fromDate.clone().add(30, "days"));
    }
  }, [isDesktop, fromDate]);

  useEffect(() => {
    const fetchEvents = async () => {
      const formattedFromDate = fromDate
        ? moment(fromDate).format("YYYY-MM-DD")
        : null;
      const formattedToDate = toDate
        ? moment(toDate).format("YYYY-MM-DD")
        : null;

      const dateFromDate = fromDate ? new Date(fromDate) : null;
      const date = dateFromDate ? dateFromDate.getDate() : null;
      const year = dateFromDate
        ? dateFromDate.getFullYear()
        : new Date().getFullYear();
      const month = dateFromDate
        ? dateFromDate.getMonth() + 1
        : new Date().getMonth() + 1;

      const data = await fetchBookings(
        year,
        month,
        date,
        days,
        formattedFromDate,
        formattedToDate
      );
      setEvents(data);
    };

    fetchEvents();
  }, [weekDays, window.innerWidth, fromDate, days]);
  const updateMonth = (days) => {
    const firstDay = days[0]?.date;
    if (firstDay) {
      setCurrentMonth(moment(firstDay).format("MMMM YYYY"));
    }
  };
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
        startDate.setDate(startDate.getDate() - 4);
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
        updateMonth(weeklyDays);
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

  const handleNextWeek = () => {
    const nextWeek = weekDays.map((day) => ({
      date: new Date(moment(day.date).add(7, "days").toDate()),
      isSelectable: day.isSelectable,
    }));
    setWeekDays(nextWeek);
    updateMonth(nextWeek);
  };

  const handlePrevWeek = () => {
    const prevWeek = weekDays.map((day) => ({
      date: new Date(moment(day.date).subtract(7, "days").toDate()),
      isSelectable: day.isSelectable,
    }));
    setWeekDays(prevWeek);
    updateMonth(prevWeek);
  };

  //**set days */
  useEffect(() => {
    const startDate = fromDate ? new Date(fromDate) : new Date();
    if (!fromDate) {
      startDate.setDate(startDate.getDate() - 7);
    }

    const endDate = toDate ? new Date(toDate) : new Date(startDate);
    if (!toDate) {
      endDate.setDate(startDate.getDate() + 30);
    }

    // Ensure the date range is at least 30 days
    if (!toDate && endDate - startDate < 30 * 24 * 60 * 60 * 1000) {
      endDate.setDate(startDate.getDate() + 30);
    }

    const datesArray = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      datesArray.push({ date: new Date(currentDate), isSelectable: true });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Ensure events do not affect fromDate and toDate logic
    events.forEach((event) => {
      const eventStartDate = new Date(
        event.startDate.split("-").reverse().join("-")
      );
      const eventEndDate = new Date(
        event.endDate.split("-").reverse().join("-")
      );

      eventStartDate.setHours(0, 0, 0, 0);
      eventEndDate.setHours(0, 0, 0, 0);

      // Exclude events that end exactly on the fromDate
      if (eventEndDate.getTime() === startDate.getTime()) {
        return;
      }

      let eventCurrentDate = new Date(eventStartDate);

      // Add event dates but ensure they stay within fromDate and toDate
      while (eventCurrentDate <= eventEndDate && eventCurrentDate <= endDate) {
        if (eventCurrentDate >= startDate) {
          const isDateAlreadyAdded = datesArray.some(
            (dateObj) => dateObj.date.getTime() === eventCurrentDate.getTime()
          );
          if (!isDateAlreadyAdded) {
            datesArray.push({
              date: new Date(eventCurrentDate),
              isSelectable: true,
            });
          }
        }
        eventCurrentDate.setDate(eventCurrentDate.getDate() + 1);
      }
    });

    // Sort final dates array
    datesArray.sort((a, b) => a.date.getTime() - b.date.getTime());

    setDays(datesArray);
  }, [fromDate, toDate, JSON.stringify(events)]);

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
    return `${year}-${month}-${day}`;
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
      if (toDate && (date.isAfter(toDate) || date.diff(toDate, "days") > 6)) {
        setToDate(null);
      }
    }
    setFromDate(date);
    // setToDate(null);
  };

  const handleToDateChange = (date) => {
    if (!fromDate) {
      setToDate(null);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a start date first.",
      });
      return;
    }

    const daysDiff = date && fromDate ? date.diff(fromDate, "days") : 0;

    if (date && date.isBefore(fromDate)) {
      setToDate(null);
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
  const [eventColors, setEventColors] = useState({});
  const colorPalette = ["#5EC4F4", "#5F69E6", "#F3B64B", "#79BB43", "#EC5B52"];
  const getColorForEvent = (index) => {
    return colorPalette[index % colorPalette.length];
  };
  useEffect(() => {
    const newColors = {};

    events.forEach((event, index) => {
      if (!newColors[event._id]) {
        newColors[event._id] = getColorForEvent(index);
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
    return filteredProps;
  }, [properties, selectedRoomType, showAvailableOnly]);

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

  const [availableRooms, setAvailableRooms] = useState([]);

  const handleShowAvailableOnly = () => {
    setShowAvailableOnly(!showAvailableOnly);

    const from = fromDate ? moment(fromDate, "DD-MM-YYYY") : null;
    const to = toDate ? moment(toDate, "DD-MM-YYYY") : null;

    if (!from || !to) {
      setAvailableRooms(filteredProperties ? filteredProperties : []);
      return;
    }

    const bookedRoomIds = new Set();
    if (events) {
      events.forEach(({ rooms, startDate, endDate }) => {
        const start = moment(startDate, "DD-MM-YYYY");
        const end = moment(endDate, "DD-MM-YYYY");
        if (end.isAfter(from) && start.isBefore(to)) {
          rooms.forEach((room) => {
            bookedRoomIds.add(room.roomId);
          });
        }
      });
    }

    const filteredRooms =
      properties && properties.filter((room) => !bookedRoomIds.has(room._id));
    setAvailableRooms(filteredRooms);
  };

  const handleCellClick = (date, property) => {
    navigate({
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
      const currentDate = moment();
      const eventEndDate = moment(event.endDate, "DD-MM-YYYY");
      if (eventEndDate.isBefore(currentDate)) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Cannot resize this event; the end date is in the past.",
        });
        return;
      }
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
      navigate({
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
    TOTAL_ROWS -
      (!showAvailableOnly ? filteredProperties.length : availableRooms.length),
    0
  );
  return (
    <div className="calendar-container">
      <div className="calendar-filters">
        <div className="d-flex justify-content-between align-items-center">
          <img
            src={arrowLeft}
            className="me-2 cursor-pointer"
            onClick={() => navigate(`/booking/info/`)}
          />
        </div>
        <div
          className="d-flex flex-wrap align-items-center"
          style={{
            display: "flex",
            flexDirection: window.innerWidth < 768 ? "column" : "row",
            gap: window.innerWidth < 768 ? "8px" : "0",
            width:"100%"
          }}
        >
          {/* First row (Desktop: From Date, To Date, Room Type, Button | Mobile: From Date only) */}
          <div className="d-flex w-100 align-items-center">
            <div className="calendarDateComponent">
              <label htmlFor="from-date">From Date:</label>
              <CustomDatePicker
                id="from-date"
                format="DD MMM YYYY"
                onChange={handleFromDateChange}
                value={fromDate || ""}
              />
            </div>

            {/* To Date: Hidden in Mobile, Shown in Desktop */}
            <div className="toDate calendarDateComponent mx-1 d-none d-md-block">
              <label htmlFor="to-date">To Date:</label>
              <CustomDatePicker
                id="to-date"
                format="DD MMM YYYY"
                onChange={handleToDateChange}
                value={toDate || ""}
              />
            </div>

            {/* Room Type: Hidden in Mobile First Row, Shown in Desktop */}
            <div
              id="select_div"
              className="roomTypeSelect flex-grow-1 mx-1 d-none d-md-block"
            >
              <CustomReactSelect
                labelName={t("room_type")}
                name="roomType"
                defaultValue={{ value: "All", label: "All" }}
                loadOptions={[
                  ...propertyTypes.map((type) => ({
                    value: type,
                    label: type,
                  })),
                ]}
                onChange={(value) => {
                  setSelectedRoomType(value?.value);
                }}
              />
            </div>

            {/* Availability Button: Hidden in Mobile First Row, Shown in Desktop */}
            <div className="d-none d-md-block">
              <Button
                className="availability-check"
                color="primary"
                onClick={handleShowAvailableOnly}
              >
                {showAvailableOnly
                  ? window.innerWidth < 768
                    ? "All"
                    : "Show All"
                  : window.innerWidth < 768
                  ? "Available"
                  : "Show Available Only"}
              </Button>
            </div>
          </div>

          {/* Second row (Mobile: Room Type & Button) */}
          <div className="d-flex align-items-center gap-2 w-100 d-md-none">
            <div id="select_div" className="roomTypeSelect flex-grow-1">
              <CustomReactSelect
                labelName={t("room_type")}
                name="roomType"
                defaultValue={{ value: "All", label: "All" }}
                loadOptions={[
                  ...propertyTypes.map((type) => ({
                    value: type,
                    label: type,
                  })),
                ]}
                onChange={(value) => {
                  setSelectedRoomType(value?.value);
                }}
              />
            </div>
            <div>
              <Button
                className="availability-check"
                color="primary"
                onClick={handleShowAvailableOnly}
              >
                {showAvailableOnly ? "All" : "Available"}
              </Button>
            </div>
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
            {Array.isArray(days) &&
              days.map((day) => {
                const dayStart = new Date(day.date).setHours(0, 0, 0, 0);
                const startDate = fromDate
                  ? new Date(fromDate).setHours(0, 0, 0, 0)
                  : null;
                const endDate = toDate
                  ? new Date(toDate).setHours(23, 59, 59, 999)
                  : null;

                const isDayInRange =
                  !startDate ||
                  !endDate ||
                  dayStart >= startDate ||
                  dayStart <= endDate;

                const isTodayDate = isToday(day.date);
                const shouldHighlightToday = isDayInRange && isTodayDate;

                return (
                  <div
                    key={day.date.toISOString()}
                    className={`header-cell ${
                      shouldHighlightToday ? "today" : ""
                    } sticky-header`}
                  >
                    {isDayInRange ? (
                      <>
                        {day.date.getDate()}-
                        {day.date.toLocaleString("default", { month: "short" })}
                        {shouldHighlightToday && (
                          <div className="current-date-highlight" />
                        )}
                      </>
                    ) : (
                      <span>&nbsp;</span>
                    )}
                  </div>
                );
              })}
          </div>
          {/* Header for mobile view */}
          {filteredProperties.length > 0 ? (
            <div className="calendar-header-mobile">
              <div className="header-cell-mobile property-header-mobile sticky d-flex justify-content-between">
                <img
                  src={arrPrev}
                  width={30}
                  height={30}
                  className="weekArr"
                  onClick={handlePrevWeek}
                />
                <div className="d-flex flex-column align-items-center justify-content-center">
                  Week View
                  <span className="monthText fs-6">{`(${currentMonth})`}</span>
                </div>
                <img
                  src={arrNext}
                  width={30}
                  height={30}
                  className="weekArr"
                  onClick={handleNextWeek}
                />
              </div>
            </div>
          ) : (
            <div className="calendar-header-mobile">
              <div className="header-cell-mobile property-header-mobile sticky"></div>
            </div>
          )}
          {filteredProperties.length > 0 ? (
            (!showAvailableOnly ? filteredProperties : availableRooms).map(
              (property) => {
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
                        const dayStart = new Date(day.date).setHours(
                          0,
                          0,
                          0,
                          0
                        );
                        const dayEnd = new Date(day.date).setHours(
                          23,
                          59,
                          59,
                          999
                        );
                        const eventsForDay = events.filter((event) => {
                          const filteredIds = property._id;
                          const roomIds = event.rooms.map(
                            (room) => room.roomId
                          );
                          const eventStartDateStr = convertDateFormat(
                            event.startDate
                          );
                          const eventEndDateStr = convertDateFormat(
                            event.endDate
                          );
                          const eventStartDate = new Date(
                            eventStartDateStr
                          ).setHours(0, 0, 0, 0);
                          const eventEndDate = new Date(
                            eventEndDateStr
                          ).setHours(23, 59, 59, 999);
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
                                {eventsForDay[0]?.userDetails?.name || ""}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {/* Render events in desktop view */}
                      {(window.matchMedia("(max-width: 768px)").matches
                        ? []
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
                            new Date(
                              event.endDate.split("-").reverse().join("-")
                            )
                          );
                          const firstDay = roundToDay(days[0].date);

                          // Calculate start offset (allow negative values for partial visibility)
                          const startOffset =
                            (checkIn - firstDay) / (24 * 60 * 60 * 1000) + 0.5;

                          // Ensure events that start before the first visible date are partially visible
                          const adjustedStartOffset = Math.max(
                            startOffset,
                            -0.5
                          ); // Allow some portion of the event to be visible

                          // Calculate end offset (ensure it doesn't overflow)
                          const endOffset =
                            Math.min(
                              days.length,
                              (checkOut - firstDay) / (24 * 60 * 60 * 1000)
                            ) + 0.5;

                          // Calculate visible duration (ensure it's at least partially visible)
                          const visibleDuration =
                            endOffset - adjustedStartOffset;

                          const backgroundColor = eventColors[event._id];

                          return (
                            <Rnd
                              key={event._id}
                              disableDragging={true}
                              default={{
                                x: adjustedStartOffset * 120, // Adjusted to allow partial visibility
                                y: 0,
                                width: `${visibleDuration * 120}px`,
                                height: "30px",
                              }}
                              size={{
                                width: `${visibleDuration * 120}px`,
                                height: "30px",
                              }}
                              position={{ x: adjustedStartOffset * 120, y: 5 }}
                              minWidth={60} // Allow minimum width for partial visibility
                              maxWidth={days.length * 120} // Prevent overflowing
                              bounds="parent"
                              enableResizing={{
                                top: false,
                                right: true,
                                bottom: false,
                                left: false,
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
                                const checkOut = new Date(
                                  event.endDate.split("-").reverse().join("-")
                                );
                                const today = new Date();
                                if (checkOut >= today) {
                                  navigate({
                                    pathname: `/booking/edit/${event._id}`,
                                    state: { bookingData: event },
                                  });
                                }
                              }}
                              onResizeStop={(
                                e,
                                direction,
                                ref,
                                delta,
                                position
                              ) => {
                                const resizedWidth = parseFloat(
                                  ref.style.width
                                );
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
                              {" "}
                              <Tooltip
                                title={
                                  <div
                                    style={{
                                      fontSize: "13px",
                                      lineHeight: "1.5",
                                    }}
                                  >
                                    <p style={{ margin: 0 }}>
                                      <UserOutlined
                                        style={{
                                          marginRight: 8,
                                          color: "#40a9ff",
                                        }}
                                      />
                                      <b>{event?.userDetails?.name}</b>
                                    </p>
                                    <p style={{ margin: 0 }}>
                                      <CalendarOutlined
                                        style={{
                                          marginRight: 8,
                                          color: "#ffc53d",
                                        }}
                                      />
                                      <b>Start:</b>{" "}
                                      {moment(
                                        event.startDate,
                                        "DD-MM-YYYY"
                                      ).format("DD MMM YYYY")}
                                    </p>
                                    <p style={{ margin: 0 }}>
                                      <ClockCircleOutlined
                                        style={{
                                          marginRight: 8,
                                          color: "#73d13d",
                                        }}
                                      />
                                      <b>End:</b>{" "}
                                      {moment(
                                        event.endDate,
                                        "DD-MM-YYYY"
                                      ).format("DD MMM YYYY")}
                                    </p>
                                  </div>
                                }
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "100%",
                                    cursor: "pointer",
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
                                </div>
                              </Tooltip>
                            </Rnd>
                          );
                        })}
                    </div>
                  </div>
                );
              }
            )
          ) : (
            <PlaceholderRows
              numRows={numPlaceholderRows}
              numCells={numPlaceholderCells}
            />
          )}
          {placeholderRowsNeeded > 0 && (
            <PlaceholderRows
              days={days ?? []}
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
              {days.map((day) => {
                const dayStart = new Date(day.date).setHours(0, 0, 0, 0);
                const startDate = fromDate
                  ? new Date(fromDate).setHours(0, 0, 0, 0)
                  : null;
                const endDate = toDate
                  ? new Date(toDate).setHours(23, 59, 59, 999)
                  : null;

                const isDayInRange =
                  !startDate || !endDate
                    ? true
                    : dayStart >= startDate && dayStart <= endDate;

                return (
                  <div key={day.date.toISOString()} className="footer-cell">
                    {isDayInRange
                      ? toggleSwitch
                        ? getTotalGuestsForDate(day.date)
                        : getTotalBookingsForDate(day.date)
                      : // Optionally, display nothing or a placeholder for filtered out days
                        null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
