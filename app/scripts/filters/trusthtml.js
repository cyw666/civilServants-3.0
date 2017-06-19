'use strict';

/**
 * @ngdoc filter
 * @name luZhouApp.filter:trustHtml
 * @function
 * @description
 * # trustHtml
 * Filter in the luZhouApp.
 */
angular.module('luZhouApp')
  .filter('trustHtml', function ($sce) {
    return function (input) {
      return $sce.trustAsHtml(input);
    };
  });
