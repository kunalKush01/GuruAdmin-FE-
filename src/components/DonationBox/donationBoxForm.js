import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { flatMap } from "lodash";
import React, { useMemo, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router-dom";
import { Button, ButtonGroup, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import * as Yup from "yup";
import { getAllBoxCollectionLogs } from "../../api/donationBoxCollectionApi";
import { createNews } from "../../api/newsApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { setlang } from "../../redux/authSlice";
import { TextArea } from "../partials/CustomTextArea";
import { CustomDropDown } from "../partials/customDropDown";
import CustomTextField from "../partials/customTextField";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import RichTextField from "../partials/richTextEditorField";
import LogListTable from "./logListTable";
import "../../assets/scss/common.scss";

export default function DonationBoxForm({
  plusIconDisable = false,
  buttonName = "",
  handleSubmit,
  validationSchema,
  collectionId,
  editLogs,
  initialValues,
  showTimeInput,
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const newsQuerClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const newsMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        newsQuerClient.invalidateQueries(["Collections"]);
        newsQuerClient.invalidateQueries(["BoxCollectionDetail"]);
        setLoading(false);
        history.push("/hundi");
      } else if (data?.error) {
        setLoading(false);
      }
    },
  });

  const hundiLogQuery = useQuery(
    ["hundiLogs"],
    () =>
      getAllBoxCollectionLogs({
        // ...pagination,
        collectionId: collectionId,
        // search: searchBarValue,
      }),
    {
      keepPreviousData: true,
    }
  );

  const hundiLogs = useMemo(
    () => hundiLogQuery?.data?.results ?? [],
    [hundiLogQuery]
  );
  const [showPrompt, setShowPrompt] = useState(true);

  return (
    <div className="formwrapper FormikWrapper">
      <Formik
        // enableReinitialize
        initialValues={{ ...initialValues }}
        onSubmit={(e) => {
          setShowPrompt(false);
          setLoading(true);
          newsMutation.mutate({
            collectionId: e?.Id,
            amount: e?.Amount,
            remarks: e?.Body,
            collectionDate: e?.DateTime,
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
                    <Col xs={12}>
                      <TextArea
                        rows="8"
                        label={t("news_label_Description")}
                        name="Body"
                        autoFocus
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={6} className="">
                      <CustomTextField
                        type="number"
                        label={t("categories_select_amount")}
                        placeholder={t("enter_price_manually")}
                        required
                        name="Amount"
                      />
                    </Col>
                    <Col xs={12} md={6} className="opacity-75">
                      <CustomTextField
                        label={t("added_by")}
                        name="CreatedBy"
                        disabled
                      />
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row>
                    <Col xs={12}>
                      <FormikCustomDatePicker
                        label={t("donation_select_date")}
                        futureDateNotAllowed
                        name="DateTime"
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
                    <LogListTable data={hundiLogs} />
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
                  className="addAction-btn "
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
    </div>
  );
}
