'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:ClasslistCtrl
 * @description
 * # ClasslistCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('ClasslistCtrl', function ($scope, $location, $rootScope, $cookieStore, commonService, $timeout, $loading,$stateParams) {
    console.log($stateParams);
    //保持在线
    //commonService.keepOnline();
    //loading
    $loading.start('courseClassify');
    $loading.start('classMy');


    //专题培训班分类
    commonService.getData(ALL_PORT.GetTrainingClassTypeList.url, 'POST',
      $.extend({}, ALL_PORT.GetTrainingClassTypeList.data))
      .then(function(response) {
        $loading.finish('courseClassify');
        $scope.courseClassify = response.Data;
      });

    //折叠面板控制
    $scope.repeatDone = function() {
      $('.courseClassify .panel-title a').click(function() {
        $(this).parents('.panel-heading').next().slideToggle();
        if ($(this).children('.category').html() == '+') {
          $(this).children('.category').html('-');
        } else {
          $(this).children('.category').html('+');
        }
      });
    };


    //我的班级
    commonService.getData(ALL_PORT.ClassMy.url, 'POST',
      $.extend({}, ALL_PORT.ClassMy.data))
      .then(function(response) {
        $loading.finish('classMy');
        $scope.classMyData = response.Data;
      });
    //活跃班级
     commonService.getData(ALL_PORT.ClassActive.url, 'POST',
      $.extend({}, ALL_PORT.ClassActive.data))
      .then(function(response) {
        $loading.finish('classMy');
        $scope.ClassActiveData = response.Data;
     });
     //近期班级
     commonService.getData(ALL_PORT.ClassRecent.url, 'POST',
      $.extend({}, ALL_PORT.ClassRecent.data))
      .then(function(response) {
        $loading.finish('classMy');
        $scope.ClassRecentData = response.Data;
     });
     //报名状态
    $scope.JudgeStatus = commonService.JudgeStatus;
    //培训班级列
    $scope.getClassList = function(options) {
      $loading.start('trainingCenter');
      ;
      commonService.getData( ALL_PORT.ClassList.url, 'POST',
        $.extend({},ALL_PORT.ClassList.data, options,{type:$stateParams.type}))
        .then(function(response) {
          $loading.finish('trainingCenter');
          $scope.paginationConf.totalItems = response.Data.Count;
          $scope.classListData = response.Data;
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
