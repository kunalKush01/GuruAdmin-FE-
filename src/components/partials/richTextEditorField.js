import React, { useRef } from "react";
import { useField } from "formik";
import SunEditor, { buttonList } from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import styled from "styled-components";
import { Trans, useTranslation } from "react-i18next";

const RichTextFieldWarper = styled.div`
  font: normal normal bold 11px/20px noto sans;
  .text-danger {
    height: 20px;
  }
  label {
    color: #583703;
    font: normal normal bold 15px/20px noto sans !important;
    margin: 15px 0px;
  }
  .se-container {
    display: flex !important ;
    flex-direction: column-reverse;
  }

  .sun-editor {
    border: none !important;
    border-radius: 20px !important ;

    .se-resizing-bar {
      display: none !important;
    }
    .sun-editor-editable {
      background-color: #fdf7e8 !important;
      border-radius: 20px 20px 0px 0px !important ;
    }
    .se-dialog-content {
      top: 30% !important;
    }
  }
  .se-placeholder{
    color: #583703 !important;
    opacity: 60% !important;
    font: normal normal bold 13px/20px Noto Sans !important;
  }
  .se-toolbar {
    outline: none !important;
    border-radius: 0px 0px 20px 20px;
    background-color: #fbe6cf !important ;
    color: #583703 !important;
  }
  .se-btn {
    color: #583703 !important;
    font: normal normal bold 15px/20px noto sans;
  }
  .se-wrapper {
    z-index: 0 !important;
  }
  .se-toolbar-sticky-dummy {
    display: none !important;
    height: 0px !important;
  }
  .sun-editor .se-toolbar.se-toolbar-sticky {
    position: inherit;
  }
  @media only screen and (max-width: 576px) {
    label {
      font: normal normal bold 13px/20px noto sans !important;
    }
  }
`;
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
    <RichTextFieldWarper key={field.name} className="mb-2">
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
          linkTargetNewWindow:true,
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
              //   "fontColor",
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
    </RichTextFieldWarper>
  );
}
