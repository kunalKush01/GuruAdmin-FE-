import { useField } from "formik";
import React from "react";
import { CustomReactSelect } from "./customReactSelect";
import { Trans } from "react-i18next";
import "../../assets/scss/viewCommon.scss";

export default function FormikCustomReactSelect({ loadOptions, ...props }) {
  const [field, meta, helpers] = useField(props);

  return (
    <div>
      <CustomReactSelect
        loadOptions={loadOptions}
        onChange={(data) => helpers.setValue(data)}
        placeholder={props.placeholder}
        //value={selectedOption || field.value}
        value={field.value}
        {...props}
      />
      <div classname="reactselectlabel">
        {meta.error && meta.touched && (
          <div className="text-danger">
            <Trans i18nKey={meta.error} />
          </div>
        )}
      </div>
    </div>
  );
}
