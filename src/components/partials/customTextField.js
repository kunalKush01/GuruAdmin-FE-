import { ErrorMessage, useField } from "formik";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { FormGroup, InputGroup } from "reactstrap";
import styled from "styled-components";
import "../../../src/styles/common.scss";

const CustomTextFieldWrapper = styled.div``;
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
    <div className="customtextfieldwrapper" width={width}>
      <FormGroup className="formGroup">
        {label && (
          <label>
            {`${label}`}
            {required && "*"}
          </label>
        )}
        <InputGroup>
          <input
            type={type}
            className={"form-control"}
            placeholder={placeholder}
            value={field.value}
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
      </FormGroup>
    </div>
  );
}
