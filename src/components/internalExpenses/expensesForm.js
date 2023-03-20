import { Form, Formik } from "formik";
import React, { useMemo, useState } from "react";
import CustomTextField from "../partials/customTextField";
import * as yup from "yup";
import RichTextField from "../partials/richTextEditorField";
import styled from "styled-components";
import { CustomDropDown } from "../partials/customDropDown";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { Trans, useTranslation } from "react-i18next";
import { Button, ButtonGroup, Col, Row, Spinner } from "reactstrap";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import { useHistory } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNews } from "../../api/newsApi";
import { Plus } from "react-feather";

const FormWaraper = styled.div`
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
  vailidationSchema,
  initialValues,
  showTimeInput,
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const newsQuerClient = useQueryClient();

  const newsMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        newsQuerClient.invalidateQueries(["Expenses"]);
        newsQuerClient.invalidateQueries(["ExpensesDetail"]);
        setLoading(false);
        history.push("/internal_expenses");
      } else if (data?.error) {
        setLoading(false);
      }
    },
  });
  return (
    <FormWaraper className="FormikWraper">
      <Formik
        // enableReinitialize
        initialValues={{ ...initialValues }}
        onSubmit={(e) => {
          setLoading(true);
          newsMutation.mutate({
            expenseId: e?.Id,
            amount: e?.Amount,
            title: e?.Title,
            description: e?.Body,
            expenseDate: e?.DateTime,
          });
        }}
        validationSchema={vailidationSchema}
      >
        {(formik) => (
          <Form>
            <Row>
              <Col xs={7}>
                <Row>
                  <Col>
                    <CustomTextField
                      label={t("news_label_Title")}
                      name="Title"
                      autoFocus
                      required
                    />
                  </Col>
                  <Col>
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
                      height="100px"
                      label={t("news_label_Description")}
                      name="Body"
                    />
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col xs={6}>
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
                <FormikCustomDatePicker
                  label={t("donation_select_date_time")}
                  name="DateTime"
                  showTimeInput={showTimeInput}
                />
              </Col>
            </Row>
            <div className="btn-Published mb-2">
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
    </FormWaraper>
  );
}
