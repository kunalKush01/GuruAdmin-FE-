import React from 'react'
import styled from 'styled-components'
import noNewsIcon from "../../assets/images/icons/news/noNewsIcon.svg"

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
export default function NoEvent() {
  return (
    <NoEventWraper>
        <div className='d-flex flex-column justify-content-center align-items-center w-100' >
            <img src={noNewsIcon}  />
            <div className='noEvent' >No Event Found</div>
            <div className='noEventMass' >Click on "Add Event" to add event on the screen</div>
        </div>
    </NoEventWraper>
  )
}
