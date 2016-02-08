var express = require('express');
var fs = require('fs');
var PlayMusic = require('../bin/play');
var request = require('request');
var SparqlClient = require('sparql-client');
var util = require('util');
var seqqueue = require('seq-queue');

var queue = seqqueue.createQueue(1000);

var endpoint = 'http://dbpedia.org/sparql';
var pm = new PlayMusic();
var router = express.Router();
var config = JSON.parse(fs.readFileSync("config.json"));

function getArtistURI(artist, callback) {
	var query = 'select distinct ?person where {\
	    		?person dbp:name ?name;\
				rdf:type dbo:MusicalArtist.\
				filter(regex(?name, "' + artist + '", "i"))\
				} limit 1';
	var client = new SparqlClient(endpoint);
	client.query(query).execute(function(error, results) {
		console.log("GET ART URI");
		callback(error, error ? null : results.results.bindings[0].person.value);
		// if (!results.results.bindings && results.results.bindings !==
		// 'undefined' && !(typeof results.results.bindings !== "undefined")) {
		// if (results.results.bindings.length > 0) {
		// callback(results.results.bindings[0].person.value);
		// }
		// }
		// callback(error, error ? null : "");
	});
}

function getTrackURI(trackName, artistUri, callback) {
	var query = 'select distinct ?song where {\
	    ?song dbp:name ?name;\
		rdf:type dbo:Single;\
		rdf:type dbo:MusicalWork;\
		dbp:artist <' + artistUri + '>\
		filter(regex(?name, "' + trackName + '", "i"))\
		} limit 1';
	var client = new SparqlClient(endpoint);
	client.query(query).execute(function(error, results) {
		console.log("GET TR URI");
		callback(error, error ? null : results.results.bindings[0].song.value);
		// if (!results.results.bindings && results.results.bindings !==
		// 'undefined' && !(typeof results.results.bindings === "undefined")) {
		// if (results.results.bindings.length > 0) {
		// callback(results.results.bindings[0].song.value);
		// }
		// }
		// callback(error, error ? null : "");
	});
}

function getAlbumURI(albumName, artistUri, callback) {
	var query = 'select distinct ?album where {\
	    ?album dbp:name ?name;\
		rdf:type dbo:Album;\
		rdf:type dbo:MusicalWork;\
		dbp:artist <' + artistUri + '>\
		filter(regex(?name, "' + albumName + '", "i"))\
		} limit 1';
	var client = new SparqlClient(endpoint);
	client.query(query).execute(function(error, results) {
		console.log("GET AL URI");
		callback(error, error ? null : results.results.bindings[0].album.value);
		// if (!results.results.bindings && results.results.bindings !==
		// 'undefined' && typeof results.results.bindings !== "undefined") {
		// if (results.results.bindings.length > 0) {
		// callback(results.results.bindings[0].album.value);
		// }
		// }
		// callback(error, error ? null : "");
	});
}

function insertArtistUri(artistUri, userUri) {
	var auth = 'Basic ' + new Buffer('dav' + ':' + 'dav').toString('base64');

	var query = 'prefix dbo: <http://dbpedia.org/ontology/>\
		insert data into <http://wadeproject.com/> {\
	       <' + userUri + '> foaf:interest <' + artistUri + '>.\
	       <' + artistUri + '> rdf:type dbo:MusicalArtist.\
	}';

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

function insertTrackUri(trackUri, userUri) {
	var auth = 'Basic ' + new Buffer('dav' + ':' + 'dav').toString('base64');

	var query = 'prefix dbo: <http://dbpedia.org/ontology/>\
				insert data into <http://wadeproject.com/> {\
		       <' + userUri + '> foaf:interest <' + trackUri + '>.\
		    	<' + trackUri + '> rdf:type dbo:Single;\
		            rdf:type dbo:MusicalWork.\
				}\
				}';

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
		}
	});
}

function insertAlbumUri(albumUri, userUri) {
	var auth = 'Basic ' + new Buffer('dav' + ':' + 'dav').toString('base64');

	var query = 'prefix dbo: <http://dbpedia.org/ontology/>\
				insert data into <http://wadeproject.com/> {\
		        <' + userUri + '> foaf:interest <' + albumUri + '>.\
		        <' + albumUri + '> rdf:type dbo:Album;\
		            rdf:type dbo:MusicalWork.\
				}';

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
		}
	});
}
var artistUri = "";
var trackUri = "";
var albumUri = "";
router.route('/trackData').get(function(req, res) {
	pm.login({
		email : config.email,
		password : config.password
	}, function(err, resp) {
		console.log(err, resp);
	});

	pm.init(config, function(err) {
		if (err) {
			return console.log("error", err);
		}
		pm.getPlayListEntries(function(err, data) {
			var userUri = req.session.userUri;
			// data.data.items.length
			for (var index = 0; index < 1; ++index) {
				var item = data.data.items[index];
				var artistName = item.track.artist;
				var trackName = item.track.title;
				var albumName = item.track.album;

				queue.push(function(task) {
					getArtistURI(artistName, function(err, data) {
						console.log("GET ART: " + data);
						artistUri = data;
						task.done();
					});
				}, function() {
					console.log('task timeout');
				}, 1000);
				if (!artistUri) {
					queue.push(function(task) {
						console.log("INSERT ART: " + artistUri);
						insertArtistUri(artistUri, userUri);
						task.done();
					});
					queue.push(function(task) {
						getTrackURI(trackName, artistUri, function(err, data) {
							console.log("GET TR: " + data);
							trackUri = data;
						});
						getAlbumURI(albumName, artistUri, function(err, data) {
							console.log("GET AL: " + data);
							albumUri = data;
						});
						task.done();
					});

					queue.push(function(task) {
						if (!trackUri) {
							console.log("INSERT TR: " + trackUri);
							insertTrackUri(trackUri, userUri);
						}
						if (!albumUri) {
							console.log("INSERT AL: " + albumUri);
							insertAlbumUri(albumUri, userUri);
						}
						task.done();
					});

					// queue.push(function(task) {
					//						
					// task.done();
					// }, function() {
					// console.log('task timeout');
					// }, 1000);

					queue.push(function(task) {
						if (!albumUri) {
							console.log("INSERT AL: " + albumUri);
							insertAlbumUri(albumUri, userUri);
						}
						task.done();
					}, function() {
						console.log('task timeout');
					}, 1000);
				}
				// var artistUri = getArtistURI(artistName, function(err, data)
				// {
				// console.log("INSERT: " + data);
				// insertArtistUri(data, userUri);
				// });
				// getTrackURI(trackName, artistUri, function(err, data) {
				// console.log("INSERT: " + data);
				// insertTrackUri(data, userUri);
				// });
				// getAlbumURI(albumName, artistUri, function(err, data) {
				// console.log("INSERT: " + data);
				// insertAlbumUri(data, userUri);
				// });
			}
			return res.json(data);
		});
	});
});

module.exports = router;
