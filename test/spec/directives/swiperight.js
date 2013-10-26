'use strict';

describe('Directive: swiperight', function () {

  // load the directive's module
  beforeEach(module('billsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<swiperight></swiperight>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the swiperight directive');
  }));
});
