(function() {
	'use strict';

	angular.module('app').factory('RecommendationsService', RecommendationsService);

	RecommendationsService.$inject = [ '$http', '$rootScope', ];
	function RecommendationsService($http, $rootScope) {
		var service = {};

		service.GetAssociatedBands = GetAssociatedBands;
		service.GetCommonSongs = GetCommonSongs;
		service.GetSongsByGenre = GetSongsByGenre;
		service.GetSongsWrittenBy = GetSongsWrittenBy;
		service.GetEvents = GetEvents;

		return service;

		function GetAssociatedBands(artist, callback) {
			$http({
				url:"/api/recommendation/associatedbands",
				method: "GET",
				params:{
					artist: artist
				}
			}).success(function(response) {
				callback(response);
			});
		}

		function GetCommonSongs(artist1, artist2, callback) {
			$http({
				url:"/api/recommendation/commonsongs",
				method: "GET",
				params:{
					artist1: artist1,
					artist2: artist2
				}
			}).success(function(response) {
				callback(response);
			});
		}

		function GetSongsByGenre(artist, genre, callback) {
			$http({
				url:"/api/recommendation/songsbygenre",
				method: "GET",
				params:{
					artist: artist,
					genre: genre
				}
			}).success(function(response) {
				callback(response);
			});
		}
		
		function GetSongsWrittenBy(artist, callback) {
			$http({
				url:"/api/recommendation/writtenby",
				method: "GET",
				params:{
					artist: artist,
				}
			}).success(function(response) {
				callback(response);
			});
		}

		function GetEvents(location, date, callback) {
			$http({
				url:"/api/recommendation/events",
				method: "GET",
				params:{
					location: location,
					date: date,
				}
			}).success(function(response) {
				callback(response);
			});
		}
	}
})();