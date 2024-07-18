import { useField } from "formik";
import React, { useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import styled from "styled-components";
import SunEditor, { buttonList } from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import icon from "../../assets/images/icons/resizeField.png";
import "../../../src/styles/common.scss";

;
export default function RichTextField({
  label,
  type = "text",
  icon,
  autofocus = false,
  placeholder,
  value,
  controlled = false,
  ...props
}) {
  const [field, meta, helpers] = useField(props);
  const { t } = useTranslation();

  return (
    <div className="richtextfieldwrapper mb-2" key={field.name}>
      <label style={{ margin: "0px 0px 10px 0px " }}>{`${label}*`}</label>
      <SunEditor
        onChange={(value) => helpers.setValue(value)}
        setContents={field.value}
        autoFocus={autofocus}
        placeholder={t("placeHolder_description")}
        {...props}
        setDefaultStyle={
          "font: normal normal normal 12px/20px Noto sans !important;color:#583703"
        }
        setOptions={{
          linkTargetNewWindow: true,
          buttonList: [
            [
              "font",
              "fontSize",
              "formatBlock",
              "bold",
              "underline",
              "italic",
              //   "strike",
              //   "subscript",
              //   "superscript",
              "fontColor",
              //   "hiliteColor",
              //   "textStyle",
              //   "removeFormat",
              "align",
              "indent",
              "outdent",

              //   "horizontalRule",
              "list",
              "lineHeight",
              //   "table",
              "link",
              // "image",
              // "video",
              // "audio",
              //   "fullScreen",
              //   "showBlocks",
              //   "codeView",
              //   "preview",
              //   "print",
              //   "save",
              //   "template",
            ],
          ],
        }}
      />
      <div className="text-danger mt-1">
        {meta.error && meta.touched && <Trans i18nKey={meta.error} />}
      </div>
    </div>
  );
}
