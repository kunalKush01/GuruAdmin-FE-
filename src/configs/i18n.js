import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { englishContent } from "../utility/lang/english";
import { hindiContent } from "../utility/lang/hindi";
import { kannadaContent } from "../utility/lang/kannada";
import { tamilContent } from "../utility/lang/tamil";
import { marathiContent } from "../utility/lang/marathi";
import { gujaratiContent } from "../utility/lang/gujarati";
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // we init with resources
    resources: {
      en: {
        translations: englishContent,
      },
      hi: {
        translations: hindiContent,
      },
      gu: {
        translations: gujaratiContent,
      },
      mr: {
        translations: marathiContent,
      },
      ta: {
        translations: tamilContent,
      },
      kn: {
        translations: kannadaContent,
      },
    },
    fallbackLng: "english",
    debug: true,

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
