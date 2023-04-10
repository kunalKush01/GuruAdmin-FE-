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
  plusIconDisable = false,
  loadOptions,
  handleSubmit,
  vailidationSchema,
  initialValues,
  showTimeInput,
  addDonationUser,
  buttonName = "",
  ...props
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);


  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get('page')
  const currentCategory = searchParams.get("category");
  const currentSubCategory = searchParams.get("subCategory");
  const currentFilter = searchParams.get('filter')
  const categoryQuerClient = useQueryClient();

  const categoryMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        addDonationUser
          ? categoryQuerClient.invalidateQueries(["donations"])
          : categoryQuerClient.invalidateQueries(["subscribedUser"]);
        setLoading(false);
        addDonationUser
          ? history.push(`/donation/add?page=${currentPage}&category=${currentCategory}&subCategory=${currentSubCategory}&filter=${currentFilter}`)
          : history.push("/subscribed-user");
      } else if (data?.error) {
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
          categoryMutation.mutate({
            email: e.email,
            mobileNumber: e.mobile.toString(),
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
                    <CustomTextField
                      label={t("user_name")}
                      name="name"
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                      autoFocus
                    />
                  </Col>
                  <Col>
                    <CustomTextField
                      label={t("dashboard_Recent_DonorNumber")}
                      name="mobile"
                      type="number"
                      pattern="[6789][0-9]{9}"
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 12))
                      }
                    />
                  </Col>
                  <Col>
                    <CustomTextField
                      label={t("subscribed_user_email")}
                      name="email"
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <div className="btn-Published  mt-lg-3">
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
    </FormWaraper>
  );
}
