var bodyParser = require('body-parser');
var express = require('express');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a
												// cookie, so we use this to
												// parse it
var path = require('path');
var playlists = require('./routes/api.playlists');
var artists = require('./routes/artist');
var search = require('./routes/search');
var genres = require('./routes/api.genre');
var login = require('./routes/api.auth');
var interests = require('./routes/api.interests');
var trackdata = require('./routes/api.dataofinterest');
var favorites = require('./routes/api.favorites');
var recommendations = require('./routes/api.recommendations');

var app = express();
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	"extended" : false
}));

app.use(cookieParser());
app.use(expressSession({
	secret : 'somesecrettokenhere'
}));
app.use(bodyParser());

router.get("/", function(req, res) {
	res.json({
		"error" : false,
		"message" : "Hello World"
	});
});

app.get('/', function(req, res){
    res.sendfile('index.html', { root: __dirname + "/public" } );
});

app.use('/api', login);
app.use('/api', genres);
app.use('/api', search);
app.use('/api', playlists);
app.use('/api', favorites);
app.use('/api', interests);
app.use('/api', trackdata);
app.use('/api', recommendations);
app.use(express.static(path.join(__dirname, 'public')));
module.exports = app;