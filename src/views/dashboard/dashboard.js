import moment from "moment";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "reactstrap";
import SpinnerComponent from "../../@core/components/spinner/Fallback-spinner";
import {
  getAllChartData,
  getAllDashboardData,
  getAllRecentDonationList,
  getAllTopDonor,
} from "../../api/dashboard";
import custcardImage3 from "../../assets/images/icons/dashBoard/Group 24887.svg";
import RecentDonationTable from "../../components/dashboard/recentDonationTable";
import { TopDonerList } from "../../components/dashboard/topDonerList";
import { ChangePeriodDropDown } from "../../components/partials/changePeriodDropDown";
import CustomCard from "../../components/partials/customCard";
import { setCookieWithMainDomain } from "../../utility/formater";
import { RevenueChart } from "../../utility/revenueChart";
import DashboardStatsCard from "../../utility/ui-elements/cards/statistics/DashboardStatsCard";
import "../../assets/scss/viewCommon.scss";

const Home = () => {
  const { t } = useTranslation();
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const [dashboardData, setDashboardData] = useState();
  const [topDonorData, setTopDonorData] = useState();
  const [recentDonationData, setRecentDonationData] = useState();
  const [chartData, setChart] = useState();

  const navigate = useNavigate();

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
        <title>Apna Dharm Admin | Dashboard</title>
      </Helmet>
      {dashboardData && chartData && topDonorData && recentDonationData ? (
        <div>
          <ChangePeriodDropDown
            allFilter
            dropDownName={dropDownName}
            setdropDownName={(e) => setdropDownName(e.target.name)}
            isDashboard={true}
          />
          <div className="d-flex flex-wrap gap-1 justify-content-between mt-1 mb-lg-1 dashboard-cards-wrapper">
            <DashboardStatsCard
              statTitle={t("dashboard_donationReceived")}
              stats={parseInt(dashboardData?.donationReceived ?? 0)}
              warning={"primary"}
              data={dashboardData?.donationReceivedArr}
              SeriesName={"Donation Received"}
            />
            <DashboardStatsCard
              statTitle={t("dashboard_donationPending")}
              stats={parseInt(dashboardData?.donationPending ?? 0)}
              warning={"primary"}
              data={dashboardData?.donationPendingArr}
              SeriesName={"Donation Pending"}
            />
            <DashboardStatsCard
              statTitle={t("dashboard_totalExpenses")}
              stats={parseInt(dashboardData?.totalExpenses ?? 0)}
              warning={"primary"}
              data={dashboardData?.totalExpensesArr}
              SeriesName={"Total Expenses"}
            />
            <div
              className="cursor-pointer"
              onClick={() => navigate("/subscribed-user")}
            >
              <CustomCard
                cardTitle={t("dashboard_card_title3")}
                cardNumber={parseInt(dashboardData?.subscribedUsers ?? 0)}
                cardImage={custcardImage3}
              />
            </div>
          </div>
          <RevenueChart
            CommitmentData={chartData?.pendingAmountArr}
            DonationData={chartData?.donationAmountArr}
            ExpenseData={chartData?.expenseAmountArr}
            chartHeading="dashboard_RevenueReport"
          />

          <Row>
            <Col xs={12} md={5} lg={12} className="mt-3 mt-md-0">
              {topDonorData?.results?.length > 0 && (
                <TopDonerList data={topDonorData?.results} />
              )}
            </Col>
          </Row>
        </div>
      ) : (
        <SpinnerComponent />
      )}
    </>
  );
};

export default Home;
