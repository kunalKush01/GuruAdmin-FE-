import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Col, Row, Spinner } from "reactstrap";
import "../../assets/scss/common.scss";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import CustomCheckBox from "../partials/customCheckBox";
import CustomTextField from "../partials/customTextField";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";

export default function CategoryForm({
  loadOptions = [],
  CategoryFormName = "",
  AddLanguage,
  plusIconDisable = false,
  buttonName = "",
  handleSubmit,
  validationSchema,
  initialValues,
  langSelectionValue,
  editDisableCategory,
  showTimeInput,
  ...props
}) {
  console.log(AddLanguage);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const categoryQuerClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [isFixedAmountChecked, setIsFixedAmountChecked] = useState(false);
  const categoryMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        categoryQuerClient.invalidateQueries(["Categories"]);
        categoryQuerClient.invalidateQueries(["SubCategoryDetail"]);
        setLoading(false);
        navigate("/configuration/categories");
      } else if (data.error) {
        setLoading(false);
      }
    },
  });
  const [showPrompt, setShowPrompt] = useState(true);

  const langToast = {
    toastId: "langError",
  };

  return (
    <div className="FormikWrapper">
      <Formik
        initialValues={{ ...initialValues }}
        onSubmit={(e) => {
          if (langSelectionValue === "Select") {
            toast.error("Please select a language", { ...langToast });
            return;
          }
          setShowPrompt(false);
          setLoading(true);
          return categoryMutation.mutate({
            name: e?.SubCategory,
            masterId: e?.MasterCategory?.id,
            categoryId: e?.Id,
            isFixedAmount: e?.IsFixedAmount || false,
            amount: e?.Amount || 0,
          });
        }}
        validationSchema={validationSchema}
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
              <Col>
                <Row>
                  {!AddLanguage && (
                    <Col xs={12} sm={3}>
                      <FormikCustomReactSelect
                        labelName={t("categories_select_master_category")}
                        required
                        name={CategoryFormName}
                        labelKey={"name"}
                        valueKey="id"
                        disabled={editDisableCategory}
                        loadOptions={
                          loadOptions &&
                          loadOptions?.map((item) => {
                            return {
                              ...item,
                              name: ConverFirstLatterToCapital(
                                item?.name ?? ""
                              ),
                            };
                          })
                        }
                        width={"100%"}
                        {...props}
                      />
                    </Col>
                  )}
                  <Col xs={12} sm={3}>
                    <CustomTextField
                      label={t("categories_sub_category")}
                      name="SubCategory"
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                      required
                    />
                  </Col>
                  {!AddLanguage && (
                    <Col xs={12} sm={3} className="mt-2">
                      <CustomCheckBox
                        name="IsFixedAmount"
                        label={t("is_fixed_amount")}
                        customOnChange={(checked) => {
                          setIsFixedAmountChecked(checked);
                          formik.setFieldValue("IsFixedAmount", checked); // Update Formik state
                          if (!checked) {
                            formik.setFieldValue("Amount", 0); // Set Amount to 0 if unchecked
                          }
                          console.log("Checkbox state:", checked);
                        }}
                        disabled={false}
                      />
                    </Col>
                  )}

                  {(isFixedAmountChecked || formik.values.IsFixedAmount) && (
                    <Col xs={12} sm={3}>
                      <CustomTextField
                        type="number"
                        label={t("amount")}
                        name="Amount"
                        onChange={(e) => {
                          formik.setFieldValue("Amount", e.target.value); // Update Formik state
                        }}
                        required
                      />
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>

            <div className="btn-Published">
              {loading ? (
                <Button
                  color="primary"
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
                <Button color="primary mt-2" type="submit">
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
