(function() {
	'use strict';

	angular.module('app').factory('ContextualMenuService', ContextualMenuService);

	ContextualMenuService.$inject = ['$mdBottomSheet', '$mdDialog'];
	function ContextualMenuService($mdBottomSheet, $mdDialog) {
		var service = {};

		service.SongMenu = SongMenu;
		service.PlaylistMenu = PlaylistMenu;
		service.ArtistMenu = ArtistMenu;
		service.AlbumMenu = AlbumMenu;
		
		return service;

		
		function SongMenu($event, callback) {
			$mdDialog.show({
				template : '<md-dialog aria-label="Add Playlist">	<md-content class="md-padding">		<md-list>		<md-item>			<md-item-content md-ink-ripple flex class="inset">				<a flex aria-label="Follow" ng-click="listItemClick($index)">					<span class="md-inline-list-icon-label">Follow</span>				</a>			</md-item-content>		</md-item>		<md-item>			<md-item-content md-ink-ripple flex class="inset">				<a flex aria-label="Remove" ng-click="listItemClick($index)">					<span class="md-inline-list-icon-label">Follow</span>				</a>			</md-item-content>		</md-item>	</md-list>	</md-content></md-dialog>',
				controller : 'DashboardController',
				targetEvent : $event
			}).then(function(clickedItem) {
				callback(clickedItem.name);
			});
		}

		function ArtistMenu($event, callback) {
			$mdBottomSheet.show({
				template : '<md-bottom-sheet class="md-list md-has-header">	<md-subheader>Settings</md-subheader>	<md-list>		<md-item>			<md-item-content md-ink-ripple flex class="inset">				<a flex aria-label="Follow" ng-click="listItemClick($index)">					<span class="md-inline-list-icon-label">Follow</span>				</a>			</md-item-content>		</md-item>		<md-item>			<md-item-content md-ink-ripple flex class="inset">				<a flex aria-label="Remove" ng-click="listItemClick($index)">					<span class="md-inline-list-icon-label">Follow</span>				</a>			</md-item-content>	</md-item>	</md-list></md-bottom-sheet>',
				controller : 'DashboardController',
				targetEvent : $event
			}).then(function(clickedItem) {
				callback(clickedItem.name);
			});
		}

		function PlaylistMenu($event, callback) {
			$mdBottomSheet.show({
				template : '<md-bottom-sheet class="md-list md-has-header">	<md-subheader>Settings</md-subheader>	<md-list>		<md-item>			<md-item-content md-ink-ripple flex class="inset">				<a flex aria-label="Follow" ng-click="listItemClick($index)">					<span class="md-inline-list-icon-label">Follow</span>				</a>			</md-item-content>		</md-item>		<md-item>			<md-item-content md-ink-ripple flex class="inset">				<a flex aria-label="Remove" ng-click="listItemClick($index)">					<span class="md-inline-list-icon-label">Follow</span>				</a>			</md-item-content>	</md-item>	</md-list></md-bottom-sheet>',
				controller : 'DashboardController',
				targetEvent : $event
			}).then(function(clickedItem) {
				callback(clickedItem.name);
			});
		}
		
		function AlbumMenu($event, callback) {
			$mdBottomSheet.show({
				template : '<md-bottom-sheet class="md-list md-has-header">	<md-subheader>Settings</md-subheader>	<md-list>		<md-item>			<md-item-content md-ink-ripple flex class="inset">				<a flex aria-label="Follow" ng-click="listItemClick($index)">					<span class="md-inline-list-icon-label">Follow</span>				</a>			</md-item-content>		</md-item>		<md-item>			<md-item-content md-ink-ripple flex class="inset">				<a flex aria-label="Remove" ng-click="listItemClick($index)">					<span class="md-inline-list-icon-label">Follow</span>				</a>			</md-item-content>	</md-item>	</md-list></md-bottom-sheet>',
				controller : 'DashboardController',
				targetEvent : $event
			}).then(function(clickedItem) {
				callback(clickedItem.name);
			});
		}
	}
})();