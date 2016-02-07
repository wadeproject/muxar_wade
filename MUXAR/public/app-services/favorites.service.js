(function() {
	'use strict';

	angular.module('app').factory('FavoritesService', FavoritesService);

	FavoritesService.$inject = [ '$http', '$cookieStore', '$rootScope', '$timeout', 'UserService' ];
	function FavoritesService($http, $cookieStore, $rootScope, $timeout, UserService) {
		var service = {};

		service.GetFavorites = GetFavorites;

		return service;

		function GetFavorites(callback) {
			$http.get('/api/favorites').success(function(response) {
				callback(response);
			});
		}
	}

})();