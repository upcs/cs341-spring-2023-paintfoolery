import React, { useState } from 'react';
import db from './Firebase';
// if (window.location.hostname === "localhost") {
//     console.log("running on localhost");
//     db.useEmulator("localhost", 8080);
//   }
//   console.log(window.location.hostname);




function SheetForm() {
  const [sheetUrl, setSheetUrl] = useState('');
  console.log("sheetforem")

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
    const batch = db.batch();
    let count = 0;
    
    for (let i=0; i< data.length; i++) {
        const row =data[i];
      const docRef = db.collection('jobs').doc();
      batch.set(docRef, { address: row['Column 3'], name: row['Column 2'], ID: row['Column 0'] });
        console.log("row", row);
        count++;
        

    if (count >=499 || i == data.length-1) { 
    await batch.commit();
    batch = db.batch();
    count = 0;
    }
}
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
