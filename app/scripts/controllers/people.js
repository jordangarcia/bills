'use strict';

angular.module('billsApp')
	.controller('PeopleCtrl', ['$scope', 'appModel', function ($scope, model) {
		$scope.model = model;

		$scope.addPerson = function() {
			$scope.model.addPerson({
				name: $scope.personName,
				items: []
			});
			$scope.personName = '';
		};

		$scope.deletePerson = function(person) {
			$scope.model.deletePerson('people', person);
		};
	}]);
