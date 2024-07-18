import React from 'react'
import styled from 'styled-components'
import noNoticeIcon from "../../assets/images/icons/news/noNewsIcon.svg"
import '../../../src/styles/common.scss';

const NoEventWraper = styled.div``;
 
export default function NoNotice() {
  return (
    <div className="noeventwraper">
        <div className='d-flex flex-column justify-content-center align-items-center w-100' >
            <img src={noNoticeIcon}  />
            <div className='noEvent' >No Notice Found</div>
            <div className='noEventMass' >Click on "Add Notice" to add notice on the screen</div>
        </div>
    </div>
  )
}
