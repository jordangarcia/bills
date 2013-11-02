'use strict';

angular.module('billsApp')
.controller('SummaryCtrl', ['$scope', 'appModel', function ($scope, model) {
	$scope.model = model;

	$scope.selectedPerson = null;

	$scope.togglePerson = function(person) {
		if ($scope.selectedPerson === person) {
			$scope.selectedPerson = null;
		} else {
			$scope.selectedPerson = person;
		}
	};

	$scope.newSubtotal = {
		name: '',
		percent: 0,
	};

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
}]);
