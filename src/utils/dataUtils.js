// src/utils/dataUtils.js
//utility function for downloading data as CSV or JSON
export const downloadData = (data, fields, format, filename) => {
    
    let content = '';
    if (format === 'csv') {
      const headers = ['File Name', ...fields];
      const rows = data.map((row) =>
        [row.fileName, ...fields.map((field) => row[field] || '')].join(',')
      );
      
      content = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      const blob = new Blob([content], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `${filename}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  