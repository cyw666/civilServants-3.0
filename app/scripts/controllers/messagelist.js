'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:MessagelistCtrl
 * @description
 * # MessagelistCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
    .controller('MessagelistCtrl', function($scope, $timeout, $rootScope, $cookieStore, commonService, $location, $loading) {
        //判断能否访问
        // commonService.isVisit();
        //保持在线
        //commonService.keepOnline();
        //退出
        $scope.loginOut = commonService.loginOut;
        $scope.token = commonService.AntiForgeryToken();
        //请求用户信息
        $loading.start('loginOut');
        commonService.getData(ALL_PORT.LoginLong.url, 'POST', ALL_PORT.LoginLong.data)
          .then(function(response) {
            $loading.finish('loginOut');
            $scope.userMessage = response.Data;
          });

        //留言板
        $loading.start('messageList');
      $scope.paginationConf = $.extend({},paginationConf,{itemsPerPage: ALL_PORT.MessageList.data.rows});
        $scope.requestMessageList = function(options) {
            var params = $.extend({}, ALL_PORT.MessageList.data, options);
            commonService.getData(ALL_PORT.MessageList.url, 'POST',
                    params)
                .then(function(response) {
                    $loading.finish('messageList');
                    $scope.paginationConf.totalItems = response.Data.Count;
                    $scope.messageListData = response.Data;

                });
        };
        $scope.$watch('paginationConf.currentPage', function() {
            var options = {};
            options.page = $scope.paginationConf.currentPage;
            $scope.requestMessageList(options);
        });

        //添加留言
        $scope.allClass = ['课程建设', '支持服务', '平台功能'];
        $scope.messageClass = "课程建设";
        $scope.messageName = '';
        $scope.messageContent = '';
        $scope.addMessage = function(options) {
          var addMessage = function () {
            if (options.Name.length < 2) {
              alert("标题字数不能少于2个字！");
            } else if (options.Content.length >= 249) {
              alert('留言说明字数不能超过249个字');
            } else if (options.Content.length < 7) {
              alert('留言说明字数不能少于7个字');
            } else {
              commonService.getData(ALL_PORT.GetMessageAdd.url, 'POST',
                $.extend({}, ALL_PORT.GetMessageAdd.data, $scope.token, options))
                .then(function(response) {
                  $('.notemodal').modal('hide');
                  alert(response.Message);
                });
            }
          };

          commonService.limitSubmit(addMessage);

        };

    });
