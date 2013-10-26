'use strict';

angular.module('billsApp')
.directive('swiperight', function() {
	var listenOnce = function(el, eventName, fn) {
		var newFn = function(event) {
			fn(event);
			removeListener();
		};
		var removeListener = function() {
			el.removeEventListener(eventName, newFn);
		};
		el.addEventListener(eventName, newFn);
	};

	return {
		restrict: "A",
		scope: false,
		link: function(scope, element, attrs) {
			Hammer(element[0]).on('dragright', function(event) {
				var currentTarget = angular.element(event.currentTarget).addClass('swipe-overlay');
				var toShow = event.currentTarget.querySelector('.show-on-swiperight');
				angular.element(toShow).addClass('showing');
				// because chrome fires click -> doubletap -> click
				setTimeout(function(){
					listenOnce(document, 'tap', function() {
						setTimeout(function() {
							angular.element(document.querySelectorAll('.show-on-swiperight.showing')).removeClass('showing');
							currentTarget.removeClass('swipe-overlay');
						}, 0);
					});
				}, 0);
			});
		}
	}
});
