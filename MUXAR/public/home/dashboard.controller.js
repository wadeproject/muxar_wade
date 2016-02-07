(function() {
	'use strict';

	angular.module('app').controller('DashboardController', DashboardController).config(function($mdThemingProvider) {
		var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
			'contrastDefaultColor' : 'light',
			'contrastDarkColors' : [ '50' ],
			'50' : 'ffffff'
		});
		$mdThemingProvider.definePalette('customBlue', customBlueMap);
		$mdThemingProvider.theme('default').primaryPalette('customBlue', {
			'default' : '500',
			'hue-1' : '50'
		}).accentPalette('pink');
		$mdThemingProvider.theme('input', 'default').primaryPalette('grey');
	});

	DashboardController.$inject = [ 'AuthenticationService', 'SearchService', 'UtilsService', 'UserService', 'PlaylistService', 'InterestsService', 'RecommendationsService', 'ContextualMenuService', 'FavoritesService', 'GenreService', '$rootScope', '$mdDialog', '$cookieStore', '$location', '$mdBottomSheet', '$q' ];
	function DashboardController(AuthenticationService, SearchService, UtilsService, UserService, PlaylistService, InterestsService, RecommendationsService, ContextualMenuService, FavoritesService, GenreService, $rootScope, $mdDialog, $cookieStore, $location, $mdBottomSheet, $q) {
		var vm = this;
		vm.username = $cookieStore.get("email");
		vm.searchKey = "";
		vm.searchfor = "";
		vm.searchresults = [];
		vm.playlist = {
			name : ""
		};
		vm.genres = [];
		vm.playlists = [];
		vm.playlistsentries = [];
		vm.favorites = [];
		vm.listenLater = [];

		vm.recommendations = {
			artists : [],
			songs : []
		};

		vm.interests = {
			artists : [],
			albums : [],
			songs : []
		};

		initController();

		function initController() {
			loadPlaylists();
			loadPlaylistsEntries();
			loadFavorites();

			var myPromise = loadInterests();
			myPromise.then();

			var finished = $q.all([ myPromise ]);

			finished.then(function() {
				loadRecommendations();
			});
		}

		function loadPlaylists() {
			PlaylistService.GetPlaylists(function(res) {
				var results = res;
				for (var idx = 0; idx < results.length; idx++) {
					var r = results[idx];
					var pl = {
						id : r.id,
						name : r.name
					};
					vm.playlists.push(pl);
				}
				console.log(vm.playlists);
			});
		}

		function loadPlaylistsEntries() {
			PlaylistService.GetPlaylistsEntries(function(res) {
				var results = res;
				for (var idx = 0; idx < results.length; idx++) {
					var r = results[idx];
					var entry = {
						id : r.songId,
						plId : r.plId,
						title : r.title,
						artist : r.artist,
						album : r.album
					};
					vm.playlistsentries.push(entry);
				}
				console.log(vm.playlistsentries);
			});
		}
		function loadFavorites() {
			FavoritesService.GetFavorites(function(res) {
				var favs = res.track;
				for (var idx = 0; idx < favs.length; idx++) {
					var fav = favs[idx];
					var favEntry = {
						title : fav.title,
						artist : fav.artist,
						album : fav.album,
						image : fav.artistImage[0].url
					}
					vm.favorites.push(favEntry);
				}
			});
		}

		function loadInterests() {
			var defer = $q.defer();

			InterestsService.GetArtists(function(res) {
				var artists = JSON.parse(res);
				for (var idx = 0; idx < artists.results.bindings.length; idx++) {
					vm.interests.artists.push(artists.results.bindings[idx].artist.value);
				}
				defer.resolve(vm.interests.artists);
			});

			InterestsService.GetAlbums(function(res) {
				var albums = JSON.parse(res);
				for (var idx = 0; idx < albums.results.bindings.length; idx++) {
					vm.interests.albums.push(albums.results.bindings[idx].album.value);
				}
			});

			InterestsService.GetSongs(function(res) {
				var songs = JSON.parse(res);
				for (var idx = 0; idx < songs.results.bindings.length; idx++) {
					vm.interests.songs.push(songs.results.bindings[idx].song.value);
				}
			});

			return defer.promise;
		}

		function loadRecommendations() {
			var artists = vm.interests.artists;
			for (var idx = 0; idx < artists.length; idx++) {
				var artist = artists[idx];
				RecommendationsService.GetAssociatedBands(artist, function(res) {
					for (var idx = 0; idx < res.results.bindings.length; idx++) {
						vm.recommendations.artists.push(res.results.bindings[idx].bands.value);
					}
				});
			}
			var idx1 = UtilsService.Random(0, artists.length);
			var idx2 = UtilsService.Random(0, artists.length);
			var artist1 = artists[idx1];
			var artist2 = artists[idx2];
			RecommendationsService.GetCommonSongs(artist1, artist2, function(res) {
				for (var idx = 0; idx < res.results.bindings.length; idx++) {
					vm.recommendations.songs.push(res.results.bindings[idx].song.value);
				}
			});

			RecommendationsService.GetSongsWrittenBy(artist1, function(res) {
				for (var idx = 0; idx < res.results.bindings.length; idx++) {
					if (vm.recommendations.songs.indexOf(res.results.bindings[idx].song.value) == -1) {
						vm.recommendations.songs.push(res.results.bindings[idx].song.value);
					}
				}
			})

			var myPromise = getGenres();
			myPromise.then();
			var finished = $q.all([ myPromise ]);
			var genre = vm.genres[UtilsService.Random(0, vm.genres.length)];
			finished.then(function() {
				RecommendationsService.GetSongsByGenre(artist, genre, function(res) {
					for (var idx = 0; idx < res.results.bindings.length; idx++) {
						if (vm.recommendations.songs.indexOf(res.results.bindings[idx].song.value) == -1) {
							vm.recommendations.songs.push(res.results.bindings[idx].song.value);
						}
					}
				});
			});

		}

		function getGenres() {
			var defer = $q.defer();

			GenreService.GetGenres(function(res) {
				for (var idx = 0; idx < res.results.bindings.length; idx++) {
					vm.genres.push(res.results.bindings[idx].genre.value);
				}
				defer.resolve(vm.genres);
			})
			return defer.promise;
		}

		vm.logout = function() {
			AuthenticationService.Logout(function(response) {
				if (response.success) {
					AuthenticationService.ClearCredentials();
					$location.path('/login');
				} else {
					FlashService.Error(response.message);
					vm.dataLoading = false;
				}
			});
		}

		vm.search = function() {
			vm.searchresults = [];
			SearchService.Search(vm.searchKey, function(res) {
				var results = res;
				console.log(results);
				for (var idx = 0; idx < results.length; idx++) {
					var r = results[idx];
					if (r.track) {
						var entry = {
							id : r.nId,
							title : r.track.title,
							artist : r.track.artist,
							album : r.track.album,
							image : r.track.albumArtRef[0].url
						};
						vm.searchresults.push(entry);
					}
				}
			})
		}

		// playlists
		vm.createPlaylist = function() {
			console.log("creating");
			console.log(vm.playlist.name, vm.playlist.description);
		}

		vm.deletePlaylist = function() {
			console.log("delete");
			console.log(playlist.name, playlist.description);
		}

		vm.addSongToPlaylist = function() {

		}

		// dialogs
		vm.showSongMenu = function($event) {
			ContextualMenuService.SongMenu($event, function() {
				console.log("here");
			})
		};
		vm.showArtistMenu = function($event) {
			ContextualMenuService.ArtistMenu($event, function() {
				console.log("here");
			})
		};
		vm.showPlaylistMenu = function($event) {
			ContextualMenuService.PlaylistMenu($event, function() {
				console.log("here");
			})
		};
		vm.showAlbumMenu = function($event) {
			ContextualMenuService.AlbumMenu($event, function() {
				console.log("here");
			})
		};
		vm.showAdd = function($event) {
			$mdDialog.show({
				controller : DashboardController,
				template : '<md-dialog aria-label="Add">	<md-content class="md-padding">		<form name="userForm" ng-submit="vm.createPlaylist()">			<div layout layout-sm="column">				<md-input-container flex>					<label>Name</label>					<input ng-model="vm.playlist.name" placeholder="Placeholder text">					</md-input-container>					<md-input-container flex>						<label>Description</label>						<input ng-model="vm.playlist.desc">						</md-input-container>					</div>				</form>			</md-content>			<div class="md-actions" layout="row">				<span flex/>				<md-button ng-click="vm.close()"> Cancel </md-button>				<md-button type="submit" class="md-primary"> Save </md-button>			</div>		</md-dialog>',
				targetEvent : $event,
			}).then(function(answer) {
				vm.createPlaylist();
			}, function() {
				vm.createPlaylist();
			});
		};

		// dummy data
		vm.items = [ {
			name : 'Share',
			icon : 'share'
		}, {
			name : 'Upload',
			icon : 'upload'
		}, {
			name : 'Copy',
			icon : 'copy'
		}, {
			name : 'Print this page',
			icon : 'print'
		}, ];
	}
})();