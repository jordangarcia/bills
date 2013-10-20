'use strict';

describe('Controller: PersonselectorCtrl', function () {

  // load the controller's module
  beforeEach(module('billsApp'));

  var PersonselectorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PersonselectorCtrl = $controller('PersonselectorCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
