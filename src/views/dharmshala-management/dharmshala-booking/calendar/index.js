// calendar.js

import React, { useState } from 'react';
import moment from 'moment';
import '../../dharmshala_css/calendar.css'; // Import the custom CSS file

const CalendarPage = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(moment());

  const handleDateClick = (date) => {
    if (!startDate) {
      setStartDate(date);
      setEndDate(null);
      setSelectedDates([date]);
    } else if (!endDate) {
      setEndDate(date);
      const newSelectedDates = getDatesInRange(startDate, date);
      setSelectedDates(newSelectedDates);
    } else {
      setStartDate(date);
      setEndDate(null);
      setSelectedDates([date]);
    }
  };

  const getDatesInRange = (start, end) => {
    const dates = [];
    const current = moment(start);

    while (current.isSameOrBefore(end)) {
      dates.push(current.clone());
      current.add(1, 'day');
    }

    return dates;
  };

  const generateCalendar = () => {
    const startOfMonth = currentMonth.clone().startOf('month');
    const endOfMonth = currentMonth.clone().endOf('month');
    const startDate = startOfMonth.clone().startOf('week');
    const endDate = endOfMonth.clone().endOf('week');

    const date = startDate.clone().subtract(1, 'day');
    const calendar = [];

    while (date.isBefore(endDate, 'day')) {
      calendar.push(
        Array(7)
          .fill(0)
          .map(() => date.add(1, 'day').clone())
      );
    }

    return calendar;
  };

  const isDateSelected = (date) => {
    return selectedDates.some((selectedDate) =>
      selectedDate.isSame(date, 'day')
    );
  };

  const renderCalendar = () => {
    const calendar = generateCalendar();

    return calendar.map((week, index) => (
      <div className="week" key={index}>
        {week.map((date) => (
          <div
            key={date.format('DD-MM-YYYY')}
            className={`day ${isDateSelected(date) ? 'selected' : ''}`}
            onClick={() => handleDateClick(date)}
          >
            {date.date()}
          </div>
        ))}
      </div>
    ));
  };

  const prevMonth = () => {
    setCurrentMonth(currentMonth.clone().subtract(1, 'month'));
  };

  const nextMonth = () => {
    setCurrentMonth(currentMonth.clone().add(1, 'month'));
  };

  const clearSelection = () => {
    setSelectedDates([]);
    setStartDate(null);
    setEndDate(null);
  };

  const checkAvailability = () => {
    // Implement your check availability logic here
    console.log('Checking availability...');
  };

  return (
    <div className="calendar-page">
      <h2>Select Dates for Your Booking</h2>
      <div className="calendar-nav">
        <button onClick={prevMonth}>{'<'}</button>
        <span>{currentMonth.format('MMMM YYYY')}</span>
        <button onClick={nextMonth}>{'>'}</button>
      </div>
      <div className="calendar-container">
        <div className="calendar">
          <div className="weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}
          </div>
          {renderCalendar()}
        </div>
        <div className="selected-dates">
          <h3>Selected Dates</h3>
          <p>Start Date: {startDate ? startDate.format('MMMM Do YYYY') : 'N/A'}</p>
          <p>End Date: {endDate ? endDate.format('MMMM Do YYYY') : 'N/A'}</p>
          <button className="clear-btn" onClick={clearSelection}>Clear Selection</button>
          <button className="check-availability-btn" onClick={checkAvailability}>Check Availability</button>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
