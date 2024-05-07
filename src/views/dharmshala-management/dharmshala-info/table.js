import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";
import { Button } from "reactstrap";

import { deleteDharmshalaInfo } from "../../../api/dharmshala/dharmshalaInfo";
import deleteIcon from "../../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../../assets/images/icons/category/editIcon.svg";
import avtarIcon from "../../../assets/images/icons/dashBoard/defaultAvatar.svg";
import confirmationIcon from "../../../assets/images/icons/news/conformationIcon.svg";
import CustomDataTable from "../../../components/partials/CustomDataTable";
import { ConverFirstLatterToCapital } from "../../../utility/formater";

const DharmshalaInfoTableWrapper = styled.div`
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

const DharmshalaInfoTable = ({
  data = [],
  maxHeight,
  height,
  currentFilter,
  // currentBreed,
  currentStatus,
  currentPage,
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
      name: t("floorCount"),
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
        ),
      };
    });
  }, [data]);

  return (
    <DharmshalaInfoTableWrapper>
      <CustomDataTable
        maxHeight={maxHeight}
        height={height}
        columns={columns}
        data={DharmshalasInfo}
      />
    </DharmshalaInfoTableWrapper>
  );
};

export default DharmshalaInfoTable;
