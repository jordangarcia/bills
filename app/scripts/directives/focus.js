'use strict';

angular.module('billsApp')
.directive('focus', function () {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var focusable = [];
			if (element[0].nodeName === 'INPUT') {
				focusable.push(element[0]);
				element[0].bind('focus', function() {
					scope.$apply(attrs.focus);
				});
			} else {
				focusable = Array.prototype.slice.call(element.find('input'));
			}
			focusable.forEach(function(el) {
				angular.element(el).bind('focus', function(e, data) {
					scope.$apply(attrs.focus);
				});
			});
		}
	};
});
