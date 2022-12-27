import React, { useEffect, useState } from "react";
import { CheckCircle } from "react-feather";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Col,
  Row,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import styled from "styled-components";
import { setlang } from "../../../../redux/authSlice";
import { ConverFirstLatterToCapital } from "../../../../utility/formater";
import { langOption } from "./langCardContent";

function LangModel({ setlangSelection, langSelection }) {
  const selectedLanguage = useSelector(state=>state.auth.selectLang)
  const dispatch = useDispatch()
  const langList= useSelector(state=>state.auth.availableLang)
  

  const handleSelectLang = (lang)=>{
    dispatch(setlang(lang))
    setlangSelection(false)
  }

  const ModelWarraper = styled.div`
    color: #583703;
    padding: 25px;

    .modal-title {
      display: flex !important ;
      width: 100%;
      justify-content: space-between;
      color: #583703;
      font: normal normal bold 14px/30px Noto Sans;
      .cancel {
        cursor: pointer;
        color: #ff8744;
      }
    }
    .langButton {
      align-items: center;
      background: #fff7e8;
      display: flex;
      padding: 1rem;

      border-radius: 10px;
      cursor: pointer;
    }
    .changeBG {
      background-color: #ff8744;
      color: #fff7e8;
    }
    .form-check-input {
      background: inherit;
      border: 3px solid #70707070;
      width: 1rem;
      height: 1rem;
      margin-right: 10px;
      &:checked {
        border: 3px solid white;
      }
    }
    .language_heading{
      font-size: 18px;
    }
  `;
  return (
    <Modal isOpen={langSelection}>
      <ModelWarraper>
        <ModalHeader className="bg-white w-100 p-0 py-1 ">
          <div className="language_heading">Language Preference</div>
          <div onClick={() => setlangSelection(false)} className="cancel">
            Cancel
          </div>
        </ModalHeader>

        <ModalBody className="p-0">
          <Row className="justify-content-between  ">
            {langList?.map((item) => {
              return (
                <Col
                  xs={6}
                  className="py-1 "
                  onClick={() => handleSelectLang(item)}
                  key={item.id}
                >
                  <div
                    className={` langButton ${
                      selectedLanguage.langCode == item.langCode ? "changeBG" : ""
                    } `}
                  >
                    <Input
                      type="radio"
                      checked={selectedLanguage.name == item.name ? true : false}
                    />
                    <label check>{ConverFirstLatterToCapital(item?.name ??"")}</label>
                  </div>
                </Col>
              );
            })}
          </Row>
        </ModalBody>
      </ModelWarraper>
    </Modal>
  );
}

export default LangModel;
