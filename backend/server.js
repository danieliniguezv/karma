const express = require('express');
// const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
require('dotenv').config();
const getFingerprint = require('./scripts/acoustic-fingerprint.js');

/* Create a MySQL connection */
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: process.env.DB_PASSWORD,
	database: 'karma'
});

connection.connect((err) => {
	if (err) {
		console.error('Error connectign to the database: ' + err.stack);
		return;
	}
	console.log('Connected to the database');
});

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/songs'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.use(bodyParser.json());
// app.use(cors());
app.use(express.urlencoded({ extend: true }));

// Serve the HTML file and static assets
app.use('/', express.static('../frontend/public'));
app.use('/styles', express.static(path.join(__dirname, '/frontend/src/styles'), {
  setHeaders: (res, filePath) => {
    if (path.extname(filePath).toLowerCase() === '.css') {
      res.setHeader('Content-Type', 'text/css');
    }
  },
}));
app.use('/src', express.static('../frontend/src/'));
app.use('/images', express.static('../frontend/src/images'));

/* Endpoint query existing users' addresses */
app.get('/login', (req, res) => {
	const query = 'SELECT address FROM users';

	connection.query(query, (error, results) => {
		if (error) {
			console.error('Error querying the database: ' + error);
			res.sendStatus(500);
			return;
		} else {
			const addresses = results.map(row => row.address);
			res.json(addresses);
		}
	});
});

/* Endpoint checks if the address logging in exists already */
app.get('/check-address', (req, res) => {
  console.log('Received URL:', req.url);
  
  if (req.query && req.query.address) {
    console.log('Received Parameters:', req.query);

    const address = req.query.address;

    // Database query
    const query = `SELECT address FROM users WHERE address = '${address}'`;

    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error executing the query');
        res.sendStatus(500);
        return;
      }

      // Check if the address exists in the database
      if (results.length > 0) {
        res.send('Address exists in the database.');
      } else {
        res.send('Address does not exist in the database.');
      }
    });
  } else {
    res.status(400).send('Invalid request');
  }
});

/* Endpoint to upload the file and insert inforamtion to songs table */
app.post('/upload', upload.single('file'), async (req, res) => {
  const  { artist, song, genre } = req.body;

  const filePath = req.file.path;

  const acousticFingerprint = await getFingerprint(filePath);

  const insertQuery = `INSERT INTO songs (acoustic_fingerprint, artist_name, song_name, genre) VALUES (?, ?, ?, ?)`;

  const values = [acousticFingerprint, artist, song, genre];

  connection.query(insertQuery, values, (error, results) => {
    if (error) {
      console.error('Error inserting into songs table.');
      res.sendStatus(500);
      return;
    }
    console.log('Song inserted successfully');
    res.sendStatus(200);
  });
});

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
