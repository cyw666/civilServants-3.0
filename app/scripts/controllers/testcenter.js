'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:TestcenterCtrl
 * @description
 * # TestcenterCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('TestcenterCtrl', function ($scope, $timeout, $rootScope,$state, $cookieStore, commonService, $location, $loading) {
    $scope.token = commonService.AntiForgeryToken();
    //考试中心
    $scope.selectedName = {};
    //搜索title
    $scope.searchTitle = '';
    $scope.paginationConf = $.extend({}, paginationConf, {itemsPerPage: 5});
    $scope.courseStatus = [
      {name: '全部', id: 'All'},
      {name: '已完成', id: 'Finish'},
      {name: '未完成', id: 'UnFinish'}
    ];
    $scope.vm = {};
    //考试列表请求
    $scope.searchMyCenterCourse = function (option, mark) {
      $loading.start('examList');
      if (mark == 1) {
        if (option.examType == "Finish") {
          $scope.vm.activeTab = 3;
        } else {
          $scope.vm.activeTab = 1;
        }
      }
      var params = $.extend({}, ALL_PORT.ExamList.data, option);
      commonService.getData(ALL_PORT.ExamList.url, 'POST',
        params)
        .then(function (response) {
          $loading.finish('examList');
          $scope.TotalData = response.Data;
          if (params.examType == "Finish") {
            $scope.paginationConf.totalItems = response.Data.FinishCount == null ? 0 : response.Data.FinishCount;
          } else {
            $scope.paginationConf.totalItems = response.Data.UnFinishCount == null ? 0 : response.Data.UnFinishCount;
          }
        });
    }

    //分页
    // 通过$watch currentPage 当他们一变化的时候，重新获取数据条目
    $scope.$watch('paginationConf.currentPage', function () {
      // 发送给后台的请求数据
      var pageOptions = {
        page: $scope.paginationConf.currentPage,
        title: $scope.searchTitle
      };
      $scope.searchMyCenterCourse(pageOptions);
    });

    //参加测试
    $scope.havTest = function (Id) {
      var params = $.extend({}, ALL_PORT.Exam.data, $scope.token, {parameter1: Id})
      commonService.getData(ALL_PORT.Exam.url, 'POST',
        params)

        .then(function (response) {
          if (response.Type) {
            //Type存在，意味着不能考试
            alert(response.Message);
          } else {
            var examUrl = $state.href('exam',{Id:Id});
            window.open(examUrl,'_blank');
          }

        });
    };
  });
