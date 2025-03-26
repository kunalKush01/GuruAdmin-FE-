import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";
import { deleteMedicalRecord } from "../../../api/cattle/cattleMedical";
import deleteIcon from "../../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../../assets/images/icons/category/editIcon.svg";
import confirmationIcon from "../../../assets/images/icons/news/conformationIcon.svg";
import CustomDataTable from "../../../components/partials/CustomDataTable";
import { DELETE, EDIT } from "../../../utility/permissionsVariable";
import "../../../assets/scss/viewCommon.scss";
import { Table } from "antd";
const MedicalReportTable = ({
  data = [],
  allPermissions,
  subPermission,
  currentPage,
  currentFilter,
  maxHeight,
  height,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
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
      title: t("cattle_id"),
      dataIndex: "cattleId",
      key: "cattleId",
      width: 130,
    },
    {
      title: t("expenses_Date"),
      dataIndex: "date",
      key: "date",
      width: 130,
    },
    {
      title: t("cattle_treatment_medicine"),
      dataIndex: "medicine",
      key: "medicine",
      width: 180,
    },
    {
      title: t("cattle_dosage"),
      dataIndex: "dosage",
      key: "dosage",
      width: 150,
    },
    {
      title: t("cattle_dr_name"),
      dataIndex: "drName",
      key: "drName",
      width: 130,
    },
    {
      title: t("dashboard_Recent_DonorNumber"),
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      width: 150,
    },
    {
      title: t("cattle_symptoms"),
      dataIndex: "symptoms",
      key: "symptoms",
      width: 130,
    },
    {
      title: t("cattle_fees"),
      dataIndex: "medicalExpense",
      key: "medicalExpense",
      width: 150,
    },
    {
      title: t("action"),
      dataIndex: "action",
      key: "action",
      width: 100,
      fixed:"right"
    }
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
        medicalExpense: `₹${item?.expenseAmount.toLocaleString("en-IN")}`,
        mobileNumber: `+${item?.countryCode?.replace("+", "") ?? "91"} ${
          item?.doctorNumber
        }`,
        symptoms: item?.symptoms,
        action: (
          <div>
            {allPermissions?.name === "all" || subPermission?.includes(EDIT) ? (
              <img
                src={editIcon}
                width={35}
                className="cursor-pointer "
                onClick={() => {
                  history.push(
                    `/cattle/medical-info/${item?.id}?page=${currentPage}&filter=${currentFilter}`
                  );
                }}
              />
            ) : (
              ""
            )}
            {allPermissions?.name === "all" ||
            subPermission?.includes(DELETE) ? (
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
            ) : (
              ""
            )}
          </div>
        ),
      };
    });
  }, [data]);

  return (
    <div className="medicaltablewrapper">
      <Table
        columns={columns}
        className="commonListTable"
        scroll={{
          x: 1500,
          y: 400,
        }}
        sticky={{
          offsetHeader: 64,
        }}
        bordered
        dataSource={MedicalReportData}
      />
    </div>
  );
};

export default MedicalReportTable;
