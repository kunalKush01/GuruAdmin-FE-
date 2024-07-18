import { useQuery } from "@tanstack/react-query";
import he from "he";
import moment from "moment";
import React from "react";
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

import '../../styles/viewCommon.scss';
;

const handleCreateExpense = async (payload) => {
  return updateExpensesDetail(payload);
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

export default function AddExpense() {
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
    DateTime: moment(ExpensesDetailQuery?.data?.result?.expenseDate)
      .utcOffset("+0530")
      .toDate(),
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
          <div className="addExpense">
            <Trans i18nKey={"expenses_EditExpenses"} />
          </div>
        </div>
      </div>

      {!ExpensesDetailQuery.isLoading ? (
        <div className="ms-md-3 mt-1">
          <ExpensesForm
            handleSubmit={handleCreateExpense}
            editLogs
            initialValues={initialValues}
            expensesId={expensesId}
            expenseTypeArr={ExpenseType}
            validationSchema={schema}
            showTimeInput
            buttonName="save_changes"
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
