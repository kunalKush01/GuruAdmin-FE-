import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Swal from "sweetalert2";
import { deleteMedicalRecord } from "../../../api/cattle/cattleMedical";
import deleteIcon from "../../../assets/images/icons/category/deleteIcon.svg";
import confirmationIcon from "../../../assets/images/icons/news/conformationIcon.svg";
import CustomDataTable from "../../../components/partials/CustomDataTable";
import { DELETE } from "../../../utility/permissionsVariable";

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

const MedicalReportTable = ({ data = [], allPermissions, subPermission }) => {
  const { t } = useTranslation();

  const handleDeleteMedicalRecord = async (payload) => {
    return deleteMedicalRecord(payload);
  };
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteMedicalRecord,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["cattleMedicalList"]);
      }
    },
  });

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
    {
      name: t(""),
      selector: (row) => row.delete,
      width: "80px",
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
        delete: (
          // allPermissions?.name === "all" || subPermission?.includes(DELETE) ? (
          <img
            src={deleteIcon}
            width={35}
            className="cursor-pointer "
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              Swal.fire({
                title: `<img src="${confirmationIcon}"/>`,
                html: `
                                      <h3 class="swal-heading mt-1">${t(
                                        "cattle_medical_delete"
                                      )}</h3>
                                      <p>${t("cattle_medical_sure")}</p>
                                      `,
                showCloseButton: false,
                showCancelButton: true,
                focusConfirm: true,
                cancelButtonText: ` ${t("cancel")}`,
                cancelButtonAriaLabel: ` ${t("cancel")}`,

                confirmButtonText: ` ${t("confirm")}`,
                confirmButtonAriaLabel: "Confirm",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  deleteMutation.mutate(item.id);
                }
              });
            }}
          />
        ),
        // ) : (
        //   ""
        // ),
      };
    });
  }, [data]);

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
