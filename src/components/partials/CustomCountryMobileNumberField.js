import React, { useState } from "react";
import styled from "styled-components";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useField } from "formik";
import { Trans } from "react-i18next";
const Warapper = styled.div`
  label {
    /* margin-bottom: 0px; */
    font: normal normal bold 15px/33px Noto Sans;
  }
  input::placeholder {
    color: #583703 !important;
    opacity: 60% !important;
    font: normal normal bold 13px/20px Noto Sans !important;
  }
  .react-tel-input {
    color: #583703 !important;
    border: none !important;
    background-color: #fff7e8 !important;
    font: normal normal normal 13px/20px Noto Sans;
    border-radius: 5px;
  }
  input {
    color: #583703 !important;
    border: none !important;
    background-color: #fff7e8 !important;
    font: normal normal normal 13px/20px Noto Sans;
    border-radius: 5px;
  }
  .react-tel-input .flag-dropdown {
    background-color: #fff7e8 !important;
    border: none !important;
    border-right: 1px solid black !important;
  }
  .react-tel-input .selected-flag:hover {
    background-color: #fff7e8 !important;
  }
  .react-tel-input .flag-dropdown.open .selected-flag {
    background-color: #fff7e8 !important;
  }
  .country-list {
    background-color: #fff7e8 !important;
    ::-webkit-scrollbar {
      width: 5px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #ff8744 !important;
      border-radius: 5px;
      height: 50px;
      width: 10px !important;
    }
  }
  .react-tel-input .country-list .country:hover {
    background-color: #ff8744 !important;
    color: #fff;
  }
  .react-tel-input .country-list .country:hover .dial-code {
    color: #fff !important;
  }
  .dial-code {
    color: #583703 !important;
  }
  .react-tel-input .country-list .country.highlight {
    background-color: #ff8744 !important;
  }
  .react-tel-input .country-list .country.highlight > span {
    font: normal normal bold 13px/20px Noto Sans;
    color: #ffffff !important;
  }
  .react-tel-input .country-list .search {
    padding: 0.5rem 1.5rem 0.5rem 0rem;
  }
  .react-tel-input .country-list .search-box {
    width: 100%;
  }
`;
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
    <Warapper>
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
    </Warapper>
  );
};

export default CustomCountryMobileNumberField;
