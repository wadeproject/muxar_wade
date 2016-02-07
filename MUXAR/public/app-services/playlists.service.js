(function() {
	'use strict';

	angular.module('app').factory('PlaylistService', PlaylistService);

	PlaylistService.$inject = [ '$http', '$cookieStore', '$rootScope', '$timeout', 'UserService' ];
	function PlaylistService($http, $cookieStore, $rootScope, $timeout, UserService) {
		var service = {};

		service.GetPlaylists = GetPlaylists;
		service.GetPlaylistsEntries = GetPlaylistsEntries;
		
		return service;

		function GetPlaylists(callback) {
			$http.get('/api/playlists').success(function(response) {
				callback(response);
			});
		}
		
		function GetPlaylistsEntries(callback) {
			$http.get('/api/playlistsentries').success(function(response) {
				callback(response);
			});
		}
	}

})();