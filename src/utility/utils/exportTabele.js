import React from 'react'
import { utils, writeFile } from 'xlsx';



  
export const handleExport = ({sheetName,dataName,fileName}) => {
  

        const binaryWorksheet = utils.json_to_sheet(dataName);
    
        // Create a new Workbook
        const workbook = utils.book_new();
    
        // naming our sheet
        utils.book_append_sheet(workbook, binaryWorksheet, sheetName);
    
        // exporting our excel and naming it
        writeFile(workbook, `${fileName}.xlsx`);
      };