import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import SpinnerComponent from "../../../@core/components/spinner/Fallback-spinner";

import {
  getAvailableRooms,
  getOccupiedRooms,
  getExpectedCheckIns,
  getExpectedCheckouts,
  getOpenBookingRequests,
} from "../../../api/dharmshala/dharmshalaInfo"; 

import DharmshalaDashboardStatsCard from "./DharmshalaDashboardStatsCard"; // New component import

const Home = () => {
  const [dashboardData, setDashboardData] = useState({
    availableRooms: 0,
    occupiedRooms: 0,
    expectedCheckIns: 0,
    expectedCheckouts: 0,
    openBookingRequests: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const { t } = useTranslation();

  const ensureNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  const extractValue = (response, key) => {
    if (response && typeof response === 'object' && key in response) {
      console.log(`Extracting ${key}:`, response[key]); 
      return ensureNumber(response[key]);
    }
    return 0;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          availableRoomsRes,
          occupiedRoomsRes,
          expectedCheckInsRes,
          expectedCheckoutsRes,
          openBookingRequestsRes,
        ] = await Promise.all([
          getAvailableRooms(),
          getOccupiedRooms(),
          getExpectedCheckIns(),
          getExpectedCheckouts(),
          getOpenBookingRequests(),
        ]);

        setDashboardData({
          availableRooms: extractValue(availableRoomsRes, 'availableRooms'),
          occupiedRooms: extractValue(occupiedRoomsRes, 'occupiedRooms'),
          expectedCheckIns: extractValue(expectedCheckInsRes, 'expectedCheckinToday'),
          expectedCheckouts: extractValue(expectedCheckoutsRes, 'expectedCheckoutToday'),
          openBookingRequests: extractValue(openBookingRequestsRes, 'openBookingRequests'),
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm | Dharmshala Dashboard</title>
      </Helmet>
      {isLoading ? (
        <SpinnerComponent />
      ) : (
        <DharmshalaDashboardStatsCard dashboardData={dashboardData} /> // Use new component here
      )}
    </>
  );
};

export default Home;
