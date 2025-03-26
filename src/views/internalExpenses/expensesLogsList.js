import React, { useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import styled from "styled-components";
import { getAllBoxCollectionLogs } from "../../api/donationBoxCollectionApi";
import { getAllExpensesLogs } from "../../api/expenseApi";
import { getAllSubscribedUser } from "../../api/subscribedUser";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import LogListTable from "../../components/DonationBox/logListTable";
import { ChangePeriodDropDown } from "../../components/partials/changePeriodDropDown";
import NoContent from "../../components/partials/noContent";
import SubscribedUSerListTable from "../../components/subscribedUser/subscribedUserListTable";

import "../../../assets/scss/viewCommon.scss";
export default function ExpensesLog() {
  const { t } = useTranslation();
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const { expensesId } = useParams();
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
  const history = useHistory();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [selectedMasterCate, setSelectedMasterCate] = useState("");

  let filterStartDate = moment()
    .startOf(periodDropDown())
    .utcOffset(0, true)
    .toISOString();
  let filterEndDate = moment()
    .endOf(periodDropDown())
    .utcOffset(0, true)
    .toISOString();

  const searchBarValue = useSelector((state) => state.search.LocalSearch);

  const expenseLogQuery = useQuery(
    ["expenseLog", pagination.page, searchBarValue, expensesId],
    () =>
      getAllExpensesLogs({
        ...pagination,
        expenseId: expensesId,
        search: searchBarValue,
      }),
    {
      keepPreviousData: true,
    }
  );

  const expenseLog = useMemo(
    () => expenseLogQuery?.data?.results ?? [],
    [expenseLogQuery]
  );

  return (
    <div className="expenselogwrapper">
      <div className="window nav statusBar body "></div>

      <div>
        <div className="d-flex justify-content-between align-items-center ">
          <div className="d-flex justify-content-between align-items-center ">
            <img
              src={arrowLeft}
              className="me-2 cursor-pointer align-self-end"
              onClick={() => history.push("/financial_reports")}
            />
            <div className="addExpense">
              <div className="">
                <div>
                  <Trans i18nKey={"logs"} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ height: "10px" }}>
          <If condition={expenseLogQuery.isFetching}>
            <Then>
              <Skeleton
                baseColor="#ff8744"
                highlightColor="#fff"
                height={"3px"}
              />
            </Then>
          </If>
        </div>
        <div className="expenseContent">
          <Row>
            <If condition={expenseLogQuery.isLoading} disableMemo>
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
                <If condition={expenseLog.length != 0} disableMemo>
                  <Then>
                    <LogListTable data={expenseLog} />
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

            <If condition={expenseLogQuery?.data?.totalPages > 1}>
              <Then>
                <Col xs={12} className="d-flex justify-content-center">
                  <ReactPaginate
                    nextLabel=""
                    breakLabel="..."
                    previousLabel=""
                    pageCount={expenseLogQuery?.data?.totalPages || 0}
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
    </div>
  );
}
