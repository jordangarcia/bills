'use strict';

describe('Service: Appmodel', function () {

	// load the service's module
	beforeEach(module('billsApp'));

	var Appmodel;
	var localStorageMock;

	var LOCAL_STORAGE_KEY = 'data';

	var person1 = {
		id: 1,
		name: 'person1',
	};

	var person2 = {
		id: 2,
		name: 'person2',
	};
	
	var item1 = {
		name: 'item1',
		price: 10.00,
		people: [1],
	};

	var item2 = {
		name: 'item2',
		price: 5,
		people: [2],
	};

	var item3 = {
		name: 'item3',
		price: 14,
		people: [1, 2],
	};

	var dataToLoad = {
		personId: 3,
		people: [person1, person2],
		items: [item1, item2, item3],
		subtotalGratuities: [{
			name: 'tax',
			percent: 10,
		}],
	};

	beforeEach(function() {
		localStorageMock = {
			set: jasmine.createSpy(),
			get: function() {
				return dataToLoad;
			},
			remove: jasmine.createSpy(),
		};

		module(function($provide) {
			$provide.value('localStorageService', localStorageMock);
			$provide.constant('AUTOLOAD', false);
			$provide.constant('LOCAL_STORAGE_KEY', LOCAL_STORAGE_KEY);
		});

		inject(function ($injector) {
			Appmodel = $injector.get('appModel');
		});
	});

	describe('#addPerson', function() {
		it("should add a person object to this.people", function() {
			Appmodel.personId = 1;
			var person = {
				name: 'Jordan',
				items: [],
			};
			Appmodel.addPerson(person);

			expect(Appmodel.people[0].name).toBe(person.name);
			expect(Appmodel.people[0].items).toBe(person.items);
			expect(Appmodel.people[0].id).toBe(1);
		});

		it("should increment the personId", function() {
			expect(Appmodel.personId).toBe(1);
			var person = {
				name: 'Jordan',
				items: [],
			};
			Appmodel.addPerson(person);

			expect(Appmodel.personId).toBe(2);
		});
	});

	describe("#delete", function() {
		describe("when where is a valid model property", function() {
			describe("when the item is in the model property", function() {
				it("should splice the item out of the array", function() {
					spyOn(Appmodel, 'update');
					var person1 = {
						id: 1,
						name: 'jordan',
					};
					var person2 = {
						id: 2,
						name: 'logan',
					};
					Appmodel.people = [person1, person2];

					Appmodel.delete('people', person1);
					expect(Appmodel.people.length).toBe(1);
					expect(Appmodel.people[0]).toBe(person2);
					expect(Appmodel.update).toHaveBeenCalled();
				});
			});
			describe("when the item is NOT in the model property", function() {
				it("it should not change the array", function() {
					spyOn(Appmodel, 'update');
					var person1 = {
						id: 1,
						name: 'jordan',
					};
					var person2 = {
						id: 2,
						name: 'logan',
					};
					var person3 = {
						id: 3,
						name: 'scott',
					};
					var people = [person1, person2];
					Appmodel.people = people;

					Appmodel.delete('people', person3);
					expect(Appmodel.people).toBe(people);
					expect(Appmodel.update).not.toHaveBeenCalled();
				});
			});
		});
		describe("when `where` is not a valid model property", function() {
			it("should be a no-op", function() {
				spyOn(Appmodel, 'update');
				var spy = jasmine.createSpy();
				var person1 = {
					id: 1,
					name: 'jordan',
				};
				try {
					Appmodel.delete('notinmodel', person1);
				} catch (e) {
					spy();
				}
				expect(spy).toHaveBeenCalled();
				expect(Appmodel.update).not.toHaveBeenCalled();
			});
		});
	});

	describe("#save", function() {
		it("should call localStorage.set with the proper data", function() {
			var data = {
				personId: 3,
				people: ['person1', 'person2'],
				items: ['item1', 'item2'],
				subtotalGratuities: [1, 2, 3],
			};

			Appmodel.people = data.people;
			Appmodel.personId = data.personId;
			Appmodel.items = data.items;
			Appmodel.subtotalGratuities = data.subtotalGratuities;

			Appmodel.save();

			expect(localStorageMock.set).toHaveBeenCalledWith('data', data);
		});
	});

	describe("#load", function() {
		it("should load the data to the model properties", function() {
			Appmodel.load();

			expect(Appmodel.personId).toBe(dataToLoad.personId);
			expect(Appmodel.people).toBe(dataToLoad.people);
			expect(Appmodel.items).toBe(dataToLoad.items);
			expect(Appmodel.subtotalGratuities).toBe(dataToLoad.subtotalGratuities);
		});

		it("should call Model.update()", function() {
			spyOn(Appmodel, 'update');
			Appmodel.load();

			expect(Appmodel.update).toHaveBeenCalled();
		});
	});

	describe("#addItem", function() {
		it("should push the item to Model.items and call Model.update", function() {
			spyOn(Appmodel, 'update');

			var item = {
				name: 'item1',
				price: 10,
			};

			Appmodel.addItem(item);

			expect(Appmodel.items[0]).toBe(item);
			expect(Appmodel.update).toHaveBeenCalled();
		});
	});

	describe("#replaceItem", function() {
		it("should replace the item in Model.items and call Model.update", function() {
			spyOn(Appmodel, 'update');

			var oldItem = {
				name: 'item1',
				price: 10,
			};

			var newItem = {
				name: 'item2',
				price: 5,
			};

			Appmodel.addItem(oldItem);
			expect(Appmodel.items).toEqual([oldItem]);

			Appmodel.replaceItem(oldItem, newItem);

			expect(Appmodel.items).toEqual([newItem]);
			expect(Appmodel.update).toHaveBeenCalled();
		});
	});

	describe("#reset", function() {
		beforeEach(function() {
			Appmodel.personId           = dataToLoad.personId;
			Appmodel.people             = dataToLoad.people;
			Appmodel.items              = dataToLoad.items;
			Appmodel.subtotalGratuities = dataToLoad.subtotalGratuities;
			Appmodel.update();
		});

		it("should reset all data on the appModel", function() {
			Appmodel.reset();

			expect(Appmodel.personId).toBe(1);
			expect(Appmodel.subtotal).toBe(0);
			expect(Appmodel.total).toBe(0);
			expect(Appmodel.people).toEqual([]);
			expect(Appmodel.items).toEqual([]);
			expect(Appmodel.subtotalGratuities).toEqual([]);
		});

		it("should call localStorageService.remove with the LOCAL_STORAGE_KEY", function() {
			Appmodel.reset();
			expect(localStorageMock.remove).toHaveBeenCalledWith(LOCAL_STORAGE_KEY);
		});
	});

	describe("#update", function() {
		beforeEach(function() {
			Appmodel.personId           = dataToLoad.personId;
			Appmodel.people             = dataToLoad.people;
			Appmodel.items              = dataToLoad.items;
			Appmodel.subtotalGratuities = dataToLoad.subtotalGratuities;
		});

		it("should set the people data correctly", function() {
			var expected = [
				{
					id: 1,
					name: 'person1',
					items: [
						{
							name: 'item1',
							amount: 10,
						},
						{
							name: 'item3',
							amount: 7,
						}
					],
					subtotal: 17,
					subtotalGratuities: [
						{
							name: 'tax',
							percent: 10,
							amount: 1.7,
						},
					],
					total: 18.7
				},
				{
					id: 2,
					name: 'person2',
					items: [
						{
							name: 'item2',
							amount: 5
						},
						{
							name: 'item3',
							amount: 7,
						}
					],
					subtotal: 12,
					subtotalGratuities: [
						{
							name: 'tax',
							percent: 10,
							amount: 1.2,
						},
					],
					total: 13.2
				}
			];

			Appmodel.update();

			expect(Appmodel.people).toEqual(expected);
		});

		it("should update the Model.subtotal and Model.total", function() {
			Appmodel.update();

			expect(Appmodel.subtotal).toBe(29);
			expect(Appmodel.total).toBe(31.9);
		});

		it("should update the Model.subtotalGratuities", function() {
			Appmodel.update();

			var expected = [
				{
					name: 'tax',
					percent: 10,
					amount: 2.9,
				}
			];
			expect(Appmodel.subtotalGratuities).toEqual(expected);
		});
	});
});
