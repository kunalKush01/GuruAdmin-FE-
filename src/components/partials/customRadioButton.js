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
const CustomRadioButton = ({ label, heading, ...props }) => {
  const [field, meta, helper] = useField(props);
  return (
    <RadioButtonWrapper>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          checked={field.value === props.value}
          {...field}
          {...props}
        />

        {label && (
          <label class="form-check-label" for={props.id}>
            <Trans i18nKey={label} />
          </label>
        )}
      </div>
    </RadioButtonWrapper>
  );
};

export default CustomRadioButton;
