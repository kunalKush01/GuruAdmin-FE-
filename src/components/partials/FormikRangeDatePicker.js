import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { useField } from "formik";
import "../../assets/scss/common.scss";
export default function FormikRangeDatePicker({
  label,
  pastDateNotAllowed,
  futureDateNotAllowed,
  inline = true,
  ...props
}) {
  const [field, meta, helpers] = useField(props.name);

  return (
    <div className="formikcustomdatepickerwraper">
      {/* <label >
        <Trans i18nKey={"news_label_Date"} />
      </label>
       */}
      {label && <label>{`${label}*`}</label>}
      <DatePicker
        onChange={(date) => {
          const [start, end] = date;
          helpers.setValue({ start, end });
        }}
        yearDropdownItemNumber={50}
        showYearDropdown
        showMonthDropdown
        timeFormat="hh:mm aa"
        timeCaption="Time"
        minDate={pastDateNotAllowed && new Date()}
        maxDate={futureDateNotAllowed && new Date()}
        // minDate={new Date()}
        inline={inline}
        startDate={field?.value?.start}
        endDate={field?.value?.end}
        {...props}
      />
    </div>
  );
}
