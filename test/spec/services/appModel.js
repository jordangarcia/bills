'use strict';

describe('Service: Appmodel', function () {

	// load the service's module
	beforeEach(module('billsApp'));

	// instantiate service
	var Appmodel;
	beforeEach(inject(function (appModel) {
		Appmodel = appModel;
	}));

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
				});
			});
			describe("when the item is NOT in the model property", function() {
				it("it should not change the array", function() {
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
				});
			});
		});
		describe("when `where` is not a valid model property", function() {
			it("should be a no-op", function() {
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
			});
		});
	});

});
