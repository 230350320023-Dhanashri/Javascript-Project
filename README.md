# Javascript-Project
This project provides a Node.js script that converts tabular data from a PDF file into an Excel spreadsheet. The script reads a PDF file, extracts text, processes it to identify and parse table rows, and then writes the data into an Excel file. 
Features : 1. PDF Parsing: Uses pdf-parse to extract text from PDF files. 
2. Data Extraction: Filters and processes text lines to extract only relevant tabular data.  
3. Excel Generation: Uses xlsx to create and format an Excel file. 
4. Column Width Adjustment: Automatically adjusts column widths based on header length.
5. Flexible Name Handling: Handles names with up to five words.
