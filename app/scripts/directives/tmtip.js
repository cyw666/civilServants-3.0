'use strict';

/**
 * @ngdoc directive
 * @name luZhouApp.directive:tmTip
 * @description
 * # tmTip
 */
angular.module('luZhouApp')
  .directive('tmTip', function () {
    return {
      templateUrl: 'components/tmTip.html',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
      }
    };
  });
