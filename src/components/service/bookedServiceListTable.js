import { Table, Tag } from "antd";
import React, { useState } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import receiptIcon from "../../assets/images/icons/receiptIcon.svg";
import { Spinner } from "reactstrap";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { getBookingById } from "../../api/serviceApi";
import { toast } from "react-toastify";

function BookedServiceListTable({
  data,
  totalItems,
  currentPage,
  pageSize,
  onChangePage,
  onChangePageSize,
}) {
  const { t } = useTranslation();
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [isLoading, setIsLoading] = useState(false);

  // Transform data into table format
  const transformedData = data?.map((booking) => {
    const bookedSlot = booking.bookedSlots?.[0] || {}; // Get first booked slot
    const service = bookedSlot.serviceId || {}; // Extract service details
    const receiptLink = booking.receiptLink;
    const _id = booking?._id
    return {
      key: booking._id,
      bookingId: booking.bookingId,
      email: booking.userId?.email || "-",
      mobile: booking.userId?.mobileNumber || "-",
      serviceName: service.name || "-",
      dates: service.dates || [],
      amount: `₹${service.amount}` || "-",
      status: bookedSlot.status || "-",
      receiptLink,
      _id
    };
  });

  const handleDownloadReceipt = (item) => {
    if (item.receiptLink) {
      window.open(item.receiptLink, "_blank"); // Open receipt in a new tab
    } else {
      alert("Receipt not available for download.");
    }
  };
  const downloadReceipt = useMutation({
    mutationFn: (payload) => {
      return getBookingById(payload);
    },
    onSuccess: (data) => {
      if (!data.error) {
        setIsLoading(false);
        if (data.result.receiptLink) {
          window.open(`${data.result.receiptLink}`, "_blank");
        } else {
          toast.error("Receipt link not available at this moment");
        }
      }
    },
  });
  const columns = [
    {
      title: t("Booking ID"),
      dataIndex: "bookingId",
      key: "bookingId",
      width: 180,
      fixed: "left",
    },
    {
      title: t("User Email"),
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: t("Mobile Number"),
      dataIndex: "mobile",
      key: "mobile",
      width: 150,
    },
    {
      title: t("Service Name"),
      dataIndex: "serviceName",
      key: "serviceName",
      width: 200,
    },
    {
      title: t("Dates"),
      dataIndex: "dates",
      key: "dates",
      width: 200,
      render: (dates) =>
        Array.isArray(dates) && dates.length > 0
          ? dates.map((date) => moment(date).format("DD MMM YYYY")).join(", ")
          : "-",
    },
    {
      title: t("Amount"),
      dataIndex: "amount",
      key: "amount",
      width: 120,
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const tagColors = {
          Pending: "orange",
          Completed: "green",
          Failed: "red",
        };
        return <Tag color={tagColors[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: t("Action"),
      key: "action",
      render: (_, record) => (
        <div className="d-flex align-items-center">
          {isLoading === record?._id ? (
            <Spinner color="success" />
          ) : (
            <img
              src={receiptIcon} // Replace with your receipt icon path
              width={25}
              className="cursor-pointer me-2"
              onClick={() => {
                if (!record.receiptLink) {
                  setIsLoading(record?._id);
                  downloadReceipt.mutate(record._id);
                } else {
                  window.open(`${record.receiptLink}`, "_blank");
                }
              }}
            />
          )}
        </div>
      ),
      width: 100,
      fixed: "right",
    },
  ];

  return (
    <Table
      className="commitmentListTable"
      columns={columns}
      dataSource={transformedData}
      rowKey="key"
      scroll={{ x: 1200, y: 400 }}
      sticky={{ offsetHeader: 64 }}
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
}

export default BookedServiceListTable;
