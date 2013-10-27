'use strict';

angular.module('billsApp')
	.controller('ItemsCtrl', ['$scope', 'appModel', function ($scope, appModel) {
		$scope.model = appModel;

		$scope.itemAction = 'add';

		$scope.editingItem;

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
		 * Checks if a personId is a person in the currentItem
		 *
		 * @param {Integer} personId
		 * @return {Boolean}
		 */
		$scope.addItem = function(item) {
			$scope.model.items.push(item);
		};

		$scope.editItem = function(item) {
			$scope.editingItem = item;
			$scope.currentItem = angular.copy(item);
			$scope.itemAction = 'edit';
		};

		$scope.cancelEdit = function() {
			$scope.itemAction = 'add';
			$scope.resetCurrentItem();
			$scope.editingItem = null;
		};

		$scope.resetCurrentItem = function() {
			$scope.currentItem = {};
			$scope.currentItem.name = '';
			$scope.currentItem.price = 0;
			$scope.currentItem.people = [];
		};

		$scope.submitItem = function() {
			if ($scope.itemAction == 'add') {
				$scope.model.items.push($scope.currentItem);
				$scope.resetCurrentItem();
			} else if ($scope.itemAction == 'edit') {
				// replace item in array with the current edited values
				$scope.model.items[$scope.model.items.indexOf($scope.editingItem)] = $scope.currentItem;

				$scope.cancelEdit();
			}
		};

		$scope.resetCurrentItem();

		/**
		 * @param {Object} item
		 */
		$scope.deleteItem = function(item) {
			$scope.model.delete('items', item);
		};
	}]);
