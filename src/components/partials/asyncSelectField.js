import React, { useEffect, useState } from "react";
import { useField } from "formik";

import AsyncSelect from "react-select/async";
// import { DARK_BLUE_MUTED, DARK_GREY } from "../../theme";

export default function AsyncSelectField({
  label,
  loadOptions,
  labelKey = "label",
  valueKey = "value",
  placeholder,
  value,
  multiple = false,
  isClearable = true,
  ...props
}) {
  const [field, meta, helpers] = useField(props);

  const customStyles = {
    container: (provided, state) => ({
      ...provided,
      color: "#583703",
    }),
    option: (provided, { data, isDisabled, isFocused, isSelected }) => {
      console.log("provided",provided);
      return({
      ...provided,
      color:isSelected&&"#FF8744",
      backgroundColor: "#FFF7E8",
      "&:hover":{
        color:"#fff",
        backgroundColor:"#FF8744"
      },
      
      
      
    })},
    menuList: (provided) => {
      
      return({
      ...provided,
      backgroundColor: "#FFF7E8",
      color: "#583703",
      font: "normal normal bold 15px/20px Noto Sans",
      "::-webkit-scrollbar":{
        display:"none"
      },
      
      
    })},
    
    noOptionsMessage: (provided, state) => ({
      ...provided,
      // backgroundColor: DARK_GREY,
      // borderColor: DARK_BLUE_MUTED,
    }),
    control: (provided) => {
      return {
        ...provided,

        color: "grey",
        border: "1px solid white",
        backgroundColor: "#FFF7E8",
        boxShadow: "none",
        "&:hover": {
          border: "1px solid #FF8744",
        },
      };
    },
    input: (provided) => ({
      ...provided,
      margin: "0px",
      color: "#583703",
      font: "normal normal normal 13px/20px Noto Sans",
    }),
    singleValue: (provided) => ({
      ...provided,
      margin: "0px",
      color: "#583703",
      font: "normal normal bold 13px/20px Noto Sans",
      
    }),
    placeholder: (provided) => ({
      ...provided,
      margin: "0px",
      color: "#583703",
      font: "normal normal bold 13px/20px Noto Sans",
      
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0px 8px",
    }),
  };

  return (
    <div className="mb-2">
      <label style={{ marginBottom: "8px" }}>{label}</label>
      <AsyncSelect
        isMulti={multiple}
        name={field.name}
        debounceTimeout={300}
        cacheOptions
        defaultOptions
        placeholder={placeholder}
        isClearable={isClearable}
        loadOptions={loadOptions}
        getOptionValue={(option) => option[valueKey]}
        getOptionLabel={(option) => option[labelKey]}
        value={field.value}
        styles={customStyles}
        onChange={(data) => {
          helpers.setValue(data)

        }}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className="field-error text-danger">{meta.error}</div>
      ) : null}
    </div>
  );
}
