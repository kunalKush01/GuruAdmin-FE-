import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  CardLink,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import { Doughnut } from "react-chartjs-2";
import OrdersReceived from "../../utility/ui-elements/cards/statistics/OrdersReceived";
// import dropDownIcon from "../assets/images/icons/dashBoard/dropDownIcon.svg";
import { useTranslation, Trans } from "react-i18next";
import { RevenueChart } from "../../utility/revenueChart";
import { RecentDonationTable } from "../../components/dashboard/recentDonationTable";
import { TopDonerList } from "../../components/dashboard/topDonerList";
import { useState } from "react";
import styled from "styled-components";
import { CustomDropDown } from "../../components/partials/customDropDown";
import { ChangePeriodDropDown } from "../../components/partials/changePeriodDropDown";
const Home = () => {
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  
  const { t } = useTranslation();
  

 
  return (
    <div>
      <ChangePeriodDropDown
      dropDownName={dropDownName}
      setdropDownName={(e)=>setdropDownName(e.target.name)}
      />
      <div className="d-flex justify-content-between ">
        <OrdersReceived
          statTitle={t("dashboard_donationReceived")}
          stats={525000}
          warning={"primary"}
        />
        <OrdersReceived
          statTitle={t("dashboard_donationPending")}
          stats={525000}
          warning={"primary"}
        />
        <OrdersReceived
          statTitle={t("dashboard_totalExpenses")}
          stats={525000}
          warning={"primary"}
        />
      </div>

      <RevenueChart />
      <div className="d-flex mt-1">
        <RecentDonationTable />
        <TopDonerList />
      </div>
    </div>
  );
};

export default Home;
