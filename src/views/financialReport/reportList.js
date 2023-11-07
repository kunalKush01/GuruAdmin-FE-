import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import FormikCustomDatePicker from "../../components/partials/formikCustomDatePicker";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import styled from "styled-components";
import {
  exportAllCommitments,
  getAllCommitments,
} from "../../api/commitmentApi";
import { exportAllDonation, getAllDonation } from "../../api/donationApi";
import { getAllBoxCollection } from "../../api/donationBoxCollectionApi";
import { ExportAllExpense, getAllExpense } from "../../api/expenseApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import ReportListTable from "../../components/financeReport/reportListTable";
import BtnPopover from "../../components/partials/btnPopover";
import CustomDatePicker from "../../components/partials/customDatePicker";
import NoContent from "../../components/partials/noContent";
import FinancialReportTabs from "./financialReportTabs";
import FormikRangeDatePicker from "../../components/partials/FormikRangeDatePicker";
import exportIcon from "../../assets/images/icons/exportIcon.svg";
import { Formik } from "formik";
import { useUpdateEffect } from "react-use";
import { handleExport } from "../../utility/utils/exportTabele";
import {
  jsonDataCommitment,
  jsonDataDonation,
  jsonDataDonationBox,
  jsonDataExpences,
} from "../../components/financeReport/reportJsonExport";
import { Helmet } from "react-helmet";
const NewsWarper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .addNews {
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
  .exportBtn {
    padding: 10px 20px;
    font: normal normal bold 15px/20px noto sans;
  }
  .newsContent {
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .filterPeriod {
    color: #ff8744;
    margin-top: 0.5rem;
    font: normal normal bold 13px/5px noto sans;
  }
  .dateChooserReport .react-datepicker__input-container {
    width: 158px;
  }
  .dateChooserReport .react-datepicker__input-container > input:focus-within {
    outline: none !important;
    /* border: none; */
    outline-offset: 0px;
  }
  .dateChooserReport .react-datepicker__input-container > input {
    border: 1px solid #ff8744 !important;
    text-align: center;
    color: #ff8744;
    width: 100%;
    font: normal normal bold 15px/20px noto sans;
    /* padding: .4rem 1rem .4rem 2rem ; */
    padding: 10px 20px;
    border-radius: 7px;
  }
  .total_collection {
    border: 1px solid #ff8744;
    color: #ff8744;
    font: normal normal bold 15px/20px noto sans;
    padding: 10px 20px;
    border-radius: 5px;
  }
`;

export default function FinancialReport() {
  const [reportStartDate, setReportStartDate] = useState(
    new Date(moment().startOf("month"))
  );
  const [reportEndDate, setReportEndDate] = useState(new Date());

  const { t } = useTranslation();
  const [activeReportTab, setActiveReportTab] = useState({
    id: 1,
    name: t("report_expences"),
  });

  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const selectedLang = useSelector((state) => state.auth.selectLang);
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

  const searchBarValue = useSelector((state) => state.search.LocalSearch);

  const expensesQuery = useQuery(
    [
      "Expenses",
      pagination.page,
      selectedLang.id,
      reportStartDate,
      reportEndDate,
      searchBarValue,
    ],
    () =>
      getAllExpense({
        search: searchBarValue,
        ...pagination,
        startDate: moment(reportStartDate).utcOffset(0, true).toISOString(),
        endDate: moment(reportEndDate).utcOffset(0, true).toISOString(),
        languageId: selectedLang.id,
      }),
    {
      keepPreviousData: true,
      enabled: activeReportTab.name == t("report_expences"),
    }
  );
  const donationQuery = useQuery(
    [
      "donations",
      pagination.page,
      selectedLang.id,
      reportEndDate,
      reportStartDate,
      searchBarValue,
    ],
    () =>
      getAllDonation({
        search: searchBarValue,
        ...pagination,
        startDate: moment(reportStartDate).utcOffset(0, true).toISOString(),
        endDate: moment(reportEndDate).utcOffset(0, true).toISOString(),
        languageId: selectedLang.id,
      }),
    {
      keepPreviousData: true,
      enabled: activeReportTab.name == t("donation_Donation"),
    }
  );
  const commitmentQuery = useQuery(
    [
      "Commitments",
      pagination.page,
      selectedLang.id,
      reportEndDate,
      reportStartDate,
      searchBarValue,
    ],
    () =>
      getAllCommitments({
        search: searchBarValue,
        ...pagination,
        startDate: moment(reportStartDate).utcOffset(0, true).toISOString(),
        endDate: moment(reportEndDate).utcOffset(0, true).toISOString(),
        languageId: selectedLang.id,
      }),
    {
      keepPreviousData: true,
      enabled: activeReportTab.name == t("report_commitment"),
    }
  );

  const boxCollectionQuery = useQuery(
    [
      "Collections",
      pagination.page,
      selectedLang.id,
      reportStartDate,
      reportEndDate,
      searchBarValue,
    ],
    () =>
      getAllBoxCollection({
        search: searchBarValue,
        ...pagination,
        startDate: moment(reportStartDate).utcOffset(0, true).toISOString(),
        endDate: moment(reportEndDate).utcOffset(0, true).toISOString(),
        languageId: selectedLang.id,
      }),
    {
      keepPreviousData: true,
      enabled: activeReportTab.name == t("report_donation_box"),
    }
  );
  const Items = useMemo(() => {
    switch (activeReportTab.name) {
      case t("report_expences"):
        return expensesQuery?.data ?? [];

      case t("donation_Donation"):
        return donationQuery?.data ?? [];

      case t("report_commitment"):
        return commitmentQuery?.data ?? [];

      case t("report_donation_box"):
        return boxCollectionQuery?.data ?? [];
      default:
        return [];
    }
  }, [expensesQuery, donationQuery, commitmentQuery, boxCollectionQuery]);
  // Export

  const exportExpenseData = useQuery(
    [
      "ExportExpenses",
      selectedLang.id,
      reportStartDate,
      reportEndDate,
      searchBarValue,
      expensesQuery
    ],
    () =>
      ExportAllExpense({
        search: searchBarValue,
        limit: expensesQuery?.data?.totalResults,
        startDate: moment(reportStartDate).utcOffset(0, true).toISOString(),
        endDate: moment(reportEndDate).utcOffset(0, true).toISOString(),
        languageId: selectedLang.id,
      }),
    {
      keepPreviousData: true,
      enabled: activeReportTab.name == t("report_expences"),
    }
  );
  const exportAllCommitmentsData = useQuery(
    [
      "ExportCommitments",
      selectedLang.id,
      reportEndDate,
      reportStartDate,
      searchBarValue,
      commitmentQuery,
    ],
    () =>
      exportAllCommitments({
        search: searchBarValue,
        // ...pagination,
        limit: commitmentQuery?.data?.totalResults,
        startDate: moment(reportStartDate).utcOffset(0, true).toISOString(),
        endDate: moment(reportEndDate).utcOffset(0, true).toISOString(),
        languageId: selectedLang.id,
      }),
    {
      keepPreviousData: true,
      enabled: activeReportTab.name == t("report_commitment"),
    }
  );
  const exportDonationData = useQuery(
    [
      "ExportDonations",
      selectedLang.id,
      reportEndDate,
      reportStartDate,
      searchBarValue,
      donationQuery
    ],
    () =>
      exportAllDonation({
        search: searchBarValue,
        limit: donationQuery?.data?.totalResults,
        startDate: moment(reportStartDate).utcOffset(0, true).toISOString(),
        endDate: moment(reportEndDate).utcOffset(0, true).toISOString(),
        languageId: selectedLang.id,
      }),
    {
      keepPreviousData: true,
      enabled: activeReportTab.name == t("donation_Donation"),
    }
  );

  const exportBoxCollectionData = useQuery(
    [
      "ExportCollections",
      selectedLang.id,
      reportStartDate,
      reportEndDate,
      searchBarValue,
      boxCollectionQuery
    ],
    () =>
      getAllBoxCollection({
        search: searchBarValue,
        limit: boxCollectionQuery?.data?.totalResults,
        startDate: moment(reportStartDate).utcOffset(0, true).toISOString(),
        endDate: moment(reportEndDate).utcOffset(0, true).toISOString(),
        languageId: selectedLang.id,
      }),
    {
      keepPreviousData: true,
      enabled: activeReportTab.name == t("report_donation_box"),
    }
  );

  useEffect(() => {
    setPagination({ page: 1, limit: 10 });
  }, [activeReportTab.name]);

  // exoprt table code

  const handleClickExport = () => {
    let tableData = [];
    let fileName;
    let sheetName;
    
    switch (activeReportTab.name) {
      case t("report_expences"):
        fileName = "Expenses report";
        sheetName = "Expenses";
        tableData = jsonDataExpences({
          data: exportExpenseData?.data?.results ?? [],
        });
        break;
      case t("donation_Donation"):
        fileName = "Donation report";
        sheetName = "Donation";
        tableData = jsonDataDonation({
          data: exportDonationData?.data?.results ?? [],
        });
        break;
      case t("report_commitment"):
        fileName = "Commitment report";
        sheetName = "Commitment";
        tableData = jsonDataCommitment({
          data: exportAllCommitmentsData?.data?.results ?? [],
        });
        break;
      case t("report_donation_box"):
        fileName = "Hundi report";
        sheetName = "Hundi";
        tableData = jsonDataDonationBox({
          data: exportBoxCollectionData?.data?.results ?? [],
        });
        break;
      default:
        break;
    }
    handleExport({
      dataName: tableData,
      fileName: fileName,
      sheetName: sheetName,
    });
  };

  

  return (
    <NewsWarper>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Mandir Admin | Financial Report</title>
      </Helmet>
      <div className="window nav statusBar body "></div>

      <div>
        <div className="d-lg-flex justify-content-between align-items-center ">
          <div className="d-flex align-items-center mb-2 mb-lg-0">
            {/* <img
              src={arrowLeft}
              className="me-2  cursor-pointer align-self-center"
              onClick={() => history.push("/")}
            /> */}
            <div className="addNews d-flex">
              <div className="">
                <div>
                  <Trans i18nKey={"report_AddReport"} />
                </div>
              </div>
            </div>
          </div>
          <div className="addNews d-flex flex-wrap gap-2 gap-md-0">
            <div className="total_collection me-2 d-flex justify-content-center align-items-center ">
              {/* <Trans i18nKey={"DonationBox_total_collection"} /> */}
              <div>{`Total ${activeReportTab.name} :`}</div>
              &nbsp;
              <div>₹</div>&nbsp;
              <div>{Items?.totalAmount?.toLocaleString('en-IN') ?? 0}</div>
            </div>
            <div className="dateChooserReport me-2 position-relative justify-content-between align-item-center">
              <Formik
                initialValues={{
                  startDate: new Date(moment().startOf("month")),
                }}
              >
                {(formik) => {
                  useUpdateEffect(() => {
                    setReportStartDate(formik.values.startDate);
                  }, [formik.values.startDate]);
                  return (
                    <FormikCustomDatePicker
                      name="startDate"
                      inline={false}
                      dateFormat=" dd-MM-yyyy"
                    />
                  );
                }}
              </Formik>
            </div>
            <div className="dateChooserReport d-flex me-2 position-relative justify-content-between align-item-center">
              <Formik
                initialValues={{
                  endDate: new Date(),
                }}
              >
                {(formik) => {
                  useUpdateEffect(() => {
                    setReportEndDate(formik.values.endDate);
                  }, [formik.values.endDate]);
                  return (
                    <FormikCustomDatePicker
                      name="endDate"
                      inline={false}
                      minDate={reportStartDate}
                      dateFormat=" dd-MM-yyyy"
                    />
                  );
                }}
              </Formik>
            </div>
            <div>
              <Button
                color="primary"
                className="exportBtn"
                onClick={handleClickExport}
              >
                <span className="d-flex align-items-center">
                  <Trans i18nKey={"export_report"} />
                  <img src={exportIcon} width={15} className="ms-2" />
                </span>
              </Button>
            </div>
          </div>
        </div>

        <FinancialReportTabs
          setActive={setActiveReportTab}
          active={activeReportTab}
          setPagination={setPagination}
        />

        <div style={{ height: "10px" }}>
          <If
            condition={
              expensesQuery.isFetching ||
              donationQuery.isFetching ||
              commitmentQuery.isFetching ||
              boxCollectionQuery.isFetching
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
        <div className="newsContent  ">
          <Row>
            <If
              condition={
                expensesQuery.isFetching ||
                donationQuery.isFetching ||
                commitmentQuery.isFetching ||
                boxCollectionQuery.isFetching
              }
              disableMemo
            >
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
                <If condition={Items?.results?.length != 0} disableMemo>
                  <Then>
                    <ReportListTable
                      activeReportTab={activeReportTab}
                      data={Items?.results ?? []}
                      page={pagination}
                    />
                  </Then>
                  <Else>
                    <NoContent
                      headingNotfound={t("finance_report_no_found")}
                      // para={t("donation_box_not_click_add_donation_box")}
                    />
                  </Else>
                </If>
              </Else>
            </If>

            {/* <If condition={Items.totalPages > 1} > */}
            {/* <Then  > */}
            {Items.totalPages > 1 && (
              <Col xs={12} className="mb-2 d-flex justify-content-center">
                <ReactPaginate
                  nextLabel=""
                  breakLabel="..."
                  previousLabel=""
                  pageCount={Items.totalPages ?? 0}
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
                  forcePage={pagination.page - 1}
                  containerClassName={
                    "pagination react-paginate justify-content-end p-1"
                  }
                />
              </Col>
            )}
            {/* </Then> */}
            {/* </If> */}
          </Row>
        </div>
      </div>
    </NewsWarper>
  );
}
