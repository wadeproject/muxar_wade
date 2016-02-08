var express = require('express');
var fs = require('fs');
var PlayMusic = require('../bin/play');

var pm = new PlayMusic();
var router = express.Router();
var config = JSON.parse(fs.readFileSync("config.json"));

router.route('/playlists').get(function(req, res) {
	pm.login({
		email : config.email,
		password : config.password
	}, function(err, resp) {
	});

	pm.init(config, function(err) {
		var playlists = [];
		if (err) {
			return console.log("error", err);
		}
		pm.getPlayLists(function(err, data) {

			var pls = data.data.items;
			for (var idx = 0; idx < pls.length; idx++) {
				var pl = pls[idx];
				var playlist = {
					id : pl.id,
					name : pl.name,
				};
				playlists.push(playlist);
			}
			return res.json(playlists);
		});
	});
})

router.route('/playlistsentries').get(function(req, res) {
	pm.login({
		email : config.email,
		password : config.password
	}, function(err, resp) {
		console.log(err, resp);
	});

	pm.init(config, function(err) {
		var entries = [];
		if (err) {
			return console.log("error", err);
		}

		pm.getPlayListEntries(function(err, data) {
			for (var index = 0; index < data.data.items.length; ++index) {
				var item = data.data.items[index];
				console.log(item);
				var img = "";
				if (item.track.artistArtRef && item.track.artistArtRef.length>0){
					img = item.track.artistArtRef[0].url;
				}
				var songEntry = {
					plId : item.playlistId,
					songId : item.id,
					title : item.track.title,
					artist : item.track.artist,
					album : item.track.album,
					image : img
				}
				entries.push(songEntry);
			}

			return res.json(entries);
		});
	});
})

.post(function(req, res) {

});

router.route('/playlists/:id').put(function(req, res) {

}).get(function(req, res) {

});

module.exports = router;
