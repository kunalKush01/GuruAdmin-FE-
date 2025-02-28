import { useField } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import styled from "styled-components";
import SunEditor, { buttonList } from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import icon from "../../assets/images/icons/resizeField.png";
import "../../assets/scss/common.scss";

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
  const [editorHeight, setEditorHeight] = useState("250px");
  const [editorWidth, setEditorWidth] = useState("100%");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const handleResizeEditor = (height) => {
    console.log("Editor resized:", height);
    setEditorHeight(height);
  };

  const handleFullScreenToggle = () => {
    const editor = document.querySelector(".sun-editor");
    if (!editor) return;

    const isFull = editor.classList.contains("se-fullscreen");
    setIsFullScreen(isFull);

    if (isFull) {
      setEditorWidth("80vw");  // Not too broad
      setEditorHeight("70vh"); // Proper height
      editor.style.position = "fixed";
      editor.style.top = "15vh"; 
      editor.style.left = "10vw";
      editor.style.zIndex = "9999";
      editor.style.maxWidth = "1200px"; // Prevents too much width
    } else {
      setEditorWidth("100%");
      setEditorHeight("250px");
      editor.style.position = "relative";
      editor.style.top = "auto";
      editor.style.left = "auto";
      editor.style.zIndex = "1";
    }
  };

  useEffect(() => {
    // Attach event listener when full-screen mode is toggled
    const editor = document.querySelector(".sun-editor");
    if (editor) {
      editor.addEventListener("click", handleFullScreenToggle);
    }
    return () => {
      if (editor) {
        editor.removeEventListener("click", handleFullScreenToggle);
      }
    };
  }, []);
  return (
    <div className="richtextfieldwrapper mb-2" key={field.name}>
      <label style={{ margin: "0px 0px 10px 0px " }}>{label}<span className="text-danger">*</span></label>
      <SunEditor
        onChange={(value) => helpers.setValue(value)}
        setContents={field.value}
        autoFocus={autofocus}
        placeholder={t("placeHolder_description")}
        onResizeEditor={handleResizeEditor}
        {...props}
        setDefaultStyle={
          "font: normal normal normal 12px/20px Noto sans !important;color:#583703"
        }
        setOptions={{
          linkTargetNewWindow: true,
          height: editorHeight,
          width: editorWidth,
          resizingBar: true,
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
                "fullScreen",
              //   "showBlocks",
              //   "codeView",
              //   "preview",
              //   "print",
              //   "save",
              //   "template",
              "hiliteColor",
              "table",
              "codeView",
              "preview"

            ],
          ],
        }}
      />
      <div className="text-danger">
        {meta.error && meta.touched && <Trans i18nKey={meta.error} />}
      </div>
    </div>
  );
}
