import moment from "moment";
import React from "react";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import DatePicker from "react-datepicker";
import styled from "styled-components";
import "../../assets/scss/common.scss";

export default function CustomDatePicker({ ...props }) {
  return (
    <div className="customdatepickerwraper">
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
    </div>
  );
}
