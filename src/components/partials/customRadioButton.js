import { useField } from "formik";
import React from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import "../../assets/scss/common.scss";

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
    <div className="radiobuttonwrapper">
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
    </div>
  );
};

export default CustomRadioButton;
