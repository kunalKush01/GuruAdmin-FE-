// ** React Imports
import { useState } from "react";
import { Link } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Third Party Components
import {
  CheckSquare,
  CreditCard,
  HelpCircle,
  Mail,
  MessageSquare,
  Power,
  Settings,
  User,
} from "react-feather";

// ** Reactstrap Imports
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";

// ** Default Avatar Image
import defaultAvatar from "../../../../assets/images/icons/dashBoard/defaultAvatar.svg";
import editProfileIcon from "../../../../assets/images/icons/dashBoard/icon_awesome_edit.svg";

import { useSelector } from "react-redux";
import "../../../../assets/scss/viewCommon.scss";

const UserDropdown = () => {
  // ** State
  const [userData] = useState(null);

  //** Vars
  const userProfile = useSelector(
    (state) => state?.auth?.trustDetail?.profilePhoto
  );
  const userAvatar = userProfile || defaultAvatar;

  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div className="avatar-wrapper">
          <Avatar
            img={userAvatar}
            status="online"
            imgClassName="img-class-name"
            editProfileIcon={editProfileIcon}
          />
        </div>
      </DropdownToggle>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;
