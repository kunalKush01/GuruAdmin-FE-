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

export default function CustomSearchBar() {
  const searchBarValue = useSelector((state) => state.search.LocalSearch);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  return (
    <InputGroup className=" w-100 h-75 searchinput border-0 rounded-pill d-flex align-items-center ">
      <Input
        className=" sInput searchinput border-0 h-75 rounded-pill "
        value={searchBarValue}
        onChange={(e) => dispatch(setSearchbarValue(e.target.value))}
        placeholder={t(setPlaceholderSerchbar())}
      />
      <InputGroupText className="sIconsBox searchinput border-0  h-75  rounded-pill">
        <img src={searchIcon} className="" />
      </InputGroupText>
    </InputGroup>
  );
}
