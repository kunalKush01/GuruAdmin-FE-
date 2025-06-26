import { Table, Tag } from "antd";
import React, { useState } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import receiptIcon from "../../assets/images/icons/receiptIcon.svg";
import { Spinner } from "reactstrap";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking, getBookingById } from "../../api/serviceApi";
import { toast } from "react-toastify";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function BookedServiceListTable({
  data,
  totalItems,
  currentPage,
  pageSize,
  onChangePage,
  onChangePageSize,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  // Transform data into table format
  const transformedData = data?.map((booking) => {
    const bookedSlot = booking.bookedSlots?.[0] || {}; // Get first booked slot
    const service = bookedSlot.serviceId || {}; // Extract service details
    const receiptLink = booking.receiptLink;
    const _id = booking?._id;
    return {
      key: booking._id,
      bookingId: booking.bookingId,
      email: booking.userId?.email || "-",
      mobile: booking.userId?.mobileNumber || "-",
      serviceName: service.name || "-",
      dates: service.dates || [],
      amount: `₹${service.amount}` || "-",
      status: bookedSlot.status || "-",
      serviceId: bookedSlot?.serviceId?._id || "-",
      receiptLink,
      _id,
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
  const handleEditClick = (record) => {
    navigate(`/editBooking/${record._id}/${record?.serviceId}`);
  };
  const handleDeleteBooking = async (record) => {
    // Show Confirmation Dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteBooking(record._id);
        queryClient.invalidateQueries("bookedService");
        Swal.fire("Deleted!", "The booking has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting booking:", error);
        Swal.fire("Error!", "Failed to delete booking. Try again.", "error");
      }
    }
  };
  const columns = [
    {
      title: t("Booking ID"),
      dataIndex: "bookingId",
      key: "bookingId",
      width: 180,
      fixed: "left",
    },
    {
      title: t("email"),
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
      title: t("Service_Name"),
      dataIndex: "serviceName",
      key: "serviceName",
      width: 200,
    },
    {
      title: t("amount"),
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
      title: t("action"),
      key: "action",
      render: (_, record) => (
        <div className="d-flex">
          <div>
            <img
              src={editIcon}
              width={30}
              className="cursor-pointer me-1"
              onClick={() => handleEditClick(record)}
              alt="Edit"
            />
          </div>
          <div>
            <img
              src={deleteIcon}
              width={30}
              className="cursor-pointer me-1"
              onClick={() => handleDeleteBooking(record)}
              alt="Edit"
            />
          </div>
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
        </div>
      ),
      width: 120,
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
