import { useField } from "formik";
import React from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";

const RadioButtonWrapper = styled.div`
  label {
    /* margin-bottom: 0px; */
    font: normal normal bold 15px/33px Noto Sans;
  }
  .form-check {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
`;
const CustomRadioButton = ({ label, heading, customOnChange, ...props }) => {
  const [field, meta, helper] = useField(props);
  const handleChange = (e) => {
    const { value } = e.target;
    helper.setValue(value);

    // Assuming customOnChange is a function prop passed from the parent
    if (customOnChange) {
      customOnChange(); // Assuming customOnChange takes the value as an argument
    }
  };
  return (
    <RadioButtonWrapper>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          checked={field.value === props.value}
          {...field}
          {...props}
          onChange={handleChange} // Handle onChange event
        />

        {label && (
          <label className="form-check-label" for={props.id}>
            <Trans i18nKey={label} />
          </label>
        )}
      </div>
    </RadioButtonWrapper>
  );
};

export default CustomRadioButton;
