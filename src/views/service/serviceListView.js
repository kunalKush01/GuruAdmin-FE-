import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Trans, useTranslation } from "react-i18next";
import { Button, Col, Row } from "reactstrap";
import "../../assets/scss/common.scss";
import "../../assets/scss/viewCommon.scss";

import { Space, Tabs } from "antd";
import ServiceListTable from "../../components/service/serviceListTable";
import { useHistory, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllBookedServices, getAllServices } from "../../api/serviceApi";
import BookedServiceListTable from "../../components/service/bookedServiceListTable";
import { Plus } from "react-feather";
import BookingService from "./bookingService";

function ServiceListView() {
  const history = useHistory();
  const location = useLocation();
  const trustId = localStorage.getItem("trustId");
  const { t } = useTranslation();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname.includes("service-booked")) {
      return "booked_services";
    }
    return "service";
  });

  useEffect(() => {
    // Update activeTab based on URL changes
    if (location.pathname === "/service") {
      setActiveTab("service");
    } else if (location.pathname === "/service-booked") {
      setActiveTab("booked_services");
    }
  }, [location.pathname]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    switch (key) {
      case "service":
        history.push("/service"); // Change URL to /service
        break;
      case "booked_services":
        history.push("/service-booked"); // Change URL to /service-booked
        break;
      default:
        break;
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
  const [bookedServicePagination, setBookedServicePagination] = useState({
    page: 1,
    limit: 10,
  });
  const { data: bookedService } = useQuery(
    [
      "bookedService",
      bookedServicePagination.page,
      bookedServicePagination.limit,
    ],
    () =>
      getAllBookedServices({
        ...bookedServicePagination,
        trustId: trustId,
      }),
    {
      keepPreviousData: true,
      onError: (error) => {
        console.error("Error fetching member data:", error);
      },
    }
  );
  const item = [
    // {
    //   key: "booking_service",
    //   label: t("Booking Service"),
    //   children: (
    //     <>
    //       <BookingService serviceData={data ? data.results : []} />
    //     </>
    //   ),
    // },
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
                    <div>{/* <Trans i18nKey={"service"} /> */}</div>
                  </div>
                </div>
              </div>
              <Space wrap className="d-flex">
                <div className="addAction d-flex flex-wrap gap-2 gap-md-0">
                  <Button
                    color="primary"
                    className="addAction-btn"
                    onClick={() => history.push(`/services/addService`)}
                  >
                    <span>
                      <Plus className="" size={15} strokeWidth={4} />
                    </span>
                    <span>
                      <Trans i18nKey={"add_service"} />
                    </span>
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
    {
      key: "booked_services",
      label: t("Bookings"),
      children: (
        <div className="d-flex flex-column">
          {!showBookingForm && (
            <div className="d-flex justify-content-end mb-1">
              <Button
                color="primary"
                className="addAction-btn"
                onClick={() => {
                  setShowBookingForm(true);
                }}
              >
                <span>
                  <Plus className="" size={15} strokeWidth={4} />
                </span>
                <span>
                  <Trans i18nKey={"add_Booking"} />
                </span>
              </Button>
            </div>
          )}
          {!showBookingForm ? (
            <BookedServiceListTable
              // setShowBookingForm={setShowBookingForm}
              data={bookedService ? bookedService.results : []}
              totalItems={bookedService ? bookedService.totalResults : 0}
              pageSize={bookedServicePagination.limit}
              onChangePage={(page) => {
                setBookedServicePagination((prev) => ({ ...prev, page }));
              }}
              onChangePageSize={(pageSize) => {
                setBookedServicePagination((prev) => ({
                  ...prev,
                  limit: pageSize,
                  page: 1,
                }));
              }}
            />
          ) : (
            <BookingService
              serviceData={data ? data.results : []}
              setShowBookingForm={setShowBookingForm}
            />
          )}
        </div>
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
