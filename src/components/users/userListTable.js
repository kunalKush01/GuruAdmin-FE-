import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import { deleteCategoryDetail } from "../../api/categoryApi";
import { deleteSubAdmin } from "../../api/userApi";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import avtarIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import confirmationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import placeHolderTable from "../../assets/images/placeholderImages/placeHolderTable.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { DELETE, EDIT } from "../../utility/permissionsVariable";
import CustomDataTable from "../partials/CustomDataTable";
import "../../assets/scss/common.scss";
import { Table } from "antd";

export function SubAdminUserListTable({
  data,
  currentFilter,
  currentPage,
  subPermission,
  allPermissions,
}) {
  const handleDeleteSubAdmin = async (payload) => {
    return deleteSubAdmin(payload);
  };
  const queryCient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteSubAdmin,
    onSuccess: (data) => {
      if (!data.error) {
        queryCient.invalidateQueries(["Users"]);
      }
    },
  });
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns = [
    {
      title: t("Username"),
      dataIndex: "userName",
      key: "userName",
      render: (text) => (
        <span style={{ font: "normal normal 700 13px/20px noto sans" }}>
          {text}
        </span>
      ),
      width: 120,
      fixed:"left"
    },
    {
      title: t("Mobile Number"),
      dataIndex: "mobile",
      key: "mobile",
      width: 120,
    },
    {
      title: t("email"),
      dataIndex: "email",
      key: "email",
      width: 120,
    },
    {
      title: t("User Role"),
      dataIndex: "userRole",
      key: "userRole",
      width: 120,
    },
    {
      title: t("action"),
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 40,
    },
  ];

  const categoriesList = useMemo(() => {
    return data.map((item, idx) => ({
      _Id: item.id,
      id: `${idx + 1}`,
      userName: (
        <div className="d-flex align-items-center ">
          <img
            src={item?.profilePhoto !== "" ? item?.profilePhoto : avtarIcon}
            className="cursor-pointer"
            style={{
              marginRight: "5px",
              width: "30px",
              height: "30px",
              objectFit: "cover",
              backgroundPosition: "center center",
              borderRadius: "50%",
            }}
          />
          <div>{ConverFirstLatterToCapital(item.name ?? "-")}</div>
        </div>
      ),
      mobile: `+${item?.countryCode ?? "91"} ${item.mobileNumber}` ?? "-",
      email: item.email ?? "-",
      userRole: item?.roles?.join(",") ?? "-",
      action: (
        <div className="d-flex align-items-center">
          <div>
            {allPermissions?.name === "all" || subPermission?.includes(EDIT) ? (
              <img
                src={editIcon}
                className="cursor-pointer"
                width={35}
                onClick={() =>
                  navigate(
                    `/configuration/users/edit/${item.id}?page=${currentPage}`
                  )
                }
              />
            ) : (
              ""
            )}
          </div>
          <div>
            {allPermissions?.name === "all" ||
            subPermission?.includes(DELETE) ? (
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
                                  <h3 class="swal-heading">Delete Sub Admin</h3>
                                  <p>Are you sure you want to permanently delete the selected sub admin ?</p>
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
            )}
          </div>
        </div>
      ),
    }));
  }, [data]);

  return (
    <div className="usertablewrapper">
      <Table
        className="commonListTable"
        columns={columns}
        dataSource={categoriesList}
        scroll={{
          x: 1500,
          y: 400,
        }}
        sticky={{
          offsetHeader: 64,
        }}
        bordered
        rowKey="id"
      />
    </div>
  );
}
