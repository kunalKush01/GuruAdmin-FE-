import React from "react";
import { useField, ErrorMessage } from "formik";
import { FormGroup, InputGroup } from "reactstrap";
import styled from "styled-components";
import { Trans, useTranslation } from "react-i18next";

const CustomTextFieldWarper = styled.div`
  color: #583703 !important;
  font: normal normal bold 11px/33px Noto Sans;

  .formGroup {
    width: ${(props) => props.width ?? "auto"};
    margin:${(props) => props.margin ?? "auto"} !important;
  }
  label {
    margin-bottom: 10px;
    font: normal normal bold 15px/33px Noto Sans;
  }
  input {
    color: #583703 !important;
    border: none !important;
    background-color: #fff7e8 !important;
    font: normal normal normal 13px/20px Noto Sans;
    border-radius: 20px;
  }
`;

export default function CustomTextField({
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
        <label>{`${label}*`}</label>
        <InputGroup>
          <input
            type={type}
            className={"form-control  "}
            placeholder={placeholder}            
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
    </CustomTextFieldWarper>
  );
}
