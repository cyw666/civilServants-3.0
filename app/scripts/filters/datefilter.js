'use strict';

/**
 * @ngdoc filter
 * @name luZhouApp.filter:dateFilter
 * @function
 * @description
 * # dateFilter
 * Filter in the luZhouApp.
 */
angular.module('luZhouApp')
  .filter('dateFilter', function () {
    return function (input) {
        if (!input) {
          return "";
        }
        var value = input.replace(/[^0-9-]/ig, "");
        return value;
    };
  });
