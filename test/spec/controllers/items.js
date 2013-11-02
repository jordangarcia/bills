'use strict';

describe('Controller: ItemsCtrl', function () {

	// load the controller's module
	beforeEach(function() {
		module('billsApp');
		module(function($provide) {
			$provide.constant('AUTOLOAD', false);
		});
	});

	var ItemsCtrl;
	var scope;
	var theAppModel;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope, appModel) {
		scope = $rootScope.$new();
		theAppModel = appModel;
		ItemsCtrl = $controller('ItemsCtrl', {
			$scope: scope,
			appModel: appModel,
		});
	}));

	describe("#resetCurrentItem", function() {
		it("should reset the $scope.current item with name, price and people", function() {
			scope.resetCurrentItem();
			expect(scope.currentItem.name).toBe('');
			expect(scope.currentItem.price).toBe(0);
			expect(scope.currentItem.people).toEqual([]);
		});
	});

	describe("#selectPerson", function() {
		beforeEach(function() {
			scope.resetCurrentItem();
		});
		describe("when the personId is NOT in the currentPeople", function() {
			it("should push the person id to currentItem.people", function() {
				var personId = 123;
				scope.selectPerson(personId);
				expect(scope.currentItem.people[0]).toBe(personId);
			});
		});
		describe("when the personId is in the currentPeople", function() {
			it("should push the person id to currentItem.people", function() {
				var personId = 123;
				scope.currentItem.people.push(personId);
				scope.selectPerson(personId);
				expect(scope.currentItem.people[0]).toBe(undefined);
			});
		});
	});

	describe("#editItem", function() {
		it("should backup the passed item in $scope.editingItem", function() {
			var item = {
				name: 'item1',
				price: 14.95,
				people: []
			};
			scope.editItem(item);
			expect(scope.editingItem).toBe(item);
		});

		it("should should copy the item to the currentItem", function() {
			var item = {
				name: 'item1',
				price: 14.95,
				people: []
			};
			scope.editItem(item);
			expect(scope.currentItem).not.toBe(item);
			expect(scope.currentItem).toEqual(item);
		});

		it("should change the item action to 'edit'", function() {
			var item = {
				name: 'item1',
				price: 14.95,
				people: []
			};
			scope.editItem(item);
			expect(scope.itemAction).toBe('edit');
		});
	});

	describe("#cancelEdit", function() {
		beforeEach(function() {
			var item = {
				name: 'item1',
				price: 14.95,
				people: []
			};
			scope.currentItem = angular.copy(item);
			scope.editingItem = item;
			scope.itemAction = 'edit';
		});

		it("it should change the itemAction", function() {
			scope.cancelEdit();
			expect(scope.itemAction).toBe('add');
		});

		it("should call resetCurrentItem", function() {
			spyOn(scope, 'resetCurrentItem');

			scope.cancelEdit();
			expect(scope.resetCurrentItem).toHaveBeenCalled();
		});

		it("should set editingItem to null", function() {
			scope.cancelEdit();
			expect(scope.editingItem).toBe(null);
		});
	});

	describe("#submitItem", function() {
		describe("when the itemAction is add", function() {
			beforeEach(function() {
				scope.itemAction = 'add';
			});

			it("should push the currentItem to model.items", function() {
				var item = {
					name: 'item1',
					price: 14.95,
					people: []
				};

				scope.currentItem = item;
				scope.submitItem();
				expect(scope.model.items[0]).toBe(item);
			});
			it("should call resetCurrentItem", function() {
				var item = {
					name: 'item1',
					price: 14.95,
					people: []
				};
				spyOn(scope, 'resetCurrentItem');

				scope.currentItem = item;
				scope.submitItem();
				expect(scope.resetCurrentItem).toHaveBeenCalled();
			});
		});
		describe("when the itemAction is edit", function() {
			beforeEach(function() {
				scope.itemAction = 'edit';
			});

			it("should replace the model.items entry with the edited item", function() {
				var item = {
					name: 'item1',
					price: 14.95,
					people: []
				};

				scope.model.items.push(item);
				scope.editItem(item);

				scope.currentItem.name = 'edited';
				scope.currentItem.price = 12;
				scope.currentItem.people = [];

				var currentItemRef = scope.currentItem;

				scope.submitItem();

				expect(scope.model.items[0]).toBe(currentItemRef);
			});

			it("should call cancelEdit", function() {
				spyOn(scope, 'cancelEdit');

				var item = {
					name: 'item1',
					price: 14.95,
					people: []
				};

				scope.model.items.push(item);
				scope.editItem(item);

				scope.submitItem();

				expect(scope.cancelEdit).toHaveBeenCalled();
			});
		});
	});

});
