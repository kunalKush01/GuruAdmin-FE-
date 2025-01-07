import { useEffect, useState } from "react";
import { CustomDropDown } from "./customDropDown";

export const ChangePeriodDropDown = ({
  dropDownName,
  setdropDownName,
  allFilter,
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
    i18nKeyDropDownItemArray
  );

  useEffect(() => {
    if (allFilter) {
      setDashboardAllLabelState([
        { id: 4, key: "dashboard_all" },
        ...i18nKeyDropDownItemArray,
      ]);
    }
  }, []);
  return (
    <CustomDropDown
      defaultDropDownName={dropDownName}
      i18nKeyDropDownItemArray={dashboardAllLabelState}
      handleDropDownClick={(e) => setdropDownName(e)}
      {...props}
    />
  );
};
