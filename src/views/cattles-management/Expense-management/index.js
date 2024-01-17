import React, { useState } from "react";

import CattleTabBar from "../../../components/cattleTabBar";
import { cattleHeader } from "../../../utility/subHeaderContent/cattleHeader";

const ExpenseManagement = () => {
  const [active, setActive] = useState(location.pathname);

  return (
    <div>
      <CattleTabBar tabs={cattleHeader} active={active} setActive={setActive} />
      Expense Management
    </div>
  );
};

export default ExpenseManagement;
