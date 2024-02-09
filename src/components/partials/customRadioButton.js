import React from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";

const RadioButtonWrapper = styled.div``;
const CustomRadioButton = ({ label, ...props }) => {
  return (
    <RadioButtonWrapper>
      <div class="form-check">
        <input class="form-check-input" type="radio" {...props} />

        {label && (
          <label class="form-check-label" for="flexRadioDefault1">
            <Trans i18nKey={label} />
          </label>
        )}
      </div>
    </RadioButtonWrapper>
  );
};

export default CustomRadioButton;
