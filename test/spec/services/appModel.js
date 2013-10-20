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
			var person = {
				name: 'Jordan',
				items: [],
			};
			Appmodel.addPerson(person);

			expect(Appmodel.people[0].name).toBe(person.name);
			expect(Appmodel.people[0].items).toBe(person.items);
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

	describe('#deletePerson', function() {
		it("it should remove the person from this.people", function() {
			var p1 = {
				name: 'Jordan',
				items: [],
			};
			var p2 = {
				name: 'Logan',
				items: [],
			};

			Appmodel.addPerson(p1);
			Appmodel.addPerson(p2);

			Appmodel.deletePerson(Appmodel.people[0]);

			expect(Appmodel.people.length).toBe(1);
			expect(Appmodel.people[0].name).toBe('Logan');
		});
	});

});
