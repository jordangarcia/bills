'use strict';

describe('Directive: focus', function () {

  // load the directive's module
  beforeEach(module('billsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<focus></focus>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the focus directive');
  }));
});
