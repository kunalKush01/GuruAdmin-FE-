import moment from "moment";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
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
