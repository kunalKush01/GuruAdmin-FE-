import React, { useState } from "react";
import { Trans } from "react-i18next";
import { Nav, NavItem, NavLink } from "reactstrap";
import CattleTabBar from "../../../components/cattleTabBar";
import { cattleHeader } from "../../../utility/subHeaderContent/cattleHeader";

const PregnancyReport = () => {
  const [active, setActive] = useState(location.pathname);

  return (
    <div>
      <CattleTabBar tabs={cattleHeader} active={active} setActive={setActive} />
      Pregnancy Report
    </div>
  );
};

export default PregnancyReport;
