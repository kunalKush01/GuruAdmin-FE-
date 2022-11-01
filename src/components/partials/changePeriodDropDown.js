import { CustomDropDown } from "./customDropDown"



export const ChagePeriodDropDown= ()=>{
    const dropDownNameKey = "dashboard_monthly"
    const i18nKeyDropDownItemArray = [{
        id:1,
        key:"dashboard_monthly",        
    },
    {
        id:2,
        key:"dashboard_weekly",        
    },
    {
        id:3,
        key:"dashboard_yearly",        
    }
]
    return(
        <CustomDropDown dropDownNameKey={dropDownNameKey} i18nKeyDropDownItemArray={i18nKeyDropDownItemArray} />
    )

}