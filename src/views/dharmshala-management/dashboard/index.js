import moment from "moment";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Col, Row } from "reactstrap";
import SpinnerComponent from "../../../@core/components/spinner/Fallback-spinner";

import {
  getAllChartData,
  getAllDashboardData,
  getAllRecentDonationList,
  getAllTopDonor,
} from "../../../api/dashboard";
import custcardImage3 from "../../../assets/images/icons/dashBoard/Group 24887.svg";
import RecentDonationTable from "../../../components/dashboard/recentDonationTable";
import { TopDonerList } from "../../../components/dashboard/topDonerList";
import { ChangePeriodDropDown } from "../../../components/partials/changePeriodDropDown";
import CustomCard from "../../../components/partials/customCard";
import { setCookieWithMainDomain } from "../../../utility/formater";
import { RevenueChart } from "../../../utility/revenueChart";
import DashboardStatsCard from "../../../utility/ui-elements/cards/statistics/DashboardStatsCard";
const Home = () => {
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const [dashboardData, setDashboardData] = useState();
  const [topDonorData, setTopDonorData] = useState();
  const [recentDonationData, setRecentDonationData] = useState();
  const [chartData, setChart] = useState();

  const { t } = useTranslation();
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
  let filterStartDate = moment()
    .startOf(periodDropDown())
    .utcOffset(0, true)
    .toISOString();
  let filterEndDate = moment()
    .endOf(periodDropDown())
    .utcOffset(0, true)
    .toISOString();

  const history = useHistory();

  useEffect(() => {
    const dashboardInfo = async () => {
      const res = await getAllDashboardData({
        startDate: dropDownName === "dashboard_all" ? "" : filterStartDate,
        endDate: dropDownName === "dashboard_all" ? "" : filterEndDate,
      });
      setDashboardData(res);
    };
    dashboardInfo();
  }, [filterStartDate, filterEndDate, dropDownName]);

  useEffect(() => {
    const chartInfo = async () => {
      const chartRes = await getAllChartData();
      setChart(chartRes);
    };
    chartInfo();
  }, []);

  useEffect(() => {
    const topDonorInfo = async () => {
      const topDonorRes = await getAllTopDonor();

      setTopDonorData(topDonorRes);
    };
    topDonorInfo();
  }, []);

  useEffect(() => {
    const recentDonationInfo = async () => {
      const recentDonationRes = await getAllRecentDonationList();

      setRecentDonationData(recentDonationRes);
    };
    recentDonationInfo();
  }, []);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm | Dharmshala Dashboard</title>
      </Helmet>
      {dashboardData && chartData && topDonorData && recentDonationData ? (
        <div className="pb-4">
          <ChangePeriodDropDown
            allFilter
            dropDownName={dropDownName}
            setdropDownName={(e) => setdropDownName(e.target.name)}
          />
          <div className="d-flex flex-wrap gap-1 justify-content-between mt-1 mb-lg-3">
            <DashboardStatsCard
              statTitle={t("total_rooms_available")}
              stats={parseInt(
                dashboardData?.donationReceived === undefined
                  ? 0
                  : dashboardData?.donationReceived
              )}
              warning={"primary"}
              data={dashboardData?.donationReceivedArr}
              SeriesName={"Donation Received"}
            />
            <DashboardStatsCard
              statTitle={t("roomtypes_available")}
              stats={parseInt(
                dashboardData?.donationPending === undefined
                  ? 0
                  : dashboardData?.donationPending
              )}
              warning={"primary"}
              data={dashboardData?.donationPendingArr}
              SeriesName={"Donation Pending"}
            />
            <DashboardStatsCard
              statTitle={t("total_bookings")}
              stats={parseInt(
                dashboardData?.totalExpenses === undefined
                  ? 0
                  : dashboardData?.totalExpenses
              )}
              warning={"primary"}
              data={dashboardData?.totalExpensesArr}
              SeriesName={"Total Expenses"}
            />
            <div
              className="cursor-pointer"
              onClick={() => history.push("/dharmshala/info")}
            >
              <CustomCard
                cardTitle={t("buildings_registered")}
                cardNumber={parseInt(
                  dashboardData?.subscribedUsers === undefined
                    ? 0
                    : dashboardData?.subscribedUsers
                )}
                cardImage={custcardImage3}
              />
            </div>
          </div>
        </div>
      ) : (
        <SpinnerComponent />
      )}
    </>
  );
};

export default Home;
