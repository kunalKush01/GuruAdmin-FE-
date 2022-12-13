import { Form, Formik } from "formik";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { Trans, useTranslation } from "react-i18next";
import { Button, Col, Row } from "reactstrap";
import FormikCustomDatePicker from "../../components/partials/formikCustomDatePicker";
import { ChangePeriodDropDown } from "../../components/partials/changePeriodDropDown";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { Plus } from "react-feather";
import moment from "moment";
import { useHistory } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { If, Then, Else } from "react-if-else-switch";
import { getAllEvents, getEventDates } from "../../api/eventApi";
import NoEvent from "../../components/events/noEvent";
import EventCard from "../../components/events/eventCard";
import CustomDatePicker from "../../components/partials/customDatePicker";
import HinduCalenderDetailCard from "../../components/events/hinduCalenderDetailCard";
import { useSelector } from "react-redux";
const EventWarper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .addEvent {
    color: #583703;
    display: flex;
    align-items: center;
  }

  .FormikWraper {
    padding: 40px;
  }
  .btn-Published {
    text-align: center;
  }
  .addEvent-btn {
    padding: 8px 20px;
    margin-left: 10px;
    font: normal normal bold 15px/20px noto sans;
  }
  .eventContent {
    height: 350px;
    overflow: auto;
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .filterPeriod {
    color: #ff8744;
    font: normal normal bold 13px/5px noto sans;
  }
`;

const randomArray = [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function EventList() {
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const selectedLang= useSelector(state=>state.auth.selectLang)

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
  const { t } = useTranslation();
  const history = useHistory();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
  });

  let filterStartDate = moment()
    .startOf(periodDropDown())
    .utcOffset(0, true)
    .toISOString();
  let filterEndDate = moment()
    .endOf(periodDropDown())
    .utcOffset(0, true)
    .toISOString();

  let startDate = moment(filterStartDate).format("D MMM YYYY");
  let endDate = moment(filterEndDate).utcOffset(0).format("D MMM YYYY");

  const eventQuery = useQuery(
    ["Events", pagination.page, startDate, endDate,selectedLang.id],
    () =>
      getAllEvents({
        ...pagination,
        startDate: filterStartDate,
        endDate: filterEndDate,
        languageId:selectedLang.id
      }),
    {
      keepPreviousData: true,
    }
  );

  const dateQuery = useQuery(["Dates"], () => getEventDates());
  const eventDates = useMemo(() => {
    return dateQuery?.data?.results?.map((item) => moment(item).toDate()) ?? [];
  }, [dateQuery]);
  console.log("eventDates=", eventDates);

  const eventItems = useMemo(
    () => eventQuery?.data?.results ?? [],
    [eventQuery]
  );
  

  return (
    <EventWarper>
      <div className="window nav statusBar body "></div>

      <div>
        <div className="d-flex justify-content-between align-items-center ">
          <div className="d-flex justify-content-between align-items-center ">
            <img
              src={arrowLeft}
              className="me-2  cursor-pointer"
              onClick={() => history.push("/")}
            />
            <div className="addEvent">
              <div className="">
                <div>
                  <Trans i18nKey={"events"} />
                </div>
                <div className="filterPeriod">
                  <span>
                    {startDate}-{endDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="addEvent">
            <ChangePeriodDropDown
              // className={"me-0"}
              dropDownName={dropDownName}
              setdropDownName={(e) => setdropDownName(e.target.name)}
            />
            <Button
              color="primary"
              className="addEvent-btn"
              onClick={() => history.push("/events/add")}
            >
              <span>
                <Plus className="me-1" size={15} strokeWidth={4} />
              </span>
              <span>
                <Trans i18nKey={"events_AddEvent"} />
              </span>
            </Button>
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
          <Row className="w-100 m-0"  >
            <Col xs={9} className="eventContent">
              <If condition={eventQuery.isLoading} disableMemo >
                <Then>
                  <SkeletonTheme
                    baseColor="#FFF7E8"
                    highlightColor="#fff"
                    borderRadius={"10px"}
                  >
                    {randomArray.map((itm, idx) => {
                      return (
                        <Col xs={12} key={idx}>
                          <Skeleton height={"63px"} />
                        </Col>
                      );
                    })}
                  </SkeletonTheme>
                </Then>
                <Else>
                  <If condition={eventItems.length != 0} disableMemo >
                    <Then>
                      {eventItems.map((item) => {
                        return (
                          <Col xs={12} key={item.id} className={"p-0"} >
                            <EventCard data={item} />
                          </Col>
                        );
                      })}
                    </Then>
                    <Else>
                      <NoEvent />
                    </Else>
                  </If>
                </Else>
              </If>

              <If condition={eventQuery?.data?.totalPages > 1}>
                <Then>
                  <Col xs={12} className="mb-2 d-flex justify-content-center">
                    <ReactPaginate
                      nextLabel=""
                      breakLabel="..."
                      previousLabel=""
                      pageCount={eventQuery?.data?.totalPages || 0}
                      activeClassName="active"
                      breakClassName="page-item"
                      pageClassName={"page-item"}
                      breakLinkClassName="page-link"
                      nextLinkClassName={"page-link"}
                      pageLinkClassName={"page-link"}
                      nextClassName={"page-item next"}
                      previousLinkClassName={"page-link"}
                      previousClassName={"page-item prev"}
                      onPageChange={(page) =>
                        setPagination({
                          ...pagination,
                          page: page.selected + 1,
                        })
                      }
                      // forcePage={pagination.page !== 0 ? pagination.page - 1 : 0}
                      containerClassName={
                        "pagination react-paginate justify-content-end p-1"
                      }
                    />
                  </Col>
                </Then>
              </If>
            </Col>
            <Col xs={3} className="p-0 ps-1 ">
              <Row>
                <Col xs={12}>
                  <If condition={dateQuery.isLoading}>
                    <Then>
                      <></>
                    </Then>
                    <Else>
                      <CustomDatePicker
                        selected={""}
                        highlightDates={eventDates}
                        
                        
                      />
                    </Else>
                  </If>
                </Col>
              </Row>
              <Row className="w-100 m-0" >
                <Col xs={12}  >
                  <HinduCalenderDetailCard />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </EventWarper>
  );
}
