import React, { useEffect, useState } from "react";
import { useField } from "formik";

import AsyncSelect from "react-select/async";
import {Trans} from "react-i18next";
// import { DARK_BLUE_MUTED, DARK_GREY } from "../../theme";

export default function AsyncSelectField({
  label,
  required=false,
  loadOptions,
  isSearchable,
  minHeight,
  labelKey = "label",
  valueKey = "value",
  placeholder,
  value,
  filterOption,
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
      return({
      ...provided,
      color:isSelected&&"#FF8744",
      backgroundColor: isFocused ? "#FF8744" : "#FFF7E8",
      color:isFocused ? "#fff" : "#583703",
        zIndex:2,
      "&:hover":{
        color:"#fff",
        backgroundColor:"#FF8744"
      },
      
      
      
    })},
    menuList: (provided) => {
      
      return({
      ...provided,
      backgroundColor: "#FFF7E8",
      zIndex:999999,
      color: "#583703",
      maxHeight:"150px",
      font: "normal normal normal 15px/20px Noto Sans",
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
      opacity:"60%",
      font: "normal normal bold 13px/20px Noto Sans",
      
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0px 8px",
    }),
  };

  return (
    <div >
      <label style={{ marginBottom: "0px",font: "normal normal bold 15px/28px Noto Sans" }}>{label}{required&&"*"}</label>
      <AsyncSelect
        isDisabled={props.disabled}
        isMulti={multiple}
        name={field.name}
        debounceTimeout={300}
        cacheOptions
        minMenuHeight={minHeight}
        filterOption={filterOption}
        defaultOptions
        placeholder={placeholder}
        isSearchable={isSearchable}
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
      <div style={{ height: "20px",fontSize:"11px" }}>
        {meta.error && meta.touched && (
            <div className="text-danger">
              <Trans i18nKey={meta.error} />
            </div>
        )}
      </div>
    </div>
  );
}
