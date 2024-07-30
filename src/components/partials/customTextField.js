import { ErrorMessage, useField } from "formik";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { FormGroup, InputGroup } from "reactstrap";
import styled from "styled-components";

const CustomTextFieldWarper = styled.div`
  color: #583703 !important;
  font: normal normal bold 11px/33px Noto Sans;

  .formGroup {
    width: ${(props) => props.width ?? "auto"};
    margin: ${(props) => props.margin ?? "auto"} !important;
  }
  label {
    font: normal normal bold 15px/33px Noto Sans;
  }
  input::placeholder {
    color: #583703 !important;
    opacity: 60% !important;
    font: normal normal bold 13px/20px Noto Sans !important;
  }
  input {
    color: #583703 !important;
    border: none !important;
    background-color: #fff7e8 !important;
    font: normal normal normal 13px/20px Noto Sans;
    border-radius: 20px;
    height: 38px; /* Adjust height to match form controls */
    padding-right: 30px; /* Space for the arrow */
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    display: none;
  }

  .address-input {
    width: 500px !important;
  }

  select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    color: #583703 !important;
    border: none !important;
    background-color: #fff7e8 !important;
    font: normal normal normal 13px/20px Noto Sans;
    border-radius: 20px;
    height: 38px;
    width: 100%; /* Ensure the dropdown stretches to full width */
    padding-right: 30px; /* Space for the arrow */
    background-image: url('data:image/svg+xml;utf8,<svg fill="%23583703" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'); /* Arrow icon */
    background-repeat: no-repeat;
    background-position: right 8px center; /* Position the arrow */
    cursor: pointer; /* Show pointer cursor on hover */
    outline: none; /* Remove default focus outline */
    padding: 10px 20px; /* Padding inside the select box */
  }
  select:hover {
    background-color: #e07a00; /* Background color when hovered */
  }
  select option {
    background-color: #fff7e8; /* Background color of options */
    padding: 10px 20px; /* Padding inside the options */
    cursor: pointer; /* Show pointer cursor on options */
  }
`;

export default function CustomTextField({
  required = false,
  label,
  type = "text",
  icon,
  placeholder,
  roundDigits,
  width,
  ...props
}) {
  const [field, meta, helpers] = useField(props);

  return (
    <CustomTextFieldWarper width={width}>
      <FormGroup className="formGroup">
        {label && (
          <label>
            {`${label}`}
            {required && "*"}
          </label>
        )}
        <InputGroup>
          {type === "select" ? (
            <select
              className="form-control"
              value={field.value}
              {...field}
              {...props}
            >
              {props.children}
            </select>
          ) : (
            <input
              type={type}
              className={`form-control ${type === "address" ? "address-input" : ""}`}
              placeholder={placeholder}
              value={field.value}
              style={type === "address" ? { width: "500px" } : {}}
              {...field}
              {...props}
            />
          )}
        </InputGroup>
        <div style={{ height: "20px" }}>
          {meta.error && meta.touched && (
            <div className="text-danger">
              <Trans i18nKey={meta.error} />
            </div>
          )}
        </div>
      </FormGroup>
    </CustomTextFieldWarper>
  );
}
