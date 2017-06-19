'use strict';

/**
 * @ngdoc directive
 * @name luZhouApp.directive:tmRegister
 * @description
 * # tmRegister
 */
angular.module('luZhouApp')
  .directive('tmRegister', function ($http) {
    return {
      templateUrl: 'components/tmRegister.html',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
      }
    };
  });
