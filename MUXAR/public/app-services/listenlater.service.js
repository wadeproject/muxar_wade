(function() {
	'use strict';

	angular.module('app').factory('ListenLaterService', ListenLaterService);

	ListenLaterService.$inject = [ '$http', '$rootScope', ];
	function ListenLaterService($http, $rootScope) {
		var service = {};

		service.AddToListenLater = AddToListenLater;
		service.GetAllListenLater = GetAllListenLater;

		return service;

		function AddToListenLater(callback) {
//			$http.get('/api/recommendation/associatedbands/:band').success(function(response) {
//				callback(response);
//			});
			
			$http.get({
				url:"/api/interests/artists",
				method: "GET"
			}).success(function(response) {
				callback(response);
			});
		}

		function GetAllListenLater(callback) {
			$http.get({
				url:"/api/interests/albums",
				method: "GET"
			}).success(function(response) {
				callback(response);
			});
		}
	}
})();