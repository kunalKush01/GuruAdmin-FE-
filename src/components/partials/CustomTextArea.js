import { useField } from "formik";
import { Trans } from "react-i18next";
import styled from "styled-components";

const WaraperTextArea = styled.div`
  label {
    margin-bottom: 10px;
    font: normal normal bold 15px/33px Noto Sans;
  }
  .error {
    font: normal normal bold 11px/33px Noto Sans;
  }
  .text-area {
    border: none !important;
    background-color: #fff7e8 !important;
    color: #583703 !important;
    font: normal normal normal 13px/20px Noto Sans;
    width: 100%;
    padding: 0.5rem 0.5rem;
    box-shadow: none;
    :focus-visible {
      outline: none;
    }
  }
`;
const TextArea = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <WaraperTextArea>
      <label htmlFor={props.id || props.name}>{label}*</label>
      <textarea className="text-area" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error text-danger">
          <Trans i18nKey={meta.error} />
        </div>
      ) : null}
    </WaraperTextArea>
  );
};
export { TextArea };
