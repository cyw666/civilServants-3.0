'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:CoursedetailsCtrl
 * @description
 * # CoursedetailsCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('CoursedetailsCtrl', function ($scope, $rootScope, $state, $cookieStore, commonService, $timeout, $loading, $stateParams, $location) {
    //显示loading
    $loading.start('courseDetails');
    $scope.token = commonService.AntiForgeryToken();
    $scope.showFav = true;
    var queryDetail = function () {
      var Id = $stateParams.Id;
      commonService.getData(ALL_PORT.CourseContent.url, 'POST', $.extend({}, ALL_PORT.CourseContent.data, {Id: Id}))
        .then(function (response) {
          $loading.finish('courseDetails');
          $scope.courseDetailsData = response.Data;
        });
    };
    queryDetail();


    $scope.favoriteAdd = function (options, token) {
      var params = $.extend({}, ALL_PORT.FavoriteAdd.data, options, token)
      commonService.getData(ALL_PORT.FavoriteAdd.url, 'POST', params)
        .then(function (response) {
          if (response.Type == 1) {
            $scope.courseDetailsData.CourseModel.FavoriteId = response.Value;
            alert(response.Message);
          }
        });
    };
    $scope.favoriteDelete = function (options, token) {
      var params = $.extend({}, ALL_PORT.FavoriteDelete.data, options, token)
      commonService.getData(ALL_PORT.FavoriteDelete.url, 'POST', params)
        .then(function (response) {
          if (response.Type == 1) {
            $scope.courseDetailsData.CourseModel.FavoriteId = 0;
            alert(response.Message);
          }
        });
    };

    $scope.selectClass = function (checkValue) {
      //打开一个不被拦截的新窗口
      var newWindow = window.open('about:blank', '_blank');
      var params = $.extend({}, ALL_PORT.AddStudyCourse.data, {checkValue: checkValue}, $scope.token)
      commonService.getData(ALL_PORT.AddStudyCourse.url, 'POST', params)
        .then(function (response) {
          if (response.Type == 1) {
            // $state.go('play',{Id:checkValue});
            var url = $state.href('play', {Id: checkValue});
            //修改新窗口的url
            newWindow.location.href = url;
          }
        });
    };

    //参加测试
    $scope.havTest = function (Id) {
      var params = $.extend({}, ALL_PORT.Exam.data, $scope.token, {parameter1: Id})
      commonService.getData(ALL_PORT.Exam.url, 'POST', params)
        .then(function (response) {
          $loading.finish('exam');
          if (response.Type) {
            //Type存在，意味着不能考试
            alert(response.Message);
          } else {
            window.open("#/exam/exam/" + Id);
          }

        });
    };

  });
