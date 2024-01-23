import moment from "moment";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import CustomDataTable from "../../../components/partials/CustomDataTable";

const PregnancyTableWrapper = styled.div`
  color: #583703 !important;
  font: normal normal bold 15px/23px Noto Sans;
  .modal-body {
    max-height: 600px !important;
    overflow: auto !important;
  }
  .tableDes p {
    margin-bottom: 0;
  }
`;

const PregnancyReportTable = ({ data = [] }) => {
  const { t } = useTranslation();

  const columns = [
    {
      name: t("cattle_calf_id"),
      selector: (row) => row?.cattleId,
    },
    {
      name: t("cattle_conceiving_date"),
      selector: (row) => row?.conceivingDate,
    },
    {
      name: t("cattle_delivery_date"),
      selector: (row) => row?.deliveryDate,
    },
    {
      name: t("cattle_pregnancy_status"),
      selector: (row) => row?.pregnancyStatus,
    },
  ];

  const pregnancyData = useMemo(() => {
    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        cattleId: item?.tagId,
        conceivingDate: moment(item?.conceivingDate).format("DD MMM YYYY"),
        deliveryDate: item?.deliveryDate
          ? moment(item?.deliveryDate).format("DD MMM YYYY")
          : "N/A",
        pregnancyStatus: item?.status,
      };
    });
  },[data]);

  return (
    <PregnancyTableWrapper>
      <CustomDataTable maxHeight={""} columns={columns} data={pregnancyData} />
    </PregnancyTableWrapper>
  );
};

export default PregnancyReportTable;
