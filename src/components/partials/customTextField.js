import React from "react";
import { useField, ErrorMessage } from "formik";
import { FormGroup, InputGroup } from "reactstrap";
import styled from "styled-components";

const CustomTextFieldWarper = styled.div`
  color: #583703 !important;
  .formGroup {    
    width: ${(props) => props.width ?? "auto"};
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
        <label>{label}</label>
        <InputGroup>
          <input
            type={type}
            className={"form-control  "}
            placeholder={placeholder}
            {...field}
            {...props}
          />
        </InputGroup>
        <ErrorMessage name={field.name} />
        
      </FormGroup>
    </CustomTextFieldWarper>
  );
}
