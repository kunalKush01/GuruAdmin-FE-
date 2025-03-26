import { Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import "../../assets/scss/common.scss";
import "../../assets/scss/viewCommon.scss";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import defaultImage from "../../assets/images/icons/defaultServiceImg.png";
import { deleteService } from "../../api/serviceApi";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { fetchImage } from "../partials/downloadUploadImage";

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
    // console.log(record);
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
  const [imageUrls, setImageUrls] = useState({}); // Store image URLs by record ID

  const loadImages = async (record) => {
    if (record?.image) { // Check if "image" exists
      let urls = [];
  
      if (Array.isArray(record.image)) {
        // If "image" is an array, process each image
        urls = await Promise.all(
          record.image.map(async (img) => {
            const url = await fetchImage(img.name);
            return url;
          })
        );
      } else if (typeof record.image === "object" && record.image.name) {
        // If "image" is a single object, process it
        const url = await fetchImage(record.image.name);
        urls = [url]; // Store as an array for consistency
      }
  
      setImageUrls((prevUrls) => ({
        ...prevUrls,
        [record._id]: urls, // Store the image URLs by record ID
      }));
    }
  };
  
  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      data.forEach((record) => {
        loadImages(record);
      });
    }
  }, [data]);
  
  console.log(imageUrls)
  const columns = [
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      width: 150,
      fixed: "left",
      render: (text, record) => {
        const imgUrls = imageUrls[record._id] || []; // Get images for this record
        const imgUrl = imgUrls.length > 0 ? imgUrls[0] : defaultImage;

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={imgUrl}
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                marginRight: 10,
              }}
            />
            <span>{text}</span>
          </div>
        );
      },
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
    // {
    //   title: t("date"),
    //   dataIndex: "dates",
    //   key: "dates",
    //   width: 120,
    //   render: (dates) =>
    //     Array.isArray(dates) && dates.length > 0
    //       ? dates
    //           .map((date) => (date ? moment(date).format("DD MMM YYYY") : "-"))
    //           .join(", ")
    //       : "-",
    // },
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
