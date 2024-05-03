import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";

import { deleteCattleInfo } from "../../../api/cattle/cattleInfo";
import deleteIcon from "../../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../../assets/images/icons/category/editIcon.svg";
import avtarIcon from "../../../assets/images/icons/dashBoard/defaultAvatar.svg";
import confirmationIcon from "../../../assets/images/icons/news/conformationIcon.svg";
import CustomDataTable from "../../../components/partials/CustomDataTable";
import { ConverFirstLatterToCapital } from "../../../utility/formater";
import { DELETE, EDIT } from "../../../utility/permissionsVariable";

const CattleInfoTableWrapper = styled.div`
  color: #583703 !important;
  margin-bottom: 1rem;
  font: normal normal bold 15px/23px Noto Sans;

  .modal-body {
    max-height: 600px !important;
    overflow: auto !important;
  }
  .tableDes p {
    margin-bottom: 0;
  }
`;

const CattleInfoTable = ({
  data = [],
  maxHeight,
  height,
  currentFilter,
  // currentBreed,
  currentStatus,
  allPermissions,
  subPermission,
  currentPage,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const handleDeleteCattle = async (payload) => {
    return deleteCattleInfo(payload);
  };

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteCattle,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["cattleList"]);
      }
    },
  });

  const columns = [
    {
      name: t("cattle_id"),
      selector: (row) => row.cattleId,
      width: "130px",
    },
    {
      name: t("cattle_photo"),
      selector: (row) => row.cowPhoto,
      center: true,
      width: "130px",
    },
    // {
    //   name: t("cattle_owner_photo"),
    //   selector: (row) => row.ownerPhoto,
    //   center: true,
    //   width: "140px",
    // },
    // {
    //   name: t("cattle_owner_id"),
    //   selector: (row) => row.ownerId,
    //   width: "130px",
    // },
    {
      name: t("dashboard_Recent_DonorType"),
      selector: (row) => row.type,
      width: "130px",
    },
    {
      name: t("cattle_mother_id"),
      selector: (row) => row.motherId,
      width: "150px",
    },
    {
      name: t("cattle_breed"),
      selector: (row) => row.breed,
      width: "130px",
    },
    {
      name: t("cattle_date_of_birth"),
      selector: (row) => row.dateOfBirth,
      width: "150px",
    },
    {
      name: t("cattle_age"),
      selector: (row) => row.age,
      width: "100px",
    },
    {
      name: t("cattle_is_pregnant"),
      selector: (row) => row.isPregnant,
      width: "130px",
    },
    {
      name: t("cattle_pregnancy_date"),
      selector: (row) => row.pregnancyDate,
      width: "150px",
    },
    {
      name: t("cattle_is_milking"),
      selector: (row) => row.isMilking,
      width: "130px",
    },
    {
      name: t("cattle_milk_quantity"),
      selector: (row) => row.milkQuantity,
      width: "150px",
    },
    {
      name: t(""),
      selector: (row) => row.edit,
      width: "80px",
    },
    {
      name: t(""),
      selector: (row) => row.delete,
      width: "80px",
    },
  ];

  const CattlesInfo = useMemo(() => {
    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        cattleId: item?.tagId,
        cowPhoto: (
          <img
            src={
              item?.cattleImage !== "" && item?.cattleImage
                ? item?.cattleImage
                : avtarIcon
            }
            style={{
              marginRight: "5px",
              width: "30px",
              height: "30px",
            }}
            className="rounded-circle"
          />
        ),
        ownerPhoto: (
          <img
            src={
              item?.ownerImage !== "" && item?.ownerImage
                ? item?.ownerImage
                : avtarIcon
            }
            style={{
              marginRight: "5px",
              width: "30px",
              height: "30px",
            }}
            className="rounded-circle"
          />
        ),
        ownerId: item?.ownerId,
        type: ConverFirstLatterToCapital(item?.typeId?.name ?? ""),
        motherId: item?.motherId ?? "N/A",
        breed: ConverFirstLatterToCapital(item?.breedId?.name ?? ""),
        dateOfBirth: moment(item?.dob).format(" DD MMM YYYY"),
        age: item?.age,
        isPregnant:
          // <div style={{ padding: "16px" }}>
          item?.isPregnant ? "YES" : "NO",
        // </div>
        isMilking: item?.isMilking ? "YES" : "NO",
        pregnancyDate: item?.pregnancyDate
          ? moment(item?.pregnancyDate).format(" DD MMM YYYY")
          : "N/A",
        milkQuantity: item?.milkQuantity ?? "N/A",

        edit:
          allPermissions?.name === "all" || subPermission?.includes(EDIT) ? (
            <img
              src={editIcon}
              width={35}
              className="cursor-pointer "
              onClick={() => {
                history.push(
                  `/cattle/info/${item?._id}?page=${currentPage}&status=${currentStatus}&filter=${currentFilter}`
                );
              }}
            />
          ) : (
            ""
          ),
        delete:
          allPermissions?.name === "all" || subPermission?.includes(DELETE) ? (
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
                                        "cattle_cattle_delete"
                                      )}</h3>
                                      <p>${t("cattle_cattle_sure")}</p>
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
                    deleteMutation.mutate(item._id);
                  }
                });
              }}
            />
          ) : (
            ""
          ),
      };
    });
  }, [data]);

  return (
    <CattleInfoTableWrapper>
      <CustomDataTable
        maxHeight={maxHeight}
        height={height}
        columns={columns}
        data={CattlesInfo}
      />
    </CattleInfoTableWrapper>
  );
};

export default CattleInfoTable;
