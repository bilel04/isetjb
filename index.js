const express = require ('express');
const app= express();
const mongoose = require('mongoose');
const path = require ('path');
const config= require('./config/database');
const router = express.Router();
const authentification = require('./routes/authentification')(router);
const blogs = require('./routes/blogs')(router);


const bodyParser = require('body-parser');

const cors = require('cors');


mongoose.Promise= global.Promise;
mongoose.connect(config.uri, (err) => {
	if(err) {
		console.log('Echec de connexion au DB: ', err);
	}
	else {
		console.log('Reussite de connexion au DB: ', config.db);
	}
});


app.use(cors({
	origin: 'http://localhost:4200'
}));


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/admin/dist/'));
app.use('/authentification', authentification);
app.use('/blogs', blogs);


app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/admin/dist/index.html'));
});

app.listen(8080, () => {
	console.log('Okey');
});