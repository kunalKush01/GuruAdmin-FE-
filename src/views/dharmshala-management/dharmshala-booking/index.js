import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isBetween from "dayjs/plugin/isBetween";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import { getDharmshalaBookingList } from "../../../api/dharmshala/dharmshalaInfo";
import NoContent from "../../../components/partials/noContent";
import DharmshalaBookingTable from "./table";
import { Helmet } from "react-helmet";
import { CustomDropDown } from "../../../components/partials/customDropDown";
import RoomHoldModal from "./roomHoldModal";
import "../../../assets/scss/dharmshala.scss";
import { Dropdown, Space } from "antd";
import RoomHoldTable from "./roomHoldTable";
import arrowLeft from "../../../assets/images/icons/arrow-left.svg";

dayjs.extend(utc);
dayjs.extend(isBetween);

const DharmshalaBookings = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const importFileRef = useRef();
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const searchBarValue = useSelector((state) => state.search.LocalSearch);
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const [showPastRequests, setShowPastRequests] = useState(false);
  const [statusFilter, setStatusFilter] = useState(t("All"));
  const [isRoomHoldModalOpen, setIsRoomHoldModalOpen] = useState(false);

  const toggleRoomHoldModal = () => {
    setIsRoomHoldModalOpen(!isRoomHoldModalOpen);
  };

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentStatus = searchParams.get("status");
  const currentFilter = searchParams.get("filter");

  useEffect(() => {
    if (currentPage || currentFilter || currentStatus) {
      setdropDownName(currentFilter);
      setStatusFilter(currentStatus || "All");
    }
  }, [currentPage, currentFilter, currentStatus]);

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

  let filterStartDate = dayjs().startOf(periodDropDown()).utc().toISOString();
  let filterEndDate = dayjs().endOf(periodDropDown()).utc().toISOString();
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
      limit: 10,
    }));
  }, [showPastRequests]);

  const dharmshalaBookingList = useQuery(
    [
      "dharmshalaBookingList",
      pagination.page,
      pagination.limit,
      selectedLang.id,
      searchBarValue,
      statusFilter,
      showPastRequests,
    ],
    () =>
      getDharmshalaBookingList({
        bookingType: !showPastRequests ? "upcoming" : "past",
        page: pagination.page,
        limit: pagination.limit,
      })
  );

  const dharmshalaBookingListData = useMemo(
    () => dharmshalaBookingList.data?.results ?? [],
    [dharmshalaBookingList.data]
  );
  const totalItems = useMemo(
    () => dharmshalaBookingList.data?.totalResults ?? [],
    [dharmshalaBookingList.data]
  );
  const queryClient = useQueryClient();

  const handleImportFile = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      await importFile(formData);
      queryClient.invalidateQueries(["dharmshalaBookingList"]);
    }
  };

  const isMobileView = window.innerWidth <= 784;

  const togglePastRequests = () => {
    setShowPastRequests(!showPastRequests);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.name);
    navigate(
      `/booking/info?page=${pagination.page}&status=${e.target.name}&filter=${dropDownName}`
    );
  };

  const filteredBookingListData = useMemo(() => {
    const currentDate = dayjs().startOf("day");
    let filteredData = dharmshalaBookingListData;
    const dateFormat = "DD-MM-YYYY";
    if (statusFilter) {
      if (statusFilter === "all") {
        // If showPastRequests is true, show all bookings
        if (showPastRequests) {
          filteredData = filteredData; // No filtering, show everything
        } else {
          // If showPastRequests is false, exclude checked-out bookings
          filteredData = filteredData.filter(
            (item) => item.status !== "checked-out"
          );
        }
      } else {
        // Apply normal status filtering
        filteredData = filteredData.filter(
          (item) => item.status === statusFilter
        );
      }
    }

    if (searchBarValue && searchBarValue.length >= 3) {
      filteredData = filteredData.filter((item) =>
        item.bookingId
          .toLowerCase()
          .startsWith(searchBarValue.toLowerCase().slice(0, 3))
      );
    }
    return filteredData;
  }, [
    dharmshalaBookingListData,
    showPastRequests,
    searchBarValue,
    statusFilter,
  ]);

  const statusOptions = [
    { key: "all", label: t("All") },
    { key: "checked-in", label: t("Checked_in") },
    { key: "checked-out", label: t("Checked_out") },
    { key: "requested", label: t("requested") },
    { key: "accepted", label: t("accepted") },
    { key: "reserved", label: t("reserved") },
    { key: "confirmed", label: t("confirmed") },
    { key: "completed", label: t("completed") },
    { key: "cancelled", label: t("cancelled") },
    { key: "maintenance", label: t("maintenance") },
  ];
  const [showRoomHold, setShowRoomHold] = useState(false);
  const handleBtnClick = (e) => {
    setShowRoomHold(true);
  };
  const handlebackBtn = () => {
    setShowRoomHold(false);
  };
  return (
    <div className="DharmshalaComponentInfo">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | Dharmshala Bookings</title>
      </Helmet>
      <div>
        <div className="d-sm-flex mb-1 justify-content-between align-items-center ">
          <Trans i18nKey={"dharmshala_bookings_requested"} />
          <div
            className="d-flex mt-1 mt-sm-0 justify-content-between"
            id="dharmshala_booking_buttons"
          >
            <div className="botton-container">
              <div className="row1">
                <Button
                  className={`me-1 ${isMobileView ? "btn-sm" : ""}`}
                  color="primary"
                  onClick={() =>
                    navigate(
                      `/booking/add/?page=${pagination.page}&filter=${dropDownName}`
                    )
                  }
                  style={{
                    marginBottom: isMobileView ? "5px" : "0",
                    height: "38px",
                  }}
                >
                  <span>
                    <Plus className="" size={15} strokeWidth={4} />
                  </span>
                  <span>
                    <Trans i18nKey={"dharmshala_booking_add"} />
                  </span>
                </Button>
                <Button
                  className={`me-1 ${
                    isMobileView
                      ? "secondaryAction-btn btn-sm"
                      : "secondaryAction-btn"
                  }`}
                  color="primary"
                  onClick={() =>
                    navigate(
                      `/booking/calendar/?page=${pagination.page}&filter=${dropDownName}`
                    )
                  }
                  style={{ marginBottom: isMobileView ? "5px" : "0" }}
                >
                  <span>
                    <Trans i18nKey={"dharmshala_booking_calendar"} />
                  </span>
                </Button>
              </div>
              <div className="row2">
                <Space wrap className="">
                  <Button
                    className={`${
                      isMobileView
                        ? "secondaryAction-btn btn-sm"
                        : "secondaryAction-btn"
                    }`}
                    color="primary"
                    onClick={togglePastRequests}
                    style={{ marginBottom: isMobileView ? "5px" : "0" }}
                  >
                    <span>
                      {showPastRequests ? (
                        <Trans i18nKey={"view_upcoming_requests"} />
                      ) : (
                        <Trans i18nKey={"view_past_requests"} />
                      )}
                    </span>
                  </Button>
                  <Dropdown.Button
                    type="primary"
                    size="large"
                    className="roomholdBtn"
                    menu={{
                      items: [
                        {
                          label: t("add_room_hold"),
                          key: "add_room_hold",
                        },
                      ],
                      onClick: toggleRoomHoldModal,
                    }}
                    onClick={handleBtnClick}
                  >
                    {t("room_hold")}
                  </Dropdown.Button>
                </Space>
                {/* <Button
                  className={`me-1 ${isMobileView ? "btn-sm" : ""}`}
                  color="primary"
                  onClick={toggleRoomHoldModal}
                  style={{ marginBottom: isMobileView ? "5px" : "0" }}
                >
                  <span>
                    <Trans i18nKey={"room_hold"} />
                  </span>
                </Button> */}
              </div>
              <CustomDropDown
                i18nKeyDropDownItemArray={statusOptions}
                defaultDropDownName={statusFilter}
                handleDropDownClick={handleStatusFilterChange}
                width={"120px"}
              />
            </div>
          </div>
        </div>
        <div style={{ height: "10px" }}>
          <If
            condition={
              dharmshalaBookingList.isFetching ||
              dharmshalaBookingList.isLoading
            }
          >
            <Then>
              <Skeleton
                baseColor="#ff8744"
                highlightColor="#fff"
                height={"3px"}
              />
            </Then>
          </If>
        </div>
        <div className="newsContent">
          <Row>
            <div className="table-container-style">
              <If
                condition={
                  !dharmshalaBookingList.isLoading &&
                  filteredBookingListData.length > 0 &&
                  !dharmshalaBookingList.isFetching
                }
                disableMemo
              >
                <Then>
                  {showRoomHold && (
                    <div className="d-flex">
                      <img
                        src={arrowLeft}
                        className="mt-0 mb-1 me-1 cursor-pointer"
                        onClick={handlebackBtn}
                      />
                      <span>Room Holds</span>
                    </div>
                  )}
                  {!showRoomHold ? (
                    <DharmshalaBookingTable
                      data={filteredBookingListData}
                      height="160px"
                      currentFilter={dropDownName}
                      currentPage={pagination.page}
                      isMobileView={isMobileView}
                      totalItems={totalItems}
                      pageSize={pagination.limit}
                      onChangePage={(page) =>
                        setPagination((prev) => ({ ...prev, page }))
                      }
                      onChangePageSize={(pageSize) =>
                        setPagination((prev) => ({
                          ...prev,
                          limit: pageSize,
                          page: 1,
                        }))
                      }
                    />
                  ) : (
                    <RoomHoldTable />
                  )}
                </Then>
                <Else>
                  <If
                    condition={
                      !dharmshalaBookingList.isLoading &&
                      filteredBookingListData.length === 0
                    }
                    disableMemo
                  >
                    <Then>
                      <NoContent
                        headingNotfound={t("no_data_found")}
                        para={t("no_data_found_add_data")}
                      />
                    </Then>
                  </If>
                </Else>
              </If>
              {/* <If
                condition={
                  !dharmshalaBookingList.isFetching &&
                  dharmshalaBookingList?.data?.totalPages > 1
                }
              >
                <Then>
                  <Col xs={12} className="d-flex justify-content-center">
                    <ReactPaginate
                      nextLabel=""
                      forcePage={pagination.page - 1}
                      breakLabel="..."
                      previousLabel=""
                      pageCount={dharmshalaBookingList?.data?.totalPages || 0}
                      activeClassName="active"
                      initialPage={
                        parseInt(searchParams.get("page"))
                          ? parseInt(searchParams.get("page")) - 1
                          : pagination.page - 1
                      }
                      breakClassName="page-item"
                      pageClassName={"page-item"}
                      breakLinkClassName="page-link"
                      nextLinkClassName={"page-link"}
                      pageLinkClassName={"page-link"}
                      nextClassName={"page-item next"}
                      previousLinkClassName={"page-item prev"}
                      onPageChange={(page) => {
                        setPagination({
                          ...pagination,
                          page: page.selected + 1,
                        });
                        navigate(
                          `/dharmshala/info?page=${
                            page.selected + 1
                          }&status=${currentStatus}&filter=${dropDownName}`
                        );
                      }}
                      containerClassName={
                        "pagination react-paginate justify-content-end p-1"
                      }
                    />
                  </Col>
                </Then>
              </If> */}
            </div>
          </Row>
        </div>
      </div>
      <RoomHoldModal
        isOpen={isRoomHoldModalOpen}
        toggle={toggleRoomHoldModal}
      />
    </div>
  );
};

export default DharmshalaBookings;
