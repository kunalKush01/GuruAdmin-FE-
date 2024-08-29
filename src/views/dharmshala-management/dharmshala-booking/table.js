import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Space } from "antd";
import moment from "moment";
import Swal from "sweetalert2";
import { deleteDharmshalaBooking } from "../../../api/dharmshala/dharmshalaInfo";
import deleteIcon from "../../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../../assets/images/icons/category/editIcon.svg";
import confirmationIcon from "../../../assets/images/icons/news/conformationIcon.svg";
import "../../../assets/scss/common.scss";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);


const DharmshalaBookingTable = ({
  data = [],
  currentFilter,
  currentStatus,
  currentPage,
  pageSize,
  totalItems,
  onChangePage,
  onChangePageSize,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteDharmshalaBooking,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["dharmshalaBookingList"]);
      }
    },
  });

  const handleEditClick = (item) => {
    history.push({
      pathname: `/booking/edit/${item._id}`,
      state: { bookingData: item.originalData }
    });
  };

  const handleDeleteClick = (item) => {
    Swal.fire({
      title: `<img src="${confirmationIcon}"/>`,
      html: `
        <h3 class="swal-heading mt-1">${t("dharmshala_booking_delete")}</h3>
        <p>${t("dharmshala_booking_delete_sure")}</p>
      `,
      showCloseButton: false,
      showCancelButton: true,
      focusConfirm: true,
      cancelButtonText: t("cancel"),
      cancelButtonAriaLabel: t("cancel"),
      confirmButtonText: t("confirm"),
      confirmButtonAriaLabel: "Confirm",
    }).then(async (result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(item._id);
      }
    });
  };

  const columns = [
    {
      title: t("Booking ID"),
      dataIndex: "bookingId",
      key: "bookingId",
      width: 150,
      fixed: "left",
    },
    {
      title: t("Start Date"),
      dataIndex: "startDate",
      key: "startDate",
      width: 150,
    },
    {
      title: t("End Date"),
      dataIndex: "endDate",
      key: "endDate",
      width: 150,
    },
    {
      title: t("Count"),
      dataIndex: "count",
      key: "count",
      width: 100,
    },
    {
      title: t("Room Number"),
      dataIndex: "roomNumber",
      key: "roomNumber",
      width: 150,
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      width: 150,
    },
    {
      title: t("Early Check In"),
      dataIndex: "earlyCheckIn",
      key: "earlyCheckIn",
      width: 150,
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: t("Late Checkout"),
      dataIndex: "lateCheckout",
      key: "lateCheckout",
      width: 150,
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: t("Actions"),
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <img
            src={editIcon}
            width={25}
            className="cursor-pointer"
            onClick={() => handleEditClick(record)}
            alt="Edit"
          />
          <img
            src={deleteIcon}
            width={25}
            className="cursor-pointer"
            onClick={() => handleDeleteClick(record)}
            alt="Delete"
          />
        </Space>
      ),
    },
  ];

  const dataSource = useMemo(() => {
    return data.map((item) => ({
      key: item._id,
      bookingId: item.bookingId,
      startDate: item.startDate ? dayjs(item.startDate, "DD-MM-YYYY").format("DD MMM YYYY") : 'N/A',
      endDate: item.endDate ? dayjs(item.endDate, "DD-MM-YYYY").format("DD MMM YYYY") : 'N/A',
      count: item.count,
      roomNumber: item.roomId?.roomNumber || 'N/A',
      status: item.status,
      earlyCheckIn: item.earlyCheckIn,
      lateCheckout: item.lateCheckout,
      _id: item._id,
      originalData: item,
    }));
  }, [data]);

  return (
    <Table
      className="donationListTable"
      columns={columns}
      dataSource={dataSource}
      scroll={{
        x: 1500,
        y: 400,
      }}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: totalItems,
        onChange: onChangePage,
        onShowSizeChange: (current, size) => onChangePageSize(size),
        showSizeChanger: true,
      }}
      bordered
    />
  );
};

export default DharmshalaBookingTable;