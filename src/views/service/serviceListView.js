import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Trans, useTranslation } from "react-i18next";
import { Button, Col, Row } from "reactstrap";
import "../../assets/scss/common.scss";
import "../../assets/scss/viewCommon.scss";

import { Space, Tabs } from "antd";
import ServiceListTable from "../../components/service/serviceListTable";
import { useHistory,useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllServices } from "../../api/serviceApi";
import BookingService from "./bookingService";

function ServiceListView() {
  const history = useHistory();
  const location = useLocation(); // Access the current location

  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(location.pathname === "/service" ? "service" : "booking_service");
  useEffect(() => {
    // Set the active tab based on the URL path
    if (location.pathname === "/service") {
      setActiveTab("service");
    } else if (location.pathname === "/service-booking") {
      setActiveTab("booking_service");
    }
  }, [location.pathname]);
  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === "service") {
      history.push("/service"); // Change URL to /service
    } else if (key === "booking_service") {
      history.push("/service-booking"); // Change URL to /booking-service
    }
  };

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const { data } = useQuery(
    ["services", pagination.page, pagination.limit],
    () =>
      getAllServices({
        ...pagination,
      }),
    {
      keepPreviousData: true,
      onError: (error) => {
        console.error("Error fetching member data:", error);
      },
    }
  );
  const item = [
    {
      key: "booking_service",
      label: t("Booking Service"),
      children: (
        <>
          <BookingService serviceData={data ? data.results : []}/>
        </>
      ),
    },
    {
      key: "service",
      label: t("Services"),
      children: (
        <>
          <div>
            <div className="d-lg-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center mb-2 mb-lg-0">
                <div className="addAction d-flex">
                  <div className="">
                    <div>
                      <Trans i18nKey={"service"} />
                    </div>
                  </div>
                </div>
              </div>
              <Space wrap className="d-flex">
                <div className="addAction d-flex flex-wrap gap-2 gap-md-0">
                  <Button
                    className={`addAction-btn`}
                    color="primary"
                    onClick={() => history.push(`/services/addService`)}
                  >
                    Add
                  </Button>
                </div>
              </Space>
            </div>
            <div style={{ height: "10px" }}></div>
            <div className="commitmentContent">
              <Row>
                <ServiceListTable
                  data={data ? data.results : []}
                  totalItems={data ? data.totalResults : 0}
                  pageSize={pagination.limit}
                  onChangePage={(page) => {
                    setPagination((prev) => ({ ...prev, page }));
                  }}
                  onChangePageSize={(pageSize) => {
                    setPagination((prev) => ({
                      ...prev,
                      limit: pageSize,
                      page: 1,
                    }));
                  }}
                />
              </Row>
            </div>
          </div>
        </>
      ),
    },
  ];
  return (
    <div className="listviewwrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | Services</title>
      </Helmet>
      <div className="window nav statusBar body "></div>

      <div>
        <Tabs
          defaultActiveKey={activeTab}
          className="donationTab"
          items={item}
          onChange={handleTabChange}
        />
      </div>
    </div>
  );
}

export default ServiceListView;
