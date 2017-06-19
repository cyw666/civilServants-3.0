'use strict';

/**
 * @ngdoc directive
 * @name luZhouApp.directive:tmUserInformation
 * @description
 * # tmUserInformation
 */
angular.module('luZhouApp')
  .directive('tmUserInformation', function () {
    return {
      templateUrl: 'components/tmUserInformation.html',
      restrict: 'EA',
      scope:{
        info:'=',
        out:'='
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
