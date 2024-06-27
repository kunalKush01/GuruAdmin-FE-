import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";
import { Button } from "reactstrap";
<<<<<<< Updated upstream

import { deleteDharmshalaInfo } from "../../../api/dharmshala/dharmshalaInfo";
=======
import { deleteDharmshalaFloor } from "../../../api/dharmshala/dharmshalaInfo";
import deleteDisableIcon from "../../../assets/images/icons/category/deleteDisableIcon.svg";
>>>>>>> Stashed changes
import deleteIcon from "../../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../../assets/images/icons/category/editIcon.svg";
import avtarIcon from "../../../assets/images/icons/dashBoard/defaultAvatar.svg";
import confirmationIcon from "../../../assets/images/icons/news/conformationIcon.svg";
import CustomDataTable from "../../../components/partials/CustomDataTable";
import { ConverFirstLatterToCapital } from "../../../utility/formater";
<<<<<<< Updated upstream

const DharmshalaFloorTableWrapper = styled.div`
  color: #583703 !important;
  margin-bottom: 1rem;
  font: normal normal bold 15px/23px Noto Sans;

  .modal-body {
    max-height: 600px !important;
    overflow: auto !important;
  }
  .tableDes p {
    margin-bottom: 0;
  }
`;
=======
import { DharmshalaFloorTableWrapper } from "../dharmshalaStyles";
import "../dharmshala_css/dharmshalafloors.css";
>>>>>>> Stashed changes

const DharmshalaFloorTable = ({
  data = [],
  maxHeight,
  height,
  currentFilter,
  // currentBreed,
  currentStatus,
  currentPage,
<<<<<<< Updated upstream
=======
  buildingID,
  isMobileView,
>>>>>>> Stashed changes
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const handleDeleteDharmshala = async (payload) => {
    return deleteDharmshalaFloor(payload);
  };

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteDharmshala,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["dharmshalaFloorList"]);
      }
    },
  });

  const columns = [
    {
      name: t("Name"),
      selector: (row) => row.name,
      width: "200px",
    },
    {
      name: t("Number"),
      selector: (row) => row.number,
      width: "300px",
    },
    {
      name: t("description"),
      selector: (row) => row.description,
      width: "200px",
    },
    {
<<<<<<< Updated upstream
=======
      name: t("Room Count"),
      selector: (row) => row.roomCount,
      width: "200px",
    },
    {
>>>>>>> Stashed changes
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

  const DharmshalasFloor = useMemo(() => {
<<<<<<< Updated upstream
    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        name: item?.name,
        number: item?.number,
        description: item?.description,
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
=======
    const { buildingId } = useParams();
    return data?.map((item, idx) => ({
      id: idx + 1,
      name: item?.name,
      number: item?.number,
      description: item?.description,
      roomCount: (
        <div style={{ fontWeight: "bold", cursor: "pointer" }}>
          {item?.roomCount === 0 ? (
            <Button
              size="lg"
              color="primary"
              className="px-1 py-0"
              onClick={() =>
                history.push(`/rooms/add/${item._id}/${buildingId}`, item._id)
              }
            >
              {" "}
              +{" "}
            </Button>
          ) : item?.roomCount > 1 ? (
            <Button
              size="lg"
              color="primary"
              className="px-1 py-0"
              onClick={() =>
                history.push(`/room/${item._id}/${buildingId}`, item._id)
              }
            >
              {item?.roomCount} {t("Rooms")}
            </Button>
          ) : (
            <Button
              size="lg"
              color="primary"
              className="px-1 py-0"
              onClick={() =>
                history.push(`/room/${item._id}/${buildingId}`, item._id)
              }
            >
              {item?.roomCount} {t("Room")}
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
              `/floor/edit/${item?._id}/${item?.buildingId}/?page=${currentPage}&status=${currentStatus}&filter=${currentFilter}&name=${item?.name}&number=${item?.number}&description=${item?.description}`
            );
          }}
        />
      ),
      delete: (
        item?.roomCount === 0 ? (
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                                      <h3 class="swal-heading mt-1">${t(
                                        "dharmshala_delete"
                                      )}</h3>
                                      <p>${t("dharmshala_delete_sure")}</p>
                                      `,
=======
                  <h3 class="swal-heading mt-1">${t(
                    "dharmshala_floor_delete"
                  )}</h3>
                  <p>${t("dharmshala_floor_delete_sure")}</p>
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
            }}
          />
<<<<<<< Updated upstream
        ),
      };
    });
  }, [data]);
=======
        ) : (
          <img
            src={deleteDisableIcon}
            width={35}
            className="cursor-pointer disabled"
          />
        )
      ),
    }));
  }, [data, buildingID]);
>>>>>>> Stashed changes

  return (
    <DharmshalaFloorTableWrapper>
      {isMobileView ? (
        <div className="card-container">
          {DharmshalasFloor.map((item, index) => (
            <div key={index} className="card">
              <div className="card-body">
                <div className="card-content">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">{item.number}</p>
                  <p className="card-text">{item.description}</p>
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
        <CustomDataTable
          maxHeight={maxHeight}
          height={height}
          columns={columns}
          data={DharmshalasFloor}
        />
      )}
    </DharmshalaFloorTableWrapper>
  );
};

export default DharmshalaFloorTable;
