import React, { useEffect } from "react";
import { InputGroup, Input, InputGroupText } from "reactstrap";
import searchIcon from "../../assets/images/icons/dashBoard/Group 5997.svg";
import {
  isSerchable,
  setPlaceholderSerchbar,
} from "../../utility/localSerachBar";
import { useDispatch, useSelector } from "react-redux";
import { useTransition } from "react";
import { useTranslation } from "react-i18next";
import { setSearchbarValue } from "../../redux/searchBar";
import styled from "styled-components";
import { X } from "react-feather";
import "../../../src/styles/common.scss";

;
export default function CustomSearchBar({ searchBarState, setSearchBarState }) {
  const searchBarValue = useSelector((state) => state?.search?.LocalSearch);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  return (
    <div className="searchbarwrapper w-100">
      <div className="d-flex align-items-center">
        <InputGroup
          className={`searbarSize ${
            !searchBarState && window.screen.width < 576
              ? "bgNone"
              : "searchinput"
          } border-0 rounded-pill d-flex align-items-center justify-content-end`}
        >
          <Input
            className={`${
              !searchBarState && window.screen.width < 576 ? "d-none" : ""
            } sInput searchinput border-0 h-100 rounded-pill `}
            value={searchBarValue}
            onChange={(e) => dispatch(setSearchbarValue(e.target.value))}
            placeholder={t(setPlaceholderSerchbar())}
          />
          <InputGroupText
            className={`sIconsBox ${
              !searchBarState && window.screen.width < 576
                ? "bgNone"
                : "searchinput"
            } border-0 h-100  rounded-pill`}
          >
            <img
              src={searchIcon}
              className=""
              onClick={() => {
                window.screen.width < 576 ? setSearchBarState(true) : "";
              }}
            />
          </InputGroupText>
        </InputGroup>
        {searchBarState && (
          <div
            onClick={() => {
              window.screen.width < 576 ? setSearchBarState(false) : "";
            }}
          >
            <X color="#000000" stroke-width="3" />
          </div>
        )}
      </div>
    </div>
  );
}
