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
import CustomCard from "../../components/partials/customCard";
import custcardImage3 from "../../assets/images/icons/dashBoard/Group 24887.svg";
import { useHistory } from "react-router-dom";
const Home = () => {
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  
  const { t } = useTranslation();
  const history = useHistory();

 
  return (
    <div>
      <ChangePeriodDropDown
      dropDownName={dropDownName}
      setdropDownName={(e)=>setdropDownName(e.target.name)}
      />
      <div className="d-flex justify-content-between mt-1 ">
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
        <div 
          className="cursor-pointer"
          onClick={() => history.push("/subscribed-user")}
        >
        <CustomCard
          cardTitle={t("dashboard_card_title3")}
          cardNumber={558487}
          cardImage={custcardImage3}
        />
        </div>
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
