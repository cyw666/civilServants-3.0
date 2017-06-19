'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:RankloginsumCtrl
 * @description
 * # RankloginsumCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('RankloginsumCtrl', function ($scope, $rootScope, $cookieStore, commonService, $timeout, $loading, $stateParams) {
    //保持在线
    //commonService.keepOnline();
    //用户学时排行
    $loading.start('rankCourseClick');
    $scope.getRankCourseClick = function (options) {
      var params = $.extend({},ALL_PORT.LoginSumList.data,options)
      commonService.getData(ALL_PORT.LoginSumList.url, 'POST',params )
        .then(function(response) {
          $loading.finish('rankCourseClick');
          $scope.paginationConf.totalItems = response.Data.ViewBag.Count;
          $scope.rankCourseFinish = response.Data;
        });
    }


    $scope.paginationConf = $.extend({},paginationConf,{itemsPerPage: ALL_PORT.LoginSumList.data.rows});

    //分页
    // 通过$watch currentPage 当他们一变化的时候，重新获取数据条目
    $scope.$watch('paginationConf.currentPage', function() {
      // 发送给后台的请求数据
      var pageOptions = {
        page: $scope.paginationConf.currentPage
      };
      $scope.getRankCourseClick(pageOptions);
    });
  });
