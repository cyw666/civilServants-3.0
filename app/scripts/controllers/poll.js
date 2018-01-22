'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:PollCtrl
 * @description
 * # PollCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('PollCtrl', function ($scope, $http, $rootScope, $cookieStore, commonService, $state, $location, $loading, $stateParams, $interval) {
    
    $scope.token = commonService.AntiForgeryToken();
    $loading.start('exam');
    var Id = $stateParams.Id;
    var params = $.extend({}, ALL_PORT.Poll2.data, {pollId: Id})
    commonService.getData(ALL_PORT.Poll2.url, 'POST', params)
      .then(function (response) {
        $loading.finish('exam');
        //考试题目数量
        if (response.Data) {
          $scope.examData = response.Data.Exam;
          $scope.allQuestions = response.Data.TypeAllQuestions;
        } else {
          alert(response.Message);
          window.open("about:blank", "_top").close();
        }
      });
    
    //倒计时
    $interval(function () {
      $scope.seconds -= 1000;
      if ($scope.seconds == 0) {
        commonService.alertMs('考试时间到,系统将自动提交！');
        $scope.submitForm();
      }
    }, 1000);
    $scope.submitForm = function () {
      var str0 = "第";
      $("input:hidden[name^='questionid']").each(function (index) {
        var checked = $(this).siblings('table').find("input:checked").length;
        var type = $(this).siblings('.tibg').children('span').attr("type");
        if (checked == 0 && (type == "0" || type == "1")) {
          str0 += $(this).siblings('.tibg').children('span').html();
        }
        if (!$("textarea[name='textbox" + this.value + "']").val() && type == "2") {
          str0 += $(this).siblings('.tibg').children('span').html();
        }
      });
      str0 += "题";
      if (str0 == "第题") {
        str0 = "";
      }
      if (str0 === "" || (str0 !== "" && confirm(str0 + " 未答,是否提交?"))) {
        var params = $(".editForm").serialize();
        commonService.getData(ALL_PORT.PostExam.url, 'POST', params)
          .then(function (response) {
            if (response.Type == 1) {
              // commonService.alertMs(response.Message);
              alert(response.Message)
              // $state.go('pollreview', {parameter1: Id, parameter2: response.Value});
              window.close();
            } else {
              commonService.alertMs(response.Message);
            }
          }, function (error) {
            commonService.alertMs("提交失败！");
            window.close();
          });
      }
    };
  });
