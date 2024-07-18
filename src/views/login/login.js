import InputPasswordToggle from "@components/input-password-toggle";
import { useSkin } from "@hooks/useSkin";
import "@styles/react/pages/page-authentication.scss";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ErrorMessage, Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
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
import styled from "styled-components";
import * as Yup from "yup";
import { forgotPassword } from "../../api/forgotPassword";
import { checkUserTrust, loginPage } from "../../api/loginPageApi";
import passwordEyeIcon from "../../assets/images/icons/signInIcon/Icon awesome-eye.svg";
import backIconIcon from "../../assets/images/icons/signInIcon/backIcon.svg";
import emailInputIcon from "../../assets/images/icons/signInIcon/email.svg";
import hidePassIcon from "../../assets/images/icons/signInIcon/hidePassIcon.svg";
import {
  handleTokenLogin,
  handleTrustDetail,
  login,
} from "../../redux/authSlice";
import {
  ConverFirstLatterToCapital,
  getCookie,
  setCookieWithMainDomain,
} from "../../utility/formater";
import {
  defaultHeaders,
  refreshTokenRequest,
} from "../../utility/utils/callApi";
import TrustListModal from "./TrustListModal";
import { cattleHeader } from "../../utility/subHeaderContent/cattleHeader";
import '../../styles/viewCommon.scss';;
;

