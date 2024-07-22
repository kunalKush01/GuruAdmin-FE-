import { useField } from "formik";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import "react-datepicker/dist/react-datepicker.css";
import { Trans } from "react-i18next";
import styled from "styled-components";
import { calculateAge } from "../../utility/formater";
import "../../assets/scss/common.scss";
export default function FormikCustomDatePicker({
  label,
  futureDateNotAllowed,
  pastDateNotAllowed,
  minDate,
  inline = true,
  setFieldValue,
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
        selected={field.value}
        onChange={(date) => {
          helpers.setValue(date);
          if (props.calculateAge) {
            const age = calculateAge(date);
            setFieldValue("age", age);
          }
        }}
        yearDropdownItemNumber={30}
        showYearDropdown
        minDate={pastDateNotAllowed ? new Date() : minDate}
        maxDate={futureDateNotAllowed && new Date()}
        showMonthDropdown
        timeFormat="hh:mm aa"
        timeCaption="Time"
        inline={inline}
        {...props}
      />
    </div>
  );
}
