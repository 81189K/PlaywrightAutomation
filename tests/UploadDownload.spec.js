const ExcelJS = require('exceljs');
const {test, expect} = require('@playwright/test');
//import { test, expect } from '@playwright/test';

let workbook;

async function readExcel(filepath){
    workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filepath);
    const worksheet = workbook.getWorksheet('Sheet1');
    return worksheet;
    
}

function findPosition(worksheet, searchText) {
    let output = {row:-1, column:-1};
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
            if(cell.value === searchText){
                output.row = rowNumber;
                output.column = colNumber;
            }
        });
    });
    return output;   
}

async function updateValue(filepath, oldValue, newValue) {
    const worksheet = await readExcel(filepath);
    const output = findPosition(worksheet, oldValue);
    const cell = worksheet.getCell(output.row, output.column);
    cell.value = newValue;
    await workbook.xlsx.writeFile(filepath);
}

test('001TC:Upload, Download, Excel Validtions', async ({page}) => {
    await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");

    await page.locator("#downloadButton").waitFor();
    await page.screenshot({path: `screenshots/screenshotBefore.png`});

    // wait for download event
    const downloadPromise = page.waitForEvent('download');
    // click downlaod
    await page.locator("#downloadButton").click();
    // wait until downloadPromise is resolved
    const dl = await downloadPromise;

    // const filepath = "/Users/hariprasad.kunde/Downloads/download.xlsx";
    const filepath = await dl.path(); //Returns path to the downloaded file for a successful download, or throws for a failed/canceled download.

    // Excel action
    await updateValue(filepath, "Mango", "Zoro");

    // upload code:
    const uploadBtn = page.locator("#fileinput");
    await uploadBtn.click();
    //file upload: setInputFiles() - must have type="file" attribute.
    await uploadBtn.setInputFiles(filepath);
    // OR
    // await page.locator('#fileinput').setInputFiles(filepath);

    await page.screenshot({path: `screenshots/screenshotBeforeAfter.png`});
});


async function writeExcelExample(searchText, replaceText, change, filePath) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet('Sheet1');
    const output = readExcelExample(worksheet, searchText); // not async
    const cell = worksheet.getCell(output.row, output.column + change.colChange);
    cell.value = replaceText;
    await workbook.xlsx.writeFile(filePath);
}

function readExcelExample(worksheet, searchText) {
    let output = { row: -1, column: -1 };
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
            if (cell.value === searchText) {
                output = { row: rowNumber, column: colNumber };
            }
        });
    });
    return output;
}

//update Mango Price to 350. 
test('002TC: Update Mango Price to 350.', async ({ page }) => {
    const textSearch = 'Mango';
    const updateValue = '350';

    await page.goto('https://rahulshettyacademy.com/upload-download-test/index.html');

    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download' }).click();
    const dl = await download;
    const filePath = await dl.path();

    await writeExcelExample(textSearch, updateValue, { rowChange: 0, colChange: 2 }, filePath);

    await page.locator('#fileinput').setInputFiles(filePath);

    const desiredRow = page.getByRole('row').filter({ has: page.getByText(textSearch) }); // ***
    await expect(desiredRow.locator('#cell-4-undefined')).toContainText(updateValue);
});
