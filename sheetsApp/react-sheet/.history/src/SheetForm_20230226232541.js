import React, { useState } from 'react';
import db from './Firebase';
if (window.location.hostname === "localhost") {
    console.log("running on localhost");
    db.useEmulator("localhost", 8080);
  }
  console.log(window.location.hostname);

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
    const headers = lines[0].split(',').map((header, index) => `Column ${index}`);
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
    console.log(row['Column 3'])
    const batch = db.batch();
    data.forEach((row) => {
      const docRef = db.collection('jobs').doc();
      batch.set(docRef, { address: row['Column 3'], name: row['Column 2'], ID: row['Column 0'] });
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
