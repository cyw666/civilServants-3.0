'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:RankgroupCtrl
 * @description
 * # RankgroupCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('RankgroupCtrl', function ($scope, $rootScope, $cookieStore, commonService, $timeout, $loading, $stateParams) {
    //防伪造请求
    $scope.token = commonService.AntiForgeryToken();
    //退出
    $scope.loginOut = commonService.loginOut;
    //请求用户信息
    $loading.start('loginOut');
    commonService.getData(ALL_PORT.LoginLong.url, 'POST', ALL_PORT.LoginLong.data).then(function(response) {
      $loading.finish('loginOut');
      $scope.userMessage = response.Data;
    });
    //用户学时排行
    $loading.start('rankingDetail');
    $scope.getGroupRanking = function (options) {
      var params = $.extend({},ALL_PORT.RankGroupList.data,options)
      commonService.getData(ALL_PORT.RankGroupList.url, 'POST',params )
        .then(function(response) {
          $loading.finish('rankingDetail');
          $scope.paginationConf.totalItems = response.Data.ViewBag.Count;
          $scope.govermentRanking = response.Data;
        });
    }


    $scope.paginationConf = $.extend({},paginationConf,{itemsPerPage: ALL_PORT.RankGroupList.data.rows});

    //分页
    // 通过$watch currentPage 当他们一变化的时候，重新获取数据条目
    $scope.$watch('paginationConf.currentPage', function() {
      // 发送给后台的请求数据
      var pageOptions = {
        page: $scope.paginationConf.currentPage
      };
      $scope.getGroupRanking(pageOptions);
    });
  });
