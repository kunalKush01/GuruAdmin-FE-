import { useQuery } from "@tanstack/react-query";
import { Table, Tag } from "antd";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { getAllRoomHoldList } from "../../../api/dharmshala/dharmshalaInfo";
import moment from "moment";
import { ConverFirstLatterToCapital } from "../../../utility/formater";

function RoomHoldTable() {
  const { t } = useTranslation();
  const history = useHistory();

  const dharmshalaRoomholdList = useQuery(["dharmshalaRoomholdList"], () =>
    getAllRoomHoldList()
  );

  const dharmshalaRoomholdListData = useMemo(() => {
    const data = dharmshalaRoomholdList.data ?? [];
    return data.flatMap((item) =>
      item.rooms.map((room) => ({
        key: room.roomId,
        roomNumber: room.roomNumber,
        remark: item.remark || "N/A",
        checkInDate: item.startDate,
        checkOutDate: item.endDate,
        status: item.status,
      }))
    );
  }, [dharmshalaRoomholdList.data]);
  const columns = [
    {
      title: t("Room Number"),
      dataIndex: "roomNumber",
      key: "roomNumber",
      width: 150,
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
  ];

  return (
    <div>
      <Table
        className="donationListTable"
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
