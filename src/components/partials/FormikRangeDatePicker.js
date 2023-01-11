import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { useField } from "formik";
const FormikCustomDatePickerWraper = styled.div`
  label {
    color: #583703;
    font: normal normal bold 15px/33px Noto Sans !important;
  }
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
        width: 150px;
        font: normal normal bold 15px/30px Noto Sans !important  ;
      }
    }

    .react-datepicker__navigation {
      top: 16px;
    }
    .react-datepicker__month-read-view--down-arrow {
      top: 10px;
    }
    .react-datepicker__year-read-view--down-arrow {
      top: 10px;
    }
    .react-datepicker__day-name {
      color: #583703 !important;
      font: normal normal bold 12px/20px Noto Sans;
    }
    .react-datepicker__day--keyboard-selected,
    .react-datepicker__day--selected {
      background: #ff8744 !important;
      /* border-radius: 50%; */
      color: #fff7e8 !important;
      opacity: 1 !important;
      
    }
    .react-datepicker__day {
      color: #583703;
      font: normal normal bold 10px/20px Noto Sans;
      &:hover {
        border-radius: 50%;
      }
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
      .react-datepicker__month-dropdown-container {
        margin-right: 50px;
      }
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
  
  .react-datepicker__day--in-range{
    background-color: inherit   !important;
    color: #ff8744 !important;
    /* opacity: 0.5 !important;  */
    }
    .react-datepicker__day--range-start{
    background: #ff8744 !important;
      /* border-radius: 50% !important ; */
      color: #fff7e8 !important;
      opacity: 1 !important;
  }
  .react-datepicker__input-container {
    //max-width:80%;
  }
  .react-datepicker__input-container > input{
    border: none;
    outline: none;
    font-size: 16px;
    margin-top: .4rem;
    text-align: center;
    width: 100%;
    color: #ff8744;
    font-weight:bold;
  }
  .react-datepicker__input-container > input:focus{
    outline: none;
  }
`;

export default function FormikRangeDatePicker({ label, inline=true,...props }) {
  const [field, meta, helpers] = useField(props.name);

  

  return (
    <FormikCustomDatePickerWraper>
      {/* <label >
        <Trans i18nKey={"news_label_Date"} />
      </label>
       */}
      {label && <label>{`${label}*`}</label>}
      <DatePicker
        sele
        onChange={(date) => {
          const [start,end] = date
          
          helpers.setValue({start,end})
        }}
        yearDropdownItemNumber={50}
        showYearDropdown
        showMonthDropdown
        timeFormat="hh:mm aa"
        timeCaption="Time"
        inline={inline}
        startDate={field?.value?.start}
        endDate={field?.value?.end}
        {...props}
      />
    </FormikCustomDatePickerWraper>
  );
}
