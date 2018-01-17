'use strict';

/**
 * @ngdoc directive
 * @name luZhouApp.directive:floatWindow
 * @description
 * # floatWindow
 */
angular.module('luZhouApp')
  .directive('floatWindow', function () {
    return {
      templateUrl: 'components/floatWindow.html',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        $(function () {
          $("#floadAD").adFloat({width: 450, height: 150, closeid: 'flyclose'});
        });
      }
    };
  });
