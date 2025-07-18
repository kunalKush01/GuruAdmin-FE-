import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import {
  findAllExpenseName,
  findAllItemId,
} from "../../api/cattle/cattleExpense";
import AsyncSelectField from "../partials/asyncSelectField";
import CustomTextField from "../partials/customTextField";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import "../../assets/scss/common.scss";

const AddItemUsageForm = ({
  initialValues,
  validationSchema,
  handleSubmit,
  buttonName,
  ...props
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPrompt, setShowPrompt] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadOption = async (itemId) => {
    const res = await findAllItemId({ itemId: itemId, isUsage: true });
    return res.results;
  };

  const nameLoadOption = async (name) => {
    const res = await findAllExpenseName({ name: name, isUsage: true });
    return res.results;
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data?.error) {
        queryClient.invalidateQueries(["cattleItemUsageList"]);
        setLoading(false);
        navigate("/stock-management/usage");
      } else if (data?.error || data === undefined) {
        setLoading(false);
      }
    },
  });

  return (
    <div className="FormikWrapper">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          setLoading(true);
          setShowPrompt(false);
          mutation.mutate({
            usageId: values?.usageId,
            itemId: values?.itemId?._id,
            name: values?.name?.name,
            date: values?.Date,
            quantity: values?.quantity,
            unit: values?.unit?.value,
            purpose: values?.purpose,
          });
        }}
      >
        {(formik) => (
          <Form>
            {/* {showPrompt && (
              <
                when={!!Object.values(formik?.values).find((val) => !!val)}
                message={(location) =>
                  `Are you sure you want to leave this page & visit ${location.pathname.replace(
                    "/",
                    ""
                  )}`
                }
              />
            )} */}

            <Row className="paddingForm">
              <Col xs={12} md={10}>
                <Row>
                  <Col xs={12} md={4}>
                    <AsyncSelectField
                      name="name"
                      labelKey="name"
                      valueKey="name"
                      loadOptions={nameLoadOption}
                      label={t("name")}
                      onChange={(e) => {
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
                    <CustomTextField
                      label={t("cattle_expense_quantity")}
                      type="number"
                      placeholder={t("placeHolder_cattle_expense_quantity")}
                      name="quantity"
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
                    <CustomTextField
                      label={t("cattle_purpose")}
                      placeholder={t("placeHolder_cattle_purpose")}
                      name="purpose"
                      required
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                    {/* <FormikCustomReactSelect
                      name="purpose"
                      loadOptions={[
                        {
                          label: "Buying Consumable",
                          value: "BUYING_CONSUMABLE",
                        },
                        {
                          label: "Assets",
                          value: "ASSETS",
                        },
                        {
                          label: "General",
                          value: "GENERAL",
                        },
                      ]}
                      labelName={t("cattle_purpose")}
                      placeholder={t("placeHolder_cattle_purpose")}
                      required
                      width="100%"
                    /> */}
                  </Col>
                </Row>
              </Col>
              <Col xs={12} md={3}>
                <FormikCustomDatePicker
                  label={t("expenses_Date")}
                  name="Date"
                />
              </Col>
            </Row>

            <div className="btn-Published mt-3">
              {loading ? (
                <Button
                  color="primary"
                  className="add-trust-btn"
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
    </div>
  );
};

export default AddItemUsageForm;
