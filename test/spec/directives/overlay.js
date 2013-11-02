'use strict';

describe('Directive: overlay', function () {
	var scope;
	var elem;
	var directive;
	var compiled;
	var html;

	beforeEach(function() {
		module('billsApp')

		html = '<div class="overlay"></div>';

		inject(function($compile, $rootScope) {
			//create a scope (you could just use $rootScope, I suppose)
			scope = $rootScope.$new();

			scope.overlayShowing = false;

			//get the jqLite or jQuery element
			elem = angular.element(html);
			//compile the element into a function to 
			// process the view.
			compiled = $compile(elem);
			//run the compiled view.
			compiled(scope);
			//call digest on the scope!
			scope.$digest();
		});
	});

	describe("when `scope.overlayShowing` is false", function() {
		it("should not have css property display:none", function() {
			expect(elem.css('display')).toEqual('none');
		});
	});

	describe("when `scope.overlayShowing` is true", function() {
		it("should not have css property display:none", function() {
			expect(elem.css('display')).toEqual('none');
			scope.overlayShowing = true;
			scope.$digest();
			expect(elem.css('display')).toEqual('block');
		});
	});
});
