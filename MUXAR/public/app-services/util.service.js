(function() {
	'use strict';

	angular.module('app').factory('UtilsService', UtilsService);

	UtilsService.$inject = [];
	function UtilsService() {
		var service = {};

		service.Random = Random;
		service.Shuffle = Shuffle;

		return service;

		function Random(min, max) {
			return Math.floor(Math.random() * (max - min) + min);
		}

		function Shuffle(o) {
			for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
				return o;
		}
	}
})();