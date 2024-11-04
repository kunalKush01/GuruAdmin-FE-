import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import CustomTextField from "../partials/customTextField";
import "../../assets/scss/common.scss";
const AddDharmshalaForm = ({
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
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentStatus = searchParams.get("status");
  const currentFilter = searchParams.get("filter");
  const [correct, isCorrect] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data?.error) {
        queryClient.invalidateQueries(["dharmshalaList"]);
        setLoading(false);
        isCorrect(true);
      } else if (data?.error || data === undefined) {
        setLoading(false);
      }
    },
  });

  const handleFormSubmit = (values) => {
    setLoading(true);
    setShowPrompt(false);
    const { ...formValues } = values;
    const data = {
      ...formValues,
    };
    mutation.mutate(data);
    history.push(`/dharmshala/info`);
  };

  return (
    <div className="FormikWrapper">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
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
                {/* First Row */}
                <Row>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("building_name")}
                      placeholder={t("placeHolder_building_name")}
                      name="name"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("building_description")}
                      placeholder={t("placeHolder_building_description")}
                      name="description"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 256))
                      }
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("building_location")}
                      placeholder={t("placeHolder_building_location")}
                      name="location"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
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

export default AddDharmshalaForm;
