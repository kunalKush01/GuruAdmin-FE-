import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Table } from "antd";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button } from "reactstrap";
import Swal from "sweetalert2";
import { deleteCategoryDetail } from "../../api/categoryApi";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import confirmationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import "../../assets/scss/common.scss";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { DELETE, EDIT, WRITE } from "../../utility/permissionsVariable";

export function CategoryListTable({
  data,
  page,
  currentPage,
  currentFilter,
  subPermission,
  allPermissions,
  totalItems,
  // currentNewPage,
  pageSize,
  onChangePage,
  onChangePageSize,
}) {
  const handleDeleteCategory = async (payload) => {
    return deleteCategoryDetail(payload);
  };
  const queryCient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteCategory,
    onSuccess: (data) => {
      if (!data.error) {
        queryCient.invalidateQueries(["Categories"]);
      }
    },
  });
  const { t } = useTranslation();
  const history = useHistory();
  const columns = [
    // {
    //   title: t("categories_serial_number"),
    //   dataIndex: "id",
    //   key: "id",
    //   width: 150,
    //   render: (text) => (
    //     <span style={{ font: "normal normal 700 13px/20px noto sans" }}>
    //       {text}
    //     </span>
    //   ),
    // },
    {
      title: t("name"),
      dataIndex: "subCategory",
      key: "subCategory",
      width: 220,
      fixed: "left",
    },
    {
      title: t("categories_master_category"),
      dataIndex: "masterCategory",
      key: "masterCategory",
      width:
        window.screen.width < 700
          ? 250
          : window.screen.width >= 700 && window.screen.width < 900
          ? 350
          : window.screen.width >= 900 && window.screen.width < 1200
          ? 250
          : window.screen.width >= 1200 && window.screen.width < 1450
          ? 250
          : 250,
    },
    {
      title: t("is_fixed_amount"),
      dataIndex: "isFixedAmount",
      key: "isFixedAmount",
      width: 120,
    },
    {
      title: t("amount"),
      dataIndex: "amount",
      key: "a",
      width: 180,
    },
    {
      title: t("Id (For bulk upload)"),
      dataIndex: "_Id",
      key: "a",
      width: 220,
    },
    {
      title: "",
      dataIndex: "addLanguage",
      key: "addLanguage",
      width: 230,
    },
    {
      title: t("action"),
      dataIndex: "action",
      width: 120,
      fixed: "right",
    },
  ];

  const langList = useSelector((state) => state.auth.availableLang);
  console.log(langList);
  const categoriesList = useMemo(() => {
    return data.map((item) => ({
      _Id: item.id,
      //   id:
      //     item?.serialNumber > 9 ? item?.serialNumber : `0${item?.serialNumber}`,
      masterCategory: ConverFirstLatterToCapital(item.masterCategory.name),
      subCategory: ConverFirstLatterToCapital(item.name),
      isFixedAmount: item.isFixedAmount ? "Yes" : "No",
      amount: item.amount,

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
                `/configuration/categories/add-language/${item.id}?page=${currentPage}&filter=${currentFilter}`
              )
            }
            color="primary"
            style={{ padding: "5px 20px" }}
          >
            {"Add Language"}
          </Button>
        ) : (
          ""
        ),
      action: (
        <div className="d-flex">
          <div>
            {allPermissions?.name === "all" || subPermission?.includes(EDIT) ? (
              <img
                className="cursor-pointer"
                src={editIcon}
                width={35}
                onClick={() =>
                  history.push(
                    `/configuration/categories/edit/${item.id}?page=${currentPage}&filter=${currentFilter}`
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
                className="cursor-pointer"
                src={deleteIcon}
                width={35}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Swal.fire("Oops...", "Something went wrong!", "error");
                  Swal.fire({
                    title: `<img src="${confirmationIcon}"/>`,
                    html: `
                                  <h3 class="swal-heading mt-1">${t(
                                    "category_delete"
                                  )}</h3>
                                  <p>${t("category_sure")}</p>
                                  `,
                    showCloseButton: false,
                    showCancelButton: true,
                    focusConfirm: true,
                    cancelButtonText: `${t("cancel")}`,
                    cancelButtonAriaLabel: `${t("cancel")}`,

                    confirmButtonText: `${t("confirm")}`,
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
    <div className="categorytablewrapper">
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
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          onChange: onChangePage,
          onShowSizeChange: (current, size) => onChangePageSize(size),
          showSizeChanger: true,
        }}
        rowKey="id"
      />
    </div>
  );
}
