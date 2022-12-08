import React from "react";
import ReactSelect from "react-select";

export const CustomReactSelect = ({
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
      console.log("provided", provided);
      return {
        ...provided,
        color: isSelected && "#FF8744",
        backgroundColor: "#FFF7E8",
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
        font: "normal normal bold 15px/20px Noto Sans",
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
        border: "1px solid white",
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
      color: "#583703",
      font: "normal normal bold 13px/20px Noto Sans",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0px 8px",
    }),
  };

  return (
    <div>
      {props.labelName && (
        <div style={{ font: "normal normal bold 15px/33px Noto Sans" }}>
          {props.labelName}*
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
