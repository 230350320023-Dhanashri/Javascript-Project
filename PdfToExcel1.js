const fs = require('fs');
const pdf = require('pdf-parse');
const XLSX = require('xlsx');

async function pdfToExcel(pdfPath, excelPath) {
  try {
    // Read PDF file
    const pdfBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(pdfBuffer);

    // Extract text from PDF
    const lines = data.text.split('\n').filter(line => line.trim() !== '');

    // Prepare headers and rows
    const headers = ['Sr. No.', 'AIR', 'NEET Roll No.', 'CET Form No.', 'Reg. Sr No.', 'Name', 'G', 'Cat', 'Quota', 'Code College'];
    const rows = [];

    let isTableData = false;

    lines.forEach(line => {
      const columns = line.trim().split(/\s+/);

      // Check if the line marks the start of the table data
      if (columns.length > 0 && columns[0].match(/^\d+$/)) {
        isTableData = true;
      }

      if (isTableData && columns.length >= 6) {
        const sr_no = columns[0];
        const air = columns[1];
        const neet_roll_no = columns[2];
        const cet_form_no = columns[3];
        const reg_sr_no = columns[4];

        // Extract the name field (assume names are between 2 to 5 words)
        let name = '';
        let nameEndIndex = 5;
        while (nameEndIndex < columns.length && columns[nameEndIndex].length > 1) {
          name += columns[nameEndIndex] + ' ';
          nameEndIndex++;
          if (nameEndIndex - 5 > 4) break; // Name should be at most 5 words
        }
        name = name.trim();

        const g = columns[nameEndIndex] || ''; // Gender field
        nameEndIndex++;
        
       
// Extract Cat field (take as is from the PDF)
let cat = columns[nameEndIndex] || ''; // Initialize Cat field

// Check if cat is not empty and does not contain exactly 2 words
if (cat.trim() !== '' && cat.split(/\s+/).length <= 0) {
  cat = ' '; // Set Cat field to empty if it doesn't have exactly 2 words
}

nameEndIndex++;




        // Extract Quota field (assume quota can be between 1 to 3 words)
        let quota = '';
        while (nameEndIndex < columns.length && quota.split(/\s+/).length < 3) {
          quota += columns[nameEndIndex] + ' ';
          nameEndIndex++;
        }
        quota = quota.trim();

        const code_college = columns[nameEndIndex] || ''; // Code College field

        // Ensure we have enough columns for a valid row
        const row = [sr_no, air, neet_roll_no, cet_form_no, reg_sr_no, name, g, cat, quota, code_college];
        rows.push(row);
      }

      // Add logic to detect the end of tabular data
      if (isTableData && columns.length < 6) {
        isTableData = false;
      }
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // Set column widths
    const columnWidths = headers.map(header => ({ wch: header.length + 5 }));
    ws['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Write workbook to file
    XLSX.writeFile(wb, excelPath);

    console.log(`PDF data has been converted to Excel successfully.`);
  } catch (error) {
    console.error('Error converting PDF to Excel:', error);
  }
}

// Example usage
const pdfPath = 'NEET-Selection-MOP2.pdf'; // Replace with your PDF file path
const excelPath = 'NEET-Selection-MOP2.xlsx'; // Replace with desired output Excel file path
pdfToExcel(pdfPath, excelPath);
