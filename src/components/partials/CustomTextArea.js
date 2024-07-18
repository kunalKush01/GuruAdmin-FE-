import { useField } from "formik";
import { Trans } from "react-i18next";
import styled from "styled-components";
import "../../../src/styles/common.scss";

const WrapperTextArea = styled.div``;
const TextArea = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="wrappertextarea">
      <label htmlFor={props.id || props.name}>{label}</label>
      <textarea className="text-area" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error text-danger">
          <Trans i18nKey={meta.error} />
        </div>
      ) : null}
    </div>
  );
};
export { TextArea };
