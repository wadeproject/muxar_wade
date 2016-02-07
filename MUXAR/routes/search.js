var express = require('express');
var fs = require('fs');
var PlayMusic = require('../bin/play');

var pm = new PlayMusic();
var router = express.Router();
var config = JSON.parse(fs.readFileSync("config.json"));

router.route('/search').get(function(req, res) {
	var ss = req.param("search");
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
		pm.search(ss, 25, function(err, data) {
			var songs = data.entries.sort(function(a, b) {
				return a.score < b.score;
			});
			return res.json(songs);
		}, function(message, body, err, httpResponse) {
			console.log(message);
		});

	});
})

.post(function(req, res) {

});

module.exports = router;
