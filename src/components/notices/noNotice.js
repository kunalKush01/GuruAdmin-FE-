import React from 'react'
import styled from 'styled-components'
import noNoticeIcon from "../../assets/images/icons/news/noNewsIcon.svg"

const NoEventWraper = styled.div`

img{
    width: 90px;
    margin: 20px;

}
.noEvent{
    color: #FF8744;
    font:  normal normal bold 25px/20px noto sans;
}
.noEventMass{
   
    font:  normal normal normal 13px/30px noto sans;
}

` 
export default function NoNotice() {
  return (
    <NoEventWraper>
        <div className='d-flex flex-column justify-content-center align-items-center w-100' >
            <img src={noNoticeIcon}  />
            <div className='noEvent' >No Notice Found</div>
            <div className='noEventMass' >Click on "Add Notice" to add notice on the screen</div>
        </div>
    </NoEventWraper>
  )
}
