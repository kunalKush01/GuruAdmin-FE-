// ** Router Import
import Router from "./router/Router";
import { useTranslation, Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { authApiInstance } from "./axiosApi/authApiInstans";
import { setAvailableLang } from "./redux/authSlice";
import "react-loading-skeleton/dist/skeleton.css";
import {isSerchable} from "./utility/localSerachBar";

const App = () => {
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


  useEffect(() => {
    languageList();
  }, []);



  return <Router />;
};

export default App;
