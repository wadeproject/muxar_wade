var express = require('express');
var request = require('request');
var SparqlClient = require('sparql-client');

var endpoint = 'http://dbpedia.org/sparql';
var router = express.Router();

router.route('/recommendation/associatedbands').get(function(req, res) {
	var band = req.param("artist");
	var query = 'select ?bands where {\
		   ?bands dbo:associatedBand <' + band + '>.\
		   } limit 10';
	var client = new SparqlClient(endpoint);
	client.query(query).execute(function(error, results) {
		return res.json(results);
	});
});

router.route('/recommendation/commonsongs').get(function(req, res) {
	var artistF = req.param("artist1");
	var artistS = req.param("artist2");
	var query = 'select ?song where {\
	     		?song dbo:musicalArtist <' + artistF + '>;\
	            dbo:musicalArtist <' + artistS + '>.\
				} limit 10';
	var client = new SparqlClient(endpoint);
	client.query(query).execute(function(error, results) {
		return res.json(results);
	});
});

router.route('/recommendation/songsbygenre').get(function(req, res) {
	var artist = req.param("artist");
	var genre = req.param("genre");
	var query = 'select distinct ?song where {\
	    		?song dbp:name ?name;\
				rdf:type dbo:Single;\
				rdf:type dbo:MusicalWork;\
				dbp:artist <' + artist + '>;\
				dbo:genre <' + genre + '>.\
				} limit 10';
	var client = new SparqlClient(endpoint);
	client.query(query).execute(function(error, results) {
		return res.json(results);
	});
});

router.route('/recommendation/writtenby').get(function(req, res) {
	var artist = req.param("artist");
	var query = 'select ?song where {\
	    		?song dbp:writer <' + artist + '>;\
	    		rdf:type dbo:MusicalWork;\
	          	rdf:type dbo:Single.\
				} limit 10';
	var client = new SparqlClient(endpoint);
	client.query(query).execute(function(error, results) {
		return res.json(results);
	});
});

router.route('/recommendation/events').get(function(req, res) {
	var location = req.param("location");
	var date = req.param("date");
	var query = 'select ?song where {\
	    		?song dbp:recorded <' + location + '>;\
	    		?song dbp:released <' + date + '>;\
	            rdf:type dbo:MusicalWork;\
	            rdf:type dbo:Single.\
				} limit 10';
	var client = new SparqlClient(endpoint);
	client.query(query).execute(function(error, results) {
		return res.json(results);
	});
});

module.exports = router;
