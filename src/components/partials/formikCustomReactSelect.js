import { useField } from "formik";
import React from "react";
import { CustomReactSelect } from "./customReactSelect";

export default function FormikCustomReactSelect({ loadOptions, ...props }) {
  const [field, meta, helpers] = useField(props);

  return (
    <div>
      <CustomReactSelect
        loadOptions={loadOptions}
        onChange={(data) => helpers.setValue(data)}
        value={field.value}
        {...props}
      />
    </div>
  );
}
