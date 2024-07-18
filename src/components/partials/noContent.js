import React from 'react'
import styled from 'styled-components'
import noNewsIcon from "../../assets/images/icons/news/noNewsIcon.svg"
import '../../../src/styles/common.scss';

const NoContentWraper = styled.div``;
 
export default function NoContent({headingNotfound,para}) {
  return (
    <div className="nocontentwraper">
        <div className='d-flex flex-column justify-content-center align-items-center w-100' >
            <img src={noNewsIcon}  />
            <div className='noNews' >{headingNotfound}</div>
            <div className='noNewsMass' >{para}</div>
        </div>
    </div>
  )
}
