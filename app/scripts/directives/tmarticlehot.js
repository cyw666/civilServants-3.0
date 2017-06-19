'use strict';

/**
 * @ngdoc directive
 * @name luZhouApp.directive:tmArticleHot
 * @description
 * # tmArticleHot
 */
angular.module('luZhouApp')
  .directive('tmArticleHot', function () {
    return {
      templateUrl: 'components/tmArticleHot.html',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {}
    };
  });
