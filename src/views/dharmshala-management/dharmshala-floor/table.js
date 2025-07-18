import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Button } from "reactstrap";
import { deleteDharmshalaFloor } from "../../../api/dharmshala/dharmshalaInfo";
import deleteDisableIcon from "../../../assets/images/icons/category/deleteDisableIcon.svg";
import deleteIcon from "../../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../../assets/images/icons/category/editIcon.svg";
import confirmationIcon from "../../../assets/images/icons/news/conformationIcon.svg";
import CustomDharmshalaTable from "../../../components/partials/CustomDharmshalaTable";
import CustomDataTable from "../../../components/partials/CustomDataTable";
import "../../../assets/scss/dharmshala.scss";
import { Table, Tag } from "antd";

const DharmshalaFloorTable = ({
  data = [],
  maxHeight,
  height,
  currentFilter,
  currentStatus,
  currentPage,
  buildingID,
  isMobileView,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleDeleteDharmshalaFloor = async (payload) => {
    return deleteDharmshalaFloor(payload);
  };

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteDharmshalaFloor,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["dharmshalaFloorList"]);
      }
    },
  });

  const antdColumns = [
    {
      title: t("Name"), // Table column title
      dataIndex: "name", // Corresponding field in the data
      key: "name", // Unique key for this column
      width: 100,
      fixed: "left",
    },
    {
      title: t("Number"),
      dataIndex: "number",
      key: "number",
      width: 50,
    },
    {
      title: t("Description"),
      dataIndex: "description",
      key: "description",
      width: 120,
    },
    {
      title: t("Room Count"),
      dataIndex: "roomCount",
      key: "roomCount",
      width: 50,
    },
    {
      title: t("action"),
      key: "action",
      dataIndex: "action",
      width: 50,
      fixed: "right", // Align the column to the right
    },
  ];

  const DharmshalasFloor = useMemo(() => {
    const { buildingId } = useParams();
    return data?.map((item, idx) => ({
      id: idx + 1,
      name: item?.name,
      number: item?.number,
      description: item?.description,
      roomCount: (
        <div style={{ fontWeight: "bold", cursor: "pointer" }}>
          {item?.roomCount === 0 ? (
            <Tag
              // size="lg"
              // color="primary"
              // className="px-1 py-0"
              className="floorTag"
              onClick={() =>
                navigate(`/rooms/add/${item._id}/${buildingId}`, item._id)
              }
            >
              {" "}
              +{" "}
            </Tag>
          ) : item?.roomCount > 1 ? (
            <Tag
              // size="lg"
              // color="primary"
              // className="px-1 py-0"
              className="floorTag"
              onClick={() =>
                navigate(`/room/${item._id}/${buildingId}`, item._id)
              }
            >
              {item?.roomCount} {t("Rooms")}
            </Tag>
          ) : (
            <Tag
              // size="lg"
              // color="primary"
              // className="px-1 py-0"
              className="floorTag"
              onClick={() =>
                navigate(`/room/${item._id}/${buildingId}`, item._id)
              }
            >
              {item?.roomCount} {t("Room")}
            </Tag>
          )}
        </div>
      ),
      action: (
        <div className="d-flex">
          <img
            src={editIcon}
            width={35}
            className="cursor-pointer"
            onClick={() => {
              navigate(
                `/floor/edit/${item?._id}/${
                  item?.buildingId
                }?name=${encodeURIComponent(
                  item?.name
                )}&number=${encodeURIComponent(
                  item?.number
                )}&description=${encodeURIComponent(item?.description)}`
              );
            }}
          />
          <div>
            {item?.roomCount === 0 ? (
              <img
                src={deleteIcon}
                width={35}
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  Swal.fire({
                    title: `<img src="${confirmationIcon}"/>`,
                    html: `
          <h3 class="swal-heading mt-1">${t("dharmshala_floor_delete")}</h3>
          <p>${t("dharmshala_floor_delete_sure")}</p>
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
            ) : (
              <img
                src={deleteDisableIcon}
                width={35}
                className="cursor-pointer"
                onClick={() => {
                  Swal.fire({
                    icon: "warning",
                    title: t("cannot_delete_floor"),
                    text: t("cannot_delete_floor_non_zero_rooms"),
                  });
                }}
              />
            )}
          </div>
        </div>
      ),
    }));
  }, [
    data,
    buildingID,
    currentPage,
    currentStatus,
    currentFilter,
    deleteMutation,
    t,
    history,
  ]);

  return (
    <div className="DharmshalaComponentInfo">
      {isMobileView ? (
        <div className="card-container">
          {DharmshalasFloor.map((item, index) => (
            <div key={index} className="card">
              <div className="card-header">
                <h5 className="card-title">{item.name}</h5>
                <div class="card-actions">
                  <i class="fas fa-pen"></i>
                  <i class="fas fa-trash-alt"></i>
                </div>
              </div>
              <div className="card-body">
                <div className="card-content">
                  <p className="card-text">{item.number}</p>
                  <p className="card-text">{item.description}</p>
                </div>
                <div className="card-bottom">
                  <p className="card-text">{item.roomCount}</p>
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
          columns={antdColumns}
          scroll={{
            x: 1500,
            y: 400,
          }}
          sticky={{
            offsetHeader: 64,
          }}
          dataSource={DharmshalasFloor}
        />
      )}
    </div>
  );
};
// <CustomDharmshalaTable
//   maxHeight={maxHeight}
//   height={height}
//   columns={columns}
//   data={DharmshalasFloor}
// />

export default DharmshalaFloorTable;
