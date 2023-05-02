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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNews } from "../../api/newsApi";
import { Plus } from "react-feather";
import { flatMap } from "lodash";
import { setlang } from "../../redux/authSlice";
import LogListTable from "./logListTable";
import { getAllBoxCollectionLogs } from "../../api/donationBoxCollectionApi";
import { Prompt } from "react-router-dom";

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

export default function DonationBoxForm({
  plusIconDisable = false,
  buttonName = "",
  handleSubmit,
  vailidationSchema,
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
        history.push("/donation_box");
      } else if (data?.error) {
        setLoading(false);
      }
    },
  });

  const hundiLogQuery = useQuery(
    [
      "hundiLogs",
    ],
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
    <FormWaraper className="FormikWraper">
      <Formik
        // enableReinitialize
        initialValues={{ ...initialValues }}
        onSubmit={(e) => {
          setShowPrompt(false)
          setLoading(true);
          newsMutation.mutate({
            collectionId: e?.Id,
            amount: e?.Amount,
            remarks: e?.Body,
            collectionDate: e?.DateTime,
          });
        }}
        validationSchema={vailidationSchema}
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
            <Row>
              <Col xs={12} md={7} >
                <Row>
                  <Col xs={12}>
                    <CustomTextField
                      label={t("created_by")}
                      name="CreatedBy"
                      disabled
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <RichTextField
                      height="100px"
                      label={t("news_label_Description")}
                      name="Body"
                      autoFocus
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6} className="mt-1">
                    <CustomTextField
                      type="number"
                      label={t("categories_select_amount")}
                      placeholder={t("enter_price_manually")}
                      required
                      name="Amount"
                    />
                  </Col>
                </Row>
              </Col>
              <Col>
                <FormikCustomDatePicker
                  label={t("donation_select_date")}
                  name="DateTime"
                  // showTimeInput={showTimeInput}
                />
              </Col>
            </Row>
            {editLogs && (
              <Row>
                <div>
                  <Trans i18nKey={"Logs"} />
                </div>
                <Col lg={9} className='my-lg-2'>
                  <LogListTable data={hundiLogs} />
                </Col>
              </Row>
            )}
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
    </FormWaraper>
  );
}
