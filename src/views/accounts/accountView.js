import React, { useMemo, useState } from "react";
import {
  Flex,
  Table,
  Typography,
  DatePicker,
  Row,
  Col,
  Divider,
  Card,
} from "antd";
import { useTranslation } from "react-i18next";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import "../../assets/scss/common.scss";
import { useHistory } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAccountById, getAccountEntries } from "../../api/profileApi";
import { useParams } from "react-router-dom";
import moment from "moment";
const { RangePicker } = DatePicker;
const { Text } = Typography;
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const registerColumns = [
  {
    title: "Date",
    dataIndex: "date",
    render: (text) => moment(text).format("DD MMM YYYY"),
  },
  {
    title: "Narration",
    dataIndex: "narration",
  },
  {
    title: "Debit",
    dataIndex: "debit",
    render: (value) => (value ? <Text>{`₹${value}`}</Text> : null),
  },
  {
    title: "Credit",
    dataIndex: "credit",
    render: (value) => (value ? <Text>{`₹${value}`}</Text> : null),
  },
];
const AccountView = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const today = dayjs();
  const [dateRangeFilter, setDateRangeFilter] = useState({
    startDate: dayjs().startOf("month").toISOString(),
    endDate: dayjs().endOf("month").toISOString(),
  });

  // const [sourceType, setSourceType] = useState("donation");

  const { data } = useQuery(
    [
      "AccountsEntries",
      id,
      pagination,
      dateRangeFilter,
      //sourceType
    ],
    () =>
      getAccountEntries({
        id,
        payload: {
          ...pagination,
          ...(dateRangeFilter || {}),
          // sourceType,
          sort: "desc",
        },
      }),
    {
      keepPreviousData: true,
      enabled: !!id,
      onError: (error) => {
        console.error("Error fetching member data:", error);
      },
    }
  );

  const accountsDetails = useMemo(() => data?.result ?? [], [data]);

  const flatDataSource = useMemo(() => {
    if (!Array.isArray(accountsDetails?.entries)) return [];

    return accountsDetails.entries.flatMap((entry) =>
      entry.entries.map((item) => ({
        key: item._id,
        date: entry.date,
        narration: entry.narration,
        debit: item.type === "debit" ? item.amount : null,
        credit: item.type === "credit" ? item.amount : null,
      }))
    );
  }, [accountsDetails]);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-1">
        <div className="d-flex align-items-center">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push("/accounts")}
          />
          <span className="commonFont">{t("Transactions History")}</span>
        </div>
        <div className="">
          <RangePicker
            id="dateRangePickerANTD"
            format="DD MMM YYYY"
            value={
              dateRangeFilter
                ? [
                    dayjs(dateRangeFilter.startDate),
                    dayjs(dateRangeFilter.endDate),
                  ]
                : null
            }
            placeholder={[t("Start Date"), t("End Date")]}
            onChange={(dates) => {
              if (dates && dates.length === 2) {
                const [start, end] = dates;
                setDateRangeFilter({
                  startDate: start.startOf("day").toISOString(),
                  endDate: end.endOf("day").toISOString(),
                });
              } else {
                // Reset to current month if cleared
                setDateRangeFilter(null);
              }
            }}
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <div className={`${accountsDetails?.totalResults < 1 ? "mb-1" : ""}`}>
        <Table
          bordered
          className="commonListTable"
          scroll={{ x: 1000, y: 400 }}
          sticky={{ offsetHeader: 64 }}
          columns={registerColumns}
          dataSource={flatDataSource}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: accountsDetails?.totalResults,
            onChange: (page) => setPagination((prev) => ({ ...prev, page })),
            onShowSizeChange: (current, size) =>
              setPagination((prev) => ({
                ...prev,
                limit: size,
                page: 1,
              })),
            showSizeChanger: true,
          }}
        />
      </div>
      <Card
        style={{
          position: "sticky",
          bottom: 0,
          zIndex: 10,
          boxShadow: "0 -2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Row gutter={16} justify="space-between">
          <Col>
            <Text strong className="commonFont">
              Balance
            </Text>
          </Col>
          <Col>
            <Text type="danger" className="me-3 commonFontFamily">
              Debit: ₹
              {(accountsDetails?.totals?.grand?.totalDebit || 0).toFixed(2)}
            </Text>
            <Text type="success" className="commonFontFamily">
              Credit: ₹
              {(accountsDetails?.totals?.grand?.totalCredit || 0).toFixed(2)}
            </Text>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
export default AccountView;
