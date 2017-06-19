'use strict';

/**
 * @ngdoc directive
 * @name luZhouApp.directive:tmRealTimeData
 * @description
 * # tmRealTimeData
 */
angular.module('luZhouApp')
  .directive('tmRealTimeData', function () {
    return {
      templateUrl: 'components/tmRealTimeData.html',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {

      }
    };
  });
