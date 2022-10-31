import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  CardLink,
} from "reactstrap";
import { Doughnut } from "react-chartjs-2";
import OrdersReceived from '../utility/ui-elements/cards/statistics/OrdersReceived'

import { useTranslation } from "react-i18next";
import { RevenueChart } from "../utility/revenueChart";
import { RecentDonationTable } from "../utility/table/recentDonationTable";
import { TopDonerList } from "../utility/table/topDonerList";
const Home = () => {
  const {t}= useTranslation()
  const kFormatter = num => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)
  return (
    <div>
      <div className="d-flex justify-content-between " >

      <OrdersReceived statTitle={t("dashboard_donationReceived")} stats={525000} warning={"primary"} />
      <OrdersReceived statTitle={t("dashboard_donationPending")} stats={525000} warning={"primary"} />
      <OrdersReceived statTitle={t("dashboard_totalExpenses")} stats={525000} warning={"primary"} />
      </div>
      
      <RevenueChart/>
      <div className="d-flex mt-1" >

      <RecentDonationTable/>
      <TopDonerList/>
      </div>
      
    </div>
  );
};

export default Home;
