import { useQuery } from "@tanstack/react-query";
import he from "he";
import moment from "moment";
import React, { useMemo } from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";
import { getExpensesDetail, updateExpensesDetail } from "../../api/expenseApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import ExpensesForm from "../../components/internalExpenses/expensesForm";
import { ExpenseType } from "./addExpenses";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import "../../assets/scss/viewCommon.scss";
import { getExpensesCustomFields } from "../../api/customFieldsApi";
import { Tag } from "antd";
import { getAllAccounts } from "../../api/profileApi";

export default function AddExpense() {
  const handleCreateExpense = async (payload) => {
    return updateExpensesDetail(payload);
  };
  const customFieldsQuery = useQuery(
    ["getExpensesFields"],
    async () => await getExpensesCustomFields(),
    {
      keepPreviousData: true,
    }
  );
  const PaymentModeOptions = [
    { label: "Bank Account", value: "bankAccount" },
    { label: "Cash", value: "cash" },
  ];
  const customFieldsList = customFieldsQuery?.data?.customFields ?? [];
  const { data } = useQuery(["Accounts"], () => getAllAccounts(), {
    keepPreviousData: true,
    onError: (error) => {
      console.error("Error fetching member data:", error);
    },
  });

  const accountsItem = useMemo(() => {
    return data?.result ?? [];
  }, [data]);
  const flattenedAccounts = accountsItem.map((item) => ({
    label: item.name,
    value: item.id,
    ...item,
  }));

  const schema = Yup.object().shape({
    Title: Yup.string()
      .matches(/^[^!@$%^*()_+\=[\]{};':"\\|.<>/?`~]*$/g, "injection_found")
      .required("expenses_title_required")
      .trim(),
    Amount: Yup.number()
      .typeError("invalid_amount")
      .positive("invalid_amount") // Optional: ensures it's > 0
      .required("amount_required"),
    Body: Yup.string().required("expenses_desc_required"),
    expenseType: Yup.mixed().required("expense_type_required"),

    itemId: Yup.mixed().when("expenseType", {
      is: (val) =>
        val && (val.value === "assets" || val.value === "consumable"),
      then: Yup.mixed().required("cattle_itemID_required"),
      otherwise: Yup.mixed(),
    }),

    perItemAmount: Yup.string().when("expenseType", {
      is: (val) =>
        val && (val.value === "assets" || val.value === "consumable"),
      then: Yup.string()
        .matches(/^[1-9][0-9]*$/, "invalid_amount")
        .required("amount_required"),
      otherwise: Yup.string(),
    }),
    orderQuantity: Yup.string().when("expenseType", {
      is: (val) =>
        val && (val.value === "assets" || val.value === "consumable"),
      then: Yup.string().required("Order Quantity is required"),
      otherwise: Yup.string(),
    }),

    name: Yup.mixed().when("expenseType", {
      is: (val) =>
        val && (val.value === "assets" || val.value === "consumable"),
      then: Yup.mixed().required("cattle_name_required"),
      otherwise: Yup.mixed(),
    }),

    DateTime: Yup.string(),
    paymentMode: Yup.mixed()
      .required("Required")
      .test(
        "is-valid",
        "invalid_payment_mode",
        (val) => val && ["bankAccount", "cash"].includes(val.value)
      ),
    paidFromAccountId: Yup.mixed().required("Required"),
    expenseAccountId: Yup.mixed().required("Required"),
    customFields: Yup.object().shape(
      customFieldsList.reduce((acc, field) => {
        if (field.isRequired) {
          acc[field.fieldName] = Yup.mixed().required(
            `${field.fieldName} is required`
          );
        }
        return acc;
      }, {})
    ),
  });

  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentExpenseType = searchParams.get("expenseType");
  const currentFilter = searchParams.get("filter");

  const { expensesId } = useParams();

  const ExpensesDetailQuery = useQuery(
    ["ExpensesDetail", expensesId],
    async () => await getExpensesDetail(expensesId)
  );
  const loggedInUser = useSelector((state) => state.auth.userDetail.name);
  const paymentModeValue = ExpensesDetailQuery?.data?.result?.paymentMode ?? "";
  const expenseData = ExpensesDetailQuery?.data?.result;

  // Find matching account by id
  const findAccountById = (id) => {
    if (!id) return null;
    const account = flattenedAccounts.find((acc) => acc.id === id);
    if (account) {
      return {
        label: account.name,
        value: account.id,
      };
    }
    return null;
  };
  const initialValues = {
    Id: ExpensesDetailQuery?.data?.result?.id,
    Title: ExpensesDetailQuery?.data?.result?.title ?? null,
    expenseType: {
      label: ConverFirstLatterToCapital(
        ExpensesDetailQuery?.data?.result?.expenseType?.toLowerCase() ?? ""
      ),
      value: ExpensesDetailQuery?.data?.result?.expenseType.toLowerCase(),
    },
    name: ExpensesDetailQuery?.data?.result?.itemId,
    itemId: ExpensesDetailQuery?.data?.result?.itemId,
    orderQuantity: ExpensesDetailQuery?.data?.result?.orderQuantity,
    perItemAmount: ExpensesDetailQuery?.data?.result?.pricePerItem,
    Amount: ExpensesDetailQuery?.data?.result?.amount ?? "",
    AddedBy: loggedInUser,
    Body: he?.decode(ExpensesDetailQuery?.data?.result?.description ?? ""),
    paymentMode:
      PaymentModeOptions.find((option) => option.value === paymentModeValue) ??
      "",
    paidFromAccountId: findAccountById(expenseData?.paidFromAccountId) ?? "",
    expenseAccountId: findAccountById(expenseData?.expenseAccountId) ?? "",
    DateTime: moment(ExpensesDetailQuery?.data?.result?.expenseDate).isValid()
      ? moment(ExpensesDetailQuery?.data?.result?.expenseDate).format(
          "DD MMM YYYY"
        )
      : moment().format("DD MMM YYYY"),

    customFields: ExpensesDetailQuery?.data?.result?.customFields.reduce(
      (acc, field) => {
        acc[field.fieldName] =
          field.fieldType === "Select"
            ? {
                label:
                  typeof field.value === "boolean"
                    ? field.value
                      ? "True"
                      : "False"
                    : field.value,
                value: field.value,
              }
            : typeof field.value === "string" && !isNaN(Date.parse(field.value))
            ? moment(field.value).utcOffset("+0530").toDate()
            : field.value ?? "";
        return acc;
      },
      {}
    ),
  };

  return (
    <div className="expensewrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/internal_expenses?page=${currentPage}&expenseType=${currentExpenseType}&filter=${currentFilter}`
              )
            }
          />
          <div className="addExpense commonFont">
            <Trans i18nKey={"expenses_EditExpenses"} />
          </div>
        </div>
        <div className="d-flex align-items-center">
          <p
            style={{ fontSize: "15px", marginBottom: "0" }}
            className="commonSmallFont"
          >
            Current User :
          </p>
          <Tag
            color="#ff8744"
            style={{
              marginLeft: "8px",
              borderRadius: "5px",
              backgroundColor: "#ff8744",
              color: "white",
            }}
          >
            {loggedInUser}
          </Tag>
        </div>
      </div>

      {!ExpensesDetailQuery.isLoading ? (
        <div className="mt-1">
          <ExpensesForm
            handleSubmit={handleCreateExpense}
            editLogs
            initialValues={initialValues}
            expensesId={expensesId}
            expenseTypeArr={ExpenseType}
            validationSchema={schema}
            showTimeInput
            customFieldsList={customFieldsList}
            paymentModeArr={PaymentModeOptions}
            buttonName="save_changes"
            flattenedAccounts={flattenedAccounts}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
