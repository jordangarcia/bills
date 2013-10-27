'use strict';

angular.module('billsApp', ['hmTouchevents', 'LocalStorageModule'])
.constant('AUTOLOAD', true)
.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'views/people.html',
		controller: 'PeopleCtrl'
	})
	.when('/items', {
		templateUrl: 'views/items.html',
		controller: 'ItemsCtrl'
	})
	.when('/summary', {
		templateUrl: 'views/summary.html',
		controller: 'SummaryCtrl'
	})
	.otherwise({
		redirectTo: '/'
	});
}]);

