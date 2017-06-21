'use strict';

/**
 * @ngdoc filter
 * @name luZhouApp.filter:filters
 * @function
 * @description
 * # filters
 * Filter in the luZhouApp.
 */
angular.module('luZhouApp')
  .filter('dateFilter', function () {
    return function (date) {
      if (!date) {
        return "";
      }
      var date = date.replace(/[^0-9-]/ig, "");
      return date;
    };
  })
  .filter('wordLimit', function () {
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
  })
  .filter('trustHtml', function ($sce) {
    return function (input) {
      return $sce.trustAsHtml(input);
    };
  });
