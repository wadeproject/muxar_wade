(function() {
	'use strict';

	angular.module('app').factory('GenreService', GenreService);

	GenreService.$inject = [ '$http', '$rootScope', ];
	function GenreService($http, $rootScope) {
		var service = {};

		service.GetGenres = GetGenres;

		return service;

		function GetGenres(callback) {
			$http({
				url:"/api/genres",
				method: "GET"
			}).success(function(response) {
				callback(response);
			});
		}
	}
})();