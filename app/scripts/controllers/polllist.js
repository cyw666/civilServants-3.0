'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:PolllistCtrl
 * @description
 * # PolllistCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('PolllistCtrl', function ($scope, $location, $rootScope, $cookieStore, commonService, $timeout, $loading,$stateParams) {
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


    //报名状态
    $scope.JudgeStatus = commonService.JudgeStatus;
    //问卷调查列表
    $scope.getClassList = function(options) {
      $loading.start('pollList');
      ;
      commonService.getData( ALL_PORT.PollList.url, 'POST',
        $.extend({},ALL_PORT.PollList.data, options))
        .then(function(response) {
          $loading.finish('pollList');
          $scope.paginationConf.totalItems = response.Data.UnFinishCount;
          $scope.pollListData = response.Data;
        });
    };
    // $scope.getClassList();

    //分页
    $scope.paginationConf = $.extend({},paginationConf,{itemsPerPage: ALL_PORT.CourseClickList.data.rows});
    $scope.$watch('paginationConf.currentPage', function() {
      // 发送给后台的请求数据
      var pageOptions = {
        page: $scope.paginationConf.currentPage
      };
      $scope.getClassList(pageOptions);
    });

    //查看用户权限
    $scope.checkUserClass = function(id) {
      commonService.getData(ALL_PORT.CheckUserClass.url, 'POST',
        $.extend({}, ALL_PORT.CheckUserClass.data, { trainingId: id }))
        .then(function(response) {
          if (response.Type === 0) {
            alert("请先加入培训班!");
          } else {
            window.open('#/specialTrainingCourse/classDetail/' + id);
          }
        });
    };
    //班级报名
    $scope.addClass = function(id) {
      commonService.getData(ALL_PORT.ApplyClass.url, 'POST',
        $.extend({}, ALL_PORT.ApplyClass.data, { trainingId: id }))
        .then(function(response) {
          alert(response.Message);
          $scope.getClassList();
        });
    };
  });
