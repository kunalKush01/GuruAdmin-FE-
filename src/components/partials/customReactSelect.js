import React from "react";
import ReactSelect from "react-select";
import { Trans } from "react-i18next";
import { useField } from "formik";
import styled from "styled-components";
import "../../../src/styles/common.scss";

;
export const CustomReactSelect = ({
  required = false,
  label,
  loadOptions,
  labelKey = "label",
  valueKey = "value",
  placeholder,
  multiple = false,
  isClearable = true,
  ...props
}) => {
  const customStyles = {
    container: (provided, state) => ({
      ...provided,
      color: "#583703",
    }),
    option: (provided, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...provided,
        color: isSelected && !isFocused ? "#FF8744" : isFocused && "#fff",
        backgroundColor: isFocused ? "#FF8744" : "#FFF7E8",
        // color:isFocused ? "#fff" : "#583703",
        "&:hover": {
          color: "#fff",
          backgroundColor: "#FF8744",
        },
      };
    },
    menuList: (provided) => {
      return {
        ...provided,
        backgroundColor: "#FFF7E8",
        color: "#583703",
        // width: "fit-content"  ,
        maxHeight: "150px",
        zIndex: "50000000000000010000",
        font: "normal normal normal 15px/20px Noto Sans",
        "::-webkit-scrollbar": {
          display: "none",
        },
      };
    },

    noOptionsMessage: (provided, state) => ({
      ...provided,
      // backgroundColor: DARK_GREY,
      // borderColor: DARK_BLUE_MUTED,
    }),
    control: (provided) => {
      return {
        ...provided,
        width: `${props.width ?? "200px"}`,
        color: "grey",
        backgroundColor: `${props.outlined ? "" : "#FFF7E8"}`,
        boxShadow: "none",
        border: `${props.outlined ? "1px solid #FF8744" : "none"}`,
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
      opacity: "60%",
      // color: "#583703 ",
      color: `${props.color ?? "#583703"}`,
      font: "normal normal bold 13px/20px Noto Sans",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0px 8px",
      flexWrap: "nowrap",
      overflow: "auto",
      // overflow: "hidden",
      "::-webkit-scrollbar": {
        height: " 5px",
      },
      "::-webkit-scrollbar-thumb": {
        backgroundColor: "#c9c6c5 !important",
        borderRadius: " 25px",
      },
    }),
    multiValueContainer: (style) => {
      return {
        ...style,
        background: "red !importnt",
      };
    },

    multiValue: (styles) => {
      return {
        ...styles,
        border: "1px solid #E1DFEC",
        background: "inherit",
        minWidth: "100px",
        borderRadius: "50px",
      };
    },
    multiValue: (styles) => {
      return {
        ...styles,
        border: "1px solid #000000",
        background: "inherit",
        minWidth: "100px",
        borderRadius: "10px",
        ":hover": {
          borderColor: "rgba(0, 0, 0, 0.87)",
        },
      };
    },
    multiValueLabel: (styles) => {
      return {
        ...styles,
        color: "#583703",
        textOverflow: "ellipsis",
        padding: "0px",
        overflow: "hidden",
      };
    },
    multiValueRemove: (styles, { data }) => ({
      ...styles,

      ":hover": {
        backgroundColor: data.color,
      },
    }),
  };
  // const [field, meta, helpers] = useField(props);
  return (
    <div className="reactselectwrapper">
      {props.labelName && (
        <div style={{ font: "normal normal bold 15px/33px Noto Sans" }}>
          {`${props.labelName}`}
          {required && "*"}
        </div>
      )}
      <ReactSelect
        isDisabled={props.disabled}
        isMulti={multiple}
        name={props.name}
        debounceTimeout={300}
        cacheOptions
        placeholder={placeholder}
        isClearable={isClearable}
        options={loadOptions}
        getOptionValue={(option) => option[valueKey]}
        getOptionLabel={(option) => option[labelKey]}
        styles={customStyles}
        {...props}
      />
    </div>
  );
};
