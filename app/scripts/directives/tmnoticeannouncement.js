'use strict';

/**
 * @ngdoc directive
 * @name luZhouApp.directive:tmNoticeAnnouncement
 * @description
 * # tmNoticeAnnouncement
 */
angular.module('luZhouApp')
  .directive('tmNoticeAnnouncement', function () {
    return {
      templateUrl: 'components/tmNoticeAnnouncement.html',
      restrict: 'EA',
      transclude: true,
      scope:true,
      link: function postLink(scope, element, attrs) {
      }
    };
  });
