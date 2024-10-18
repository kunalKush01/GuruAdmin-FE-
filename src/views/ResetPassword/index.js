import InputPasswordToggle from "@components/input-password-toggle";
import { formatIsoTimeString } from "@fullcalendar/core";
import { useSkin } from "@hooks/useSkin";
import "@styles/react/pages/page-authentication.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ErrorMessage, Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { Facebook, GitHub, Lock, Mail, Twitter, User } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  CardText,
  CardTitle,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import styled from "styled-components";
import * as Yup from "yup";
import { forgotPassword, resetPassword } from "../../api/forgotPassword";
import { loginPage } from "../../api/loginPageApi";
import passwordEyeIcon from "../../assets/images/icons/signInIcon/Icon awesome-eye.svg";
import backIconIcon from "../../assets/images/icons/signInIcon/backIcon.svg";
import emailInputIcon from "../../assets/images/icons/signInIcon/email.svg";
import hidePassIcon from "../../assets/images/icons/signInIcon/hidePassIcon.svg";
import placeholderImage from "../../assets/images/pages/placeholder.webp";

import { login } from "../../redux/authSlice";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import "../../assets/scss/viewCommon.scss";
const ResetPassWord = () => {
  const history = useHistory();

  const handleResetPassword = (values) => {
    return resetPassword(values);
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
  const loginSchema = Yup.object().shape({
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
  const forgetPasswordSchema = Yup.object().shape({
    email: Yup.string().required().min(5),
  });

  const { skin } = useSkin();

  // const illustration = skin === "dark" ? "login-v2-dark.svg" : "login.svg",
  //   const illustration = skin === "dark" ? "login-v2-dark.svg" : "main-logo.png",
  //     source = require(`@src/assets/images/pages/${illustration}`).default;
  const [loading, setLoading] = useState(false);

  const searchParams = new URLSearchParams(history?.location?.search);

  const currentToken = searchParams.get("token");

  const hostname = location.hostname;
  const subdomainChange = process.env.REACT_APP_ADMIN_SUBDOMAIN_REPLACE_URL;
  //const subDomainName = hostname.replace(subdomainChange, "");
  const subDomainName = hostname.replace("-dev.localhost", "");

  const loginPageQuery = useQuery([subDomainName], () =>
    loginPage(subDomainName)
  );

  const loginPageData = useMemo(
    () => loginPageQuery?.data?.result ?? {},
    [loginPageQuery]
  );

  const source = placeholderImage;

  return (
    <div className="loginwrapper auth-wrapper auth-cover">
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
          <Col
            className="px-xl-2 mx-auto"
            xs="12"
            sm="8"
            md="6"
            lg="12"
            style={{
              backgroundColor: "#FCF5E7",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              className="logo-container"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src="/static/media/main-logo.90679d22e72add629886.png"
                alt="Logo"
                style={{
                  maxWidth: "200px", // Set a specific width
                  height: "auto",
                  marginLeft: "0", // Ensure no left margin
                  marginRight: "0",
                  marginBottom: "20px", // Ensure no right margin
                }}
              />
            </div>
            <img
              src={backIconIcon}
              onClick={() => history.push("/login")}
              className="my-1 signInIcons"
            />
            {<CardTitle className="fw-bold mb-0 ">Reset Password</CardTitle>}

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
              Enter the New and confirm password to reset the password.
            </CardText>
            <Formik
              enableReinitialize
              initialValues={{
                password: "",
                confirmPassword: "",
              }}
              validationSchema={loginSchema}
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
                <Form
                  className="auth-login-form mt-3"
                  // onSubmit={(e) => e.preventDefault()}
                >
                  <div className="mb-1">
                    {/* <Label className="form-label" for="login-email">
                  Email
                </Label> */}

                    <InputPasswordToggle
                      className="input-group-merge"
                      name="password"
                      inputClassName="signInputField p-0 border-top-0 border-end-0 border-start-0"
                      id="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      placeholder={"Enter Password"}
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
                      {/* <Label className="form-label" for="login-password">
                    Password
                  </Label> */}
                      <InputPasswordToggle
                        className="input-group-merge"
                        name="confirmPassword"
                        inputClassName="signInputField p-0 border-top-0 border-end-0 border-start-0"
                        id="confirmPassword"
                        placeholder={"Enter Confirm Password"}
                        value={formik.values.confirmPassword}
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
                        <ErrorMessage name="confirmPassword" />
                      </div>

                      {/* <div className="forgetPassword">
                          <span
                            onClick={() => setForgotPassWordActive(true)}
                            className="cursor-pointer"
                          >
                            Forgot Password?
                          </span>
                        </div> */}
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
                        Reset Password
                      </Button>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
            {/* <p className="text-center mt-5 ">
                <span className="me-25  an_account ">
                  Don't Have an account ?{" "}
                </span>

                <span className="text-primary signUp cursor-pointer">
                  <a href="https://am-website-dev.paridhan.app/#home">
                    Sign Up
                  </a>
                </span>
              </p> */}
            {/* <div className="divider my-2">
              <div className="divider-text">or</div>
            </div>
            <div className="auth-footer-btn d-flex justify-content-center">
              <Button color="facebook">
                <Facebook size={14} />
              </Button>
              <Button color="twitter">
                <Twitter size={14} />
              </Button>
              <Button color="google">
                <Mail size={14} />
              </Button>
              <Button className="me-0" color="github">
                <GitHub size={14} />
              </Button>
            </div> */}
          </Col>
          {/* ) : (
            <Col className="px-xl-2 mx-auto " sm="8" md="6" lg="12">
              <img
                src={backIconIcon}
                onClick={() => setForgotPassWordActive(false)}
                className="my-1 signInIcons"
              />
              {<CardTitle className="fw-bold  mb-0  ">Email Address</CardTitle>}
              <CardText className="signInEnterUserNAme  ">
                We need to send verification link to authenticate your email
                address.
              </CardText>
              <Formik
                initialValues={{
                  email: "",
                }}
                onSubmit={(e) => {
                  setLoading(true);
                  return resetPasswordMutation.mutate({
                    email:e?.email
                  })
                }}
                validationSchema={forgetPasswordSchema}
              >
                {(formik) => (
                  <Form className="auth-login-form mt-2">
                    <div className="mb-1">
                      <Label className="form-label" for="login-email">
                  Email
                </Label>

                      <InputGroup className="input-group-merge ">
                        <InputGroupText className="border-top-0  p-0 border-end-0 border-start-0 ">
                          <img className="signInIcons" src={emailInputIcon} />
                        </InputGroupText>
                        <Input
                          className=" signInputField border-top-0 border-end-0 border-start-0 p-0 "
                          type="text"
                          name="email"
                          id="nameIcons"
                          placeholder="Enter Address"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                        />
                      </InputGroup>
                      <div className="errorMassage text-primary">
                        <ErrorMessage name="email" />
                      </div>
                    </div>

                    <div className="form-check mb-1">
                <Input type="checkbox" id="remember-me" />
                <Label className="form-check-label" for="remember-me">
                  Remember Me
                </Label>
              </div>
                    <div className="d-flex w-100 justify-content-center py-4 ">
                      {loading ? (
                        <Button type="submit" color="primary" className=""
                        style={{
                          padding:".5rem 4rem"
                        }}
                        >
                          <Spinner style={{height:"2rem", width:"2rem"}} />
                        </Button>
                      ) : (
                        <Button type="submit" color="primary" className="px-5">
                          Next
                        </Button>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
              <p className="text-center mt-2">
              <span className="me-25 an_account ">
                Don't Have an account ?{" "}
              </span>
              <Link to="/pages/register-cover">
                <span>Sign Up</span>
              </Link>
            </p>
              <div className="divider my-2">
              <div className="divider-text">or</div>
            </div>
            <div className="auth-footer-btn d-flex justify-content-center">
              <Button color="facebook">
                <Facebook size={14} />
              </Button>
              <Button color="twitter">
                <Twitter size={14} />
              </Button>
              <Button color="google">
                <Mail size={14} />
              </Button>
              <Button className="me-0" color="github">
                <GitHub size={14} />
              </Button>
            </div>
            </Col>
          )} */}
        </Col>
      </Row>
    </div>
  );
};

export default ResetPassWord;
