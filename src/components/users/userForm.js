import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import CustomTextField from "../partials/customTextField";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import defaultAvtar from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
const FormWaraper = styled.div`
  .FormikWraper {
    padding: 40px;
  }
  .btn-Published {
    text-align: center;
  }
  .addNotice-btn {
    padding: 8px 20px;
    margin-left: 10px;
    margin-top: 5rem;
    font: normal normal bold 15px/20px noto sans;
  }
  .newsContent {
    margin-top: 1rem;
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .filterPeriod {
    color: #ff8744;

    font: normal normal bold 13px/5px noto sans;
  }
`;

export default function UserForm({
  plusIconDisable = false,
  loadOptions,
  handleSubmit,
  vailidationSchema,
  initialValues,
  userRole,
  showTimeInput,
  buttonName = "",
  ...props
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const categoryQuerClient = useQueryClient();

  const categoryMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        categoryQuerClient.invalidateQueries(["Users"]);
        setLoading(false);
        history.push("/configuration/users");
      } else if (data.error) {
        setLoading(false);
      }
    },
  });
  return (
    <FormWaraper className="FormikWraper">
      <Formik
        // enableReinitialize
        initialValues={{ ...initialValues }}
        onSubmit={(e) => {
          setLoading(true);
          console.log("cateFormSubmit=", e);
          categoryMutation.mutate({
            email: e.email,
            mobileNumber: e.mobile,
            roleId: e?.role?.id,
            name: e.name,
          });
        }}
        validationSchema={vailidationSchema}
      >
        {(formik) => (
          <Form>
            <Row>
              <Col xs={12} className=" mt-2 ps-0 d-flex">
                <div className=" me-3">
                  <img src={defaultAvtar} width={150} className="" />
                </div>
                <Row className=" w-100 mt-3">
                  <Col xs={10}>
                    <Row>
                      <Col xs={4}>
                        <CustomTextField
                          label={t("user_name")}
                          name="name"
                          autoFocus
                        />
                      </Col>
                      <Col xs={4}>
                        <CustomTextField
                          label={t("dashboard_Recent_DonorNumber")}
                          name="mobile"
                          type="number"
                          pattern="[6789][0-9]{9}"
                          onInput={(e) =>
                            (e.target.value = e.target.value.slice(0, 12))
                          }
                          required
                        />
                      </Col>
                      <Col xs={4}>
                        <CustomTextField
                          label={t("subscribed_user_email")}
                          name="email"
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={4} className="mt-1">
                    <FormikCustomReactSelect
                      width={"100%"}
                      name={userRole}
                      loadOptions={loadOptions}
                      defaultValue={formik?.values?.role}
                      labelKey={"name"}
                      valueKey={"id"}
                      labelName={t("User Role")}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <div className="btn-Published ">
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
