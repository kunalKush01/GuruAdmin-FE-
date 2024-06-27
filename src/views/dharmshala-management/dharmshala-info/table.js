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
import CustomDataTable from "../../../components/partials/CustomDataTable";
import confirmationIcon from "../../../assets/images/icons/news/conformationIcon.svg";
import { DharmshalaInfoTableWrapper } from "../dharmshalaStyles";
import "../dharmshala_css/dharmshalainfotable.css"; 

const DharmshalaInfoTable = ({
  data = [],
  maxHeight,
  height,
  currentFilter,
  // currentBreed,
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
        queryClient.invalidateQueries(["DharmshalaList"]);
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
      name: t("Floor Count"),
      selector: (row) => row.floorCount,
      width: "200px",
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

  const DharmshalasInfo = useMemo(() => {
<<<<<<< Updated upstream
    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        name: item?.name,
        description: item?.description,
        location: item?.location,
        floorCount: (
          <div
            style={{ fontWeight: "bold", cursor: "pointer" }}
            onClick={() =>
              history.push(`/dharmshala/info/${item._id}/floor`, item._id)
            }
          >
            {item?.floorCount === 0 ? (
              <Button size="lg" color="primary" className="px-1 py-0">
                {" "}
                +{" "}
              </Button>
            ) : item?.floorCount > 1 ? (
              `${item?.floorCount} ${t("Floors")}`
            ) : (
              `${item?.floorCount} ${t("Floor")}`
            )}
          </div>
        ),
        edit: (
          <img
            src={editIcon}
            width={35}
            className="cursor-pointer "
            onClick={() => {
              history.push(
                `/dharmshala/info/${item?._id}?page=${currentPage}&status=${currentStatus}&filter=${currentFilter}`
              );
            }}
          />
        ),
        delete: (
          // allPermissions?.name === "all" || subPermission?.includes(DELETE) ? (
          <img
            src={deleteIcon}
            width={35}
            className="cursor-pointer "
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              Swal.fire({
                title: `<img src="${confirmationIcon}"/>`,
                html: `
                                      <h3 class="swal-heading mt-1">${t(
                                        "dharmshala_delete"
                                      )}</h3>
                                      <p>${t("dharmshala_delete_sure")}</p>
                                      `,
=======
    return data?.map((item, idx) => ({
      id: idx + 1,
      name: item?.name,
      description: item?.description,
      location: item?.location,
      floorCount: (
        <div style={{ fontWeight: "bold", cursor: "pointer" }}>
          {item?.floorCount === 0 ? (
            <Button
              size="lg"
              color="primary"
              className="px-1 py-0"
              onClick={() =>
                history.push(`/floor/add/${item._id}`, item._id)
              }
            >
              {" "}
              +{" "}
            </Button>
          ) : item?.floorCount > 1 ? (
            <Button
              size="lg"
              color="primary"
              className="px-1 py-0"
              onClick={() =>
                history.push(`/floors/${item._id}`, item._id)
              }
            >
              {item?.floorCount} {t("Floors")}
            </Button>
          ) : (
            <Button
              size="lg"
              color="primary"
              className="px-1 py-0"
              onClick={() =>
                history.push(`/floors/${item._id}`, item._id)
              }
            >
              {item?.floorCount} {t("Floor")}
            </Button>
          )}
        </div>
      ),
      edit: (
        <img
          src={editIcon}
          width={35}
          className="cursor-pointer"
          onClick={() => {
            history.push(
              `/building/edit/${item?._id}?page=${currentPage}&status=${currentStatus}&filter=${currentFilter}`
            );
          }}
        />
      ),
      delete: (
        <img
          src={item?.floorCount === 0 ? deleteIcon : deleteDisableIcon}
          width={35}
          className={`cursor-pointer ${item?.floorCount !== 0 ? 'disabled' : ''}`}
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
>>>>>>> Stashed changes
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
            }
          }}
        />
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
        <CustomDataTable
          maxHeight={maxHeight}
          height={height}
          columns={columns}
          data={DharmshalasInfo}
        />
      )}
    </DharmshalaInfoTableWrapper>
  );
};

export default DharmshalaInfoTable;