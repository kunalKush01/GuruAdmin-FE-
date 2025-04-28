import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DatePicker } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllReports } from "../../api/profileApi";
import moment from "moment";
import ReportTable from "../../components/reports/reportTable";

const { RangePicker } = DatePicker;

function ReportList() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const trustId = localStorage.getItem("trustId");
  const [dateRangeFilter, setDateRangeFilter] = useState({
    startDate: moment().startOf("month").format("YYYY-MM-DD"),
    endDate: moment().endOf("month").format("YYYY-MM-DD"),
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 1000,
  });

  const { data } = useQuery(
    ["Reports", pagination.page, pagination.limit, dateRangeFilter],
    () =>
      getAllReports({
        ...pagination,
        sort: "desc",
        trustId: trustId,
        startDate: dateRangeFilter?.startDate,
        endDate: dateRangeFilter?.endDate,
      }),
    {
      keepPreviousData: true,
      onError: (error) => {
        console.error("Error fetching report data:", error);
      },
    }
  );

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <span className="commonFont">{t("Reports")}</span>
        </div>
        <div className="ms-1 mb-1">
          <RangePicker
            id="dateRangePickerANTD"
            format="DD MMM YYYY"
            // value={[
            //   moment(dateRangeFilter.startDate),
            //   moment(dateRangeFilter.endDate),
            // ]}
            placeholder={[t("Start Date"), t("End Date")]}
            onChange={(dates) => {
              if (dates && dates.length === 2) {
                const [start, end] = dates;
                setDateRangeFilter({
                  startDate: moment(start).startOf("day").format("YYYY-MM-DD"),
                  endDate: moment(end).endOf("day").format("YYYY-MM-DD"),
                });
              } else {
                setDateRangeFilter({
                  startDate: moment().startOf("month").format("YYYY-MM-DD"),
                  endDate: moment().endOf("month").format("YYYY-MM-DD"),
                });
              }
            }}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <div>
        <ReportTable data={data} />
      </div>
    </div>
  );
}

export default ReportList;
