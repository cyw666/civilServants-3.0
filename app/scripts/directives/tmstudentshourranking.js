'use strict';

/**
 * @ngdoc directive
 * @name luZhouApp.directive:tmStudentsHourRanking
 * @description
 * # tmStudentsHourRanking
 */
angular.module('luZhouApp')
  .directive('tmStudentsHourRanking', function () {
    return {
      templateUrl: 'components/tmStudentsHourRanking.html',
      restrict: 'EA',
      scope:{
        studentHourRanking:'='
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
