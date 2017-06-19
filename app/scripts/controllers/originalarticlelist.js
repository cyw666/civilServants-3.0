'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:OriginalarticlelistCtrl
 * @description
 * # OriginalarticlelistCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('OriginalarticlelistCtrl', function ($scope, $http,$timeout, $rootScope, $cookieStore, commonService, $location, $loading) {
    //保持在线
    //commonService.keepOnline();
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

    //原创文章列表
    $scope.paginationConf = $.extend({},paginationConf,{itemsPerPage: ALL_PORT.OriginalArticleList.data.rows});
    $scope.requestOriginalArgicleList = function(options) {
      $loading.start('originalArgicleList');
      var params = $.extend({}, ALL_PORT.OriginalArticleList.data, options);
      commonService.getData(ALL_PORT.OriginalArticleList.url, 'POST', params)
        .then(function(response) {
          $loading.finish('originalArgicleList');
          $scope.paginationConf.totalItems = response.Data.Count;
          $scope.originalArgicleListData = response.Data;
        });
    };
    $scope.$watch('paginationConf.currentPage', function() {
      var options = {};
      options.page = $scope.paginationConf.currentPage;
      $scope.requestOriginalArgicleList(options);
    });
  });
