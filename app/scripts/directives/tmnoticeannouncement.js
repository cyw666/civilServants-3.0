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
      controller: function ($scope, commonService, $loading) {
        //通知公告
        $loading.start('noticeAnnouncement');
        commonService.getData(ALL_PORT.noticeAnnouncement.url, 'POST',
          $.extend({},ALL_PORT.noticeAnnouncement.data,{rows:3}))
          .then(function(response) {
            $loading.finish('noticeAnnouncement');
            $scope.noticeData = response.Data;
          });
        $scope.startSlide = function () {
          $('#noticeSlide').slideBox({
            duration : 0.5,//滚动持续时间，单位：秒
            easing : 'linear',//swing,linear//滚动特效
            delay : 4,//滚动延迟时间，单位：秒
            hideClickBar : false,//不自动隐藏点选按键
            clickBarRadius : 5
          });
        }
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
