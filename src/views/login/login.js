import InputPasswordToggle from "@components/input-password-toggle";
import { useSkin } from "@hooks/useSkin";
import "@styles/react/pages/page-authentication.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ErrorMessage, Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
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
import styled from "styled-components";
import * as yup from "yup";
import { forgotPassword } from "../../api/forgotPassword";
import { loginPage } from "../../api/loginPageApi";
import backIconIcon from "../../assets/images/icons/signInIcon/backIcon.svg";
import emailInputIcon from "../../assets/images/icons/signInIcon/email.svg";
import hidePassIcon from "../../assets/images/icons/signInIcon/hidePassIcon.svg";
import passwordEyeIcon from "../../assets/images/icons/signInIcon/Icon awesome-eye.svg";
import { handleTokenLogin, login } from "../../redux/authSlice";
import {
  defaultHeaders,
  refreshTokenRequest,
} from "../../utility/utils/callApi";
const LoginCover = () => {
  const { isLogged } = useSelector((state) => state.auth);
  const history = useHistory();
  const dispatch = useDispatch();
  const [forgotPassWordActive, setForgotPassWordActive] = useState(false);

  const handleLoginSubmit = (data) => {
    dispatch(login(data));
  };

  const handleForgetPassword = (values) => {
    return forgotPassword(values);
  };

  console.log("searchParams--------->", location.hostname);

  const forgetPasswordQueryClient = useQueryClient();
  const resetPasswordMutation = useMutation({
    mutationFn: handleForgetPassword,
    onSuccess: (data) => {
      if (!data.error) {
        setLoading(false);
        setForgotPassWordActive(false)
      } else if (data.error) {
        setLoading(false);
      }
    },
  });
  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid Email.")
      .required("Email is required.")
      .min(5),
    password: yup.string().required("Password is required."),
  });
  const forgetPasswordSchema = yup.object().shape({
    email: yup.string().required().min(5),
  });
  const LoginWarraper = styled.div`
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
    .templeName {
      font: normal normal 600 23px/43px Noto Sans;
    }
    .loginBackground {
      background: #fff7e8;
    }
  `;
  const permissions = useSelector(
    (state) => state.auth?.userDetail?.permissions
  );
  const loginPath = permissions?.map((item) => item?.name);
  console.log("withoutAll", loginPath);
  useEffect(() => {
    if (isLogged && loginPath?.includes("all")) {
      history.push("/dashboard");
    } else if (isLogged && (loginPath?.length && loginPath[0] === "configuration")) {
      history.push(`/configuration/categories`);
    } else if (isLogged || loginPath?.length) {
      history.push(`/${loginPath[0]}`);
    }
  }, [isLogged, loginPath]);

  const hostname = location.hostname;
  const subDomainName = hostname.split(".", [1]);
  const loginPageQuery = useQuery([subDomainName], () =>
    loginPage(subDomainName)
  );

  const loginPageData = useMemo(
    () => loginPageQuery?.data?.result ?? {},
    [loginPageQuery]
  );

  console.log("loginPageData-------------->", loginPageData);

  // useEffect(() => {
  //   isLogged ? history.push("/dashboard") : "";
  // }, [isLogged]);

  const { skin } = useSkin();

  const illustration = skin === "dark" ? "login-v2-dark.svg" : "login.svg",
    source = require(`@src/assets/images/pages/${illustration}`).default;

  const refreshToken = new URLSearchParams(history.location.search)?.get(
    "rtoken"
  );
  const accessToken = new URLSearchParams(history.location.search)?.get(
    "atoken"
  );

  console.log("refreshToken----->", refreshToken);

  const headers = {
    ...defaultHeaders,
    // 'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
  const axiosInstance = axios.create({
    headers,
    responseType: "json",
  });

  useEffect(async () => {
    if (refreshToken) {
      const res = await refreshTokenRequest({ refreshToken, axiosInstance });
      if (!res.error) {
        dispatch(handleTokenLogin(res));
        console.log("res--------->", res);
      }
    }
  }, [refreshToken]);

  const [loading, setLoading] = useState(false);
  return (
    <LoginWarraper className="auth-wrapper auth-cover ">
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
          {!forgotPassWordActive ? (
            <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
              {<CardTitle className="fw-bold mb-2 ">Sign In</CardTitle>}

              {loginPageData?.name !== "" && (
                <div className="templeName">
                  Admin: <span>{loginPageData?.name}</span>
                </div>
              )}

              <CardText className="signInEnterUserNAme">
                Enter Email and Password in order to sign in to your account
              </CardText>
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                }}
                validationSchema={loginSchema}
                onSubmit={handleLoginSubmit}
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
                      <InputGroup className="input-group-merge">
                        <InputGroupText className="border-top-0  p-0 border-end-0 border-start-0 ">
                          <img className="signInIcons" src={emailInputIcon} />
                        </InputGroupText>
                        <Input
                          className=" signInputField border-top-0 border-end-0 border-start-0 p-0 "
                          type="text"
                          name="email"
                          id="nameIcons"
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
                        {/* <Label className="form-label" for="login-password">
                    Password
                  </Label> */}
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
                            <img
                              className="signInIcons"
                              src={hidePassIcon}
                            />
                          }
                          showIcon={
                            <img className="signInIcons" src={passwordEyeIcon} />
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
                    {/* <div className="form-check mb-1">
                <Input type="checkbox" id="remember-me" />
                <Label className="form-check-label" for="remember-me">
                  Remember Me
                </Label>
              </div> */}
                    <div className="d-flex w-100 justify-content-center  ">
                      <Button type="submit" color="primary" className="px-5">
                        Sign In
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
              <p className="text-center mt-5 ">
                <span className="me-25  an_account ">
                  Don't Have an account ?{" "}
                </span>

                <span className="text-primary signUp cursor-pointer">
                  <a href="https://am-website-dev.paridhan.app/#home">
                    Sign Up
                  </a>
                </span>
              </p>
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
          ) : (
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
                    email: e?.email,
                  });
                }}
                validationSchema={forgetPasswordSchema}
              >
                {(formik) => (
                  <Form className="auth-login-form mt-2">
                    <div className="mb-1">
                      {/* <Label className="form-label" for="login-email">
                  Email
                </Label> */}

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

                    {/* <div className="form-check mb-1">
                <Input type="checkbox" id="remember-me" />
                <Label className="form-check-label" for="remember-me">
                  Remember Me
                </Label>
              </div> */}
                    <div className="d-flex w-100 justify-content-center py-4 ">
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
                        <Button type="submit" color="primary" className="px-5">
                          Next
                        </Button>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
              {/* <p className="text-center mt-2">
              <span className="me-25 an_account ">
                Don't Have an account ?{" "}
              </span>
              <Link to="/pages/register-cover">
                <span>Sign Up</span>
              </Link>
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
          )}
        </Col>
      </Row>
    </LoginWarraper>
  );
};

export default LoginCover;
