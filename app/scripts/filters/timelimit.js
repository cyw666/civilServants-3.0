'use strict';

/**
 * @ngdoc filter
 * @name luZhouApp.filter:timeLimit
 * @function
 * @description
 * # timeLimit
 * Filter in the luZhouApp.
 */
angular.module('luZhouApp')
  .filter('timeLimit', function () {
    return function (text,num) {
      var des='';
      if (typeof text=="string") {
        if (text.length>num){
          des = text.substring(0,num)+"...";
          return des;
        }else {
          return text;
        }
      }
    };
  });
