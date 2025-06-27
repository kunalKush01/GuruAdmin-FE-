import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  CardText,
  CardTitle,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Row,
  Spinner,
} from "reactstrap";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";

import InputPasswordToggle from "@components/input-password-toggle";
import "@styles/react/pages/page-authentication.scss";

import passwordEyeIcon from "../../assets/images/icons/signInIcon/Icon awesome-eye.svg";
import backIconIcon from "../../assets/images/icons/signInIcon/backIcon.svg";
import emailInputIcon from "../../assets/images/icons/signInIcon/email.svg";
import hidePassIcon from "../../assets/images/icons/signInIcon/hidePassIcon.svg";
import placeholderImage from "../../assets/images/pages/placeholder.webp";

import { login } from "../../redux/authSlice";
import { forgotPassword } from "../../api/forgotPassword";

const LoginCover = () => {
  const { isLogged } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [forgotPassWordActive, setForgotPassWordActive] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (isLogged) {
  //     navigate("/dashboard");
  //   }
  // }, [isLogged]);

  const handleLoginSubmit = (data) => {
    setLoadingLogin(true);

    dispatch(
      login({
        data,
        onCallback: (success) => {
          setLoadingLogin(false);
          if (success) {
            toast.success("Login successful");
            navigate("/dashboard");
          } else {
            toast.error("Login failed");
          }
        },
      })
    );
  };

  const handleForgetPassword = async (values) => {
    try {
      setLoading(true);
      await forgotPassword(values);
      toast.success("Reset link sent to your email");
      setForgotPassWordActive(false);
    } catch {
      toast.error("Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordMutation = useMutation({
    mutationFn: handleForgetPassword,
  });

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid Email.")
      .required("Email is required.")
      .min(5),
    password: Yup.string().required("Password is required."),
  });

  const forgetPasswordSchema = Yup.object().shape({
    email: Yup.string().required("Email is required.").min(5),
  });

  const source = placeholderImage;

  return (
    <div className="loginwrapper auth-wrapper auth-cover">
      <Row className="auth-inner m-0 defaultFontColor">
        <Col
          className="d-none  d-lg-flex pe-0 ps-0 align-items-center  h-100 "
          lg="7"
          sm="12"
        >
          <div className="w-100 h-100 d-lg-flex align-items-center justify-content-center loginBackground">
            <img
              className="img-fluid w-100 h-100"
              src={source}
              alt="Login Cover"
            />
          </div>
        </Col>
        <Col
          className="d-flex justify-content-center align-items-center h-100 auth-bg p-5 "
          lg="5"
          sm="12"
        >
          {!forgotPassWordActive ? (
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
                    maxWidth: "200px",
                    height: "auto",
                    marginBottom: "20px",
                  }}
                />
              </div>

              <CardText className="signInEnterUserNAme">
                Enter Email and Password in order to sign in to your account
              </CardText>
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={loginSchema}
                onSubmit={handleLoginSubmit}
              >
                {(formik) => (
                  <Form className="auth-login-form mt-3">
                    <div className="mb-1">
                      <InputGroup className="input-group-merge">
                        <InputGroupText className="border-top-0  p-0 border-end-0 border-start-0 ">
                          <img className="signInIcons" src={emailInputIcon} />
                        </InputGroupText>
                        <Input
                          className=" signInputField border-top-0 border-end-0 border-start-0 p-0 "
                          type="text"
                          name="email"
                          placeholder="Enter Email Address"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                        />
                      </InputGroup>
                      <div className="errorMassage text-primary">
                        <ErrorMessage name="email" />
                      </div>
                    </div>
                    <div className="">
                      <div className="d-flex flex-column justify-content-between">
                        <InputPasswordToggle
                          className="input-group-merge"
                          name="password"
                          placeholder={"Enter Password"}
                          inputClassName="signInputField p-0 border-top-0 border-end-0 border-start-0"
                          id="login-password"
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          iconClassName="signInIcons"
                          hideIcon={
                            <img className="signInIcons" src={hidePassIcon} />
                          }
                          showIcon={
                            <img
                              className="signInIcons"
                              src={passwordEyeIcon}
                            />
                          }
                        />
                        <div className="errorMassage text-primary">
                          <ErrorMessage name="password" />
                        </div>

                        <div className="forgetPassword">
                          <span
                            onClick={() => setForgotPassWordActive(true)}
                            className="cursor-pointer"
                          >
                            Forgot Password?
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex w-100 justify-content-center  ">
                      {loadingLogin ? (
                        <Button
                          type="submit"
                          color="primary"
                          style={{ padding: ".5rem 4rem" }}
                        >
                          <Spinner style={{ height: "2rem", width: "2rem" }} />
                        </Button>
                      ) : (
                        <Button type="submit" color="primary" className="px-5">
                          Sign In
                        </Button>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
            </Col>
          ) : (
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
                    maxWidth: "200px",
                    height: "auto",
                    marginBottom: "20px",
                  }}
                />
              </div>
              <img
                src={backIconIcon}
                onClick={() => setForgotPassWordActive(false)}
                className="my-1 signInIcons"
              />
              <CardTitle className="fw-bold  mb-0  ">Email Address</CardTitle>
              <CardText className="signInEnterUserNAme">
                We need to send verification link to authenticate your email
                address.
              </CardText>
              <Formik
                initialValues={{ email: "" }}
                onSubmit={(e) => {
                  setLoading(true);
                  return resetPasswordMutation.mutate({ email: e?.email });
                }}
                validationSchema={forgetPasswordSchema}
              >
                {(formik) => (
                  <Form className="auth-login-form mt-2">
                    <div className="mb-1">
                      <InputGroup className="input-group-merge ">
                        <InputGroupText className="border-top-0  p-0 border-end-0 border-start-0 ">
                          <img className="signInIcons" src={emailInputIcon} />
                        </InputGroupText>
                        <Input
                          className=" signInputField border-top-0 border-end-0 border-start-0 p-0 "
                          type="text"
                          name="email"
                          placeholder="Enter Address"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                        />
                      </InputGroup>
                      <div className="errorMassage text-primary">
                        <ErrorMessage name="email" />
                      </div>
                    </div>
                    <div className="d-flex w-100 justify-content-center py-4 ">
                      {loading ? (
                        <Button
                          type="submit"
                          color="primary"
                          style={{ padding: ".5rem 4rem" }}
                        >
                          <Spinner style={{ height: "2rem", width: "2rem" }} />
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
            </Col>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default LoginCover;
