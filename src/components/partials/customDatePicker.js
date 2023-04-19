import moment from "moment";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import styled from "styled-components";

const CustomDatePickerWraper = styled.div`
  .react-datepicker__day--outside-month {
    color: #9c9c9c !important;
    /* color: #DFD3BE !important; */
    pointer-events: none;
  }

  label {
    color: #583703;
    font: normal normal bold 15px/33px Noto Sans !important;
  }
  .react-datepicker {
    border: none !important ;
    color: #583703;
    background: #fff7e8 !important;
    border-radius: 10px !important;
    font-size: 14px;
    float: right;
    height: 320px;
    width: ${(props) => props.width ?? "80%"};
    .react-datepicker__month-container {
      width: ${(props) => props.width ?? "100%"};
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
        width: 150px;
        font: normal normal bold 15px/30px Noto Sans !important  ;
      }
    }

    .react-datepicker__navigation {
      top: 16px;
    }
    .react-datepicker__month-read-view {
      display: flex;
      justify-content: space-between;
    }
    .react-datepicker__month-read-view--down-arrow {
      top: 10px;
    }
    .react-datepicker__year-read-view--down-arrow {
      top: 10px;
    }
    .react-datepicker__day-name {
      color: #583703 !important;
      font: normal normal bold 13px/20px Noto Sans;
    }
    .react-datepicker__day--keyboard-selected,
    .react-datepicker__day--selected {
      background: #ff8744 !important;
      border-radius: 50%;
      color: #fff7e8 !important;
    }
    .react-datepicker__day--keyboard-highlighted,
    .react-datepicker__day--highlighted {
      background: #ff8744 !important;
      border-radius: 5px;
      color: #fff7e8 !important;
      :hover {
        background: #ff8744 !important;
        border-radius: 5px !important;
        color: #fff7e8 !important;
      }
    }
    .react-datepicker__week{
      display: flex;
      margin: 1.2rem 0rem;
      justify-content: space-around;
    }
    .react-datepicker__day {
      color: #583703;
      font: normal normal bold 12px/20px Noto Sans;
      &:hover {
        border-radius: 50%;
      }
    }
      .react-datepicker__day-names{
      display: flex;
      justify-content: space-around;
    }
    
    .react-datepicker__month-dropdown {
      border: none !important;
      /* color: #ff8744; */
      background-color: #fff7e8;
      box-shadow: 2px 2px 10px 2px gray;
      max-height: 250px;
      overflow: auto;
      ::-webkit-scrollbar {
        display: none;
      }
      .react-datepicker__month-option:hover {
        background-color: #ff8744;
        color: #fff;
      }
    }
    .react-datepicker__year-dropdown {
      border: none !important;
      /* color: #ff8744; */
      background-color: #fff7e8;
      box-shadow: 0px 0px 7px 0px gray;
      max-height: 250px;
      overflow: auto;
      ::-webkit-scrollbar {
        display: none;
      }
      .react-datepicker__year-option:hover {
        background-color: #ff8744;
        color: #fff;
      }
    }

    .react-datepicker__header {
      border: none !important ;
      background: #fff7e8 !important;
      color: #583703 !important ;
      border-radius: 10px !important;

      .react-datepicker__current-month {
        color: #583703 !important ;
        font: normal normal bold 15px/20px Noto Sans !important;
        display: none;
      }
    }
    .react-datepicker__header__dropdown {
      display: flex;
      justify-content: space-evenly;
    }

    .react-datepicker-time__header {
      border: none !important ;
      background: #fff7e8 !important;
      color: #583703 !important ;
      border-radius: 10px !important;
      font: normal normal bold 15px/20px Noto Sans !important;
    }
    .react-datepicker__time-list {
      background-color: #fff7e8;
      font: normal normal bold 11px/20px Noto Sans !important;

      ::-webkit-scrollbar {
        display: none;
      }
    }
    .react-datepicker__time-list-item--selected {
      color: #fff !important;
      background-color: #ff8744 !important;
    }
    .react-datepicker__time-container {
      border-left: 2px solid #583703;
    }

    input[type="time"]::-webkit-calendar-picker-indicator {
      display: none;
    }
  }
  @media only screen and (max-width: 1200px) {
    .react-datepicker {
      width: ${(props) => props.width ?? "100%"};
    }
  }
`;

export default function CustomDatePicker({ ...props }) {
  return (
    <CustomDatePickerWraper>
      <DatePicker
        yearDropdownItemNumber={50}
        showYearDropdown
        showMonthDropdown
        timeFormat="hh:mm aa"
        minDate={new Date()}
        timeCaption="Time"
        inline
        {...props}
      />
    </CustomDatePickerWraper>
  );
}
