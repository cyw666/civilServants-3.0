'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:StudystatCtrl
 * @description
 * # StudystatCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('StudystatCtrl', function ($scope, $timeout, $rootScope, $cookieStore, commonService, $location, $loading) {
    $scope.yearHistory = [
      {name: '2018', value: ''},
      {name: '2017', value: '2017'},
    ];
    $scope.selectYearValue = '';
    $scope.studyStateUrl = '/api' + $scope.selectYearValue + '/Page/MyStudyStat';
    $scope.yearChange = function () {
      $scope.studyStateUrl = '/api' + $scope.selectYearValue + '/Page/MyStudyStat';
      $scope.requestMyStudyStat({page: 1});
    }
    
    //个人学习统计
    $scope.paginationConf = $.extend({}, paginationConf, {itemsPerPage: 10});
    var params = $.extend({}, ALL_PORT.MyStudyStat.data);
    
    $scope.requestMyStudyStat = function (options) {
      $loading.start('studyStat');
      $.extend(params, options);
      commonService.getData($scope.studyStateUrl, 'POST', params)
        .then(function (response) {
          $loading.finish('studyStat');
          $scope.paginationConf.currentPage = response.Data.Page;
          $scope.paginationConf.totalItems = response.Data.Count;
          $scope.studyStatData = response.Data;
          $scope.startTime = response.Data.StartDate;
          $scope.endTime = response.Data.EndDate;
        })
        .catch(function () {
          $loading.finish('studyStat');
        });;
    };
    $scope.$watch('paginationConf.currentPage', function () {
      var options = {};
      options.page = $scope.paginationConf.currentPage;
      $scope.requestMyStudyStat(options);
    });
    
  });
