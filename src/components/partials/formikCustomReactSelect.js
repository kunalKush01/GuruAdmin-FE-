import { useField } from "formik";
import React from "react";
import { CustomReactSelect } from "./customReactSelect";
import { Trans } from "react-i18next";

export default function FormikCustomReactSelect({
  loadOptions,
  required,
  ...props
}) {
  const [field, meta, helpers] = useField(props);

  return (
    <div>
      <CustomReactSelect
        loadOptions={loadOptions}
        onChange={(data) => helpers.setValue(data)}
        placeholder={props.placeholder}
        value={field.value}
        {...props}
        required={required}
      />
      <div className="reactselectlabel">
        {meta.error && meta.touched && (
          <div className="text-danger">
            <Trans i18nKey={meta.error} />
          </div>
        )}
      </div>
    </div>
  );
}
