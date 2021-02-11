const log = console.log;
const path = require('path');
require('dotenv').config({path: 'conf'});
const port = process.env.PORT || 3000;

const express = require('express');
let { html } = require('./mainFile');
const api = require('./routes/api');


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


































