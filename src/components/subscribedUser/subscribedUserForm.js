import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import styled from "styled-components";
import CustomTextField from "../partials/customTextField";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";

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
`;

export default function SubscribedUserForm({
  plusIconDisable=false,
  loadOptions,
  handleSubmit,
  vailidationSchema,
  initialValues,
  showTimeInput,
  buttonName="",
  ...props
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const categoryQuerClient = useQueryClient();

  const categoryMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        categoryQuerClient.invalidateQueries(["subscribedUser"]);        
        history.push("/subscribed-user");
      }
    },
  });
  return (
    <FormWaraper className="FormikWraper">
      <Formik
        // enableReinitialize
        initialValues={{ ...initialValues }}
        onSubmit={(e) => {
          console.log("cateFormSubmit=", e);
          categoryMutation.mutate({
            email: e.email,
            mobileNumber: e.mobile,
            name: e.name,
          });
        }}
        validationSchema={vailidationSchema}
      >
        {(formik) => (
          <Form>
            <Row>
              <Col xs={12}>
                <Row>
                  <Col>
                    {/* <FormikCustomReactSelect
                      width={"100%"}
                      name={props.CategoryFormName}
                      loadOptions={loadOptions}
                      labelKey={"name"}
                      valueKey={"id"}
                      labelName={t("MasterCategory")}
                      placeholder={props.placeholder ?? t("all")}
                    /> */}
                    <CustomTextField
                      label={t("user_name")}
                      name="name"
                    />
                  </Col>
                  <Col>
                    <CustomTextField
                      label={t("dashboard_Recent_DonorNumber")}
                      name="mobile"
                    />
                  </Col>
                  <Col>
                    <CustomTextField
                      label={t("subscribed_user_email")}
                      name="email"
                    />
                  </Col>
                </Row>
                {/* <Row>
                  <Col xs={12}>
                    <RichTextField
                      height="100px"
                      label={t("news_label_Description")}
                      name="Body"
                    />
                  </Col>
                </Row> */}
                {/* <Row>
                        <div className="ImagesVideos">
                          <Trans i18nKey={"news_label_ImageVedio"} />
                        </div>
                        <div></div>
                      </Row> */}
                {/* <Row>
                  <Col xs={6}>
                    <CustomTextField
                      label={t("news_label_Published")}
                      name="PublishedBy"
                    />
                  </Col>
                </Row> */}
                {/* </Col>
              <Col> */}
                {/* <FormikCustomDatePicker
                  name="DateTime"
                  showTimeInput={showTimeInput}
                /> */}
              </Col>
            </Row>
            <div className="btn-Published ">
            <Button color="primary" className="addNotice-btn " type="submit">
                {plusIconDisable&&<span>
                  <Plus className="" size={15} strokeWidth={4} />
                </span>}
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
