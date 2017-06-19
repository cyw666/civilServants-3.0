'use strict';

describe('Controller: GuideviewCtrl', function () {

  // load the controller's module
  beforeEach(module('luZhouApp'));

  var GuideviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GuideviewCtrl = $controller('GuideviewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(GuideviewCtrl.awesomeThings.length).toBe(3);
  });
});
