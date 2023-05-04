import InputPasswordToggle from "@components/input-password-toggle";
import { useSkin } from "@hooks/useSkin";
import "@styles/react/pages/page-authentication.scss";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Form, Formik } from "formik";
import { useMemo, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, CardText, CardTitle, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import * as yup from "yup";
import { setPassword } from "../../api/forgotPassword";
import backIconIcon from "../../assets/images/icons/signInIcon/backIcon.svg";
import hidePassIcon from "../../assets/images/icons/signInIcon/hidePassIcon.svg";
import passwordEyeIcon from "../../assets/images/icons/signInIcon/Icon awesome-eye.svg";
import { loginPage } from "../../api/loginPageApi";

const SetPassword = () => {
  const history = useHistory();

  const handleResetPassword = (values) => {
    return setPassword(values);
  };

  const resetPasswordMutation = useMutation({
    mutationFn: handleResetPassword,
    onSuccess: (data) => {
      if (!data.error) {
        setLoading(false);
        history.push("/login")
      } else if (data.error) {
        setLoading(false);
      }
    },
  });
  const setPasswordSchema = yup.object().shape({
    password: yup
      .string()
      .required("Password is required.")
      .min(8, "Password is too short - should be 8 chars minimum."),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  });
  const SetPasswordWarapper = styled.div`
    .errorMassage {
      /* color: #583703 !important; */
      font: normal normal bold 14px/20px noto sans;
    }
    .defaultFontColor {
      color: #583703;
    }
    .an_account {
      font: normal normal normal 16px/25px noto sans;
    }
    .fw-bold {
      font-weight: 800 !important;
      font-size: 35px;
      font-family: noto sans;
    }
    .signInEnterUserNAme {
      font: normal normal normal 18px/25px noto sans;
    }
    .forgetPassword {
      padding: 1rem 0rem;
      text-align: end;
      margin-bottom: 20px;
    }
    .forgetPassword > span {
      font: normal normal bold 16px/20px noto sans;
    }
    .signInIcons {
      width: 30px;
      height: 30px;
      margin-right: 10px;
      cursor: pointer;
    }
    .signInputField {
      color: #583703;
      font: normal normal bold 16px/33px noto sans;
      &::-webkit-input-placeholder {
        /* padding-left: 1rem !important; */
        opacity: 0.3;
        font: normal normal bold 16px/33px noto sans;
        color: #583703 !important;
      }
    }
    .text-end {
      font: normal normal bold 18px/80px noto sans;
    }
    .px-5 {
      font: normal normal bold 20px/20px noto sans;
    }
    .signUp {
      font: normal normal bold 18px/25px noto sans;
    }
    .brand-text {
      color: #583703;
      font: normal normal bold 30px/44px noto sans;
    }
    .brand-logo {
      width: fit-content;
    }
    .loginBackground {
      background: #fff7e8;
    }
    .templeName{
      font: normal normal 600 23px/43px Noto Sans;
    }
  `;

  const { skin } = useSkin();

  const illustration = skin === "dark" ? "login-v2-dark.svg" : "login.svg",
    source = require(`@src/assets/images/pages/${illustration}`).default;
  const [loading, setLoading] = useState(false);

  const searchParams = new URLSearchParams(history.location.search);
  const currentToken = searchParams.get("token");

  const hostname = location.hostname;
  const subDomainName = hostname.split(".", [1]);
  const loginPageQuery = useQuery([subDomainName], () =>
    loginPage(subDomainName)
  );

  const loginPageData = useMemo(
    () => loginPageQuery?.data?.result ?? {},
    [loginPageQuery]
  );
  return (
    <SetPasswordWarapper className="auth-wrapper auth-cover ">
      <Row className="auth-inner m-0 defaultFontColor">
        <Link
          className=" d-inline brand-logo"
          to="/"
          onClick={(e) => e.preventDefault()}
        >
          <h1 className="brand-text  mt-2 ms-1">Your Logo</h1>
        </Link>
        <Col
          className="d-none  d-lg-flex pe-0 ps-0 align-items-center  h-100 "
          lg="7"
          sm="12"
        >
          <div className="w-100 h-100 d-lg-flex align-items-center justify-content-center loginBackground">
            <img
              className="img-fluid w-100 h-100"
              src={
                loginPageData?.image !== "" || loginPageData?.image
                  ? loginPageData?.image
                  : source
              }
              alt="Login Cover"
            />
          </div>
        </Col>
        <Col
          className="d-flex justify-content-center align-items-center h-100 auth-bg p-5 "
          lg="5"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <img
              src={backIconIcon}
              onClick={() => history.push("/login")}
              className="my-1 signInIcons"
            />
            {<CardTitle className="fw-bold mb-0 ">Set Password</CardTitle>}
            {loginPageData?.name !== "" && (
              <div className="templeName">
                Admin: <span>{loginPageData?.name}</span>
              </div>
            )}
            <CardText className="signInEnterUserNAme   ">
              Enter the New and confirm password to set the password.
            </CardText>
            <Formik
              initialValues={{
                password: "",
                confirmPassword: "",
              }}
              validationSchema={setPasswordSchema}
              onSubmit={(e) => {
                setLoading(true);
                return resetPasswordMutation.mutate({
                  password: e?.password,
                  confirmPassword: e?.confirmPassword,
                  token: currentToken,
                });
              }}
            >
              {(formik) => (
                <Form className="auth-login-form mt-3">
                  <div className="mb-1">
                    <InputPasswordToggle
                      className="input-group-merge"
                      name="password"
                      inputClassName="signInputField p-0 border-top-0 border-end-0 border-start-0"
                      id="password"
                      value={formik.values.password}
                      placeholder={"Enter Password"}
                      onChange={formik.handleChange}
                      iconClassName="signInIcons"
                      hideIcon={
                        <img className="signInIcons" src={hidePassIcon} />
                      }
                      showIcon={
                        <img className="signInIcons" src={passwordEyeIcon} />
                      }
                    />
                    <div className="errorMassage text-primary">
                      <ErrorMessage name="password" />
                    </div>
                  </div>
                  <div className="">
                    <div className="d-flex flex-column justify-content-between">
                      <InputPasswordToggle
                        className="input-group-merge"
                        name="confirmPassword"
                        inputClassName="signInputField p-0 border-top-0 border-end-0 border-start-0"
                        id="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        placeholder={"Enter Confirm Password"}
                        iconClassName="signInIcons"
                        hideIcon={
                          <img className="signInIcons" src={hidePassIcon} />
                        }
                        showIcon={
                          <img className="signInIcons" src={passwordEyeIcon} />
                        }
                      />
                      <div className="errorMassage text-primary">
                        <ErrorMessage name="confirmPassword" />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex w-100 justify-content-center my-lg-5 ">
                    {loading ? (
                      <Button
                        type="submit"
                        color="primary"
                        className=""
                        style={{
                          padding: ".5rem 4rem",
                        }}
                      >
                        <Spinner style={{ height: "2rem", width: "2rem" }} />
                      </Button>
                    ) : (
                      <Button type="submit" color="primary" className="px-5 ">
                        Set Password
                      </Button>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </Col>
        </Col>
      </Row>
    </SetPasswordWarapper>
  );
};

export default SetPassword;
