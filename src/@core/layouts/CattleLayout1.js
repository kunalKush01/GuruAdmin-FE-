import React, { useState } from "react";
import CattleTabBar from "../../components/cattleTabBar";
import { cattleHeader } from "../../utility/subHeaderContent/cattleHeader";

const CattleLayout1 = ({ children }) => {
  const [active, setActive] = useState(location.pathname);

  return (
    <div className="bg-danger " style={{ height: "calc(100dvh - 155px)" }}>
      <CattleTabBar tabs={cattleHeader} active={active} setActive={setActive} />

      <div
        className="overflow-auto bg-success"
        style={{ height: "calc(100% - 52px)" }}
      >
        {children}
      </div>
    </div>
  );
};

export default CattleLayout1;
