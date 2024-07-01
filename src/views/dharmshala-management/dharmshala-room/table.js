import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
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
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { DharmshalaRoomTableWrapper } from "../dharmshalaStyles";

const DharmshalaRoomTable = ({
  data = [],
  maxHeight,
  height,
  currentFilter,
  currentStatus,
  currentPage,
  floorID,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
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
  const columns = [
    {
      name: t("room_number"),
      selector: (row) => row.roomNumber,
      width: "200px",
    },
    {
      name: t("directBookingAvailable"),
      selector: (row) => (row.directBookingAvailable ? "Yes" : "No"),
      width: "250px",
    },
    {
      name: t("room_type"),
      selector: (row) => row.roomTypeName,
      width: "250px",
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
  const DharmshalasRoom = useMemo(() => {
    console.log("floor id is", floorId)
    console.log("building Id", buildingId)
    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        roomNumber: item?.roomNumber,
        directBookingAvailable: item?.directBookingAvailable,
        roomTypeId: item?.roomTypeId,
        roomTypeName: item?.roomTypeName,
        edit: (
          <img
            src={editIcon}
            width={35}
            className="cursor-pointer "
            onClick={() => {
              history.push(
                `/rooms/edit/${item?._id}/${floorId}/${buildingId}?page=${currentPage}&status=${currentStatus}&filter=${currentFilter}&number=${item?.roomNumber}&directBookingAvailable=${item?.directBookingAvailable}`
              );
            }}
          />
        ),
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
        ),
      };
    });
  }, [data, floorID]);
  return (
    <DharmshalaRoomTableWrapper>
      <CustomDharmshalaTable
        maxHeight={maxHeight}
        height={height}
        columns={columns}
        data={DharmshalasRoom}
      />
    </DharmshalaRoomTableWrapper>
  );
};
export default DharmshalaRoomTable;

