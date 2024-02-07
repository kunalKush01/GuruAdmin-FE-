import moment from "moment";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Swal from "sweetalert2";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePregnancy } from "../../../api/cattle/cattlePregnancy";
import deleteIcon from "../../../assets/images/icons/category/deleteIcon.svg";
import confirmationIcon from "../../../assets/images/icons/news/conformationIcon.svg";
import CustomDataTable from "../../../components/partials/CustomDataTable";
import { DELETE } from "../../../utility/permissionsVariable";

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

const PregnancyReportTable = ({ data = [], allPermissions, subPermission }) => {
  const { t } = useTranslation();

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
    {
      name: t(""),
      selector: (row) => row.delete,
      width: "80px",
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
        ),
        // ) : (
        //   ""
        // ),
      };
    });
  }, [data]);

  return (
    <PregnancyTableWrapper>
      <CustomDataTable maxHeight={""} columns={columns} data={pregnancyData} />
    </PregnancyTableWrapper>
  );
};

export default PregnancyReportTable;
