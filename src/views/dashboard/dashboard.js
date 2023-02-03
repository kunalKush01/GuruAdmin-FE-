import OrdersReceived from "../../utility/ui-elements/cards/statistics/OrdersReceived";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { getAllChartData, getAllDashboardData, getAllRecentDonationList, getAllTopDonor } from "../../api/dashboard";
import custcardImage3 from "../../assets/images/icons/dashBoard/Group 24887.svg";
import RecentDonationTable from "../../components/dashboard/recentDonationTable";
import { TopDonerList } from "../../components/dashboard/topDonerList";
import { ChangePeriodDropDown } from "../../components/partials/changePeriodDropDown";
import CustomCard from "../../components/partials/customCard";
import { RevenueChart } from "../../utility/revenueChart";
import { Col, Row } from "reactstrap";
const Home = () => {
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const [dashboardData,setDashboardData] = useState();
  const [topDonorData,setTopDonorData] = useState();
  const [recentDonationData,setRecentDonationData] = useState();
  const [chartData,setChart] = useState();

  const { t } = useTranslation();
  const history = useHistory();
  
 
useEffect(()=>{
 const dashboardInfo= async()=>{
   const res= await getAllDashboardData()
    setDashboardData(res)
  }
  dashboardInfo()
},[]);

useEffect(()=>{
  const chartInfo= async()=>{
    const chartRes= await getAllChartData()
    setChart(chartRes)
   }
   chartInfo()
 },[]);

useEffect(()=>{
  const topDonorInfo= async()=>{
    const topDonorRes= await getAllTopDonor()
    setTopDonorData(topDonorRes)
   }
   topDonorInfo()
 },[]);
 
 useEffect(()=>{
  const recentDonationInfo= async()=>{
    const recentDonationRes = await getAllRecentDonationList()
    setRecentDonationData(recentDonationRes)
   }
   recentDonationInfo()
 },[]);
 
 return (
    <>
    {dashboardData&&<div className="pb-4">
      <ChangePeriodDropDown
      dropDownName={dropDownName}
      setdropDownName={(e)=>setdropDownName(e.target.name)}
      />
      <div className="d-flex justify-content-between mt-1">
        <OrdersReceived
          statTitle={t("dashboard_donationReceived")}
          stats={parseInt(dashboardData?.donationReceived)}
          warning={"primary"}
          data={dashboardData?.donationReceivedArr}
          SeriesName={"Donation Recieved"}
          
        />
        <OrdersReceived
          statTitle={t("dashboard_donationPending")}
          stats={parseInt(dashboardData?.donationPending)}
          warning={"primary"}
          data={dashboardData?.donationPendingArr}
          SeriesName={"Donation Pending"}
        />
        <OrdersReceived
          statTitle={t("dashboard_totalExpenses")}
          stats={parseInt(dashboardData?.totalExpenses)}
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
          cardNumber={parseInt(dashboardData?.subscribedUsers)}
          cardImage={custcardImage3}
        />
        </div>
      </div>

      <RevenueChart 
          CommittmentData={chartData?.totalCommitmentArr} 
          DonationData={chartData?.donationAmountArr} 
          TotalExpensesData={chartData?.expenseAmountArr} 
      />
      
      <Row>
        <Col xs={9}>
        <RecentDonationTable data={recentDonationData?.results} />
        </Col>
        <Col xs={3} >
        <TopDonerList data={topDonorData?.results} />
        </Col>
      </Row>
      
    </div>
}    </>
  );
};

export default Home;
