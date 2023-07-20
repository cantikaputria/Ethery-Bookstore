const express = require('express');
const mysql = require('mysql');
const app = express();

// Konfigurasi MySQL
const db = mysql.createConnection({
  host: ' localhost:8889',
  user: 'root',
  password: '',
  database: 'buku-db',
});

// Koneksi ke MySQL
db.connect((err) => {
  if (err) {
    console.error('Failed to connect to MySQL:', err);
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Endpoint untuk menerima log
app.post('/log', (req, res) => {
  const { eventKey, eventData } = req.body;

  // Simpan log ke tabel logs pada MySQL
  const query = db.query('INSERT INTO logs SET ?', { event_key: eventKey, event_data: JSON.stringify(eventData) }, (err) => {
    if (err) {
      console.error('Failed to insert log to MySQL:', err);
      return res.status(500).send('Failed to insert log to MySQL');
    }
    console.log('Log inserted to MySQL');
    return res.sendStatus(200);
  });
});

// Jalankan server
app.listen(3001, () => {
  console.log('Server started on port 3001');
});
