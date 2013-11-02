'use strict';

angular.module('billsApp')
.directive('overlay', function () {
	return {
		restrict: 'C',
		link: function($scope, element, attrs) {
			$scope.$watch('overlayShowing', function(value) {
				if (value) {
					element.css('display', 'block');
				} else {
					element.css('display', 'none');
				}
			});
		}
	};
});
