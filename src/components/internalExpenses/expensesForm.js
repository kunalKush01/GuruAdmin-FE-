import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useMemo, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router-dom";
import { Button, ButtonGroup, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import * as Yup from "yup";
import { getAllExpensesLogs } from "../../api/expenseApi";
import { createNews } from "../../api/newsApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import LogListTable from "../DonationBox/logListTable";
import { CustomDropDown } from "../partials/customDropDown";
import CustomTextField from "../partials/customTextField";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import RichTextField from "../partials/richTextEditorField";

const FormWrapper = styled.div`
  .FormikWraper {
    padding: 40px;
  }
  .btn-Published {
    text-align: center;
  }
  .addNews-btn {
    padding: 8px 20px;
    margin-left: 10px;
    font: normal normal bold 15px/20px noto sans;
  }
  .newsContent {
    height: 350px;
    overflow: auto;
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .filterPeriod {
    color: #ff8744;

    font: normal normal bold 13px/5px noto sans;
  }
  .btn-secondary {
    background-color: #fff7e8 !important;
    color: #583703 !important ;
    border: none;
    font: normal normal bold 20px/20px noto sans !important ;
    box-shadow: none !important ;
    :hover {
      color: #fff !important;
      background-color: #ff8744 !important;
    }
    .secondary.active {
      color: #fff !important;
    }
  }
`;

export default function ExpensesForm({
  plusIconDisable = false,
  buttonName = "",
  handleSubmit,
  expensesId,
  editLogs,
  validationSchema,
  initialValues,
  showTimeInput,
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const expenseQueryClient = useQueryClient();

  const expenseMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        expenseQueryClient.invalidateQueries(["Expenses"]);
        expenseQueryClient.invalidateQueries(["ExpensesDetail"]);
        setLoading(false);
        history.push("/internal_expenses");
      } else if (data?.error) {
        setLoading(false);
      }
    },
  });

  const expenseLogQuery = useQuery(
    ["expenseLog"],
    () =>
      getAllExpensesLogs({
        // ...pagination,
        expenseId: expensesId,
      }),
    {
      keepPreviousData: true,
    }
  );

  const expenseLog = useMemo(
    () => expenseLogQuery?.data?.results ?? [],
    [expenseLogQuery]
  );
  const [showPrompt, setShowPrompt] = useState(true);

  return (
    <FormWrapper className="FormikWraper">
      <Formik
        // enableReinitialize
        initialValues={{ ...initialValues }}
        onSubmit={(e) => {
          setShowPrompt(false);
          setLoading(true);
          expenseMutation.mutate({
            expenseId: e?.Id,
            amount: e?.Amount,
            title: e?.Title,
            description: e?.Body,
            expenseDate: e?.DateTime,
          });
        }}
        validationSchema={validationSchema}
      >
        {(formik) => (
          <Form>
            {showPrompt && (
              <Prompt
                when={!!Object.values(formik?.values).find((val) => !!val)}
                message={(location) =>
                  `Are you sure you want to leave this page & visit ${location.pathname.replace(
                    "/",
                    ""
                  )}`
                }
              />
            )}
            <div className="paddingForm">
              <Row>
                <Col xs={12} md={7}>
                  <Row>
                    <Col xs="12" md="6">
                      <CustomTextField
                        label={t("news_label_Title")}
                        name="Title"
                        placeholder={t("placeHolder_title")}
                        onInput={(e) =>
                          (e.target.value = e.target.value.slice(0, 30))
                        }
                        autoFocus
                        required
                      />
                    </Col>
                    <Col xs={12} md={6} className="opacity-75">
                      <CustomTextField
                        label={t("added_by")}
                        name="AddedBy"
                        disabled
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} className="mt-1">
                      <RichTextField
                        height="200px"
                        label={t("news_label_Description")}
                        name="Body"
                      />
                    </Col>
                  </Row>
                  <Row className="">
                    <Col xs={12} md={6}>
                      <CustomTextField
                        type="number"
                        label={t("categories_select_amount")}
                        placeholder={t("enter_price_manually")}
                        name="Amount"
                        required
                      />
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row>
                    <Col xs={12}>
                      <FormikCustomDatePicker
                        label={t("donation_select_date")}
                        name="DateTime"
                        pastDateNotAllowed
                        // showTimeInput={showTimeInput}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              {editLogs && (
                <Row>
                  <div>
                    <Trans i18nKey={"Logs"} />
                  </div>
                  <Col lg={9} className="my-lg-2">
                    <LogListTable data={expenseLog} />
                  </Col>
                </Row>
              )}
            </div>

            <div className="btn-Published mb-2 mt-lg-2">
              {loading ? (
                <Button
                  color="primary"
                  className="add-trust-btn"
                  style={{
                    borderRadius: "10px",
                    padding: "5px 40px",
                    opacity: "100%",
                  }}
                  disabled
                >
                  <Spinner size="md" />
                </Button>
              ) : (
                <Button
                  color="primary"
                  className="addNotice-btn "
                  type="submit"
                >
                  {plusIconDisable && (
                    <span>
                      <Plus className="me-1" size={15} strokeWidth={4} />
                    </span>
                  )}
                  <span>
                    <Trans i18nKey={`${buttonName}`} />
                  </span>
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </FormWrapper>
  );
}
