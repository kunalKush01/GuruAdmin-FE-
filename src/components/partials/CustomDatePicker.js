import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import moment from "moment";
import styled from "styled-components";

const CustomDatePickerWarper = styled.div`
  .react-datepicker {
    border: none !important ;
    color: #583703;
    background: #fff7e8 !important;
    border-radius: 10px !important;
    .react-datepicker__month-container {
      width: 270px !important;
      border-radius: 10px !important;
    }
    .react-datepicker__input-time-container {
      border-top: 1px solid #ff8744;
      padding: 10px 10px;
      width: -webkit-fill-available;
      text-align: center;
      font: normal normal bold 13px/20px Noto Sans !important  ;
      .react-datepicker-time__input {
        border: none;
        width: 100%;
        border-radius: 10px;
        text-align: center;
        color: #ff8744 !important;
        font: normal normal bold 15px/30px Noto Sans !important  ;
      }
    }

    .react-datepicker__navigation {
      top: 9px;
    }
    .react-datepicker__month-year-read-view--down-arrow {
      top: 10px;
    }
    .react-datepicker__day-name {
      color: #583703 !important;
      font: normal normal bold 12px/20px Noto Sans;
    }
    .react-datepicker__day--keyboard-selected,
    .react-datepicker__day--selected {
      background: #ff8744 !important;
      border-radius: 50%;
      color: #fff7e8 !important;
    }
    .react-datepicker__day {
      color: #583703;
      font: normal normal bold 10px/20px Noto Sans;
      &:hover {
        border-radius: 50%;
      }
    }
    .react-datepicker__month-year-dropdown {
      border: none !important;
      color: #ff8744;
      background-color: #fff;
      box-shadow: 2px 2px 10px 2px gray;
      max-height: 200px;
      overflow: auto;
      ::-webkit-scrollbar {
        display: none;
      }
    }

    .react-datepicker__header {
      border: none !important ;
      background: #fff7e8 !important;
      color: #583703 !important ;
      border-radius: 10px !important;

      .react-datepicker__current-month {
        color: #583703 !important ;
        font: normal normal bold 13px/20px Noto Sans !important;
      }
    }
  }
`;
export default function CustomDatePicker() {
  const [startDate, setStartDate] = useState(new Date());

  const subMonths = (date, month) => {
    date + month;
    console.log("date", date + month);
    return;
  };
  const date = new Date();
  console.log("date=", date);
  const minMonthsAgo = moment().subtract(1000, "years");
  const maxMonthsAgo = moment().add(1000, "years");

  return (
    <CustomDatePickerWarper>
      <DatePicker      
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        //   dateFormatCalendar={"MMM yyyy"}
        minDate={minMonthsAgo._d}
        maxDate={maxMonthsAgo._d}
        // showTimeInput
        showMonthYearDropdown
        inline        
      timeFormat="p"
      />
    </CustomDatePickerWarper>
  );
}
