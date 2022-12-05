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
  Title: yup.string().required("news_title_required"),
  AddedBy: yup.string().required("news_tags_required"),
  Amount: yup.string().required("news_tags_required"),
  Body: yup.string().required("news_desc_required"),
  DateTime: yup.string(),
});

const initialValues = {
  Title: "",
  AddedBy: "admin",
  Body: "",
  Amount: "",
  DateTime: new Date(),
};

export default function AddNews() {
  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);

  return (
    <NewsWarper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2"
            onClick={() => history.push("/news")}
          />
          <div className="addNews">
            <Trans i18nKey={"expenses_AddExpenses"} />
          </div>
        </div>
        {/* <div className="addNews">
          <Trans i18nKey={"news_InputIn"} />
          <CustomDropDown
            ItemListArray={langArray}
            className={"ms-1"}
            defaultDropDownName={"English"}
            disabled
          />
        </div> */}
      </div>

      <ExpensesForm
        handleSubmit={handleCreateExpense}
        initialValues={initialValues}
        vailidationSchema={schema}
        showTimeInput
        buttonName="expenses_AddExpenses"
      />
    </NewsWarper>
  );
}
