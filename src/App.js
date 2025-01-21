// ** Router Import
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "react-loading-skeleton/dist/skeleton.css";
import { useDispatch, useSelector } from "react-redux";
import configureAmplify from "./AWS/awsPool";
import { authApiInstance } from "./axiosApi/authApiInstans";
import { setAvailableLang } from "./redux/authSlice";
import Router from "./router/Router";
import { disableInspect } from "./utility/removeContextMenu";
import { useMessageIntegration } from './utility/hooks/useMessageIntegration';
import { MessageContext } from './utility/context/MessageContext';

const App = () => {
  if (process.env.REACT_APP_ENVIRONMENT === "production") {
    disableInspect();
  }

  const messageIntegrationState = useMessageIntegration();

  configureAmplify();

  const selectedLanguage = useSelector((state) => state.auth.selectLang);
  const dispatch = useDispatch();
  const languageList = async () => {
    const languageListRes = await authApiInstance.get("/language");
    if (!languageListRes) {
      return;
    }

    dispatch(setAvailableLang(languageListRes?.data?.data?.results));
  };
  const { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(selectedLanguage.langCode);
  }, [selectedLanguage.langCode]);

  // // firebase
  // useEffect(() => {
  //   // Use messaging methods, such as requestPermission, getToken, etc.
  //   // ...
  // }, []);
  // firebase
  // useEffect(() => {

  //   firebaseCloudMessaging.init();
  //   const setToken = async () => {
  //     const token = await firebaseCloudMessaging.getFCMToken();
  //     if (token) {
  //       // setMounted(true);
  //       // not working
  //     }
  //   };
  //   const result = setToken();
  // }, []);

  useEffect(() => {
    // const messaging = firebaseConfig.messaging();
    // requestForToken();
    // Notification();
    languageList();
  }, []);

  return (
    <MessageContext.Provider value={messageIntegrationState}>
      <Router />
    </MessageContext.Provider>
  );
};

export default App;
