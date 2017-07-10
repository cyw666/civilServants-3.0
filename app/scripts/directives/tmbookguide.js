'use strict';

/**
 * @ngdoc directive
 * @name luZhouApp.directive:tmBookGuide
 * @description
 * # tmBookGuide
 */
angular.module('luZhouApp')
  .directive('tmBookGuide', function () {
    return {
      templateUrl: 'components/tmBookGuide.html',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {}
    };
  });
