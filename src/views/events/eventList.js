import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Plus } from "react-feather";
import { Helmet } from "react-helmet";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import styled from "styled-components";
import { getAllEvents, getEventDates } from "../../api/eventApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import EventCard from "../../components/events/eventCard";
import HinduCalenderDetailCard from "../../components/events/hinduCalenderDetailCard";
import NoEvent from "../../components/events/noEvent";
import { ChangePeriodDropDown } from "../../components/partials/changePeriodDropDown";
import CustomDatePicker from "../../components/partials/customDatePicker";
import FormikCustomDatePicker from "../../components/partials/formikCustomDatePicker";
import NoContent from "../../components/partials/noContent";
import { WRITE } from "../../utility/permissionsVariable";
import "../../assets/scss/viewCommon.scss";
import { Card, Pagination } from "antd";

const randomArray = [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function EventList() {
  const { t } = useTranslation();
  const [dropDownName, setdropDownName] = useState("All");
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const periodDropDown = () => {
    switch (dropDownName) {
      case "dashboard_monthly":
        return "month";
      case "dashboard_yearly":
        return "year";
      case "dashboard_weekly":
        return "week";
      case "All":
        return "All";

      default:
        return "All";
    }
  };
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const searchParams = new URLSearchParams(history.location.search);
  const [currentpage, setCurrentpage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const onChangePage = (page) => {
    setCurrentpage(page);
    // Fetch new data based on the page
  };

  const onChangePageSize = (size) => {
    setPageSize(size);
    setCurrentpage(1); // Reset to first page when page size changes
  };

  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const routPagination = pagination.page;
  const routFilter = dropDownName;

  useEffect(() => {
    if (currentPage || currentFilter) {
      setdropDownName(currentFilter);
      setPagination({ ...pagination, page: parseInt(currentPage) });
    }
  }, []);

  let filterStartDate =
    dropDownName !== "All"
      ? moment().startOf(periodDropDown()).utcOffset(0, true).toISOString()
      : null;
  let filterEndDate =
    dropDownName !== "All"
      ? moment().endOf(periodDropDown()).utcOffset(0, true).toISOString()
      : null;

  let startDate = moment(filterStartDate).format("DD MMM ");
  let endDate = moment(filterEndDate).utcOffset(0).format("DD MMM, YYYY");
  const searchBarValue = useSelector((state) => state.search.LocalSearch);

  const getQueryParams = () => {
    const baseParams = {
      languageId: selectedLang.id,
      search: searchBarValue,
      page: currentpage,
      limit: pageSize,
    };

    if (dropDownName !== "All") {
      return {
        ...baseParams,
        startDate: filterStartDate,
        endDate: filterEndDate,
      };
    }

    return baseParams;
  };

  const eventQuery = useQuery(
    [
      "Events",
      currentpage,
      pageSize,
      startDate,
      endDate,
      selectedLang.id,
      searchBarValue,
    ],

    () => getAllEvents(getQueryParams()),
    {
      keepPreviousData: true,
    }
  );

  const dateQuery = useQuery(["EventDates"], () => getEventDates());

  const [eventDates, setEventDates] = useState([]);
  useEffect(() => {
    const eventDates = () => {
      return (
        dateQuery?.data?.results?.map((item) => moment(item).toDate()) ?? []
      );
    };
    if (!dateQuery?.data?.results) {
      return;
    }
    setEventDates(eventDates());
  }, [dateQuery.isLoading, dateQuery.isFetching]);

  const eventItems = useMemo(
    () => eventQuery?.data?.results ?? [],
    [eventQuery]
  );
  const totalItems = useMemo(
    () => eventQuery?.data?.totalResults ?? [],
    [eventQuery]
  );

  // PERMISSSIONS
  const permissions = useSelector(
    (state) => state.auth.userDetail?.permissions
  );
  const allPermissions = permissions?.find(
    (permissionName) => permissionName.name === "all"
  );
  const subPermissions = permissions?.find(
    (permissionName) => permissionName.name === "events"
  );

  const subPermission = subPermissions?.subpermissions?.map(
    (item) => item.name
  );
  return (
    <div className="listviewwrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | Events</title>
      </Helmet>
      <div className="window nav statusBar body "></div>

      <div>
        <div className="d-sm-flex mb-1 justify-content-between align-items-center">
          <div className="d-flex align-items-center mb-2 mb-lg-0">
            {/* <img
              src={arrowLeft}
              className="me-1 me-sm-2  cursor-pointer align-self-center"
              onClick={() => navigate("/")}
            /> */}
            <div className="addAction">
              <div className="">
                <div>
                  <Trans i18nKey={"events"} />
                </div>
              </div>
            </div>
          </div>
          <div className="addAction gap-1 justify-content-between">
            <ChangePeriodDropDown
              dropDownName={dropDownName}
              setdropDownName={(e) => {
                setdropDownName(e.target.name);
                setPagination({ page: 1 });
                navigate(`/events?page=${1}&filter=${e.target.name}`);
              }}
            />
            {allPermissions?.name === "all" ||
            subPermission?.includes(WRITE) ? (
              <Button
                color="primary"
                className="addAction-btn"
                onClick={() =>
                  navigate(
                    `/events/add?page=${pagination.page}&filter=${dropDownName}`
                  )
                }
              >
                <span>
                  <Plus className="" size={15} strokeWidth={4} />
                </span>
                <span>
                  <Trans i18nKey={"events_AddEvent"} />
                </span>
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
        <div style={{ height: "10px" }}>
          <If condition={eventQuery.isFetching}>
            <Then>
              <Skeleton
                baseColor="#ff8744"
                highlightColor="#fff"
                height={"3px"}
              />
            </Then>
          </If>
        </div>
        <div>
          <Row className="w-100 m-0">
            <Col xs={12} md={9} className="listviewContent ps-0">
              <If condition={eventQuery.isLoading} disableMemo>
                <Then>
                  <SkeletonTheme
                    baseColor="#FFF7E8"
                    highlightColor="#fff"
                    borderRadius={"10px"}
                  >
                    {randomArray?.map((itm, idx) => {
                      return (
                        <Col xs={12} key={idx}>
                          <Skeleton height={"63px"} />
                        </Col>
                      );
                    })}
                  </SkeletonTheme>
                </Then>
                <Else>
                  <If condition={eventItems.length != 0} disableMemo>
                    <Then>
                      <div style={{marginBottom:"100px"}}>
                        {eventItems.map((item) => {
                          return (
                            <Col xs={12} key={item.id} className={"p-0"}>
                              <EventCard
                                data={item}
                                currentFilter={routFilter}
                                allPermissions={allPermissions}
                                subPermission={subPermission}
                                currentPage={routPagination}
                              />
                            </Col>
                          );
                        })}
                      </div>
                    </Then>
                    <Else>
                      <div className="noContent">
                        <NoContent
                          headingNotfound={t("events_not_found")}
                          para={t("events_not_click_add_events")}
                        />
                      </div>
                    </Else>
                  </If>
                </Else>
              </If>
              {totalItems > 0 && (
                <Card className="pagination-card">
                  <Pagination
                    current={currentpage}
                    pageSize={pageSize}
                    total={totalItems}
                    onChange={onChangePage}
                    onShowSizeChange={(current, size) => onChangePageSize(size)}
                    showSizeChanger
                  />
                </Card>
              )}
              {/* <If condition={eventQuery?.data?.totalPages > 0}>
                <Then>
                  <Col
                    xs={12}
                    className="d-flex justify-content-center pagination-container mt-3"
                  >
                    <ReactPaginate
                      nextLabel=""
                      forcePage={pagination.page - 1}
                      breakLabel="..."
                      previousLabel=""
                      pageCount={eventQuery?.data?.totalPages || 0}
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
                      previousLinkClassName={"page-link"}
                      previousClassName={"page-item prev"}
                      onPageChange={(page) => {
                        setPagination({
                          ...pagination,
                          page: page.selected + 1,
                        });
                      }}
                      // forcePage={pagination.page !== 0 ? pagination.page - 1 : 0}
                      containerClassName={
                        "pagination react-paginate justify-content-end p-1"
                      }
                    />
                  </Col>
                </Then>
              </If> */}
            </Col>
            <Col
              xs={10}
              sm={6}
              md={5}
              lg={3}
              className="p-0 ps-1 d-none d-lg-block"
              style={{ marginTop: "1.8rem" }}
            >
              <Row>
                <Col xs={12}>
                  {eventDates.length != 0 && (
                    <CustomDatePicker
                      disabledKeyboardNavigation
                      highlightDates={eventDates}
                      // disabled
                    />
                  )}
                </Col>
              </Row>
              <Row className="w-100 m-0">
                <Col xs={12}>{/* <HinduCalenderDetailCard /> */}</Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
