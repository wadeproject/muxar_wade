var express = require('express');
var PlayMusic = require('../bin/play');
// for reading POSTed form data into `req.body`
var bodyParser = require('body-parser');
var expressSession = require('express-session');
// the session is stored in a // cookie, so we use this to parse it
var cookieParser = require('cookie-parser'); // 

var request = require('request');
var pm = new PlayMusic();
var router = express.Router();

function insertUserUri(useremail) {
	console.log("Insert");
	var auth = 'Basic ' + new Buffer('dav' + ':' + 'dav').toString('base64');

	var query = 'insert data into <http://wadeproject.com/> {\
					<http://wadeproject.com/users/' + useremail + '> foaf:name "' + useremail + '".\
				}';

	console.log(query);
	request({
		url : 'http://192.168.99.100:8890/DAV',
		method : 'POST',
		headers : {
			'Content-Type' : 'application/sparql-query',
			'Accept' : 'application/json',
			'Authorization' : auth
		},
		body : query
	}, function(error, response, body) {
		if (error) {
			console.log(error);
		} else {
			console.log(body);
			// return response.json(body);
		}
	});
}

function getUserUri(user, callback) {
	var auth = 'Basic ' + new Buffer('dav' + ':' + 'dav').toString('base64');

	var query = 'select ?url from <http://wadeproject.com/> where {\
	       		?url foaf:name ?name.\
	    		} limit 1';
	request({
		url : 'http://192.168.99.100:8890/DAV',
		method : 'POST',
		headers : {
			'Content-Type' : 'application/sparql-query',
			'Accept' : 'application/json',
			'Authorization' : auth
		},
		body : query
	}, function(error, response, body) {
		if (error) {
			console.log(error);
		} else {
			callback(body);
		}
	});
}

router.route('/login').post(function(req, res) {
	var config = {
		email : req.body.email,
		password : req.body.password
	};
	pm.login(config, function(err, resp) {
		var response = {
			status : 500,
			message : "Internal server error"
		};
		if (!err && err !== 'undefined' && typeof err === "undefined") {
			response.status = 200;
			response.message = "Ok";
			req.session.androidId = resp.androidId;
			req.session.password = config.pwd;
			req.session.email = config.email;
			req.session.masterToken = resp.masterToken;

			getUserUri(config.email, function(data) {
				var obj = JSON.parse(data);
				var userUriTmp = "";
				if (obj.results.bindings[0] && obj.results.bindings[0] !== 'undefined' && typeof obj.results.bindings[0] !== "undefined") {
					var userUriTmp = obj.results.bindings[0].url.value;
					if (!userUriTmp && userUriTmp !== 'undefined' && typeof userUriTmp === "undefined") {
						insertUserUri(config.email);
						userUriTmp = 'http://wadeproject.com/users/' + config.email;
					}
				}
				req.session.userUri = userUriTmp;
				req.session.save(function(err) {
				});
			});
		} else {
			response.status = err.statusCode;
			response.message = err.response.statusMessage;
		}
		return res.json(response);
	});

});

router.route('/logout').post(function(req, res) {
	var response = {
		status : 500,
		message : "Internal server error"
	};
	req.session.destroy();
	response.status = 200;
	response.message = "Ok";
	return res.json(response);
});

module.exports = router;