const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
require('dotenv').config();

/* Creat a MySQL connection */
const connection = mysql.createConnection({
	host: 'localhost',
	user: process.env.USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DATABASE
});

connection.connect((err) => {
	if (err) {
		console.error('Error connectign to the database: ' + err.stack);
		return;
	}
	console.log('Connected to the database');
});

const app = express();

app.use(bodyParser.json());

app.post('/login', (req, res) => {
	const query = "SELECT address FROM users";
	connection.query(query, (error, results, fields) => {
		if (error) {
			console.error('Error querying the database: ' + error);
			res.sendStatus(500);
		} else {
			const addresses = result.map(result => result.address);
			console.log('Addresses: ' + addresses);
			res.status(200).json({ addresses });
		}
	});
});

app.listen(3000, () => {
	console.log('Server started on port 3000');
});
