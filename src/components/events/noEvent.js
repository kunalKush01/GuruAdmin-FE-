import React from 'react'
import styled from 'styled-components'
import noNewsIcon from "../../assets/images/icons/news/noNewsIcon.svg"
import '../../../src/styles/common.scss';

const NoEventWraper = styled.div``;
 
export default function NoEvent() {
  return (
    <div className="noeventwraper">
        <div className='d-flex flex-column justify-content-center align-items-center w-100' >
            <img src={noNewsIcon}  />
            <div className='noEvent' >No Event Found</div>
            <div className='noEventMass' >Click on "Add Event" to add event on the screen</div>
        </div>
    </div>
  )
}
