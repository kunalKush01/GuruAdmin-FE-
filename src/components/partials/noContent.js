import React from 'react'
import styled from 'styled-components'
import noNewsIcon from "../../assets/images/icons/news/noNewsIcon.svg"

const NoContentWraper = styled.div`

img{
    width: 90px;
    margin: 20px;

}
.noNews{
    color: #FF8744;
    font:  normal normal bold 25px/20px noto sans;
}
.noNewsMass{
   
    font:  normal normal normal 13px/30px noto sans;
}

` 
export default function NoContent({headingNotfound,para}) {
  return (
    <NoContentWraper>
        <div className='d-flex flex-column justify-content-center align-items-center w-100' >
            <img src={noNewsIcon}  />
            <div className='noNews' >{headingNotfound}</div>
            <div className='noNewsMass' >{para}</div>
        </div>
    </NoContentWraper>
  )
}
