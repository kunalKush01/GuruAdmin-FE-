import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";
import { createExpense } from "../../api/expenseApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import ExpensesForm from "../../components/internalExpenses/expensesForm";

import "../../assets/scss/viewCommon.scss";

export const ExpenseType = [
  {
    label: "General",
    value: "general",
  },
  {
    label: "Assets",
    value: "assets",
  },
  {
    label: "Consumable",
    value: "consumable",
  },
];

const handleCreateExpense = async (payload) => {
  return createExpense(payload);
};
const schema = Yup.object().shape({
  Title: Yup.string()
    .matches(/^[^!@$%^*()_+\=[\]{};':"\\|.<>/?`~]*$/g, "injection_found")
    .required("expenses_title_required")
    .trim(),
  Amount: Yup.string()
    .matches(/^[1-9][0-9]*$/, "invalid_amount")
    .required("amount_required"),
  Body: Yup.string().required("expenses_desc_required"),
  expenseType: Yup.mixed().required("expense_type_required"),

  itemId: Yup.mixed().when("expenseType", {
    is: (val) => val && (val.value === "assets" || val.value === "consumable"),
    then: Yup.mixed().required("cattle_itemID_required"),
    otherwise: Yup.mixed(),
  }),

  perItemAmount: Yup.string().when("expenseType", {
    is: (val) => val && (val.value === "assets" || val.value === "consumable"),
    then: Yup.string()
      .matches(/^[1-9][0-9]*$/, "invalid_amount")
      .required("amount_required"),
    otherwise: Yup.string(),
  }),

  name: Yup.mixed().when("expenseType", {
    is: (val) => val && (val.value === "assets" || val.value === "consumable"),
    then: Yup.mixed().required("cattle_name_required"),
    otherwise: Yup.mixed(),
  }),

  DateTime: Yup.string(),
});

export default function AddNews() {
  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentExpenseType = searchParams.get("expenseType");
  const currentFilter = searchParams.get("filter");
  const loggedInUser = useSelector((state) => state.auth.userDetail.name);

  const initialValues = {
    Title: "",
    expenseType: ExpenseType[0],
    name: "",
    itemId: "",
    perItemAmount: "",
    Amount: "",
    bill_invoice: "",
    Body: "",
    AddedBy: loggedInUser,
    DateTime: new Date(),
  };

  return (
    <div className="listviewwrapper">
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
          <div className="addNews">
            <Trans i18nKey={"expenses_AddExpenses"} />
          </div>
        </div>
      </div>
      <div className="mt-1">
        <ExpensesForm
          handleSubmit={handleCreateExpense}
          initialValues={initialValues}
          expenseTypeArr={ExpenseType}
          validationSchema={schema}
          showTimeInput
          buttonName="expenses_AddExpenses"
        />
      </div>
    </div>
  );
}
