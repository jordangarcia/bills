'use strict';

angular.module('billsApp')
	.controller('ItemsCtrl', ['$scope', 'appModel', function ($scope, appModel) {
		$scope.model = appModel;

		$scope.itemAction = 'add';

		$scope.editingItem;

		/**
		 * Toggles the person select
		 */
		$scope.selectPerson = function(personId) {
			var ind = $scope.currentItem.people.indexOf(personId);
			if (ind > -1) {
				// person is already in selected people UNSELECT
				$scope.currentItem.people.splice(ind, 1);
			} else {
				$scope.currentItem.people.push(personId);
			}
		};

		/**
		 * Checks if a personId is a person in the currentItem
		 *
		 * @param {Integer} personId
		 * @return {Boolean}
		 */
		$scope.isSelected = function(personId) {
			var ind = $scope.currentItem.people.indexOf(personId);
			return (ind > -1);
		};

		/**
		 * Backs up the passed in `item` and makes a copy to show in the edit item area
		 *
		 * @param {Object} item
		 */
		$scope.editItem = function(item) {
			$scope.editingItem = item;
			$scope.currentItem = angular.copy(item);
			$scope.itemAction = 'edit';
		};

		/**
		 * Cancels and rests current item
		 */
		$scope.cancelEdit = function() {
			$scope.itemAction = 'add';
			$scope.resetCurrentItem();
			$scope.editingItem = null;
		};

		/**
		 * Nulls out the currentItem
		 */
		$scope.resetCurrentItem = function() {
			$scope.currentItem = {};
			$scope.currentItem.name = '';
			$scope.currentItem.price = 0;
			$scope.currentItem.people = [];
		};

		/**
		 * @param {Object} item
		 */
		$scope.deleteItem = function(item) {
			$scope.model.delete('items', item);
		};

		/**
		 * Handles persisting item based on the itemAction
		 */
		$scope.submitItem = function() {
			if ($scope.itemAction == 'add') {
				$scope.model.addItem($scope.currentItem);
				$scope.resetCurrentItem();
			} else if ($scope.itemAction == 'edit') {
				$scope.model.replaceItem($scope.editingItem, $scope.currentItem);
				$scope.cancelEdit();
			}
		};

		$scope.resetCurrentItem();
	}]);
