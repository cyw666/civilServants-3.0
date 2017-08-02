'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:SpecialtrainingcourseCtrl
 * @description
 * # SpecialtrainingcourseCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('SpecialtrainingcourseCtrl', function ($scope, $location, $rootScope, $cookieStore, commonService, $timeout, $loading) {
    $scope.showInput1 = true;
    $scope.showInput2 = false;
    $scope.showInput3 = false;
    //loading
    $loading.start('courseClassify');
    $loading.start('classMy');

    $scope.vm = {activeTab: 1};

    //专题培训班分类
    commonService.getData(ALL_PORT.GetTrainingClassTypeList.url, 'POST',
      $.extend({}, ALL_PORT.GetTrainingClassTypeList.data))
      .then(function (response) {
        $loading.finish('courseClassify');
        $scope.courseClassify = response.Data;
      });

    //折叠面板控制
    $scope.repeatDone = function () {
      $('.courseClassify .panel1-title a').click(function () {
        $(this).parents('.panel1-heading').next().slideToggle();
        if ($(this).children('.category').html() == '+') {
          $(this).children('.category').html('-');
        } else {
          $(this).children('.category').html('+');
        }
      });
    };

    //分页
    $scope.paginationConf = $.extend({}, paginationConf, {itemsPerPage: 10});

    //我的班级
    $scope.classMyType = 'my';
    commonService.getData(ALL_PORT.ClassMy.url, 'POST',
      $.extend({}, ALL_PORT.ClassMy.data))
      .then(function (response) {
        $loading.finish('classMy');
        $scope.classMyData = response.Data;
      });
    //活跃班级
    $scope.classActiveType = 'active';
    commonService.getData(ALL_PORT.ClassActive.url, 'POST',
      $.extend({}, ALL_PORT.ClassActive.data))
      .then(function (response) {
        $loading.finish('classMy');
        $scope.ClassActiveData = response.Data;
      });
    //近期班级
    $scope.classRecentType = 'recent';
    commonService.getData(ALL_PORT.ClassRecent.url, 'POST',
      $.extend({}, ALL_PORT.ClassRecent.data))
      .then(function (response) {
        $loading.finish('classMy');
        $scope.ClassRecentData = response.Data;
      });

    //培训班级列
    $scope.params = ALL_PORT.GetClassList.data;
    $scope.getClassList = function (options) {
      $loading.start('trainingCenter');
      $.extend($scope.params, options);
      commonService.getData(ALL_PORT.GetClassList.url, 'POST',
        $scope.params)
        .then(function (response) {
          $loading.finish('trainingCenter');
          if (response.Data.ListData.length === 0) {
            $scope.paginationConf.totalItems = 0;
          } else {
            $scope.paginationConf.totalItems = response.Data.ListData[0].Count;
          }

          if ($scope.params.type == "just") {
            $scope.justListData = response.Data;
          } else if ($scope.params.type == "immediately") {
            $scope.immediatelyListData = response.Data;

          } else if ($scope.params.type == "already") {
            $scope.alreadyListData = response.Data;
          }
        });
    };

    $scope.getClassList();
    $scope.JudgeStatus = commonService.JudgeStatus;

    //查看用户权限
    $scope.checkUserClass = function (id) {
      commonService.getData(ALL_PORT.CheckUserClass.url, 'POST',
        $.extend({}, ALL_PORT.CheckUserClass.data, {trainingId: id}))

        .then(function (response) {
          if (response.Type === 0) {
            alert("请先加入培训班!");
          } else {
            window.open('#/trainingClass/classDetail/' + id);
          }
        });
    };


    $scope.addClass = function (id, type) {
      commonService.getData(ALL_PORT.ApplyClass.url, 'POST',
        $.extend({}, ALL_PORT.ApplyClass.data, {trainingId: id}))
        .then(function (response) {
          alert(response.Message);
          $scope.getClassList({type: type});
        });
    };


    // 通过$watch currentPage 当他们一变化的时候，重新获取数据条目
    $scope.$watch('paginationConf.currentPage', function () {
      var pageOptions = {
        page: $scope.paginationConf.currentPage,
        title: $scope.searchTitle
      };
      if ($scope.vm.activeTab == 1) {
        pageOptions.type = 'just';
        $scope.getClassList(pageOptions);
      } else if ($scope.vm.activeTab == 2) {
        pageOptions.type = 'immediately';
        $scope.getClassList(pageOptions);
      } else if ($scope.vm.activeTab == 3) {
        pageOptions.type = 'already';
        $scope.getClassList(pageOptions);
      }

    });

  });
