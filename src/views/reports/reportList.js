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

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-1">
        <div className="d-flex align-items-center">
          <span className="commonFont">{t("Reports")}</span>
        </div>
        <div className="ms-1 mb-1">
          {/* <RangePicker
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
          /> */}
        </div>
      </div>

      <div>
        <ReportTable />
      </div>
    </div>
  );
}

export default ReportList;
