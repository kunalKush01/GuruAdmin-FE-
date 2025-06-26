import { useQuery } from "@tanstack/react-query";
import { Formik } from "formik";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useUpdateEffect } from "react-use";
import { Button, Col, Row } from "reactstrap";
import styled from "styled-components";
import {
  exportAllCommitments,
  getAllCommitments,
} from "../../api/commitmentApi";
import { exportAllDonation, getAllDonation } from "../../api/donationApi";
import { getAllBoxCollection } from "../../api/donationBoxCollectionApi";
import { ExportAllExpense, getAllExpense, ExportExpenseReport, ExportDonationReport,ExportPledgeReport, ExportDonationBoxReport } from "../../api/expenseApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import exportIcon from "../../assets/images/icons/exportIcon.svg";
import {
  jsonDataCommitment,
  jsonDataDonation,
  jsonDataDonationBox,
  jsonDataExpences,
} from "../../components/financeReport/reportJsonExport";
import ReportListTable from "../../components/financeReport/reportListTable";
import FormikRangeDatePicker from "../../components/partials/FormikRangeDatePicker";
import BtnPopover from "../../components/partials/btnPopover";
import CustomDatePicker from "../../components/partials/customDatePicker";
import FormikCustomDatePicker from "../../components/partials/formikCustomDatePicker";
import NoContent from "../../components/partials/noContent";
import { handleExport } from "../../utility/utils/exportTabele";
import FinancialReportTabs from "./financialReportTabs";
import { Modal, Radio, DatePicker, message } from "antd";
const { RangePicker, MonthPicker } = DatePicker;
import "../../assets/scss/viewCommon.scss";

