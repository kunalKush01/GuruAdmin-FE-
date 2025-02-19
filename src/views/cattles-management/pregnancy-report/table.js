import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";

import { deletePregnancy } from "../../../api/cattle/cattlePregnancy";
import deleteIcon from "../../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../../assets/images/icons/category/editIcon.svg";
import confirmationIcon from "../../../assets/images/icons/news/conformationIcon.svg";
import CustomDataTable from "../../../components/partials/CustomDataTable";
import { DELETE, EDIT } from "../../../utility/permissionsVariable";

import "../../../assets/scss/viewCommon.scss";
import { Table } from "antd";
const PregnancyReportTable = ({
  data = [],
  allPermissions,
  subPermission,
  currentPage,
  currentFilter,
  currentPregnancyStatus,
  maxHeight,
  height,
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleDeletePregnancy = async (payload) => {
    return deletePregnancy(payload);
  };
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeletePregnancy,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["cattlePregnancyList"]);
      }
    },
  });

  const columns = [
    {
      title: t("cattle_id"),
      dataIndex: "cattleId",
      key: "cattleId",
      width: 200,
    },
    {
      title: t("cattle_conceiving_date"),
      dataIndex: "conceivingDate",
      key: "conceivingDate",
      width: 200,
    },
    {
      title: t("cattle_delivery_date"),
      dataIndex: "deliveryDate",
      key: "deliveryDate",
      width: 200,
    },
    {
      title: t("cattle_pregnancy_status"),
      dataIndex: "pregnancyStatus",
      key: "pregnancyStatus",
      width: 200,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "edit",
      width: 100,
      fixed:"right"
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
        pregnancyStatus: item?.status === "NO" ? "Inactive" : "Active",
        action: (
          <div>
            {allPermissions?.name === "all" || subPermission?.includes(EDIT) ? (
              <img
                src={editIcon}
                width={35}
                className="cursor-pointer "
                onClick={() => {
                  history.push(
                    `/cattle/pregnancy-reports/${item?.id}?page=${currentPage}&status=${currentPregnancyStatus}&filter=${currentFilter}`
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
                              "cattle_pregnancy_delete"
                            )}</h3>
                            <p>${t("cattle_pregnancy_sure")}</p>
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
    <div className="pregnancytablewrapper">
      <Table
        columns={columns}
        dataSource={pregnancyData}
        className="commonListTable"
        scroll={{
          x: 1500,
          y: 400,
        }}
        sticky={{
          offsetHeader: 64,
        }}
        bordered
      />
    </div>
  );
};

export default PregnancyReportTable;
