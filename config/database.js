const crypto = require ('crypto').randomBytes(256).toString('hex');

module.exports= {
	//uri: 'localhost:27017/mean-angular-2',
	uri: 'mongodb://bilel:bilel@ds129013.mlab.com:29013/angular-2-app',
	secret: crypto,
	db:'angular-2-app'
}