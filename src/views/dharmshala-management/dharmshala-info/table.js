import React, { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import { Button } from "reactstrap";
import { deleteDharmshalaInfo } from "../../../api/dharmshala/dharmshalaInfo";
import deleteIcon from "../../../assets/images/icons/category/deleteIcon.svg";
import deleteDisableIcon from "../../../assets/images/icons/category/deleteDisableIcon.svg";
import editIcon from "../../../assets/images/icons/category/editIcon.svg";
import CustomDharmshalaTable from "../../../components/partials/CustomDharmshalaTable";
import confirmationIcon from "../../../assets/images/icons/news/conformationIcon.svg";
import { DharmshalaInfoTableWrapper } from "../dharmshalaStyles";
import "../dharmshala_css/dharmshalainfotable.css";
import { Table, Tag } from "antd";

const DharmshalaInfoTable = ({
  data = [],
  maxHeight,
  height,
  currentFilter,
  currentStatus,
  currentPage,
  isMobileView,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const handleDeleteDharmshala = async (payload) => {
    return deleteDharmshalaInfo(payload);
  };

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteDharmshala,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["dharmshalaList"]);
      }
    },
  });

  const columns = [
    {
      name: t("name"),
      selector: (row) => row.name,
      width: "200px",
    },
    {
      name: t("description"),
      selector: (row) => row.description,
      width: "300px",
    },
    {
      name: t("location"),
      selector: (row) => row.location,
      width: "200px",
    },
    {
      name: t("floor_count"),
      selector: (row) => row.floorCount,
      width: "200px",
    },
    {
      name: t(""),
      width: "800px",
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
  const antdColumns = [
    {
      title: t("name"), // Table column title
      dataIndex: "name", // Corresponding field in the data
      key: "name", // Unique key for this column
      width: 120,
      fixed: "left",
    },
    {
      title: t("description"),
      dataIndex: "description",
      key: "description",
      width: 120,
    },
    {
      title: t("location"),
      dataIndex: "location",
      key: "location",
      width: 120,
    },
    {
      title: t("floor_count"),
      dataIndex: "floorCount",
      key: "floorCount",
      width: 100,
    },
    {
      title: t("action"),
      dataIndex: "action",
      key: "action",
      width: 80,
      fixed: "right",
    },
  ];

  const DharmshalasInfo = useMemo(() => {
    return data?.map((item, idx) => ({
      id: idx + 1,
      name: item?.name,
      description: item?.description,
      location: item?.location,
      // floorCount: (
      //   <div style={{ fontWeight: "bold", cursor: "pointer" }}>
      //     {item?.floorCount === 0 ? (
      //       <Button
      //         size="lg"
      //         color="primary"
      //         className="px-1 py-0"
      //         onClick={() => history.push(`/floor/add/${item._id}`, item._id)}
      //       >
      //         {" "}
      //         +{" "}
      //       </Button>
      //     ) : item?.floorCount > 1 ? (
      //       <Button
      //         size="lg"
      //         color="primary"
      //         className="px-1 py-0"
      //         onClick={() => history.push(`/floors/${item._id}`, item._id)}
      //       >
      //         {item?.floorCount} {t("Floors")}
      //       </Button>
      //     ) : (
      //       <Button
      //         size="lg"
      //         color="primary"
      //         className="px-1 py-0"
      //         onClick={() => history.push(`/floors/${item._id}`, item._id)}
      //       >
      //         {item?.floorCount} {t("Floor")}
      //       </Button>
      //     )}
      //   </div>
      // ),
      floorCount: (
        <div style={{ fontWeight: "bold", cursor: "pointer" }}>
          {item?.floorCount === 0 ? (
            <Tag
              className="floorTag"
              // color="blue"
              style={{ cursor: "pointer" }}
              onClick={() => history.push(`/floor/add/${item._id}`, item._id)}
            >
              +
            </Tag>
          ) : item?.floorCount > 1 ? (
            <Tag
              // color="green"
              className="floorTag"
              style={{ cursor: "pointer" }}
              onClick={() => history.push(`/floors/${item._id}`, item._id)}
            >
              {item?.floorCount} {t("Floors")}
            </Tag>
          ) : (
            <Tag
              // color="green"
              className="floorTag"
              style={{ cursor: "pointer" }}
              onClick={() => history.push(`/floors/${item._id}`, item._id)}
            >
              {item?.floorCount} {t("Floor")}
            </Tag>
          )}
        </div>
      ),
      action: (
        <div>
          <img
            src={editIcon}
            width={35}
            className="cursor-pointer"
            onClick={() => {
              history.push(`/building/edit/${item?._id}`);
            }}
          />

          <img
            src={item?.floorCount === 0 ? deleteIcon : deleteDisableIcon}
            width={35}
            className={`cursor-pointer ${
              item?.floorCount !== 0 ? "disabled" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (item?.floorCount === 0) {
                Swal.fire({
                  title: `<img src="${confirmationIcon}"/>`,
                  html: `
                  <h3 class="swal-heading mt-1">${t(
                    "dharmshala_building_delete"
                  )}</h3>
                  <p>${t("dharmshala_building_delete_sure")}</p>
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
              } else {
                Swal.fire({
                  icon: "warning",
                  title: t("cannot_delete_building"),
                  text: t("cannot_delete_building"),
                });
              }
            }}
          />
        </div>
      ),
    }));
  }, [data]);

  return (
    <DharmshalaInfoTableWrapper>
      {isMobileView ? (
        <div className="card-container">
          {DharmshalasInfo.map((item, index) => (
            <div key={index} className="card">
              <div className="card-body">
                <div className="card-content">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">{item.description}</p>
                  <p className="card-text">{item.location}</p>
                  <p className="card-text">{item.floorCount}</p>
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
          className="donationListTable"
          columns={antdColumns}
          scroll={{
            x: 1500,
            y: 400,
          }}
          sticky={{
            offsetHeader: 64,
          }}
          dataSource={DharmshalasInfo}
        />
      )}
    </DharmshalaInfoTableWrapper>
  );
};

/* <CustomDharmshalaTable
  maxHeight={maxHeight}
  height={height}
  columns={columns}
  data={DharmshalasInfo}
/> */

export default DharmshalaInfoTable;
