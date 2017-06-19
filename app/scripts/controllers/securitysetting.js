'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:SecuritysettingCtrl
 * @description
 * # securitySettingCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
    .controller('securitySettingCtrl', function($scope, commonService,$loading) {
        //判断能否访问
        // commonService.isVisit();
        //保持在线
        //commonService.keepOnline();
        //退出
        $scope.loginOut = commonService.loginOut;
        //请求用户信息
        $loading.start('loginOut');
        commonService.getData(ALL_PORT.LoginLong.url, 'POST', ALL_PORT.LoginLong.data)
          .then(function(response) {
            $loading.finish('loginOut');
            $scope.userMessage = response.Data;
          });

        $scope.isVisible = true;

        $scope.validatePwd = function() {
            commonService.getData(ALL_PORT.SetPasswordQuestion.url, 'POST', { pwd: $scope.myPwd })
                .then(function(response) {
                    if (response.Type == 0) {
                        alert(response.Message);
                    } else {
                        $scope.questionData = response.Data.Question;
                        $scope.isVisible = false;
                    }

                });
        };

        var token = commonService.AntiForgeryToken();

        $scope.addQuestion = function() {
            var str = angular.toJson($scope.questionData);
            var json = JSON.parse(str);

            commonService.getData(ALL_PORT.AddPasswordQuestion.url, 'POST',
                $.extend({}, ALL_PORT.AddPasswordQuestion.data, { pwd: $scope.myPwd, questions: json }, token))

            .then(function(response) {
                alert(response.Message);
            });
        };

    });
