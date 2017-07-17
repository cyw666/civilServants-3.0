'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:SpeciallearningCtrl
 * @description
 * # SpeciallearningCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('SpeciallearningCtrl', function ($scope, $http, commonService, $location, $loading) {
    //退出
    $scope.loginOut = commonService.loginOut;
    //请求用户信息
    $loading.start('loginOut');
    commonService.getData(ALL_PORT.LoginLong.url, 'POST', ALL_PORT.LoginLong.data).then(function (response) {
      $loading.finish('loginOut');
      $scope.userMessage = response.Data;
    });


    //专题学习
    $scope.showNoSpecialClass = false;
    commonService.getData(ALL_PORT.StudySpecial.url, 'POST',
      $.extend({}, ALL_PORT.StudySpecial.data, {rows: 20}))
      .then(function (response) {
        $scope.studySpecialData = response.Data;
        $scope.showNoSpecialClass = response.Data.ListData.length == 0 ? true : false;
      });

  });
