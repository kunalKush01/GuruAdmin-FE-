import moment from "moment";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
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
import OrdersReceived from "../../utility/ui-elements/cards/statistics/OrdersReceived";
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

  const tokens = useSelector((state) => state?.auth?.tokens);

  setCookieWithMainDomain(
    "refreshToken",
    tokens?.refreshToken,
    ".paridhan.app"
  );
  setCookieWithMainDomain("accessToken", tokens?.accessToken, ".paridhan.app");

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

  useEffect(
    () => {
      const chartInfo = async () => {
        const chartRes = await getAllChartData();
        //   {
        //   startDate: filterStartDate,
        //   endDate: filterEndDate,
        // }
        setChart(chartRes);
      };
      chartInfo();
    },
    [
      // filterStartDate,filterEndDate
    ]
  );

  useEffect(
    () => {
      const topDonorInfo = async () => {
        const topDonorRes = await getAllTopDonor();
        //   {
        //   startDate: filterStartDate,
        //   endDate: filterEndDate,
        // }
        setTopDonorData(topDonorRes);
      };
      topDonorInfo();
    },
    [
      // filterStartDate,filterEndDate
    ]
  );

  useEffect(
    () => {
      const recentDonationInfo = async () => {
        const recentDonationRes = await getAllRecentDonationList();
        //   {
        //   startDate: filterStartDate,
        //   endDate: filterEndDate,
        // }
        setRecentDonationData(recentDonationRes);
      };
      recentDonationInfo();
    },
    [
      // filterStartDate,filterEndDate
    ]
  );

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Mandir Admin | Dashboard</title>
      </Helmet>
      {dashboardData && chartData && topDonorData && recentDonationData ? (
        <div className="pb-4">
          <ChangePeriodDropDown
            allFilter
            dropDownName={dropDownName}
            setdropDownName={(e) => setdropDownName(e.target.name)}
          />
          <div className="d-flex flex-wrap gap-1 justify-content-between mt-1 mb-lg-3">
            <OrdersReceived
              statTitle={t("dashboard_donationReceived")}
              stats={parseInt(
                dashboardData?.donationReceived === undefined
                  ? 0
                  : dashboardData?.donationReceived
              )}
              warning={"primary"}
              data={dashboardData?.donationReceivedArr}
              SeriesName={"Donation Recieved"}
            />
            <OrdersReceived
              statTitle={t("dashboard_donationPending")}
              stats={parseInt(
                dashboardData?.donationPending === undefined
                  ? 0
                  : dashboardData?.donationPending
              )}
              warning={"primary"}
              data={dashboardData?.donationPendingArr}
              SeriesName={"Donation Pending"}
            />
            <OrdersReceived
              statTitle={t("dashboard_totalExpenses")}
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
              onClick={() => history.push("/subscribed-user")}
            >
              <CustomCard
                cardTitle={t("dashboard_card_title3")}
                cardNumber={parseInt(
                  dashboardData?.subscribedUsers === undefined
                    ? 0
                    : dashboardData?.subscribedUsers
                )}
                cardImage={custcardImage3}
              />
            </div>
          </div>

          <RevenueChart
            CommittmentData={chartData?.totalCommitmentArr}
            DonationData={chartData?.donationAmountArr}
            // TotalExpensesData={chartData?.expenseAmountArr}
          />

          <Row>
            <Col xs={12} md={7} lg={9}>
              <RecentDonationTable data={recentDonationData?.results} />
            </Col>
            <Col xs={12} md={5} lg={3} className="mt-3 mt-md-0">
              {topDonorData?.results?.length > 0 ? (
                <TopDonerList data={topDonorData?.results} />
              ) : (
                ""
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