const LoginCover = () => {
  const { isLogged, userDetail, trustDetail } = useSelector(
    (state) => state.auth
  );
  const history = useHistory();
  const dispatch = useDispatch();
  const [forgotPassWordActive, setForgotPassWordActive] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [modal, setModal] = useState(false);
  const [userTrustList, setUserTrustList] = useState([]);
  const hostname = location.hostname;

  const adminUrl = process.env.REACT_APP_ADMIN_URL;
  const subdomainChange = process.env.REACT_APP_ADMIN_SUBDOMAIN_REPLACE_URL;
  const mainDomain = process.env.REACT_APP_DOMAIN;
  const genericSubDomain = process.env.REACT_APP_GENERIC_SUB_DOMAIN;

  const handleLoginSubmit = (data) => {
    dispatch(
      login({
        data: data,
        onCallback: () => {
          setLoadingLogin(false);
        },
      })
    )
      .unwrap()
      .then(async (res) => {
        if (hostname === adminUrl) {
          const TrustsList = await checkUserTrust({ userId: res?.result?.id });
          setUserTrustList(TrustsList?.results);

          if (res?.tokens?.access?.token && res?.tokens?.refresh?.token) {
            setCookieWithMainDomain(
              "refreshToken",
              res?.tokens?.refresh?.token,
              mainDomain
            );
            setCookieWithMainDomain(
              "accessToken",
              res?.tokens?.access?.token,
              mainDomain
            );
            if (
              TrustsList?.results?.length > 1 &&
              res?.tokens?.access?.token &&
              res?.tokens?.refresh?.token
            ) {
              setModal(true);
              localStorage.setItem("trustModal", true);
            } else if (
              TrustsList?.results?.length === 1 &&
              TrustsList?.results[0]?.isAproved !== "approved"
            ) {
              toast.error("Your trust not approved");
            } else if (
              TrustsList?.results?.length === 1 &&
              TrustsList?.results[0]?.isAproved === "approved"
            ) {
              dispatch(handleTrustDetail(TrustsList?.results[0]));
              localStorage.setItem("trustId", TrustsList?.results[0]?.id);
              localStorage.setItem(
                "trustType",
                TrustsList?.results[0]?.typeId?.name
              );

              if (res?.tokens?.access?.token && res?.tokens?.refresh?.token) {
                window.location.replace(
                  `${process.env.REACT_APP_INTERNET_PROTOCOL}://${TrustsList?.results[0]?.subDomain}${subdomainChange}/login`
                );
              }
            }
          }
        }

        return res;
      });
  };

  const handleForgetPassword = (values) => {
    return forgotPassword(values);
  };

  const resetPasswordMutation = useMutation({
    mutationFn: handleForgetPassword,
    onSuccess: (data) => {
      if (!data.error) {
        setLoading(false);
        setForgotPassWordActive(false);
      } else if (data.error) {
        setLoading(false);
      }
    },
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

  const permissions = useSelector(
    (state) => state.auth?.userDetail?.permissions
  );

  const loginPath = permissions?.map((item) => item?.name);
  console.log("loginPath", loginPath);
  let subDomainName;
  if (hostname !== adminUrl) {
    subDomainName = hostname.replace(subdomainChange, "");
  } else {
    subDomainName = hostname.replace(
      process.env.REACT_APP_GENERIC_ADMIN_SUBDOMAIN_REPLACE_URL,
      ""
    );
  }

  const refreshToken = getCookie("refreshToken");
  const accessToken = getCookie("accessToken");

  const loginPageQuery = useQuery([subDomainName], () =>
    loginPage(subDomainName)
  );

  const loginPageData = useMemo(() => {
    dispatch(handleTrustDetail(loginPageQuery?.data?.result));
    return loginPageQuery?.data?.result;
  }, [loginPageQuery]);

  localStorage.setItem("trustId", loginPageQuery?.data?.result?.id),
    localStorage.setItem(
      "trustType",
      loginPageQuery?.data?.result?.typeId?.name
    ),
    useEffect(() => {
      if (hostname !== adminUrl && loginPageQuery?.data?.error) {
        history.push("/not-found");
      } else if (
        isLogged &&
        loginPath?.includes("all") &&
        subDomainName !== genericSubDomain
      ) {
        localStorage.setItem("trustModal", false);
        history.push("/dashboard");
      } else if (
        isLogged &&
        loginPath?.length &&
        loginPath[0] === "configuration" &&
        subDomainName !== genericSubDomain
      ) {
        localStorage.setItem("trustModal", false);
        history.push(`/configuration/categories`);
      } else if (
        isLogged &&
        loginPath?.length &&
        loginPath[0]?.startsWith("cattle") &&
        subDomainName !== genericSubDomain
      ) {
        const redirectTo = cattleHeader()?.find((item) =>
          item?.permissionKey?.includes(loginPath[0])
        );
        localStorage.setItem("trustModal", false);
        history.push(redirectTo?.url);
      } else if (
        (isLogged || loginPath?.length) &&
        subDomainName !== genericSubDomain
      ) {
        localStorage.setItem("trustModal", false);
        history.push(`/${loginPath[0]}`);
      }
    }, [isLogged, loginPath, loginPageQuery]);

  const { skin } = useSkin();

  const illustration = skin === "dark" ? "login-v2-dark.svg" : "main-logo.png",
    source = require(`@src/assets/images/pages/${illustration}`).default;

  const headers = {
    ...defaultHeaders,
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
      }
    }
  }, [refreshToken]);

  const [loading, setLoading] = useState(false);

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
          {!forgotPassWordActive ? (
            <Col className="px-xl-2 mx-auto" xs="12" sm="8" md="6" lg="12">
              {<CardTitle className="fw-bold mb-2 ">Sign In</CardTitle>}
              {loginPageData && loginPageData?.name !== "" && (
                <p className="templeName">
                  Admin:{" "}
                  <span
                    title={ConverFirstLatterToCapital(
                      loginPageData?.name ?? ""
                    )}
                  >
                    {ConverFirstLatterToCapital(loginPageData?.name ?? "")}
                  </span>
                </p>
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
                onSubmit={(data) => {
                  setLoadingLogin(true);
                  handleLoginSubmit(data);
                }}
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
                          className=""
                          style={{
                            padding: ".5rem 4rem",
                          }}
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
              {/* <p className="text-center mt-5 ">
               {/* <p className="text-center mt-5 ">
                <span className="me-25  an_account ">
                  Don't have an account ?{" "}
                </span>

                <span className="text-primary signUp cursor-pointer">
                  <a href="https://apnadharm.com/#home">Sign Up</a>
                </span>
              </p> */}
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
            </Col>
          )}
        </Col>
      </Row>
      {/* {refreshToken && accessToken && ( */}
      <TrustListModal
        modal={modal}
        setModal={setModal}
        trustArray={userTrustList}
        rToken={refreshToken}
        aToken={accessToken}
      />
      {/* )} */}
    </div>
  );
};

export default LoginCover;
