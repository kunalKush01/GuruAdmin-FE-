// ** React Imports
import { Link } from "react-router-dom";
import { useState } from "react";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Utils
// import { isUserLoggedIn } from '@utils'

// ** Third Party Components
import {
  User,
  Mail,
  CheckSquare,
  MessageSquare,
  Settings,
  CreditCard,
  HelpCircle,
  Power,
} from "react-feather";

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";

// ** Default Avatar Image
import defaultAvatar from "../../../../assets/images/icons/dashBoard/defaultAvatar.svg";
import editProfileIcon from "../../../../assets/images/icons/dashBoard/icon_awesome_edit.svg";

import styled from "styled-components";
import { useSelector } from "react-redux";

const AvatarWarraper = styled.div`
    
  .imgClassName {    
    width: 50px !important;
    height:50px !important  ;
    
} 
.editProfileIcon{
  width: 16px;
  border-radius: 0%  !important;
  box-shadow: none !important;
  bottom: 2px;
  right: -2px;

}
`

const UserDropdown = () => {
  // ** State
  const [userData] = useState(null);

  //** ComponentDidMount
  // useEffect(() => {
  //   if (isUserLoggedIn() !== null) {
  //     setUserData(JSON.parse(localStorage.getItem('userData')))
  //   }
  // }, [])

  //** Vars
  const userProfile = useSelector((state)=> state?.auth?.trustDetail?.profilePhoto )
  // const userAvatar = (userData && userData.avatar) || defaultAvatar;
  const userAvatar = userProfile || defaultAvatar;

  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        {/* <div className='user-nav d-sm-flex d-none'>
          <span className='user-name fw-bold'>{(userData && userData['username']) || 'John Doe'}</span>
          <span className='user-status'>{(userData && userData.role) || 'Admin'}</span>
        </div> */}
        
        <AvatarWarraper>
        <Avatar
          img={userAvatar}
          
          // imgHeight="50"
          // imgWidth="50"
          status="online"
          imgClassName={"imgClassName"}
          editProfileIcon={editProfileIcon}
        />
        
        </AvatarWarraper>
      </DropdownToggle>
      {/* <DropdownMenu end>
        <DropdownItem tag='a' href='/pages/profile' onClick={e => e.preventDefault()}>
          <User size={14} className='me-75' />
          <span className='align-middle'>Profile</span>
        </DropdownItem>
        <DropdownItem tag='a' href='/apps/email' onClick={e => e.preventDefault()}>
          <Mail size={14} className='me-75' />
          <span className='align-middle'>Inbox</span>
        </DropdownItem>
        <DropdownItem tag='a' href='/apps/todo' onClick={e => e.preventDefault()}>
          <CheckSquare size={14} className='me-75' />
          <span className='align-middle'>Tasks</span>
        </DropdownItem>
        <DropdownItem tag='a' href='/apps/chat' onClick={e => e.preventDefault()}>
          <MessageSquare size={14} className='me-75' />
          <span className='align-middle'>Chats</span>
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem tag='a' href='/pages/account-settings' onClick={e => e.preventDefault()}>
          <Settings size={14} className='me-75' />
          <span className='align-middle'>Settings</span>
        </DropdownItem>
        <DropdownItem tag='a' href='/pages/pricing' onClick={e => e.preventDefault()}>
          <CreditCard size={14} className='me-75' />
          <span className='align-middle'>Pricing</span>
        </DropdownItem>
        <DropdownItem tag='a' href='/pages/faq' onClick={e => e.preventDefault()}>
          <HelpCircle size={14} className='me-75' />
          <span className='align-middle'>FAQ</span>
        </DropdownItem>
        <DropdownItem tag={Link} to='/login'>
          <Power size={14} className='me-75' />
          <span className='align-middle'>Logout</span>
        </DropdownItem>
      </DropdownMenu> */}
    </UncontrolledDropdown>
  );
};

export default UserDropdown;
