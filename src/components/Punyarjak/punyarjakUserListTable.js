import { useMutation, useQueryClient } from "@tanstack/react-query";
import he from "he";
import moment from "moment";
import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button } from "reactstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import { deletePunyarjak } from "../../api/punarjakApi";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import avtarIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import confirmationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import placeHolderTable from "../../assets/images/placeholderImages/placeHolderTable.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { DELETE, EDIT, WRITE } from "../../utility/permissionsVariable";
import CustomDataTable from "../partials/CustomDataTable";

export default function PunyarjakTable({
  data,
  currentPage,
  subPermission,
  allPermissions,
}) {
  const handleDeletePunyarjakUser = async (payload) => {
    return deletePunyarjak(payload);
  };
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeletePunyarjakUser,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["punyarjak"]);
      }
    },
  });
  const { t } = useTranslation();
  const history = useHistory();

  const columns = [
    {
      name: t("news_label_Title"),
      selector: (row) => row.name,
      style: {
        font: "normal normal 700 13px/20px noto sans !important ",
      },
      width: "300px",
    },
    {
      name: t("description"),
      selector: (row) => row.description,
      width:
        window.screen.width < "700"
          ? "250px"
          : window.screen.width > "700" && window.screen.width < "900"
          ? "350px"
          : window.screen.width > "900" && window.screen.width < "1200"
          ? "400px"
          : window.screen.width > "1200" && window.screen.width < "1450"
          ? "500px"
          : "750px",
    },
    {
      name: "",
      selector: (row) => row.addLanguage,
      width: "fit-content",
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
  const langList = useSelector((state) => state.auth.availableLang);

  const punyarjak_user = useMemo(() => {
    return data.map((item, idx) => {
      return {
        id: idx + 1,
        name: (
          <div className="d-flex align-items-center ">
            <img
              // src={item?.profilePhoto !== "" ? item?.profilePhoto : avtarIcon}
              src={item?.image !== "" ? item?.image : placeHolderTable}
              className="cursor-pointer"
              style={{
                marginRight: "10px",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
              }}
            />
            <div>{ConverFirstLatterToCapital(item?.title ?? "-")}</div>
          </div>
        ),
        description: (
          <div
            className="d-flex tableDes"
            dangerouslySetInnerHTML={{
              __html: he?.decode(item?.description ?? ""),
            }}
          />
        ),
        addLanguage:
          allPermissions?.name === "all" || subPermission?.includes(WRITE) ? (
            <Button
              outline
              className={
                langList?.length === item?.languages?.length &&
                "opacity-50 disabled"
              }
              onClick={() =>
                history.push(
                  `/punyarjak/add-language/${item.id}?page=${currentPage}`
                )
              }
              color="primary"
              style={{ padding: "5px 20px" }}
            >
              <Trans i18nKey={"news_AddLangNews"} />
            </Button>
          ) : (
            ""
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
                  title: `<img src="${confirmationIcon}"/>`,
                  html: `
                                    <h3 className="swal-heading">${t(
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
    .tableDes {
      max-height: 1.7rem;
    }
  `;

  return (
    <PunyarjakUSerTableWarper>
      <CustomDataTable maxHeight={""} columns={columns} data={punyarjak_user} />
    </PunyarjakUSerTableWarper>
  );
}
