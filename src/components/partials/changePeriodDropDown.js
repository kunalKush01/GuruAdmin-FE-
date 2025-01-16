import { useEffect, useState } from "react";
import { CustomDropDown } from "./customDropDown";

export const ChangePeriodDropDown = ({
  dropDownName,
  setdropDownName,
  allFilter,
  isDashboard = false,
  ...props
}) => {
  
  const i18nKeyDropDownItemArray = [
    {
      id: 1,
      key: "All",
    },
    {
      id: 3,
      key: "dashboard_weekly",
    },
    {
      id: 2,
      key: "dashboard_monthly",
    },
    {
      id: 4,
      key: "dashboard_yearly",
    },
  ];

  const [dashboardAllLabelState, setDashboardAllLabelState] = useState(
    isDashboard 
      ? i18nKeyDropDownItemArray.filter(item => item.key !== "All")
      : i18nKeyDropDownItemArray
  );

  useEffect(() => {
    if (allFilter) {
      const baseArray = isDashboard 
        ? i18nKeyDropDownItemArray.filter(item => item.key !== "All")
        : i18nKeyDropDownItemArray;
        
      setDashboardAllLabelState([
        { id: 4, key: "dashboard_all" },
        ...baseArray,
      ]);
    }
  }, [isDashboard]);
  return (
    <CustomDropDown
      defaultDropDownName={dropDownName}
      i18nKeyDropDownItemArray={dashboardAllLabelState}
      handleDropDownClick={(e) => setdropDownName(e)}
      {...props}
    />
  );
};
