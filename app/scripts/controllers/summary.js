'use strict';

angular.module('billsApp')
.controller('SummaryCtrl', ['$scope', 'appModel', function ($scope, model) {
	$scope.model          = model;
	$scope.selectedPerson = null;
	$scope.editingGrat    = null;
	$scope.updatedGrat    = null;

	$scope.newSubtotal = {
		name: '',
		percent: 0,
	};

	/**
	 * Sets a gratuity as the one being edited
	 */
	$scope.editGratuity = function(grat) {
		$scope.editingGrat = grat;
		$scope.updatedGrat = angular.copy(grat);
	};

	/**
	 * Submits the gratuity and saves
	 */
	$scope.submitEdit = function() {
		$scope.model.replaceSubtotalGratuity($scope.editingGrat, $scope.updatedGrat);
		$scope.editingGrat = null;
		$scope.updatedGrat = null;
		$scope.model.save();
	};

	/**
	 * Toggles a person as the selectedPerson
	 *
	 * @param {Object} person
	 */
	$scope.togglePerson = function(person) {
		if ($scope.selectedPerson === person) {
			$scope.selectedPerson = null;
		} else {
			$scope.selectedPerson = person;
		}
	};

	/**
	 * Adds subtotal gratuity and resets form
	 */
	$scope.addSubtotalGratuity = function() {
		$scope.model.addSubtotalGratuity($scope.newSubtotal);
		$scope.newSubtotal = {
			name: '',
			percent: 0,
		};
		$scope.model.save();
	};

	/**
	 * @param {Object} grat
	 */
	$scope.deleteSubtotalGratuity = function(grat) {
		$scope.model.delete("subtotalGratuities", grat);
		$scope.model.save();
	};

	$scope.$parent.section = 'summary';
}]);
