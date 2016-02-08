(function() {
	'use strict';

	angular.module('app').factory('InterestsService', InterestsService);

	InterestsService.$inject = [ '$http', '$rootScope', ];
	function InterestsService($http, $rootScope) {
		var service = {};

		service.GetArtists = GetArtists;
		service.GetAlbums = GetAlbums;
		service.GetSongs = GetSongs;

		return service;

		function GetArtists(callbackOK, callbackERR) {
			$http({
				method : "GET",
				url : "/api/interests/artists"
			}).then(function mySucces(response) {
				console.log(response);
				callbackOK(response.data);
			}, function myError(response) {
				callbackERR(response.statusText);
			});
		}

		function GetAlbums(callbackOK, callbackERR) {
			$http({
				method : "GET",
				url : "/api/interests/albums"
			}).then(function mySucces(response) {
				callbackOK(response.data);
			}, function myError(response) {
				callbackERR(response.statusText);
			});
		}

		function GetSongs(callbackOK, callbackERR) {
			$http({
				method : "GET",
				url : "/api/interests/songs"
			}).then(function mySucces(response) {
				callbackOK(response.data);
			}, function myError(response) {
				callbackERR(response.statusText);
			});
		}
	}
})();