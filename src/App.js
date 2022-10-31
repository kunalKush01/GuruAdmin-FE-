// ** Router Import
import Router from './router/Router'
import { useTranslation, Trans } from "react-i18next";
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const App = () =>{
    const selectedLanguage = useSelector(state=>state.auth.lang)

 const { i18n } = useTranslation();
useEffect(()=>{
    i18n.changeLanguage(selectedLanguage)
},[selectedLanguage])

    return (<Router />)
    }

export default App
