const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
require('dotenv').config();

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

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extend: true }));

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

app.get('/check-address', (req, res) => {
  console.log('Received URL:', req.url);
  
  if (req.query && req.query.address) {
    console.log('Received Parameters:', req.query);

    const address = req.query.address;

    // Perform the database query
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

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
