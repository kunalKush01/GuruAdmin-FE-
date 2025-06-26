import moment from "moment";
import React, { useState, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import arrowLeft from "../../../assets/images/icons/arrow-left.svg";
import { ChangeStatus } from "../../../components/Report & Disput/changeStatus";
import ReportTable from "../../../components/Report & Disput/reportTable";
import { useQuery } from "@tanstack/react-query";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Col, Row } from "reactstrap";
import NoContent from "../../../components/partials/noContent";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { getAllReporDisputeList } from "../../../api/reportDisputeApi";
import { Helmet } from "react-helmet";

import "../../../assets/scss/viewCommon.scss";
const randomArray = [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const ReportList = () => {
  const { t } = useTranslation();
  const [dropDownName, setdropDownName] = useState(t("All"));
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  let filterStartDate = moment()
    .startOf("month")
    .utcOffset(0, true)
    .toISOString();
  let filterEndDate = moment().endOf("month").utcOffset(0, true).toISOString();

  let startDate = moment(filterStartDate).format("D MMM");
  let endDate = moment(filterEndDate).utcOffset(0).format("D MMM, YYYY");
  const searchBarValue = useSelector((state) => state.search.LocalSearch);

  const reportDisputeQuery = useQuery(
    [
      "reportUser",
      pagination.page,
      selectedLang.id,
      filterEndDate,
      filterStartDate,
      dropDownName,
      searchBarValue,
    ],
    () =>
      getAllReporDisputeList({
        ...pagination,
        status: t(dropDownName),
        startDate: filterStartDate,
        endDate: filterEndDate,
        languageId: selectedLang.id,
        search: searchBarValue,
      }),
    {
      keepPreviousData: true,
    }
  );

  const reportUser = useMemo(
    () => reportDisputeQuery?.data?.results ?? [],
    [reportDisputeQuery]
  );

  return (
    <div className="reportdisputwrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | Reports & Disputes</title>
      </Helmet>
      <div className="d-flex justify-content-between align-items-center table_upper_row">
        <div className="d-flex justify-content-between align-items-center ">
          {/* <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => navigate("/")}
          /> */}
          <div className="addAction">
            <div className="">
              <div>
                <Trans i18nKey={"report_Dispute"} />
              </div>
            </div>
          </div>
        </div>
        <ChangeStatus
          dropDownName={dropDownName}
          setdropDownName={(e) => setdropDownName(e.target.name)}
        />
      </div>
      <div style={{ height: "10px" }}>
        <If condition={reportDisputeQuery.isFetching}>
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
          <If condition={reportDisputeQuery.isLoading} disableMemo>
            <Then>
              <SkeletonTheme
                baseColor="#FFF7E8"
                highlightColor="#fff"
                borderRadius={"10px"}
              >
                <Col>
                  <Skeleton height={"335px"} width={"100%"} />
                </Col>
              </SkeletonTheme>
            </Then>
            <Else>
              <If condition={reportUser.length != 0} disableMemo>
                <Then>
                  <ReportTable data={reportUser} />
                </Then>
                <Else>
                  <NoContent
                    headingNotfound={t("report_dispute_not_found")}
                    // para={t("notifications_not_click_add")}
                  />
                </Else>
              </If>
            </Else>
          </If>

          <If condition={reportDisputeQuery?.data?.totalPages > 1}>
            <Then>
              <Col xs={12} className="mb-2 d-flex justify-content-center">
                <ReactPaginate
                  nextLabel=""
                  breakLabel="..."
                  previousLabel=""
                  pageCount={reportDisputeQuery?.data?.totalPages || 0}
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
  );
};

export default ReportList;
