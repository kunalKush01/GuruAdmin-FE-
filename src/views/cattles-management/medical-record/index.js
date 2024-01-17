import React, { useState } from "react";
import { Trans } from "react-i18next";
import { Nav, NavItem, NavLink } from "reactstrap";
import CattleTabBar from "../../../components/cattleTabBar";
import { cattleHeader } from "../../../utility/subHeaderContent/cattleHeader";

const CattlesMedical = () => {
  const [active, setActive] = useState(location.pathname);

  return (
    <div>
      <CattleTabBar tabs={cattleHeader} active={active} setActive={setActive} />
      Medical Report
    </div>
  );
};

export default CattlesMedical;
