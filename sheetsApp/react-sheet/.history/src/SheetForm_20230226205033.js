import React, { useState } from 'react';
import db from './Firebase';

function SheetForm() {
  const [sheetUrl, setSheetUrl] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const sheetId = extractSheetId(sheetUrl);
    fetchSheetData(sheetId)
      .then((data) => {
        writeSheetData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const extractSheetId = (url) => {
    const match = url.match(/[-\w]{25,}/);
    return match[0];
  };

  const fetchSheetData = async (sheetId) => {
    const response = await fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet data: ${response.status} ${response.statusText}`);
    }
    const text = await response.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    const rows = lines.slice(1).map((line) => {
      const values = line.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {});
    });
    return rows;
  };

  const writeSheetData = async (data) => {
    const batch = db.batch();
    data.forEach((row) => {
      const docName = row['Column C']; // Replace 'Column C' with the actual name of the column
      const docRef = db.collection('sheetData').doc(docName);
      batch.set(docRef, { columnA: row['Column A'] }); 
    });
    await batch.commit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Google Sheets URL:
        <input type="text" value={sheetUrl} onChange={(event) => setSheetUrl(event.target.value)} />
      </label>
      <button type="submit">Update Data</button>
    </form>
  );
}

export default SheetForm;
