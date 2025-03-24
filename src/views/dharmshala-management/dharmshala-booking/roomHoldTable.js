import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Table, Tag } from "antd";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import {
  getAllRoomHoldList,
  roomunhold,
} from "../../../api/dharmshala/dharmshalaInfo";
import moment from "moment";
import { ConverFirstLatterToCapital } from "../../../utility/formater";
import Swal from "sweetalert2";

function RoomHoldTable() {
  const { t } = useTranslation();
  const history = useHistory();
  const queryClient = useQueryClient();

  const dharmshalaRoomholdList = useQuery(["dharmshalaRoomholdList"], () =>
    getAllRoomHoldList()
  );
  console.log(dharmshalaRoomholdList.data ?? []);

  const dharmshalaRoomholdListData = useMemo(() => {
    const data = dharmshalaRoomholdList.data ?? [];
    return data.flatMap((item) =>
      item.status === "roomhold" // Only show rooms that are still on hold
        ? item.rooms.map((room) => ({
            key: room.roomId,
            roomHoldId: item._id,
            roomNumber: room.roomNumber,
            remark: item.remark || "N/A",
            checkInDate: item.startDate,
            checkOutDate: item.endDate,
            status: item.status,
          }))
        : []
    );
  }, [dharmshalaRoomholdList.data]);
  const handleUnholdRoom = async (roomHoldId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to unhold this room?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Unhold it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const payload = { roomHoldId };
          const response = await roomunhold(payload); // API call

          // Check if the response contains an error
          if (response.error) {
            Swal.fire(
              "Error!",
              response.message || "Something went wrong.",
              "error"
            );
          } else {
            Swal.fire(
              "Success!",
              response.message || "Room has been unheld successfully.",
              "success"
            );
            queryClient.invalidateQueries(["dharmshalaRoomholdList"]); // Refresh list
          }
        } catch (error) {
          console.log(error);

          // Handle network or unexpected errors
          Swal.fire(
            "Error!",
            "Failed to unhold the room. Please try again.",
            "error"
          );
        }
      }
    });
  };

  const columns = [
    {
      title: t("Room Number"),
      dataIndex: "roomNumber",
      key: "roomNumber",
      width: 150,
      fixed: "left",
    },
    {
      title: t("Remark"),
      dataIndex: "remark",
      key: "remark",
      width: 200,
    },
    {
      title: t("Check-In Date"),
      dataIndex: "checkInDate",
      key: "checkInDate",
      width: 180,
      render: (date) => moment(date).format("DD MMM YYYY"),
    },
    {
      title: t("Check-Out Date"),
      dataIndex: "checkOutDate",
      key: "checkOutDate",
      width: 180,
      render: (date) => moment(date).format("DD MMM YYYY"),
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => {
        return <Tag color="red">{ConverFirstLatterToCapital(status)}</Tag>;
      },
    },
    {
      title: t("Action"),
      fixed: "right",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Button
          type="primary"
          danger
          onClick={() => handleUnholdRoom(record.roomHoldId)}
        >
          {t("Unhold Room")}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Table
        className="commonListTable"
        columns={columns}
        dataSource={dharmshalaRoomholdListData}
        scroll={{
          x: 1200,
          y: 400,
        }}
        sticky={{
          offsetHeader: 64,
        }}
        bordered
      />
    </div>
  );
}

export default RoomHoldTable;
