var express = require('express');
var request = require('request');

var router = express.Router();

router.route('/genres').get(function(req, res) {
	var SparqlClient = require('sparql-client');
	var util = require('util');
	var endpoint = 'http://dbpedia.org/sparql';

	var query = 'select distinct ?genre where {\
		?genre a dbo:MusicGenre.\
		filter(regex(?genre, "_music$", "i"))\
		}';
	var client = new SparqlClient(endpoint);
	client.query(query)
	  .execute(function(error, results) {
		  var response = {
				status: 500,
				message: "Internal server error"
			};
			if(!error) {
				return res.json(results);
		    }
			else{
				return res.json(response);
			}
	});
});

module.exports = router;
