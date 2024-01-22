import moment from "moment";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import CustomDataTable from "../../../components/partials/CustomDataTable";

const MedicalTableWrapper = styled.div`
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

const MedicalReportTable = ({ data = [] }) => {
  const { t } = useTranslation();

  const columns = [
    {
      name: t("cattle_calf_id"),
      selector: (row) => row.cattleId,
    },
    {
      name: t("expenses_Date"),
      selector: (row) => row.date,
    },
    {
      name: t("cattle_treatment_medicine"),
      selector: (row) => row.medicine,
    },
    {
      name: t("cattle_dosage"),
      selector: (row) => row.dosage,
    },
    {
      name: t("cattle_dr_name"),
      selector: (row) => row.drName,
    },
    {
      name: t("dashboard_Recent_DonorNumber"),
      selector: (row) => row.mobileNumber,
    },
    {
      name: t("cattle_symptoms"),
      selector: (row) => row.symptoms,
    },
  ];

  const MedicalReportData = useMemo(() => {
    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        cattleId: item?.cattleId?.tagId,
        date: moment(item?.treatmentDate).format(" DD MMM YYYY"),
        medicine: item?.medicine,
        dosage: item?.dosage ?? "N/A",
        drName: item?.doctorName,
        mobileNumber: `+${item?.countryCode?.replace("+", "") ?? "91"} ${
          item?.doctorNumber
        }`,
        symptoms: item?.symptoms,
      };
    });
  });

  return (
    <MedicalTableWrapper>
      <CustomDataTable
        maxHeight={""}
        columns={columns}
        data={MedicalReportData}
      />
    </MedicalTableWrapper>
  );
};

export default MedicalReportTable;
