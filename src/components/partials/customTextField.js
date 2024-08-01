import { ErrorMessage, useField } from "formik";
import React from "react";
import { Trans } from "react-i18next";
import { InputGroup } from "reactstrap";
import "../../assets/scss/common.scss";

export default function CustomTextField({
  required = false,
  label,
  type = "text",
  placeholder,
  width,
  min,
  options = [],
  isLoading = false,
  isError = false,
  ...props
}) {
  const [field, meta] = useField(props);

  return (
    <div className="customtextfieldwrapper" style={{ width }}>
      {label && (
        <label>
          {`${label}`}
          {required && "*"}
        </label>
      )}
      <InputGroup>
        {type === "select" ? (
          <select {...field} className="form-control selectbox">
            {isLoading ? (
              <option>Loading...</option>
            ) : isError ? (
              <option>Error loading options</option>
            ) : (
              options.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.name}
                </option>
              ))
            )}
          </select>
        ) : (
          <input
            {...field}
            type={type}
            className="form-control textbox"
            placeholder={placeholder}
            min={min}
            value={field.value || ""}
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
    </div>
  );
}
