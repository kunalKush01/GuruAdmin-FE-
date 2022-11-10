import { useState } from "react";
import { CustomDropDown } from "./customDropDown";

export const ChangePeriodDropDown = ({dropDownName,setdropDownName,...props}) => {
  

  const i18nKeyDropDownItemArray = [
    {
      id: 1,
      key: "dashboard_monthly",
    },
    {
      id: 2,
      key: "dashboard_weekly",
    },
    {
      id: 3,
      key: "dashboard_yearly",
    },
  ];
  return (
    <CustomDropDown
      defaultDropDownName={dropDownName}
      i18nKeyDropDownItemArray={i18nKeyDropDownItemArray}
      setdropDownName={setdropDownName}
      {...props}
    />
  );
};
