import React from "react";
import { CustomReactSelect } from "./customReactSelect";
import styled from "styled-components";

const CardOption = styled.div`
  padding: 12px;
  border: 1px solid #E1DFEC;
  border-radius: 8px;
  background-color: #FFFFFF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CardLabel = styled.span`
  font-weight: 600;
  color: #583703;
  font-size: 0.9em;
`;

const CardValue = styled.span`
  color: #583703;
  text-align: right;
  font-size: 0.9em;
`;

const CardTitle = styled(CardValue)`
  font-weight: 700;
  font-size: 1em;
`;

const CardDescription = styled(CardValue)`
  opacity: 0.8;
`;

const CommitmentId = styled(CardValue)`
  font-family: monospace;
  background-color: #F0F0F0;
  padding: 2px 4px;
  border-radius: 4px;
`;

const Amount = styled(CardValue)`
  font-weight: 600;
  color: #28a745;
`;

export const CardDropdown = ({ options, backgroundColor = "#FCF5E7", ...props }) => {
  const customStyles = {
    ...props.styles,
    control: (provided, state) => ({
      ...provided,
      backgroundColor: backgroundColor,
      borderColor: state.isFocused ? "#FF8744" : "#FCF5E7",
      boxShadow: state.isFocused ? "0 0 0 1px #FF8744" : "none",
      "&:hover": {
        borderColor: "#FF8744",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      padding: "4px",
      backgroundColor: "transparent",
      color: "#583703",
      "&:hover": {
        backgroundColor: "transparent",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#583703",
      font: "normal normal bold 13px/20px Noto Sans",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "transparent",
      boxShadow: "none",
      border: "none",
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0,
    }),
  };

  const formatOptionLabel = (option, { context }) => {
    if (context === 'menu') {
      return (
        <CardOption> 
          <CardRow>
            <CardLabel>Category:</CardLabel>
            <CardTitle>{option.masterCategoryId.name}</CardTitle>
          </CardRow>
          <CardRow>
            <CardLabel>Subcategory:</CardLabel>
            <CardDescription>{option.categoryId.name}</CardDescription>
          </CardRow>
          <CardRow>
            <CardLabel>Commitment ID:</CardLabel>
            <CommitmentId>{option.commitmentId}</CommitmentId>
          </CardRow>
          <CardRow>
            <CardLabel>Amount:</CardLabel>
            <Amount>₹{option.amount}</Amount>
          </CardRow>
        </CardOption>
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
    />
  );
};