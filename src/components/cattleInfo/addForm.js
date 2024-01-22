import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router-dom";
import { Col, Row } from "reactstrap";
import styled from "styled-components";
import FormikRangeDatePicker from "../partials/FormikRangeDatePicker";
import CustomTextField from "../partials/customTextField";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";

const FormikWrapper = styled.div``;

const AddCattleForm = ({ initialValues, validationSchema }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [showPrompt, setShowPrompt] = useState(true);

  return (
    <FormikWrapper>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={() => {
          setShowPrompt(false);
        }}
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
              <Col xs={12} md={9} className="bg-danger">
                <Row>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_tag_id")}
                      placeholder={t("placeHolder_cattle_tag_id")}
                      name="TagID"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <FormikCustomReactSelect
                      name="motherID"
                      loadOptions={[]}
                      labelKey="title"
                      valueKey="id"
                      labelName={t("cattle_mother_id")}
                      placeholder={t("placeholder_cattle_mother_id")}
                      width="100%"
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <FormikCustomReactSelect
                      labelName={t("cattle_type")}
                      placeholder={t("placeholder_cattle_type")}
                      name="cattleType"
                      width="100%"
                      required
                      loadOptions={[]}
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_breed")}
                      placeholder={t("placeHolder_cattle_breed")}
                      name="breed"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_age")}
                      placeholder={t("placeHolder_cattle_age")}
                      name="age"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_purchase_price")}
                      placeholder={t("placeHolder_cattle_purchase_price")}
                      name="purchasePrice"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>

                  <Col xs={12} md={4}></Col>

                  <Col xs={12} md={4}>
                    <FormikRangeDatePicker
                      label={t("cattle_date_purchased")}
                      name="datePurchased"
                      pastDateNotAllowed
                      selectsRange
                    />
                  </Col>

                  <Col xs={12} md={4}>
                    <FormikRangeDatePicker
                      label={t("cattle_date_death")}
                      name="dateOfDeath"
                      pastDateNotAllowed
                      selectsRange
                    />
                  </Col>
                </Row>
              </Col>
              <Col xs={12} md={3}>
                <FormikRangeDatePicker
                  label={t("cattle_date_birth")}
                  name="dateOfBirth"
                  pastDateNotAllowed
                  selectsRange
                />
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </FormikWrapper>
  );
};

export default AddCattleForm;
