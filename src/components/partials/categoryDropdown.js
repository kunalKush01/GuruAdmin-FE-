import { CustomDropDown } from "../partials/customDropDown";
    
export const ChangeCategoryType = ({typeName,setTypeName,categoryTypeArray,...props}) => {
  return (
    <CustomDropDown
      defaultDropDownName={typeName}
      ItemListArray={categoryTypeArray}
      handleDropDownClick={(e)=>setTypeName(e)}
      {...props}
    />
  );
};
