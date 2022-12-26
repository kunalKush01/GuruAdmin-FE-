import moment from "moment";
import React, { useState,useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import arrowLeft from "../../../assets/images/icons/arrow-left.svg";
import { ChangeStatus } from "../../../components/Report & Disput/changeStatus";
import ReportTable from "../../../components/Report & Disput/reportTable";
import {useQuery} from "@tanstack/react-query";
import {Else, If, Then} from "react-if-else-switch";
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import {Col, Row} from "reactstrap";
import NoContent from "../../../components/partials/noContent";
import ReactPaginate from "react-paginate";
import {useSelector} from "react-redux";
import {getAllReporDisputeList} from "../../../api/reportDisputeApi";

const ReportDisputWaraper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;

  .table_upper_row {
    margin-bottom: 2rem;
  }
  .addEvent {
    color: #583703;
    display: flex;
    align-items: center;
  }
  .category_heading {
    font-size: 20px;
    font-weight: bold;
    color: #583703;
  }
  .filterPeriod {
    color: #ff8744;
    font: normal normal bold 13px/20px noto sans;
  }
`;

const randomArray = [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const ReportList = () => {
  const [dropDownName, setdropDownName] = useState("report_panding");
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const { t } = useTranslation();
  const history = useHistory();

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

  const reportDisputeQuery = useQuery(
      ["reportUser", pagination.page, selectedLang.id,filterEndDate,filterStartDate],
      () =>
          getAllReporDisputeList({
            ...pagination,
            startDate: filterStartDate,
            endDate: filterEndDate,
            languageId: selectedLang.id,

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
    <ReportDisputWaraper>
      <div className="d-flex justify-content-between align-items-center table_upper_row">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push("/")}
          />
          <div className="addEvent">
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
              <If condition={reportDisputeQuery.length != 0} disableMemo>
                <Then>
                  <ReportTable  data={reportUser} />
                </Then>
                <Else>
                  <NoContent
                      headingNotfound={t("notifications_not_found")}
                      para={t("notifications_not_click_add")}
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
    </ReportDisputWaraper>
  );
};

export default ReportList;
