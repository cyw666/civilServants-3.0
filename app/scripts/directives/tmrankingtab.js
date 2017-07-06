'use strict';

/**
 * @ngdoc directive
 * @name luZhouApp.directive:tmRankingTab
 * @description
 * # tmRankingTab
 */
angular.module('luZhouApp')
  .directive('tmRankingTab', function () {
    return {
      templateUrl: 'components/tmRankingTab.html',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
      }
    };
  });
