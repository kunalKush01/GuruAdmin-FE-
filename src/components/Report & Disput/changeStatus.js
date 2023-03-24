import { useState } from "react";
import CustomDataTable from "../partials/CustomDataTable";
import { CustomDropDown } from "../partials/customDropDown";

export const ChangeStatus = ({dropDownName,setdropDownName,...props}) => {
  

  const i18nKeyDropDownItemArray = [
    {
      id: 1,
      key: "All",
    },
    {
      id: 2,
      key: "report_panding",
    },
    {
      id: 3,
      key: "commitment_complete",
    },
  ];
  return (
    <CustomDropDown
      defaultDropDownName={dropDownName}
      i18nKeyDropDownItemArray={i18nKeyDropDownItemArray}
      handleDropDownClick={(e)=>setdropDownName(e)}
      {...props}
    />
  );
};
