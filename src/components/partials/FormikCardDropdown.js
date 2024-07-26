import { useField } from "formik";
import React from "react";
import { Trans } from "react-i18next";
import { CardDropdown } from "./CardDropdown";

export default function FormikCardDropdown({ loadOptions, ...props }) {
  const [field, meta, helpers] = useField(props);

  return (
    <div>
      <CardDropdown
        options={loadOptions}
        onChange={(data) => helpers.setValue(data)}
        placeholder={props.placeholder}
        value={field.value}
        {...props}
      />
      <div style={{ height: "20px", fontSize: "11px" }}>
        {meta.error && meta.touched && (
          <div className="text-danger">
            <Trans i18nKey={meta.error} />
          </div>
        )}
      </div>
    </div>
  );
}