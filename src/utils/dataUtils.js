import * as XLSX from 'xlsx'; // Import all exports from xlsx as XLSX
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import for table support in jsPDF

// Utility function for downloading data in various formats
export const downloadData = (data, fields, format, filename) => {
    let content = '';
    let blobType = '';
    let extension = '';

    switch (format) {
        case 'csv':
            const headers = ['File Name', ...fields];
            const rows = data.map((row) =>
                [row.fileName, ...fields.map((field) => row[field] || '')].join(',')
            );

            content = [headers.join(','), ...rows].join('\n');
            blobType = 'text/csv;charset=utf-8;';
            extension = 'csv';
            break;

        case 'json':
            content = JSON.stringify(data, null, 2);
            blobType = 'application/json;charset=utf-8;';
            extension = 'json';
            break;

        case 'xlsx':
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            const xlsxBlob = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            content = new Blob([xlsxBlob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            extension = 'xlsx';
            break;

        case 'pdf':
            const doc = new jsPDF();
            const pdfHeaders = ['File Name', ...fields];
            const pdfRows = data.map((row) =>
                [row.fileName, ...fields.map((field) => row[field] || '')]
            );

            doc.autoTable({
                head: [pdfHeaders],
                body: pdfRows,
            });

            content = doc.output('blob');
            extension = 'pdf';
            break;

        case 'xml':
            const xmlRows = data.map((row) => {
                const rowFields = fields.map((field) => `<${field}>${row[field] || ''}</${field}>`).join('');
                return `<item><fileName>${row.fileName}</fileName>${rowFields}</item>`;
            });
            content = `<?xml version="1.0" encoding="UTF-8"?><data>${xmlRows.join('')}</data>`;
            blobType = 'application/xml;charset=utf-8;';
            extension = 'xml';
            break;

        case 'sql':
            const tableName = 'exported_data';
            const createTableSQL = `CREATE TABLE ${tableName} (id INT PRIMARY KEY, fileName VARCHAR(255), ${fields.map((field) => `${field} TEXT`).join(', ')});`;
            const insertRowsSQL = data.map((row, index) => {
                const values = [`'${row.fileName}'`, ...fields.map((field) => `'${row[field] || ''}'`)];
                return `INSERT INTO ${tableName} (id, fileName, ${fields.join(', ')}) VALUES (${index + 1}, ${values.join(', ')});`;
            }).join('\n');
            content = `${createTableSQL}\n${insertRowsSQL}`;
            blobType = 'application/sql;charset=utf-8;';
            extension = 'sql';
            break;

        default:
            console.error('Unsupported format specified.');
            return;
    }

    if (format === 'xlsx' || format === 'pdf') {
        // For binary formats like xlsx and pdf
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.setAttribute('download', `${filename}.${extension}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        // For text-based formats like csv, json, xml, and sql
        const blob = new Blob([content], { type: blobType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `${filename}.${extension}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};