import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import he from "he";
import { deletePunyarjak } from "../../api/punarjakApi";
import placeHolderTable from "../../assets/images/placeholderImages/placeHolderTable.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import CustomDataTable from "../partials/CustomDataTable";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import Swal from "sweetalert2";
import comfromationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import { DELETE, EDIT } from "../../utility/permissionsVariable";

export default function PunyarjakTable({
  data,
  currentPage,
  subPermission,
  allPermissions,
}) {
  const handleDeletePunyarjakUser = async (payload) => {
    return deletePunyarjak(payload);
  };
  const queryCient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeletePunyarjakUser,
    onSuccess: (data) => {
      if (!data.error) {
        queryCient.invalidateQueries(["punyarjak"]);
      }
    },
  });
  const { t } = useTranslation();
  const history = useHistory();

  const columns = [
    {
      name: t("subscribed_user_name"),
      selector: (row) => row.name,
      style: {
        font: "normal normal 700 13px/20px noto sans !important ",
      },
      // width:"150px",
    },
    {
      name: t("description"),
      selector: (row) => row.description,
      center: true,
    },
    {
      name: t(""),
      selector: (row) => row.edit,
      center: true,
    },
    {
      name: t(""),
      selector: (row) => row.delete,
      center: true,
    },
  ];

  const punyarjak_user = useMemo(() => {
    return data.map((item, idx) => {
      return {
        id: idx + 1,
        name: (
          <div className="d-flex align-items-center ">
            <img
              src={
                item?.profilePhoto !== ""
                  ? item?.profilePhoto
                  : placeHolderTable
              }
              className="cursor-pointer"
              style={{
                marginRight: "5px",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
              }}
            />
            <div>{ConverFirstLatterToCapital(item?.name ?? "-")}</div>
          </div>
        ),
        description: (
          <div
            className="d-flex tableDes"
            dangerouslySetInnerHTML={{
              __html: he.decode(item?.description ?? ""),
            }}
          />
        ),
        edit:
          allPermissions?.name === "all" || subPermission?.includes(EDIT) ? (
            <img
              src={editIcon}
              className="cursor-pointer"
              width={35}
              onClick={() =>
                history.push(`/punyarjak/edit/${item.id}?page=${currentPage}`)
              }
            />
          ) : (
            ""
          ),
        delete:
          allPermissions?.name === "all" || subPermission?.includes(DELETE) ? (
            <img
              src={deleteIcon}
              width={35}
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Swal.fire("Oops...", "Something went wrong!", "error");
                Swal.fire({
                  title: `<img src="${comfromationIcon}"/>`,
                  html: `
                                    <h3 class="swal-heading">${t(
                                      "punyarjak_delete"
                                    )}</h3>
                                    <p>${t("punyarjak_sure")}</p>
                                    `,
                  showCloseButton: false,
                  showCancelButton: true,
                  focusConfirm: true,
                  cancelButtonText: "Cancel",
                  cancelButtonAriaLabel: "Cancel",

                  confirmButtonText: "Confirm Delete",
                  confirmButtonAriaLabel: "Confirm",
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    deleteMutation.mutate(item.id);
                  }
                });
              }}
            />
          ) : (
            ""
          ),
      };
    });
  });

  const PunyarjakUSerTableWarper = styled.div`
    color: #583703 !important;
    margin-right: 20px;
    font: normal normal bold 15px/23px Noto Sans;

    .tableDes p {
      margin-bottom: 0;
    }
  `;

  return (
    <PunyarjakUSerTableWarper>
      <CustomDataTable
        // minWidth="fit-content"
        maxHieght={""}
        columns={columns}
        data={punyarjak_user}
      />
    </PunyarjakUSerTableWarper>
  );
}
