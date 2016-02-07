//var express = require('express');
//var fs = require('fs');
//var PlayMusic = require('../node_modules/play');
//var request = require('request');
//var SparqlClient = require('sparql-client');
//var util = require('util');
//
//var endpoint = 'http://dbpedia.org/sparql';
//var pm = new PlayMusic();
//var router = express.Router();
//var config = JSON.parse(fs.readFileSync("config.json"));
//
//function getArtistURI(artist, callback) {
//	console.log("getArtistUri");
//	var query = 'select distinct ?person where {\
//	    		?person dbp:name ?name;\
//				rdf:type dbo:MusicalArtist.\
//				filter(regex(?name, "' + artist + '", "i"))\
//				} limit 1';
//	var client = new SparqlClient(endpoint);
//	client.query(query).execute(function(error, results) {
//		callback(error, error ? null : results.results.bindings[0].person.value);
//	});
//}
//
//function insertInterestArtist(artistUri) {
//	console.log("Insert");
//	var auth = 'Basic ' + new Buffer('dav' + ':' + 'dav').toString('base64');
//
//	var query = 'prefix dbo: <http://dbpedia.org/ontology/>\
//		insert data into <http://wadeproject.com/> {\
//	       <http://wadeproject.com/users/user1> foaf:interest <' + artistUri + '>.\
//	       <' + artistUri + '> rdf:type dbo:MusicalArtist.\
//	}';
//
//	console.log(query);
//	request({
//		url : 'http://192.168.99.100:8890/DAV',
//		method : 'POST',
//		headers : {
//			'Content-Type' : 'application/sparql-query',
//			'Accept' : 'application/json',
//			'Authorization' : auth
//		},
//		body : query
//	}, function(error, response, body) {
//		if (error) {
//			console.log(error);
//		} else {
//			console.log(body);
//			// return response.json(body);
//		}
//	});
//}
//
//function parseName(name){
//	return name.replace("."," ", -1);
//}
//
//router.route('/interests/artists2').get(function(req, res) {
//	pm.login({
//		email : config.email,
//		password : config.password
//	}, function(err, resp) {
//		console.log(err, resp);
//	});
//
//	pm.init(config, function(err) {
//		if (err) {
//			return console.log("error", err);
//		}
//		pm.getPlayListEntries(function(err, data) {
//			for (var index = 0; index < data.data.items.length ; ++index) {
//				var item = data.data.items[index];
//				console.log(item.track.artist);
//				var artistUri = getArtistURI(parseName(item.track.artist), function(err, data) {
//					insertInterestArtist(data);
//				});
//			}
//			return res.json(data);
//		});
//	});
//
//	// rdfstore.create(function(err, store) {
//	// store.registerDefaultProfileNamespaces();
//	// store.execute('prefix dbo: <http://dbpedia.org/ontology/>\
//	// select ?artist from <http://wadeproject.com/> where {\
//	// <http://wadeproject.com/users/user1> foaf:interest ?artist.\
//	// ?artist rdf:type dbo:MusicalArtist.\
//	// }', function(err, results) {
//	// return res.json(results);
//	// });
//	// });
//});
//
//router.route('/artists1').get(function(req, res) {
//	var auth = 'Basic ' + new Buffer('dav' + ':' + 'dav').toString('base64');
//	request({
//		url : 'http://192.168.99.100:8890/DAV',
//		method : 'POST',
//		headers : {
//			'Content-Type' : 'application/sparql-query',
//			'Accept' : 'application/json',
//			'Authorization' : auth
//		},
//		body : 'prefix dbo: <http://dbpedia.org/ontology/>\
//	    	select ?url from <http://wadeproject.com/> where {\
//	        ?url foaf:name ?name.\
//	        filter(regex(?name, "user1", "i"))\
//	 } limit 1'
//	}, function(error, response, body) {
//		if (error) {
//			console.log(error);
//		} else {
//			return res.json(body);
//		}
//	});
//});
//
//router.route('/artists2').get(function(req, res) {
//	var SparqlClient = require('sparql-client');
//	var util = require('util');
//	var endpoint = 'http://dbpedia.org/sparql';
//
//	var query = 'select distinct ?genre where {\
//		?genre a dbo:MusicGenre.\
//		filter(regex(?genre, "_music$", "i"))\
//		}';
//	var client = new SparqlClient(endpoint);
//	console.log("Query to " + endpoint);
//	console.log("Query: " + query);
//	client.query(query).execute(function(error, results) {
//		process.stdout.write(util.inspect(arguments, null, 20, true) + "\n");
//		return res.json(results);
//	});
//});
//
//router.route('/artists/:id').get(function(req, res) {
//	pm.login({
//		email : config.email,
//		password : config.password
//	}, function(err, resp) {
//		console.log(err, resp);
//	});
//
//	pm.init(config, function(err) {
//		if (err) {
//			return console.log("error", err);
//		}
//		pm.getArtist(req.params.id, true, 10, 5, function(err, data) {
//			return res.json(data);
//		});
//	});
//});
//
//module.exports = router;
