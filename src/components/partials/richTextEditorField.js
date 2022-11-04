import React, { useRef } from "react";
import { useField } from "formik";
import SunEditor, { buttonList } from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import styled from "styled-components";

const RichTextFieldWarper = styled.div`
label{
color: #583703;
font: normal normal bold 15px/20px noto sans !important;
margin: 15px;
}
.se-container {
  display: flex !important ;
  flex-direction: column-reverse;
}
.sun-editor{
  border: none !important;
  border-radius: 20px !important ;
  .se-resizing-bar {
    display: none !important;
  }
  .sun-editor-editable{
  background-color: #fdf7e8 !important;
  border-radius: 20px 20px 0px 0px  !important ;
  }
}
.se-toolbar{
  outline: none !important;
  border-radius: 0px 0px 20px 20px ;
background-color: #fbe6cf !important ;
color: #583703 !important;
}
.se-btn{
    color: #583703 !important;
    font: normal normal bold 15px/20px noto sans;
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
  



  return (
    <RichTextFieldWarper key={field.name} className="mb-2">
      <label style={{ marginBottom: "8px" }}>{label}</label>
      <SunEditor
      
        autoFocus={autofocus}
        // key={field.name}
        {...field}
        {...props}
        setDefaultStyle={
          "font: normal normal normal 12px/20px Noto sans !important;color:#583703"
        }
        setOptions={{
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
              //   "lineHeight",
              //   "table",
              "link",
              "image",
              "video",
              "audio",
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
    </RichTextFieldWarper>
  );
}
