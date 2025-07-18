import React, { useMemo, useState } from "react";
import { Tag, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Space } from "antd";
import moment from "moment";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  deleteDharmshalaBooking,
  downlaodDharmshalaReceipt,
} from "../../../api/dharmshala/dharmshalaInfo";
import deleteIcon from "../../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../../assets/images/icons/category/editIcon.svg";
import eyeIcon from "../../../assets/images/icons/signInIcon/Icon awesome-eye.svg";
import checkInIcon from "../../../assets/images/icons/dharmshala/checkin.svg";
import checkOutIcon from "../../../assets/images/icons/dharmshala/checkout.svg";
import confirmationIcon from "../../../assets/images/icons/news/conformationIcon.svg";
import whatsappIcon from "../../../assets/images/icons/whatsappIcon.svg";
import downloadIcon from "../../../assets/images/icons/receiptIcon.svg";

import "../../../assets/scss/common.scss";
import dayjs from "dayjs";
import RoomsContainer from "../../../components/dharmshalaBooking/RoomsContainer";
import customParseFormat from "dayjs/plugin/customParseFormat";
import CheckInModal from "./checkInModal";

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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [checkInVisible, setCheckInVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [mode, setMode] = useState("check-in");

  const deleteMutation = useMutation({
    mutationFn: deleteDharmshalaBooking,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["dharmshalaBookingList"]);
      }
    },
  });

  const handleViewPdfClick = async (record) => {
    const apiUrl = `${process.env.REACT_APP_DHARMSHALA_BASEURL}bookings/download/${record.originalData.bookingId}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch PDF");
      const blob = await response.blob();
      const dataUrl = URL.createObjectURL(blob);
      window.open(dataUrl, "_blank");
    } catch (error) {
      console.error("Error fetching PDF:", error);
      toast.error("Receipt link not available at this moment.");
    }
  };

  const handleWhatsAppClick = (record) => {
    if (!record.originalData.bookingId) {
      toast.error("Receipt link not available at this moment");
    } else {
      const apiUrl = `${process.env.REACT_APP_DHARMSHALA_BASEURL}bookings/download/${record.originalData.bookingId}`;
      const message = `Hello ${record.originalData.userDetails.name}, thank you for your booking with Booking ID: ${record.originalData.bookingId}. Here is your receipt: ${apiUrl}`;

      const phoneNumber = `${
        record.originalData.userDetails.countryCode?.replace("+", "") || ""
      }${record.originalData.userDetails.mobileNumber || ""}`;

      window.open(
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    }
  };

  const handleEditClick = (item) => {
    navigate({
      pathname: `/booking/edit/${item._id}`,
      state: { bookingData: item.originalData },
    });
  };
  const handleViewClick = (item) => {
    navigate({
      pathname: `/booking/view/${item._id}`,
      search: `?isReadOnly=true`,
      state: { bookingData: item.originalData },
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

  const handleCheckInClick = (record) => {
    setSelectedBooking({
      ...record.originalData,
      building: record.originalData.buildingId || "N/A",
      floor: record.originalData.floorId || "N/A",
      rooms: record.originalData.rooms || [],
      capacity: record.originalData.capacity || "N/A",
      startDate: record.startDate,
      endDate: record.endDate,
      dueAmount: record.originalData.dueAmount || 0,
    });
    setMode("check-in");
    setCheckInVisible(true);
  };

  const handleCheckOutClick = (record) => {
    setSelectedBooking({
      ...record.originalData,
      building: record.originalData.buildingId || "N/A",
      floor: record.originalData.floorId || "N/A",
      rooms: record.originalData.rooms || [],
      capacity: record.originalData.capacity || "N/A",
      startDate: record.startDate,
      endDate: record.endDate,
      dueAmount: record.originalData.dueAmount || 0,
    });
    setMode("check-out");
    setCheckInVisible(true);
  };

  const isBookingActive = (record) => {
    const endDate = dayjs(record.originalData.endDate, "DD-MM-YYYY").startOf(
      "day"
    );
    const today = dayjs().startOf("day");
    return endDate.isAfter(today) || endDate.isSame(today);
  };

  const isMobileView = window.innerWidth < 768;

  const columns = [
    {
      title: t("Booking ID"),
      dataIndex: "bookingId",
      key: "bookingId",
      width: 150,
      fixed: "left",
      width: isMobileView ? 100 : 150,
    },
    {
      title: t("Guest Name"),
      dataIndex: "guestName",
      key: "guestName",
      width: 150,
    },
    {
      title: t("Guest Mobile"),
      dataIndex: "guestMobile",
      key: "guestMobile",
      width: 150,
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
      title: t("action"),
      key: "actions",
      fixed: !isMobileView && "right",
      width: 250,
      render: (_, record) => {
        const isActive = isBookingActive(record);
        return (
          <Space size="middle" className="d-flex justify-content-between">
            {record.originalData.status === "checked-out" && (
              <Tooltip title="View" color="#FF8744">
                <img
                  src={eyeIcon}
                  width={20}
                  className="cursor-pointer"
                  onClick={() => handleViewClick(record)} 
                  alt="View"
                  style={{
                    marginLeft: "5px",
                    marginRight: "5px",
                  }}
                />
              </Tooltip>
            )}

            {isActive && (
              <Tooltip title="Edit" color="#FF8744">
                <img
                  src={editIcon}
                  width={30}
                  className="cursor-pointer"
                  onClick={() => handleEditClick(record)}
                  alt="Edit"
                />
              </Tooltip>
            )}

            <Tooltip title="Delete" color="#FF8744">
              <img
                src={deleteIcon}
                width={25}
                className="cursor-pointer"
                onClick={() => handleDeleteClick(record)}
                alt="Delete"
              />
            </Tooltip>
            {isActive &&
              (record.originalData.status === "checked-in" ? (
                <Tooltip title="Check Out" color="#FF8744">
                  <img
                    src={checkOutIcon}
                    width={17}
                    className="cursor-pointer"
                    onClick={() => handleCheckOutClick(record)}
                    alt="Check Out"
                  />
                </Tooltip>
              ) : (
                record.originalData.status !== "checked-out" && (
                  <Tooltip title="Check In" color="#FF8744">
                    <img
                      src={checkInIcon}
                      width={17}
                      className="cursor-pointer"
                      onClick={() => handleCheckInClick(record)}
                      alt="Check In"
                    />
                  </Tooltip>
                )
              ))}
            <Tooltip title="Whatsapp receipt" color="#FF8744">
              <img
                src={whatsappIcon}
                width={25}
                className="cursor-pointer"
                onClick={() => handleWhatsAppClick(record)}
                alt="WhatsApp"
              />
            </Tooltip>
            <Tooltip title="Download receipt" color="#FF8744">
              <img
                src={downloadIcon}
                width={20}
                className="cursor-pointer"
                onClick={() => handleViewPdfClick(record)}
                alt="Download"
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const dataSource = useMemo(() => {
    return data.map((item) => ({
      key: item._id,
      bookingId: item.bookingId,
      guestName: item.userDetails?.name,
      guestMobile: item.userDetails?.mobileNumber,
      startDate: item.startDate
        ? dayjs(item.startDate, "DD-MM-YYYY").format("DD MMM YYYY")
        : "N/A",
      endDate: item.endDate
        ? dayjs(item.endDate, "DD-MM-YYYY").format("DD MMM YYYY")
        : "N/A",
      count: item.count,
      roomNumber:
        item.rooms?.map((room) => (
          <Tag color="green" key={room.roomId}>
            {room.roomNumber}
          </Tag>
        )) || "N/A",
      status: item.status,
      earlyCheckIn: item.earlyCheckIn,
      lateCheckout: item.lateCheckout,
      _id: item._id,
      originalData: item,
    }));
  }, [data]);

  return (
    <>
      <Table
        className="commonListTable"
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
      <CheckInModal
        visible={checkInVisible}
        onClose={() => setCheckInVisible(false)}
        booking={selectedBooking}
        mode={mode}
      />
    </>
  );
};

export default DharmshalaBookingTable;
