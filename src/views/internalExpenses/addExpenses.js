import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as yup from "yup";
import { createExpense } from "../../api/expenseApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import ExpensesForm from "../../components/internalExpenses/expensesForm";


const NewsWarper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .addNews {
    color: #583703;
    display: flex;
    align-items: center;
  }
`;

const handleCreateExpense = async (payload) => {
  return createExpense(payload);
};
const schema = yup.object().shape({
  Title: yup.string().matches(/^[^!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]*$/g,"injection_found").required("expenses_title_required").trim(),
  // AddedBy: yup.string().required("news_tags_required"),
  Amount: yup
    .string()
    .matches(/^[1-9][0-9]*$/, "invalid_amount")
    .required("amount_required"),
  Body: yup.string().required("expenses_desc_required"),
  DateTime: yup.string(),
});


export default function AddNews() {
  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);


  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get('page')
  const currentFilter = searchParams.get('filter')
  const loggedInUser = useSelector((state) => state.auth.userDetail.name);

  const initialValues = {
    Title: "",
    AddedBy: loggedInUser,
    Body: "",
    Amount: "",
    DateTime: new Date(),
  };

  return (
    <NewsWarper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push(`/internal_expenses?page=${currentPage}&filter=${currentFilter}`)}
          />
          <div className="addNews">
            <Trans i18nKey={"expenses_AddExpenses"} />
          </div>
        </div>
      </div>
      <div className="ms-md-3 mt-1">
        <ExpensesForm
          handleSubmit={handleCreateExpense}
          initialValues={initialValues}
          vailidationSchema={schema}
          showTimeInput
          buttonName="expenses_AddExpenses"
        />
      </div>
    </NewsWarper>
  );
}
