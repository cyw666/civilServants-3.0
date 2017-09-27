'use strict';

/**
 * @ngdoc directive
 * @name luZhouApp.directive:commonHeader
 * @description
 * # commonHeader
 */
angular.module('luZhouApp')
  .directive('commonHeader', function () {
    return {
      templateUrl: 'components/commonHeader.html',
      restrict: 'EA',
      scope: {
        title: "=",
        showMore: "=",
        linkUrl:"="
      },
      link: function postLink(scope, element, attrs) {
        scope.title2 = scope.title || "标题";
        scope.showMore2 = scope.showMore || false;
        scope.linkUrl2 = scope.linkUrl || "";
      }
    };
  });
