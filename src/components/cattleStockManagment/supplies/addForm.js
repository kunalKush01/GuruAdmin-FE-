import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import {
  findAllExpenseName,
  findAllItemId,
} from "../../../api/cattle/cattleExpense";
import AsyncSelectField from "../../partials/asyncSelectField";
import CustomTextField from "../../partials/customTextField";
import FormikCustomReactSelect from "../../partials/formikCustomReactSelect";

const FormikWrapper = styled.div``;

const AddSuppliesForm = ({
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

  const loadOption = async (itemId) => {
    const res = await findAllItemId({ itemId: itemId });
    return res.results;
  };
  const nameLoadOption = async (name) => {
    const res = await findAllExpenseName({ name: name });
    return res.results;
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data?.error) {
        queryClient.invalidateQueries(["cattleStockManagementList"]);
        setLoading(false);
        history.push("/cattle/management/supplies");
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
            itemId: values?.itemId?._id,
            name: values?.name,
            unit: values?.unit?.value,
            orderQuantity: values?.orderQuantity,
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
                    <AsyncSelectField
                      name="itemId"
                      labelKey="itemId"
                      valueKey="itemId"
                      loadOptions={loadOption}
                      label={t("cattle_itemId")}
                      onChange={(e) => {
                        formik.setFieldValue("itemId", e);
                        formik.setFieldValue("name", e);
                        formik.setFieldValue("unit", {
                          label: e?.unit,
                          value: e?.unit,
                        });
                      }}
                      placeholder={t("placeHolder_cattle_itemId")}
                      defaultOptions
                      required
                    />
                  </Col>

                  <Col xs={12} md={4}>
                    <AsyncSelectField
                      name="name"
                      labelKey="name"
                      valueKey="name"
                      loadOptions={nameLoadOption}
                      label={t("name")}
                      onChange={(e) => {
                        console.log("e", e);
                        formik.setFieldValue("name", e);
                        formik.setFieldValue("itemId", e);
                        formik.setFieldValue("unit", {
                          label: e?.unit,
                          value: e?.unit,
                        });
                      }}
                      placeholder={t("placeHolder_cattle_item_name")}
                      defaultOptions
                      required
                    />
                  </Col>

                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_expense_order_quantity")}
                      type="number"
                      placeholder={t(
                        "placeHolder_cattle_expense_order_quantity"
                      )}
                      name="orderQuantity"
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
                      disabled={formik.values.itemId || formik.values.name}
                    />
                  </Col>

                  {/* <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_expense_current_quantity")}
                      type="number"
                      placeholder={t(
                        "placeHolder_cattle_expense_current_quantity"
                      )}
                      name="currentQuantity"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                      disabled={formik.values.itemId || formik.values.name}
                    />
                  </Col> */}
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
                  className="addNotice-btn "
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

export default AddSuppliesForm;
