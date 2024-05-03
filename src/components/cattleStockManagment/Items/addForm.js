import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import CustomTextField from "../../partials/customTextField";
import FormikCustomReactSelect from "../../partials/formikCustomReactSelect";

const FormikWrapper = styled.div``;

const AddStockItemForm = ({
  initialValues,
  validationSchema,
  handleSubmit,
  buttonName,
  ...props
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [showPrompt, setShowPrompt] = useState(true);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data?.error) {
        queryClient.invalidateQueries(["cattleStockManagementList"]);
        setLoading(false);
        history.push("/cattle/management/item");
      } else if (data?.error || data === undefined) {
        setLoading(false);
      }
    },
  });

  return (
    <FormikWrapper>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          setLoading(true);
          setShowPrompt(false);
          mutation.mutate({
            itemId: values?.itemId,
            name: values?.name,
            unit: values?.unit?.value,
            unitType: values?.unitType?.value,
          });
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

            <Row className="paddingForm">
              <Col xs={12} md={10}>
                <Row>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("name")}
                      placeholder={t("placeHolder_cattle_item_id")}
                      name="name"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <FormikCustomReactSelect
                      name="unit"
                      loadOptions={[
                        {
                          label: "KG",
                          value: "KG",
                        },
                        {
                          label: "ltrs",
                          value: "ltrs",
                        },
                        {
                          label: "unit",
                          value: "unit",
                        },
                      ]}
                      labelName={t("cattle_unit")}
                      placeholder={t("placeHolder_cattle_unit")}
                      required
                      width="100%"
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <FormikCustomReactSelect
                      name="unitType"
                      loadOptions={[
                        {
                          label: "Consumable",
                          value: "CONSUMABLE",
                        },
                        {
                          label: "Assets",
                          value: "ASSETS",
                        },
                      ]}
                      labelName={t("cattle_expense_unitType")}
                      placeholder={t("placeHolder_cattle_expense_unitType")}
                      required
                      width="100%"
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            <div className="btn-Published mt-3">
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
                  className="d-flex align-items-center m-auto"
                  type="submit"
                >
                  {!props.plusIconDisable && (
                    <span>
                      <Plus className="" size={15} strokeWidth={4} />
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
    </FormikWrapper>
  );
};

export default AddStockItemForm;
