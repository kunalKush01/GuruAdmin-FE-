import { useTranslation, Trans } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { Button } from "reactstrap";
import styled from "styled-components";
import CustomDataTable from "../partials/CustomDataTable";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import comfromationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import { deleteCategoryDetail } from "../../api/categoryApi";
import placeHolderTable from "../../assets/images/placeholderImages/placeHolderTable.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { deleteSubAdmin } from "../../api/userApi";
import { DELETE, EDIT } from "../../utility/permissionsVariable";
import avtarIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";


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
  const history = useHistory();

  const columns = [
    {
      name: t("Username"),
      selector: (row) => row.userName,
      style: {
        font: "normal normal 700 13px/20px noto sans !important ",
      },
    },
    {
      name: t("Mobile Number"),
      selector: (row) => row.mobile,
    },
    {
      name: t("Email"),
      selector: (row) => row.email,
    },
    {
      name: t("User Role"),
      selector: (row) => row.userRole,
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

  const categoriesList = useMemo(() => {
    return data.map((item, idx) => ({
      _Id: item.id,
      id: `${idx + 1}`,
      userName: (
        <div className="d-flex align-items-center ">
          <img
            src={
              item?.profilePhoto !== "" ? item?.profilePhoto : avtarIcon
            }
            className="cursor-pointer"
            style={{
              marginRight: "5px",
              width: "30px",
              height: "30px",
              objectFit:"cover",
              backgroundPosition:'center center',
              borderRadius: "50%",
            }}
          />
          <div>{ConverFirstLatterToCapital(item.name ?? "-")}</div>
        </div>
      ),
      mobile:  `+${item?.countryCode ?? "91"} ${item.mobileNumber}` ?? "-",
      email: item.email ?? "-",
      userRole: item?.roles?.join(",") ?? "-",
      // addLanguage: (
      //   <Button
      //     outline
      //     onClick={() =>
      //       history.push(`/configuration/categories/add-language/${item.id}?page=${currentPage}&filter=${currentFilter}`)
      //     }
      //     color="primary"
      //     style={{ padding: "5px 20px" }}
      //   >
      //     {"Add Language"}
      //   </Button>
      // ),
      edit: allPermissions?.name === "all" || subPermission?.includes(EDIT) ? (
        <img
          src={editIcon}
          className="cursor-pointer"
          width={35}
          onClick={() =>
            history.push(
              `/configuration/users/edit/${item.id}?page=${currentPage}`
            )
          }
        />
      ):"",
      delete: allPermissions?.name === "all" || subPermission?.includes(DELETE) ? (
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
      ):"",
    }));
  }, [data]);

  const RecentDonationTableWarper = styled.div`
    color: #583703 !important;
    margin-right: 20px;
    font: normal normal bold 15px/23px Noto Sans;
  `;

  return (
    <RecentDonationTableWarper>
      <CustomDataTable maxHieght={""} columns={columns} data={categoriesList} />
    </RecentDonationTableWarper>
  );
}
