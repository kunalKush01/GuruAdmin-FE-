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
import { langOption } from "./langCardContent";

function LangModel({ setlangSelection, langSelection }) {
  const selectedLanguage = useSelector(state=>state.auth.lang)
  const dispatch = useDispatch()

  

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
  `;
  return (
    <Modal isOpen={langSelection}>
      <ModelWarraper>
        <ModalHeader className="bg-white w-100 p-0 py-1 ">
          <div>Language Preference</div>
          <div onClick={() => setlangSelection(false)} className="cancel">
            Cancel
          </div>
        </ModalHeader>

        <ModalBody className="p-0">
          <Row className="justify-content-between  ">
            {langOption.map((item, idx) => {
              return (
                <Col
                  xs={6}
                  className="py-1 "
                  onClick={() => handleSelectLang(item.langKey)}
                  key={idx}
                >
                  <div
                    className={` langButton ${
                      selectedLanguage == item.langKey ? "changeBG" : ""
                    } `}
                  >
                    <Input
                      type="radio"
                      checked={selectedLanguage == item.langKey ? true : false}
                    />
                    <label check>{item.lang}</label>
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
