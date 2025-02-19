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
import "../../../assets/scss/viewCommon.scss";
import { Table } from "antd";
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
      title: t("cattle_id"),
      dataIndex: "cattleId",
      key: "cattleId",
      width: 130,
      fixed:"left"
    },
    {
      title: t("cattle_photo"),
      dataIndex: "cowPhoto",
      key: "cowPhoto",
      width: 200
    },
    // {
    //   title: t("cattle_owner_photo"),
    //   dataIndex: "ownerPhoto",
    //   key: "ownerPhoto",
    //   width: 140,
    //   align: "center",
    //   render: (ownerPhoto) => <img src={ownerPhoto} alt="Owner" width={50} height={50} />,
    // },
    // {
    //   title: t("cattle_owner_id"),
    //   dataIndex: "ownerId",
    //   key: "ownerId",
    //   width: 130,
    // },
    {
      title: t("dashboard_Recent_DonorType"),
      dataIndex: "type",
      key: "type",
      width: 130,
    },
    {
      title: t("cattle_mother_id"),
      dataIndex: "motherId",
      key: "motherId",
      width: 150,
    },
    {
      title: t("cattle_breed"),
      dataIndex: "breed",
      key: "breed",
      width: 130,
    },
    {
      title: t("cattle_date_of_birth"),
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      width: 150,
    },
    {
      title: t("cattle_age"),
      dataIndex: "age",
      key: "age",
      width: 100,
    },
    {
      title: t("cattle_is_pregnant"),
      dataIndex: "isPregnant",
      key: "isPregnant",
      width: 130,
    },
    {
      title: t("cattle_pregnancy_date"),
      dataIndex: "pregnancyDate",
      key: "pregnancyDate",
      width: 150,
    },
    {
      title: t("cattle_is_milking"),
      dataIndex: "isMilking",
      key: "isMilking",
      width: 130,
    },
    {
      title: t("cattle_milk_quantity"),
      dataIndex: "milkQuantity",
      key: "milkQuantity",
      width: 150,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width:100,
      fixed: "right",
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
        action: ( 
          <div className="d-flex">
            {allPermissions?.name === "all" || subPermission?.includes(EDIT) ? (
              <img
                src={editIcon}
                width={35}
                className="cursor-pointer "
                onClick={() => {
                  history.push(`/cattle/info/${item?._id}`);
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
            )}
          </div>
        ),
      };
    });
  }, [data]);

  return (
    <div className="cattleinfotablewrapper">
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
        dataSource={CattlesInfo}
      />
    </div>
  );
};

export default CattleInfoTable;
