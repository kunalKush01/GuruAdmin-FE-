import React from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import "../../../assets/scss/viewCommon.scss"; // Import custom styles

const DharmshalaDashboardStatsCard = ({ dashboardData }) => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm | Dharmshala Dashboard</title>
      </Helmet>
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h3>{t("available_rooms")}</h3>
          <p>{dashboardData.availableRooms}</p>
        </div>
        <div className="dashboard-card">
          <h3>{t("occupied_rooms")}</h3>
          <p>{dashboardData.occupiedRooms}</p>
        </div>
        <div className="dashboard-card">
          <h3>{t("expected_check_ins")}</h3>
          <p>{dashboardData.expectedCheckIns}</p>
        </div>
        <div className="dashboard-card">
          <h3>{t("expected_checkouts")}</h3>
          <p>{dashboardData.expectedCheckouts}</p>
        </div>
        <div className="dashboard-card">
          <h3>{t("open_booking_requests")}</h3>
          <p>{dashboardData.openBookingRequests}</p>
        </div>
      </div>
    </>
  );
};

export default DharmshalaDashboardStatsCard;
