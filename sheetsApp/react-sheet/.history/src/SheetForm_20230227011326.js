import React, { useState } from 'react';
import db from './Firebase';
// if (window.location.hostname === "localhost") {
//     console.log("running on localhost");
//     db.useEmulator("localhost", 8080);
//   }
//   console.log(window.location.hostname);


//TODO: need to add button so that single jobs can be added/deleted from the database
//TODO: need to add some form of security 

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
    let batch = db.batch();
    let count = 0;
    data.forEach((row) => {
        
        if (!/open/i.test(row['Column 8'])) {        console.log(`Skipping row: ${row['Column 8'] }${row['Column 0']}`);
        return; // Skip this row and move on to the next one
      }
      //collection currently set to jobs-test, consider changing this for produciton
      const docRef = db.collection('jobs-Test').doc();
      //TODO: need to decide if City should be concatinated to address 
      batch.set(docRef, { address: row['Column 3'], name: row['Column 2'], ID: row['Column 0'], notes: row['Column 19'] });
      console.log("row", row);
      count++;
      if (count === 500) {
        console.log("Committing batch");
        batch.commit();
        batch = db.batch(); // Start a new batch
        count = 0;
      }
    });
    // Commit any remaining documents in the last batch
    if (count > 0) {
      console.log("Committing final batch");
      await batch.commit();
    }
  };
  
  
  


//     const batch = db.batch();
//     let count = 0;
    
//     for (let i=0; i< data.length; i++) {
//         const row =data[i];
//       const docRef = db.collection('jobs').doc();
//       batch.set(docRef, { address: row['Column 3'], name: row['Column 2'], ID: row['Column 0'] });
//         console.log("row", row);
//         count++;
        

//     if (count === 499 || i === data.length-1) { 
//     await batch.commit();
//     count = 0;
//     }
// }
//   };

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
