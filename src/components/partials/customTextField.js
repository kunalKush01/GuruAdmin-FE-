import { ErrorMessage, useField } from "formik";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { FormGroup, InputGroup } from "reactstrap";
import styled from "styled-components";
import "../../assets/scss/common.scss";

export default function CustomTextField({
  required = false,
  label,
  type = "text",
  icon,
  placeholder,
  roundDigits,
  width,
  min,
  ...props
}) {
  const [field, meta, helpers] = useField(props);

  return (
    <div className="customtextfieldwrapper" width={width}>
      {label && (
        <label>
          {`${label}`}
          {required && "*"}
        </label>
      )}
      <InputGroup>
        <input
          type={type}
          className={"form-control textbox"}
          placeholder={placeholder}
          value={field.value}
          min={min}
          {...field}
          {...props}
        />
      </InputGroup>
      <div style={{ height: "20px" }}>
        {meta.error && meta.touched && (
          <div className="text-danger">
            <Trans i18nKey={meta.error} />
          </div>
        )}
      </div>
    </div>
  );
}
