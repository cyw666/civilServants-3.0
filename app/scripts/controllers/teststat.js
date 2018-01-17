'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:TeststatCtrl
 * @description
 * # TeststatCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('TeststatCtrl', function ($scope, $timeout, $rootScope, $cookieStore, commonService, $location, $loading) {
    //个人考试统计
    $scope.yearHistory = [
      {name: '2018', value: ''},
      {name: '2017', value: '2017'},
    ];
    $scope.selectYearValue = '';
    $scope.examStateUrl = '/api' + $scope.selectYearValue + '/Page/MyExamStat';
    $scope.yearChange = function () {
      $scope.examStateUrl = '/api' + $scope.selectYearValue + '/Page/MyExamStat';
      $scope.requestMyStudyStat({page: 1});
    }
    
    $scope.paginationConf = $.extend({}, paginationConf, {itemsPerPage: ALL_PORT.MyExamStat.data.rows});
    var params = $.extend({}, ALL_PORT.MyExamStat.data);
  
    $scope.requestMyStudyStat = function (options) {
      $loading.start('examStat');
      $.extend(params, options);
      commonService.getData($scope.examStateUrl, 'POST', params)
        .then(function (response) {
          $loading.finish('examStat');
          $scope.paginationConf.currentPage = response.Data.Page;
          $scope.paginationConf.totalItems = response.Data.Count;
          $scope.examStatData = response.Data;
          $scope.startTime = response.Data.StartDate;
          $scope.endTime = response.Data.EndDate;
        });
    };
    $scope.$watch('paginationConf.currentPage', function () {
      var options = {};
      options.page = $scope.paginationConf.currentPage;
      $scope.requestMyStudyStat(options);
    });
    $scope.printTestStat = function () {
      window.print();
    };
  });
