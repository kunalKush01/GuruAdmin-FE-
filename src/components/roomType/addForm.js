import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import { toast } from "react-toastify";
import CustomTextField from "../partials/customTextField";
import "../../assets/scss/common.scss";

const AddRoomTypeForm = ({
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
        queryClient.invalidateQueries(["roomTypeList"]);
        setLoading(false);
        history.push(`/roomtype/info`);
        toast.success(t("roomtype_added_successfully"));
      } else if (data?.error) {
        setLoading(false);
        const errorMessage = typeof data.error === 'string' ? data.error : t("A room type with this name already exists in the Dharmshala");
        toast.error(t(errorMessage));
      }
    },
    onError: (error) => {
      setLoading(false);
      const errorMessage = error.message || t("A room type with this name already exists in the Dharmshala.");
      toast.error(t(errorMessage));
    },
  });

  const handleFormSubmit = (values, { setFieldError }) => {
    setLoading(true);
    setShowPrompt(false);
    const { ...formValues } = values;
    const data = {
      ...formValues,
    };
    mutation.mutate(data, {
      onError: (error) => {
        const errorMessage = error.message || t("A room type with this name already exists in the Dharmshala.");
        if (errorMessage.toLowerCase().includes("duplicate")) {
          setFieldError("name", t("A room type with this name already exists in the Dharmshala"));
          toast.error(t("A room type with this name already exists in the Dharmshala."));
        } else {
          toast.error(t(errorMessage));
        }
      },
    });
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
                <Row>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("roomtype_name")}
                      placeholder={t("placeHolder_dharmshala_roomtype_name")}
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
                      label={t("dharmshala_roomtype_description")}
                      placeholder={t(
                        "placeHolder_dharmshala_roomtype_description"
                      )}
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
                      label={t("dharmshala_roomtype_capacity")}
                      placeholder={t(
                        "placeHolder_dharmshala_roomtype_capacity"
                      )}
                      name="capacity"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("dharmshala_roomtype_price")}
                      placeholder={t("placeHolder_dharmshala_roomtype_price")}
                      name="price"
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

export default AddRoomTypeForm;