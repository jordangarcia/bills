'use strict';

describe('Controller: PeopleCtrl', function () {

	// load the controller's module
	beforeEach(module('billsApp'));

	var PeopleCtrl;
	var scope;
	var theAppModel;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope, appModel) {
		scope = $rootScope.$new();
		theAppModel = appModel;
		PeopleCtrl = $controller('PeopleCtrl', {
			$scope: scope,
			appModel: appModel,
		});
	}));

	it('it should have scope.model be set to appModel', function () {
		expect(scope.model).toEqual(theAppModel);
	});

	describe('#addPerson', function() {
		it('should invoke model.addPerson with person info', function(){
			scope.personName = 'jordan'
			var info = {
				name: scope.personName,
				items: [],
			};

			console.log(scope.model);
			spyOn(scope.model, 'addPerson');

			scope.addPerson();

			expect(scope.model.addPerson).toHaveBeenCalledWith(info);
		});

		it('it should set the scope.personName to \'\'', function(){
			scope.personName = 'jordan'

			scope.addPerson();

			expect(scope.personName).toBe('');
		});

		it("should call model.save", function() {
			spyOn(scope.model, 'save');
			scope.personName = 'jordan'

			scope.addPerson();

			expect(scope.model.save).toHaveBeenCalled();
		});
	});
});
