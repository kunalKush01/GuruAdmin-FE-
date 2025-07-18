import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";
import { Button } from "reactstrap";
import { deleteRoom } from "../../../api/dharmshala/dharmshalaInfo";
import deleteIcon from "../../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../../assets/images/icons/category/editIcon.svg";
import avtarIcon from "../../../assets/images/icons/dashBoard/defaultAvatar.svg";
import confirmationIcon from "../../../assets/images/icons/news/conformationIcon.svg";
import CustomDharmshalaTable from "../../../components/partials/CustomDharmshalaTable";
import { ConverFirstLatterToCapital } from "../../../utility/formater";
import { useParams } from "react-router-dom";
import "../../../assets/scss/dharmshala.scss";
import { Table } from "antd";

const DharmshalaRoomTable = ({
  data = [],
  maxHeight,
  height,
  currentFilter,
  currentStatus,
  currentPage,
  floorID,
  isMobileView,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { floorId, buildingId } = useParams();
  const handleDeleteRoom = async (payload) => {
    return deleteRoom(payload);
  };
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteRoom,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["dharmshalaRoomList"]);
      }
    },
  });
  const antdColumn = [
    {
      title: t("room_number"), // Table column title
      dataIndex: "roomNumber", // Field in the data for this column
      key: "roomNumber", // Unique key for this column
      width: 120,
      fixed: "left",
    },
    {
      title: t("directBookingAvailable"),
      dataIndex: "directBookingAvailable",
      key: "directBookingAvailable",
      width: 150,
      render: (available) => (available ? "Yes" : "No"), // Conditional rendering for Yes/No
    },
    {
      title: t("room_type"),
      dataIndex: "roomTypeName",
      key: "roomTypeName",
      width: 150,
    },
    {
      title: t("action"),
      dataIndex: "action",
      key: "action",
      width: 50,
      fixed: "right",
    },
  ];
  const DharmshalasRoom = useMemo(() => {
    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        roomNumber: item?.roomNumber,
        directBookingAvailable: item?.directBookingAvailable,
        roomTypeId: item?.roomTypeId,
        roomTypeName: item?.roomTypeName,
        action: (
          <>
            <img
              src={editIcon}
              width={35}
              className="cursor-pointer "
              onClick={() => {
                navigate({
                  pathname: `/rooms/edit/${item?._id}/${floorId}/${buildingId}`,
                  state: { roomData: item },
                });
              }}
            />
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
                              "dharmshala_room_delete"
                            )}</h3>
                            <p>${t("dharmshala_room_delete_sure")}</p>
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
          </>
        ),

        // allPermissions?.name === "all" || subPermission?.includes(DELETE) ? (
      };
    });
  }, [data, floorID]);
  return (
    <div className="DharmshalaComponentInfo">
      {isMobileView ? (
        <div className="card-container">
          {DharmshalasRoom.map((item, index) => (
            <div key={index} className="card">
              <div className="card-body">
                <div className="card-content">
                  <h5 className="card-title">{item.roomNumber}</h5>
                  <p className="card-text">{item.directBookingAvailable}</p>
                  <p className="card-text">{item.roomTypeName}</p>
                </div>
                <div className="card-icons">
                  {item.edit}
                  {item.delete}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Table
          className="commonListTable"
          columns={antdColumn}
          scroll={{
            x: 1500,
            y: 400,
          }}
          sticky={{
            offsetHeader: 64,
          }}
          dataSource={DharmshalasRoom}
        />
      )}
    </div>
  );
};
// <CustomDharmshalaTable
//   maxHeight={maxHeight}
//   height={height}
//   columns={columns}
//   data={DharmshalasRoom}
// />
export default DharmshalaRoomTable;
