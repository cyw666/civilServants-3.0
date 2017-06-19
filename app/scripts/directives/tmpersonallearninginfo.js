'use strict';

/**
 * @ngdoc directive
 * @name luZhouApp.directive:tmpersonallearninginfo
 * @description
 * # tmPersonalLearningInfo
 */
angular.module('luZhouApp')
  .directive('tmPersonalLearningInfo', function () {
    return {
      templateUrl: 'components/tmPersonalLearningInfo.html',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {

      }
    };
  });
