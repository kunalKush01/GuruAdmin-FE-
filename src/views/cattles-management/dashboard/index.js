import React, { useState } from "react";
import { Trans } from "react-i18next";
import { Nav, NavItem, NavLink } from "reactstrap";
import CattleDashboardCard from "../../../components/cattleDashboardCard";
import CattleTabBar from "../../../components/cattleTabBar";
import { ChangePeriodDropDown } from "../../../components/partials/changePeriodDropDown";
import { RevenueChart } from "../../../utility/revenueChart";
import { cattleHeader } from "../../../utility/subHeaderContent/cattleHeader";
import RecentRegisteredCattlesTable from "./recentRegisterdCattle";

const CattlesDashboard = () => {
  const [active, setActive] = useState(location.pathname);
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const periodDropDown = () => {
    switch (dropDownName) {
      case "dashboard_monthly":
        return "month";
      case "dashboard_yearly":
        return "year";
      case "dashboard_weekly":
        return "week";

      default:
        return "month";
    }
  };

  return (
    <div>
      <CattleTabBar tabs={cattleHeader} active={active} setActive={setActive} />

      <ChangePeriodDropDown
        allFilter
        dropDownName={dropDownName}
        setdropDownName={(e) => setdropDownName(e.target.name)}
      />

      <div className="d-flex gap-5 mt-2 mb-3">
        <CattleDashboardCard
          title="Total Registered Cattle"
          number="5000"
          showSubDetails
        />
        <CattleDashboardCard title="Total Registered Cattle" number="5000" />
        <CattleDashboardCard
          title="Total Registered Cattle"
          number="5000"
          showSubDetails
        />
        <CattleDashboardCard title="Total Registered Cattle" number="5000" />
      </div>

      <RevenueChart
        CattleData={[]}
        FeedData={[]}
        MedicalData={[]}
        DeathData={[]}
        MachineryData={[]}
        chartHeading="cattle_revenueHeading"
        // TotalExpensesData={chartData?.expenseAmountArr}
      />

      <RecentRegisteredCattlesTable data={[]} />
    </div>
  );
};

export default CattlesDashboard;
