import { Table, Tag } from "antd";
import React from "react";
import "../../assets/scss/common.scss";
import "../../assets/scss/viewCommon.scss";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import { deleteService } from "../../api/serviceApi";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";

function ServiceListTable({
  data,
  totalItems,
  currentPage,
  pageSize,
  onChangePage,
  onChangePageSize,
}) {
  const history = useHistory();
  const serviceQueryClient = useQueryClient();

  const handleEdit = (record) => {
    console.log(record);
    history.push({
      pathname: "/services/addService",
      state: { record, type: "edit" },
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteService(id)
          .then(() => {
            Swal.fire("Deleted!", "Your service has been deleted.", "success");
            serviceQueryClient.invalidateQueries(["services"]);
          })
          .catch((error) => {
            Swal.fire(
              "Error!",
              "There was an issue deleting the service.",
              "error"
            );
            console.error("Delete failed:", error);
          });
      }
    });
  };

  const { t } = useTranslation();
  const columns = [
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      width: 150,
      fixed: "left",
    },
    {
      title: t("frequency"),
      dataIndex: "frequency",
      key: "frequency",
      width: 120,
      render: (text) => {
        const tagColors = {
          Daily: "green",
          Weekly: "blue",
          Monthly: "orange",
          Yearly: "purple",
        };

        return <Tag color={tagColors[text] || "default"}>{text}</Tag>;
      },
    },
    {
      title: t("date"),
      dataIndex: "dates",
      key: "dates",
      width: 120,
      render: (dates) =>
        Array.isArray(dates) && dates.length > 0
          ? dates
              .map((date) => (date ? moment(date).format("DD MMM YYYY") : "-"))
              .join(", ")
          : "-",
    },
    {
      title: t("amount"),
      dataIndex: "amount",
      key: "amount",
      width: 120,
    },
    {
      title: t("count_per_day"),
      dataIndex: "countPerDay",
      key: "countPerDay",
      width: 120,
    },
    {
      title: t("image"),
      dataIndex: "image",
      key: "image",
      width: 120,
    },
    {
      title: t("action"),
      key: "action",
      width: 100,
      fixed: "right",
      render: (text, record) => (
        <div className="d-flex gap-2">
          <img
            src={editIcon}
            onClick={() => handleEdit(record)}
            style={{ cursor: "pointer", width: "40px", height: "40px" }}
          />
          <img
            src={deleteIcon}
            onClick={() => handleDelete(record._id)}
            style={{ cursor: "pointer", width: "35px", height: "35px" }}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table
        className="commitmentListTable"
        columns={columns}
        dataSource={data}
        rowKey={(record) => record._id}
        scroll={{
          x: 1500,
          y: 400,
        }}
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
    </div>
  );
}

export default ServiceListTable;
