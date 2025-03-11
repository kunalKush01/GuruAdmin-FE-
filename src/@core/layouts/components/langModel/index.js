import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalHeader, ModalBody, Col, Row, Input } from "reactstrap";
import { setlang } from "../../../../redux/authSlice";
import { ConverFirstLatterToCapital } from "../../../../utility/formater";
import "../../../../assets/scss/viewCommon.scss";

function LangModel({ setlangSelection, langSelection }) {
  const selectedLanguage = useSelector((state) => state.auth.selectLang);
  const dispatch = useDispatch();
  const langList = useSelector((state) => state.auth.availableLang);
console.log(langList)
  const handleSelectLang = (lang) => {
    dispatch(setlang(lang));
    setlangSelection(false);
  };

  return (
    <Modal isOpen={langSelection}>
      <div className="model-wrapper">
        <ModalHeader className="bg-white w-100 p-0 py-1 modal-title">
          <div className="language_heading">Language Preference</div>
          <div onClick={() => setlangSelection(false)} className="cancel">
            Cancel
          </div>
        </ModalHeader>

        <ModalBody className="p-0">
          <Row className="justify-content-between">
            {langList?.map((item) => {
              return (
                <Col
                  xs={6}
                  className="py-1"
                  onClick={() => handleSelectLang(item)}
                  key={item.id}
                >
                  <div
                    className={`langButton ${
                      selectedLanguage.langCode == item.langCode
                        ? "changeBG"
                        : ""
                    }`}
                  >
                    <Input
                      type="radio"
                      checked={
                        selectedLanguage.name == item.name ? true : false
                      }
                    />
                    <label>
                      {ConverFirstLatterToCapital(item?.name ?? "")}
                    </label>
                  </div>
                </Col>
              );
            })}
          </Row>
        </ModalBody>
      </div>
    </Modal>
  );
}

export default LangModel;
