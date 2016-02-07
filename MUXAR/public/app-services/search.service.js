(function() {
	'use strict';

	angular.module('app').factory('SearchService', SearchService);

	SearchService.$inject = [ '$http', '$rootScope', ];
	function SearchService($http, $rootScope) {
		var service = {};

		service.Search = Search;

		return service;

		function Search(searchKey, callback) {
			$http({
				url:"/api/search",
				method: "GET",
				params:{
					search: searchKey
				}
			}).success(function(response) {
				callback(response);
			});
		}
	}
})();