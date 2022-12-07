import { Form, Formik } from "formik";
import React, { useMemo, useState } from "react";
import CustomTextField from "../partials/customTextField";
import * as yup from "yup";
import RichTextField from "../partials/richTextEditorField";
import styled from "styled-components";
import { CustomDropDown } from "../partials/customDropDown";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { Trans, useTranslation } from "react-i18next";
import { Button, ButtonGroup, Col, Row } from "reactstrap";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import { useHistory } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNews } from "../../api/newsApi";
import { Plus } from "react-feather";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import AsyncSelectField from "../partials/asyncSelectField";
import { findAllUsersByName } from "../../api/findUser";

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

export default function DonationForm({
  plusIconDisable = false,
  buttonName = "",
  handleSubmit,
  vailidationSchema,
  initialValues,
  showTimeInput,
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const newsQuerClient = useQueryClient();
  

  const loadOption = async()=>{
    const  res = await findAllUsersByName({name:""})
    return res.results
  }

  const newsMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      console.log("error=", data);
      if (!data.error) {
        newsQuerClient.invalidateQueries(["Collections"]);
        newsQuerClient.invalidateQueries(["CollectionDetail"]);

        history.push("/donation_box");
      }
    },
  });
  return (
    <FormWaraper className="FormikWraper">
      <Formik
        // enableReinitialize
        initialValues={{ ...initialValues }}
        onSubmit={(e) =>
          newsMutation.mutate({
            collectionId: e?.Id,
            amount: e?.Amount,
            remarks: e?.Body,
            collectionDate: e?.DateTime,
          })
        }
        validationSchema={vailidationSchema}
      >
        {(formik) => (
          <Form>
            <Row>
              <Col xs={12}>
                <Row>
                  <Col xs={4}>
                  <CustomTextField
                      label={t("news_label_Title")}
                      name="Title"
                    />
                  </Col>
                  <Col xs={4}>
                  <AsyncSelectField
                      name="SelectedEvent"
                      loadOptions={loadOption}
                      labelKey={"name"}
                      valueKey={"id"}
                      label={t("events_select_dropDown")}
                      placeholder={t("events_select_dropDown")}
                      
                    />
                  </Col>
                  <Col xs={4}>
                    <CustomTextField
                      label={t("news_label_Title")}
                      name="Title"
                    />
                  </Col>
                  <Col xs={4}>
                    <FormikCustomReactSelect
                      labelName={t("news_label_Title")}
                      loadOptions={[]}
                      width
                    />
                  </Col>
                  <Col xs={4}>
                    <FormikCustomReactSelect
                      labelName={t("news_label_Title")}
                      loadOptions={[]}
                      width
                    />
                  </Col>
                  <Col xs={4}>
                    <CustomTextField
                      label={t("news_label_Title")}
                      name="Title"
                    />
                  </Col>
                </Row>
                <Row></Row>
                <Row>
                  <Col>
                    <Row>
                      <Col>
                        <div className="ImagesVideos">
                          <Trans i18nKey={"add_amount"} />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Button
                          className="p-4 w-100 "
                          onClick={() => formik.setFieldValue("Amount", "1000")}
                        >
                          1000
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          className="p-4 w-100 "
                          onClick={() => formik.setFieldValue("Amount", "2000")}
                        >
                          2000
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          className="p-4 w-100 "
                          onClick={() => formik.setFieldValue("Amount", "5000")}
                        >
                          5000
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          className="p-4 w-100 "
                          onClick={() =>
                            formik.setFieldValue("Amount", "10000")
                          }
                        >
                          10000
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row className="mt-1">
                  <Row>
                    <Col className="text-center">or</Col>
                  </Row>
                  <Row className="justify-content-center">
                    <Col xs={6}>
                      <CustomTextField
                        placeholder={t("enter_price_manually")}
                        name="Amount"
                      />
                    </Col>
                  </Row>
                </Row>
              </Col>
            </Row>
            <div className="btn-Published ">
              <Button color="primary" className="addNotice-btn " type="submit">
                {!plusIconDisable && (
                  <span>
                    <Plus className="me-1" size={15} strokeWidth={4} />
                  </span>
                )}
                <span>
                  <Trans i18nKey={`${buttonName}`} />
                </span>
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </FormWaraper>
  );
}
