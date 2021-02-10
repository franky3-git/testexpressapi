const log = console.log;
const path = require('path');
//const cors = require('cors');
require('dotenv').config({path: 'conf'});
const port = process.env.PORT || 3000;

const express = require('express');
let { html } = require('./mainFile');
const api = require('./routes/api');

/*
const users = [
	{"name": "frank", "password": "1234", "email": "thisisemail@gmail.com", "id":1},
	{"name": "armel", "password": "4569", "email": "ytayops@gmail.com", "id":2},
	{"name": "ulrich", "password": "8752", "email": "keutchatang@gmail.com", "id": 3},
	{"name": "melissa", "password": "4156", "email": "tchopteyouM@gmail.com", "id": 4}
]
*/

const server = express();


server.use(express.static(path.join(__dirname, 'public')));
server.use('/api', api);
server.use(express.json());

server.get('/', (req, res) => {
	let content = '<main style="background-color: green">this is the main content</main>';
	html = html.replace('%content%', content);
	res.send(html);
});


server.listen(port, (err) => {
	if(err) {
		log('Something bad happens');
	}
	
	log('Server is running on port ' + port);
});


































