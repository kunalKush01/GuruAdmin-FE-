import React, { useState } from "react";
import styled from "styled-components";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useField } from "formik";
import { Trans } from "react-i18next";
import "../../../src/styles/common.scss";
const Wrapper = styled.div``;
const CustomCountryMobileNumberField = ({
  label,
  placeholder,
  formik,
  required,
  value,
  defaultCountry,
  ...props
}) => {
  return (
    <div className="wrapper">
      {label && (
        <label>
          {`${label}`}
          {required && "*"}
        </label>
      )}
      <PhoneInput
        value={value}
        placeholder={placeholder}
        country={defaultCountry}
        enableSearch
        disableSearchIcon
        {...props}
      />
    </div>
  );
};

export default CustomCountryMobileNumberField;
