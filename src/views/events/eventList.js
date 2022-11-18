import { Form, Formik } from "formik";
import React, { useMemo, useState } from "react";
import CustomTextField from "../../components/partials/customTextField";
import * as yup from "yup";
import RichTextField from "../../components/partials/richTextEditorField";
import styled from "styled-components";
import { CustomDropDown } from "../../components/partials/customDropDown";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { Trans, useTranslation } from "react-i18next";
import { Button, Col, Row } from "reactstrap";
import CustomDatePicker from "../../components/partials/CustomDatePicker";
import { createNews, getAllNews } from "../../api/newsApi";
import { ChangePeriodDropDown } from "../../components/partials/changePeriodDropDown";
import NewsCard from "../../components/news/newsCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { Plus } from "react-feather";
import moment from "moment";
import { current } from "@reduxjs/toolkit";
import { useHistory } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { If, Then, Else } from "react-if-else-switch";
import { getAllEvents } from "../../api/eventApi";
import NoEvent from "../../components/events/noEvent";
import EventCard from "../../components/events/eventCard";
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
    ["Events", pagination.page, filterStartDate, filterEndDate],
    () =>
      getAllEvents({
        ...pagination,
        startDate: filterStartDate,
        endDate: filterEndDate,
      }),
    {
      keepPreviousData: true,
    }
  );

  const eventItems = useMemo(() => eventQuery?.data?.results ?? [], [eventQuery]);

  return (
    <EventWarper>
      <div className="window nav statusBar body "></div>

      <div>
        <div className="d-flex justify-content-between align-items-center ">
          <div className="d-flex justify-content-between align-items-center ">
            <img
              src={arrowLeft}
              className="me-2"
              onClick={() => history.push("/")}
            />
            <div className="addEvent">
              <div className="">
                <div>
                  <Trans i18nKey={"events_latest_event"} />
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
              className={"me-1"}
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
        <div className="eventContent  ">
          <Row>
            <If condition={eventQuery.isLoading}>
              <Then>
                <SkeletonTheme
                  baseColor="#FFF7E8"
                  highlightColor="#fff"
                  borderRadius={"10px"}
                >
                  {randomArray.map((itm, idx) => {
                    return (
                      <Col xs={3} key={idx}>
                        <Skeleton height={"335px"} width={"300px"} />
                      </Col>
                    );
                  })}
                </SkeletonTheme>
              </Then>
              <Else>
                <If condition={eventItems.length != 0}>
                  <Then>
                    {eventItems.map((item) => {
                      return (
                        <Col xs={12} key={item.id}>
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
                      setPagination({ ...pagination, page: page.selected + 1 })
                    }
                    // forcePage={pagination.page !== 0 ? pagination.page - 1 : 0}
                    containerClassName={
                      "pagination react-paginate justify-content-end p-1"
                    }
                  />
                </Col>
              </Then>
            </If>
          </Row>
        </div>
      </div>
    </EventWarper>
  );
}
