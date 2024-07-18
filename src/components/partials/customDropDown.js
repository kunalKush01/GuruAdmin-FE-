import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  CardLink,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import dropDownIcon from "../../assets/images/icons/dashBoard/dropDownIcon.svg";
import { useTranslation, Trans } from "react-i18next";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import "../../../src/styles/common.scss";

export const CustomDropDown = ({
  i18nKeyDropDownItemArray,
  defaultDropDownName,
  ItemListArray,
  handleDropDownClick,
  width,
  ...props
}) => {
  const DropDownWrapper = styled.div``;
  const { t } = useTranslation();
  const selectedLang = useSelector((state) => state.auth.selectLangCode);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <div className="dropdownwrapper" width={width}>
      {i18nKeyDropDownItemArray && (
        <Dropdown
          className="textRight"
          isOpen={dropdownOpen}
          toggle={toggle}
          direction={"down"}
          {...props}
        >
          <DropdownToggle caret>
            <Trans i18nKey={defaultDropDownName} />
          </DropdownToggle>
          <DropdownMenu>
            {i18nKeyDropDownItemArray.map((item, idx) => {
              return (
                <DropdownItem
                  onClick={(e) => handleDropDownClick(e)}
                  key={idx}
                  name={item.key}
                >
                  <Trans i18nKey={item.key} />
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </Dropdown>
      )}
      {ItemListArray && (
        <Dropdown
          className="text-end"
          isOpen={dropdownOpen}
          toggle={toggle}
          direction={"down"}
          {...props}
        >
          <DropdownToggle caret>
            <span className="buttonText">{defaultDropDownName}</span>
          </DropdownToggle>
          <DropdownMenu>
            {ItemListArray.map((item, idx) => {
              return (
                <DropdownItem
                  onClick={handleDropDownClick}
                  key={item.id}
                  name={item.name}
                >
                  {ConverFirstLatterToCapital(item?.name ?? "")}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );
};
