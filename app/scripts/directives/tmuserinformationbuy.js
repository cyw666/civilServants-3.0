'use strict';

/**
 * @ngdoc directive
 * @name luZhouApp.directive:tmUserInformationBuy
 * @description
 * # tmUserInformationBuy
 */
angular.module('luZhouApp')
  .directive('tmUserInformationBuy', function () {
    return {
      templateUrl: 'components/tmUserInformationBuy.html',
      restrict: 'EA',
      scope:{
        info:'=',
        out:'='
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
