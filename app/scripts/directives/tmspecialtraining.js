'use strict';

/**
 * @ngdoc directive
 * @name luZhouApp.directive:tmSpecialTraining
 * @description
 * # tmSpecialTraining
 */
angular.module('luZhouApp')
  .directive('tmSpecialTraining', function () {
    return {
      templateUrl: 'components/tmSpecialTraining.html',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        $('.carousel').carousel({
          interval: 3000
        });
      }
    };
  });
