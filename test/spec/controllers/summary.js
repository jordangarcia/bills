'use strict';

describe('Controller: SummaryCtrl', function () {

	// load the controller's module
	beforeEach(function() {
		module('billsApp');
		module(function($provide) {
			$provide.constant('AUTOLOAD', false);
			$provide.value('defaultGratuities', false);
		});
	});

	var SummaryCtrl;
	var AppModel;
	var scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope, appModel) {
		scope = $rootScope.$new();
		AppModel = appModel;
		SummaryCtrl = $controller('SummaryCtrl', {
			$scope: scope,
			appModel: appModel,
		});
	}));


	describe("#togglePerson", function() {
		describe("when selectedPerson is null", function() {
			it("should set the selectedPerson to the person", function() {
				var person = {
					id: 1,
					name: 'Jordan',
				};
				expect(scope.selectedPerson).toBe(null);
				scope.togglePerson(person);
				expect(scope.selectedPerson).toBe(person);
			});
		});
		describe("when selectedPerson is person1", function() {
			describe("when calling togglePerson with person1", function() {
				it("should set selectedPerson to `null`", function() {
					var person1 = {
						id: 1,
						name: 'Jordan',
					};
					scope.selectedPerson = person1;
					scope.togglePerson(person1);
					expect(scope.selectedPerson).toBe(null);
				});
			});
			describe("when calling togglePerson with person2", function() {
				it("should set the selectedPerson to the person", function() {
					var person1 = {
						id: 1,
						name: 'Jordan',
					};
					var person2 = {
						id: 2,
						name: 'Logan',
					};
					scope.selectedPerson = person1;
					scope.togglePerson(person2);
					expect(scope.selectedPerson).toBe(person2);
				});
			});
		});
	});

	describe("#addSubtotalGratuity", function() {
		it("should push the newSubtotal to the appModel", function() {
			var grat = {
				name: 'tax',
				percent: 10,
			};

			scope.newSubtotal = grat;

			scope.addSubtotalGratuity();

			expect(scope.model.subtotalGratuities[0]).toBe(grat);
		});

		it("should reset the newSubtotal", function() {
			var grat = {
				name: 'tax',
				percent: 10,
			};

			var resetGrat = {
				name: '',
				percent: 0,
			};

			scope.newSubtotal = grat;

			scope.addSubtotalGratuity();

			expect(scope.newSubtotal).toEqual(resetGrat);
		});
	});

	describe("#editGratuity", function() {
		it("should set scope.editingGratuity to the current", function() {
			var grat = {
				name: 'test',
				percent: 10
			};

			scope.editGratuity(grat);

			expect(scope.editingGrat).toBe(grat);
		});
		it("should copy grat to scope.updatedGrat", function() {
			var grat = {
				name: 'test',
				percent: 10
			};

			scope.editGratuity(grat);

			expect(scope.currentGrat).not.toBe(grat);
			expect(scope.updatedGrat).toEqual(grat);
		});

	});
});