export default function FinancialReport() {
  const { t } = useTranslation();
  const [reportStartDate, setReportStartDate] = useState(
    new Date(moment().startOf("month"))
  );
  const [reportEndDate, setReportEndDate] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [exportType, setExportType] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [customDateRange, setCustomDateRange] = useState([]);

const handleClickExport = () => {
  setIsModalVisible(true);
};

const handleDownloadReport = async () => {
  let payload = { format: "excel" };

  if (exportType === "monthly" && selectedMonth) {
    const monthNumber = selectedMonth.$M + 1;
    const year = selectedMonth.$y;

    payload = {
      month: monthNumber.toString().padStart(2, "0"),
      year: year.toString(),
      format: "excel",
    };
  } else if (exportType === "custom" && customDateRange.length === 2) {
    const startDate = customDateRange[0];
    const endDate = customDateRange[1];

    payload = {
      startDate: `${startDate.$y}-${(startDate.$M + 1).toString().padStart(2, "0")}-${startDate.$D.toString().padStart(2, "0")}T00:00:00.000Z`,
      endDate: `${endDate.$y}-${(endDate.$M + 1).toString().padStart(2, "0")}-${endDate.$D.toString().padStart(2, "0")}T23:59:59.999Z`,
      format: "excel",
    };
  } else {
    return message.error("Please select a valid date range or month.");
  }

  try {
    console.log("Sending Payload:", payload);

    const reportType = activeReportTab.name;

    if (reportType === t("donation_Donation")) {
      await ExportDonationReport(payload);
    } else if (reportType === t("report_commitment")) {
      await ExportPledgeReport(payload);
    } else if (reportType === t("report_donation_box")) {
      await ExportDonationBoxReport(payload);
    } else if (reportType === t("report_expences")) {
      await ExportExpenseReport(payload);
    } else {
      return message.error("Unknown report type selected.");
    }

    message.success(
      "You will receive your report for the selected time range via email. Please wait.",
      5
    );
  } catch (error) {
    console.error("Error exporting report:", error);
    message.error("Failed to generate report. Please try again.");
  }

  setIsModalVisible(false);
};

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
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const searchBarValue = useSelector((state) => state.search.LocalSearch);

  const expensesQuery = useQuery(
    [
      "Expenses",
      pagination.page,
      pagination.limit,
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
      pagination.limit,
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
      pagination.limit,
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
      pagination.limit,
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

  const expenseTotalItem = useMemo(
    () => expensesQuery?.data?.totalResults || 0,
    [expensesQuery]
  );

  const donationTotalItem = useMemo(
    () => donationQuery?.data?.totalResults || 0,
    [donationQuery]
  );

  const commitmentTotalItem = useMemo(
    () => commitmentQuery?.data?.totalResults || 0,
    [commitmentQuery]
  );

  const boxCollectionTotalItem = useMemo(
    () => boxCollectionQuery?.data?.totalResults || 0,
    [boxCollectionQuery]
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
      expensesQuery,
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
      donationQuery,
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
      boxCollectionQuery,
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

  // const handleClickExport = () => {
  //   let tableData = [];
  //   let fileName;
  //   let sheetName;

  //   switch (activeReportTab.name) {
  //     case t("report_expences"):
  //       fileName = "Expenses report";
  //       sheetName = "Expenses";
  //       tableData = jsonDataExpences({
  //         data: exportExpenseData?.data?.results ?? [],
  //       });
  //       break;
  //     case t("donation_Donation"):
  //       fileName = "Donation report";
  //       sheetName = "Donation";
  //       tableData = jsonDataDonation({
  //         data: exportDonationData?.data?.results ?? [],
  //       });
  //       break;
  //     case t("report_commitment"):
  //       fileName = "Commitment report";
  //       sheetName = "Commitment";
  //       tableData = jsonDataCommitment({
  //         data: exportAllCommitmentsData?.data?.results ?? [],
  //       });
  //       break;
  //     case t("report_donation_box"):
  //       fileName = "Hundi report";
  //       sheetName = "Hundi";
  //       tableData = jsonDataDonationBox({
  //         data: exportBoxCollectionData?.data?.results ?? [],
  //       });
  //       break;
  //     default:
  //       break;
  //   }
  //   handleExport({
  //     dataName: tableData,
  //     fileName: fileName,
  //     sheetName: sheetName,
  //   });
  // };

  return (
    <div className="listviewwrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | Financial Report</title>
      </Helmet>
      <div className="window nav statusBar body "></div>

      <div>
        <div className="d-lg-flex justify-content-between align-items-center ">
          <div className="d-flex align-items-center mb-2 mb-lg-0">
            {/* <img
              src={arrowLeft}
              className="me-2  cursor-pointer align-self-center"
              onClick={() => navigate("/")}
            /> */}
            <div className="addAction d-flex">
              <div className="">
                <div>
                  <Trans i18nKey={"report_AddReport"} />
                </div>
              </div>
            </div>
          </div>
          <div
            className="addAction d-flex flex-wrap gap-2 gap-md-0"
            style={{ display: "flex !important", alignItems: "baseline" }}
          >
            <div className="total_collection me-2 d-flex justify-content-center align-items-center ">
              {/* <Trans i18nKey={"DonationBox_total_collection"} /> */}
              <div>{t("total")}{`${activeReportTab.name} :`}</div>
              &nbsp;
              <div>₹</div>
              <div>{Items?.totalAmount?.toLocaleString("en-IN") ?? 0}</div>
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
            <Button color="primary" className="addAction-btn" onClick={handleClickExport}>
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
                      expenseTotalItem={expenseTotalItem}
                      donationTotalItem={donationTotalItem}
                      commitmentTotalItem={commitmentTotalItem}
                      boxCollectionTotalItem={boxCollectionTotalItem}
                      currentPage={pagination.page}
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
            {/* {Items.totalPages > 1 && (
              <Col xs={12} className="mb-2 d-flex justify-content-center mt-5">
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
            )} */}
            {/* </Then> */}
            {/* </If> */}
          </Row>
        </div>
      </div>
      <Modal
  title={<h2>Download Report</h2>}
  visible={isModalVisible}
  onCancel={() => setIsModalVisible(false)}
  footer={null}
  centered
  width={500}
  className="download-report-modal"
>
  <p>Report will be sent to your registered email ID.</p>

  <div className="modal-row">
    <label className="modal-label">Type</label>
    <Radio.Group value={exportType} onChange={(e) => setExportType(e.target.value)}>
      <Radio value="monthly">Monthly</Radio>
      <Radio value="custom">Custom</Radio>
    </Radio.Group>
  </div>

  {exportType === "monthly" && (
    <div className="modal-row">
      <label className="modal-label">Month</label>
      <MonthPicker onChange={(date) => setSelectedMonth(date)} placeholder="Select month" />
    </div>
  )}

  {exportType === "custom" && (
    <div className="modal-row">
      <label className="modal-label">Range</label>
      <RangePicker onChange={(dates) => setCustomDateRange(dates)} />
    </div>
  )}

  <div className="modal-actions">
    <button className="btn-cancel" onClick={() => setIsModalVisible(false)}>Cancel</button>
    <button className="btn-download" onClick={handleDownloadReport}>Download</button>
  </div>
</Modal>



    </div>
  );
}
