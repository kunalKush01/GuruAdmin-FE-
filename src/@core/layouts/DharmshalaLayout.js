import React, { useState } from "react";
import DharmshalaTabBar from "../../components/dharmshalaTabBar";
import { dharmshalaHeader } from "../../utility/subHeaderContent/dharmshalaHeader";


const DharmshalaLayout = ({ children }) => {
  const [active, setActive] = useState(location.pathname);

  return (
    <div className="bg-danger " style={{ height: "calc(100dvh - 155px)" }}>
      <DharmshalaTabBar
        tabs={dharmshalaHeader}
        active={active}
        setActive={setActive}
      />

      <div
        className="overflow-auto bg-success"
        style={{ height: "calc(100% - 52px)" }}
      >
        {children}
      </div>
    </div>
  );
};

export default DharmshalaLayout;
