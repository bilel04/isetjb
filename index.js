const express = require ('express');
const app= express();
const mongoose = require('mongoose');
const path = require ('path');
const config= require('./config/database');

mongoose.Promise= global.Promise;
mongoose.connect(config.uri, (err) => {
	if(err) {
		console.log('Echec de connexion au DB: ', err);
	}
	else {
		console.log('Reussite de connexion au DB: ', config.db);
	}
});

app.use(express.static(__dirname + '/admin/dist/'));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/admin/dist/index.html'));
});

app.listen(8080, () => {
	console.log('Okey');
});