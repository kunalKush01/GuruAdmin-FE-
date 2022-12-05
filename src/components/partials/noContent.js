import React from 'react'
import styled from 'styled-components'
import noNewsIcon from "../../assets/images/icons/news/noNewsIcon.svg"
import { ConverFirstLatterToCapital } from '../../utility/formater'

const NoNewsWraper = styled.div`

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
export default function NoContent({content=""}) {
  return (
    <NoNewsWraper>
        <div className='d-flex flex-column justify-content-center align-items-center w-100' >
            <img src={noNewsIcon}  />
            <div className='noNews' >No {ConverFirstLatterToCapital(content)} Found</div>
            <div className='noNewsMass' >Click on "Add {ConverFirstLatterToCapital(content)}" to add {content} on the screen</div>
        </div>
    </NoNewsWraper>
  )
}
