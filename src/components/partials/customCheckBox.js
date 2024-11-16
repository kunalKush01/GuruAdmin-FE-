import { useField } from "formik";
import React from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import "../../assets/scss/common.scss";

const CustomCheckBox = ({ label, customOnChange, ...props }) => {
  const [field, meta, helper] = useField({ ...props, type: "checkbox" }); // Ensure checkbox type

  const handleChange = (e) => {
    const { checked } = e.target; // Checkbox `checked` state
    helper.setValue(checked); // Update Formik's value

    // Trigger customOnChange if provided
    if (customOnChange) {
      customOnChange(checked); // Pass the current checked state
    }
  };

  return (
    <div className="checkboxwrapper">
      <input
        className="custom-checkbox"
        type="checkbox"
        id={props.id || props.name} // Use ID for accessibility
        checked={field.value || false} // Default to false if not set
        {...field}
        onChange={handleChange} // Handle checkbox changes
        disabled={props.disabled}
      />

      {label && (
        <label className="form-check-label" htmlFor={props.id || props.name}>
          <Trans i18nKey={label} />
        </label>
      )}
    </div>
  );
};

export default CustomCheckBox;
