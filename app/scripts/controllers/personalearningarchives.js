'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:PersonalearningarchivesCtrl
 * @description
 * # PersonalearningarchivesCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('PersonalearningarchivesCtrl', function ($scope, $timeout, $rootScope, $cookieStore, commonService, $location, $loading) {
    $scope.startDate = '';
    $scope.endDate = '';
    $scope.yearHistory = [
      {name: '2018', value: ''},
      {name: '2017', value: '2017'},
    ];
    $scope.selectYearValue = '';
    $scope.studyStatisticsUrl = '/api' + $scope.selectYearValue + '/Page/StudyStatistics';
    $scope.yearChange = function () {
      $scope.studyStatisticsUrl = '/api' + $scope.selectYearValue + '/Page/StudyStatistics';
      $scope.getUserInfo({type: 'userinfo'});
      $scope.timeSearch();
    }
    //请求个人学习档案信息
    $scope.table_show_one = false;
    $scope.table_show_two = false;
    $scope.table_show_three = false;
    $scope.Show_table = function (id) {
      if (id == "one") {
        $scope.table_show_one = !$scope.table_show_one;
      } else if (id == "two") {
        $scope.table_show_two = !$scope.table_show_two;
      } else {
        $scope.table_show_three = !$scope.table_show_three;
      }
    };
    
    $scope.paginationConf = [
      { //学习课程获得学时
        currentPage: 1,
        totalItems: 10,
        itemsPerPage: 5, //每页显示的条数one
        pagesLength: 6,
        perPageOptions: [10, 20, 30, 40, 50]
      },
      { //参加测试获得学时
        currentPage: 1,
        totalItems: 10,
        itemsPerPage: 5, //每页显示的条数
        pagesLength: 6,
        perPageOptions: [10, 20, 30, 40, 50]
      },
      { //培训获得学时
        currentPage: 1,
        totalItems: 10,
        itemsPerPage: 5, //每页显示的条数
        pagesLength: 6,
        perPageOptions: [10, 20, 30, 40, 50]
      }
    ];
    $scope.getUserInfo = function (options) {
      $loading.start('personalArchive');
      var newParams = $.extend({}, ALL_PORT.StudyStatistics.data, options);
      commonService.getData($scope.studyStatisticsUrl, "post", newParams)
        .then(function (response) {
          $loading.finish('personalArchive');
          $scope.userInfoData = response.Data;
          $scope.startDate = response.Data.ViewBag.StartDate;
          $scope.endDate = response.Data.ViewBag.EndDate;
        })
        .catch(function () {
          $loading.finish('personalArchive');
        });
    };
    $scope.getStudy = function (options) {
      $loading.start('personalArchive');
      var newParams = $.extend({}, ALL_PORT.StudyStatistics.data, options);
      commonService.getData($scope.studyStatisticsUrl, "post", newParams)
        .then(function (response) {
          $loading.finish('personalArchive');
          $scope.studyData = response.Data;
          $scope.paginationConf[0].totalItems = response.Data.ViewBag.StudyCount;
        })
        .catch(function () {
          $loading.finish('personalArchive');
        });
    };
    $scope.getExam = function (options) {
      $loading.start('personalArchive');
      var newParams = $.extend({}, ALL_PORT.StudyStatistics.data, options);
      commonService.getData($scope.studyStatisticsUrl, "post", newParams)
        .then(function (response) {
          $loading.finish('personalArchive');
          $scope.examData = response.Data;
          $scope.paginationConf[1].totalItems = response.Data.ViewBag.ExamFinishCount;
          // $scope.paginationConf[2].totalItems = response.Data.ViewBag.TrainingCount;
        })
        .catch(function () {
          $loading.finish('personalArchive');
        });
    };
    $scope.getTraining = function (options) {
      $loading.start('personalArchive');
      var newParams = $.extend({}, ALL_PORT.StudyStatistics.data, options);
      commonService.getData($scope.studyStatisticsUrl, "post", newParams)
        .then(function (response) {
          $loading.finish('personalArchive');
          $scope.trainingData = response.Data;
          $scope.paginationConf[2].totalItems = response.Data.ViewBag.TrainingCount;
        })
        .catch(function () {
          $loading.finish('personalArchive');
        });
    };
    
    $scope.getUserInfo({type: 'userinfo'});
    $scope.timeSearch = function (options) {
      $scope.getStudy($.extend({}, {type: 'study'}, options));
      $scope.getExam($.extend({}, {type: 'exam'}, options));
      $scope.getTraining($.extend({}, {type: 'training'}, options));
    }
    $scope.$watch('paginationConf[0].currentPage', function (newValue, oldValue) {
      // 发送给后台的请求学习课程获得学时
      var pageOptions = {
        page: $scope.paginationConf[0].currentPage,
        startDate: $scope.startDate,
        endDate: $scope.endDate,
        type: 'study'
      };
      $scope.getStudy(pageOptions);
    });
    $scope.$watch('paginationConf[1].currentPage', function (newValue, oldValue) {
      // 发送给后台的请求参加测试获得学时
      var pageOptions = {
        page: $scope.paginationConf[1].currentPage,
        startDate: $scope.startDate,
        endDate: $scope.endDate,
        type: 'exam'
      };
      $scope.getExam(pageOptions);
    });
    $scope.$watch('paginationConf[2].currentPage', function (newValue, oldValue) {
      // 发送给后台的请求培训获得学时
      var pageOptions = {
        page: $scope.paginationConf[2].currentPage,
        startDate: $scope.startDate,
        endDate: $scope.endDate,
        type: 'training'
      };
      $scope.getTraining(pageOptions);
    });
  });
