import React from "react";
import { Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { createCattleExpenses } from "../../../../api/cattle/cattleExpense";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddExpenseForm from "../../../../components/cattleExpenses/addform";
import "../../../../assets/scss/viewCommon.scss";
const AddExpenses = () => {
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const handleCreateExpenses = async (payload) => {
    return createCattleExpenses(payload);
  };

  // const schema = Yup.object().shape({
  //   Title: Yup.string()
  //     .matches(/^[^!@$%^*()_+\=[\]{};':"\\|.<>/?`~]*$/g, "injection_found")
  //     .required("events_title_required")
  //     .trim(),
  //   // tagsInit:Yup.array().max(15 ,"tags_limit"),
  //   Body: Yup.string().required("events_desc_required").trim(),
  //   DateTime: Yup.object().shape({
  //     start: Yup.string().required("events_startDate_required"),
  //     // end: Yup.mixed().required("events_endDate_required"),
  //   }),
  //   startTime: Yup.mixed().required("events_startTime_required"),
  //   endTime: Yup.mixed().required("events_endTime_required"),
  //   SelectedEvent: Yup.mixed(),
  // });

  const initialValues = {
    purpose: "",
    itemId: "",
    name: "",
    unit: "",
    unitType: "",
    bill_invoice: "",
    quantity: "",
    amount: "",
    Date: new Date(),
  };

  return (
    <div className="addviewwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/cattle/expenses?page=${currentPage}&filter=${currentFilter}`
              )
            }
          />
          <div className="addAction">
            <Trans i18nKey={"cattle_expense_add"} />
          </div>
        </div>
      </div>
      <div className="ms-sm-3 mt-1">
        <AddExpenseForm
          handleSubmit={handleCreateExpenses}
          initialValues={initialValues}
          // validationSchema={schema}
          buttonName="cattle_record_add"
        />
      </div>
    </div>
  );
};

export default AddExpenses;
