import React from "react";
import { CustomReactSelect } from "./customReactSelect";
import '../../assets/scss/viewCommon.scss';
import "../../assets/scss/variables/_variables.scss";

export const CardDropdown = ({ options, backgroundColor = 'var(--secondary-color)', ...props }) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: backgroundColor,
      minHeight: '38px',
      height: '38px',
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: '38px',
      padding: '0 6px',
    }),
    input: (provided) => ({
      ...provided,
      margin: '0px',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '38px',
    }),
    option: () => ({}),
    menu: (provided) => ({
      ...provided,
      maxHeight: '300px',
      overflowY: 'auto',
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '300px',
      overflowY: 'auto',
    }),
    placeholder: (provided) => ({
        ...provided,
        color: 'var(--font-color)',
        opacity:'60%'
      }),
  };

  const formatOptionLabel = (option, { context }) => {
    if (context === 'menu') {
      return (
        <div className="card-option"> 
          <div className="card-row">
            <span className="card-label">Commitment ID:</span>
            <span className="commitment-id">{option.commitmentId}</span>
          </div>
          <div className="card-row">
            <span className="card-label">Category:</span>
            <span className="card-title">{option.masterCategoryId.name}</span>
          </div>
          <div className="card-row">
            <span className="card-label">Subcategory:</span>
            <span className="card-description">{option.categoryId.name}</span>
          </div>
          <div className="card-row">
            <span className="card-label">Amount:</span>
            <span className="amount">₹{option.amount}</span>
          </div>
        </div>
      );
    }
    return option.commitmentId;
  };

  return (
    <CustomReactSelect
      {...props}
      options={options}
      styles={customStyles}
      formatOptionLabel={formatOptionLabel}
      classNamePrefix="card-dropdown"
      maxMenuHeight={300}
    />
  );
};