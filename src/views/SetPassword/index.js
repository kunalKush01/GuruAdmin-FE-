import InputPasswordToggle from "@components/input-password-toggle";
import { useSkin } from "@hooks/useSkin";
import "@styles/react/pages/page-authentication.scss";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Form, Formik } from "formik";
import { useMemo, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, CardText, CardTitle, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import * as Yup from "yup";
import { setPassword } from "../../api/forgotPassword";
import { loginPage } from "../../api/loginPageApi";
import passwordEyeIcon from "../../assets/images/icons/signInIcon/Icon awesome-eye.svg";
import backIconIcon from "../../assets/images/icons/signInIcon/backIcon.svg";
import hidePassIcon from "../../assets/images/icons/signInIcon/hidePassIcon.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import "../../assets/scss/viewCommon.scss";

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
        history.push("/login");
      } else if (data.error) {
        setLoading(false);
      }
    },
  });
  const setPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required.")
      .matches(
        /^(?=.*[!@#$%^&*()-_+=|{}[\]:;'"<>,.?/~`])(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{8,}$/,
        "Password must contain at least one special character, one number, one capital letter, and one small letter"
      )
      .min(8, "Password is too short - should be 8 chars minimum."),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });
  const { skin } = useSkin();

  const illustration = skin === "dark" ? "login-v2-dark.svg" : "main-logo.png",
    source = require(`@src/assets/images/pages/${illustration}`).default;
  const [loading, setLoading] = useState(false);

  const searchParams = new URLSearchParams(history.location.search);
  const currentToken = searchParams.get("token");

  const hostname = location.hostname;

  const subdomainChange = process.env.REACT_APP_ADMIN_SUBDOMAIN_REPLACE_URL;
  const subDomainName = hostname.replace(subdomainChange, "");
  // const subDomainName = hostname.replace("-dev.localhost", "");

  const loginPageQuery = useQuery([subDomainName], () =>
    loginPage(subDomainName)
  );

  const loginPageData = useMemo(
    () => loginPageQuery?.data?.result ?? {},
    [loginPageQuery]
  );
  return (
    <div className="setpasswordwrapper auth-wrapper auth-cover">
      <Row className="auth-inner m-0 defaultFontColor">
        {/* <Link
          className=" d-inline brand-logo"
          to="/"
          onClick={(e) => e.preventDefault()}
        >
          <h1 className="brand-text  mt-2 ms-1">Your Logo</h1>
        </Link> */}
        <Col
          className="d-none  d-lg-flex pe-0 ps-0 align-items-center  h-100 "
          lg="7"
          sm="12"
        >
          <div className="w-100 h-100 d-lg-flex align-items-center justify-content-center loginBackground">
            <img
              className={`img-fluid w-100 ${
                (loginPageData && loginPageData?.profilePhoto !== "") ||
                loginPageData?.profilePhoto
                  ? "h-100"
                  : ""
              }`}
              src={
                (loginPageData && loginPageData?.profilePhoto !== "") ||
                loginPageData?.profilePhoto
                  ? loginPageData?.profilePhoto
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
          <Col className="px-xl-2 mx-auto" xs="12" sm="8" md="6" lg="12">
            <img
              src={backIconIcon}
              onClick={() => history.push("/login")}
              className="my-1 signInIcons"
            />
            {<CardTitle className="fw-bold mb-0 ">Set Password</CardTitle>}
            {loginPageData?.name !== "" && (
              <div className="templeName">
                Admin:{" "}
                <span
                  title={ConverFirstLatterToCapital(loginPageData?.name ?? "")}
                >
                  {ConverFirstLatterToCapital(loginPageData?.name ?? "")}
                </span>
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
    </div>
  );
};

export default SetPassword;
