const express = require('express');
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

const uploadsDirectory = path.join(__dirname, '../uploads');
const songsDirectory = path.join(__dirname, '../uploads/songs');
const imagesDirectory = path.join(__dirname, '../uploads/images');

if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory);
}

if (!fs.existsSync(songsDirectory)) {
  fs.mkdirSync(songsDirectory);
}

if (!fs.existsSync(imagesDirectory)) {
  fs.mkdirSync(imagesDirectory);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'songFile') {
      cb(null, songsDirectory);
    } else if (file.fieldname === 'imageFile') {
      cb(null, imagesDirectory);
    } else {
      cb(new Error('Invalid fieldname'), null);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.use(bodyParser.json());
app.use(express.urlencoded({ extend: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve the HTML file and static assets
app.use('/', express.static(path.join(__dirname, '../frontend/public')));
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
    const query = `SELECT user_address FROM users WHERE user_address = '${address}'`;

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
/*app.post('/upload', upload.single('file'), async (req, res) => {
  const  { artist, songName, genre } = req.body;

  const filePath = req.file.path;

  const acousticFingerprint = await getFingerprint(filePath);

  const insertQuery = `INSERT INTO songs (acoustic_fingerprint, artist_name, song_name, genre, song_file_path) VALUES (?, ?, ?, ?, ?)`;

  const values = [acousticFingerprint, artist, songName, genre, filePath];

  connection.query(insertQuery, values, (error, results) => {
    if (error) {
      console.error('Error inserting into songs table.');
      res.sendStatus(500);
      return;
    }
    console.log('Song inserted successfully');
    console.log(filePath);
    res.sendStatus(200);
  });
});*/

app.post('/upload', upload.fields([
  {name: 'songFile', maxCount: 1},
  {name: 'imageFile', maxCount: 1}
]), async (req, res) => {
  try {
    const  { artist, songName, genre, price, userAddress } = req.body;

    const songFilePath = req.files['songFile'][0].path;
    const imageFilePath = req.files['imageFile'][0].path;

    const acousticFingerprint = await getFingerprint(songFilePath);

    const insertQuery = `INSERT INTO songs (acoustic_fingerprint, artist_name, song_name, genre, song_file_path, image_file_path, price, owner) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [acousticFingerprint, artist, songName, genre, songFilePath, imageFilePath, price, userAddress];

    connection.query(insertQuery, values, (error, results) => {
      if (error) {
        console.error('Error inserting into songs table.');
        res.sendStatus(500);
        return;
      }
      console.log('Song inserted successfully');
      console.log(songFilePath);
      console.log(imageFilePath);
      // res.sendStatus(200);
      res.json({ acousticFingerprint });
    });
  } catch (error) {
    console.error('Error: ', error);
  }
});

app.post('/sign-up', upload.none(), (req, res) => {
  try {
    const { address, username, userType } = req.body;

    const insertQuery = `INSERT INTO users (user_address, username, user_type) VALUES (?, ?, ?)`;
    const values = [address, username, userType];
    connection.query(insertQuery, values, (error, results) => {
      if (error) {
        console.error('Error inserting into users table.');
        res.sendStatus(500);
        return;
      }
      console.log('Account created successfully!');
      res.sendStatus(200);
    });
  } catch (error) {
    console.error('Error: ', error);
  }
});

app.post('/permit/:userAddress/acousticFingerprintHash/permit', upload.none(), (req, res) => {
  try {
    const userAddress = req.params.userAddress;
    const { acousticFingerprintHash, permit } = req.body;
    console.log(permit);
    console.log(userAddress);
    console.log(acousticFingerprintHash);
    // const updateQuery = 'UPDATE songs SET permit = ? WHERE owner = ?';
    const query = `INSERT INTO permits (user_address, song, permit) VALUES (?, ?, ?)`;

    connection.query(query, [userAddress, acousticFingerprintHash, permit], (error, results) => {
      if (error) {
        console.error('Error inserting into permits table.');
        res.sendStatus(500);
        return;
      }
      console.log('Permits table updated successfully!');
      res.sendStatus(200);
    });
  } catch (error) {
    console.error('Error: ', error);
  }
});

app.get('/get-songs/:userAddress', (req, res) => {
  const userAddress = req.params.userAddress;

  const query = 'SELECT song_name, artist_name, song_file_path, image_file_path FROM songs WHERE owner = ?';

  connection.query(query, [userAddress], (error, results) => {
    if (error) {
      console.error('Error querying the database: ' + error);
      res.sendStatus(500);
      return;
    } else {
      const songs = results.map(row => ({
        title: row.song_name,
        artist: row.artist_name,
        audioFile: row.song_file_path,
        albumArt: row.image_file_path
      }));

      res.json(songs);
    }
  });
});

app.get('/get-songs', (req, res) => {
  const userAddress = req.params.userAddress;

  const query = 'SELECT * FROM songs';

  connection.query(query, [userAddress], (error, results) => {
    if (error) {
      console.error('Error querying the database: ' + error);
      res.sendStatus(500);
      return;
    } else {
      const songs = results.map(row => ({
        acousticFingerprintHash: row.acoustic_fingerprint,
        title: row.song_name,
        artist: row.artist_name,
        audioFile: row.song_file_path,
        albumArt: row.image_file_path,
        price: row.price
      }));

      res.json(songs);
    }
  });
});

app.get('/permits/:userAddress', (req, res) => {
  const userAddress = req.params.userAddress;

  // Query to retrieve song information for a user's permits
  const query = `
    SELECT s.song_name, s.artist_name, s.song_file_path, s.image_file_path
    FROM permits p
    JOIN songs s ON p.song = s.acoustic_fingerprint
    WHERE p.user_address = ?`;

  // Execute the query with the userAddress parameter
  connection.query(query, [userAddress], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    } else {
      const songs = results.map(row => ({
        title: row.song_name,
        artist: row.artist_name,
        audioFile: row.song_file_path,
        albumArt: row.image_file_path
      }));

    res.json(results);
    }
  });
});

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
