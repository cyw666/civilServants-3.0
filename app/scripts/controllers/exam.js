'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:ExamCtrl
 * @description
 * # ExamCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('ExamCtrl', function ($scope, $http, $rootScope, $cookieStore, commonService, $state, $location, $loading, $stateParams, $interval) {
    //保持在线
    //commonService.keepOnline();
    $scope.token = commonService.AntiForgeryToken();
    $loading.start('exam');
    var Id = $stateParams.Id;
    var params = $.extend({}, ALL_PORT.Exam.data, { parameter1: Id })
    commonService.getData(ALL_PORT.Exam.url, 'POST', params)
      .then(function (response) {
        $loading.finish('exam');
        if (response.Type) {
          //Type存在，意味着不能考试
          commonService.alertMs(response.Message);
          window.open("about:blank", "_top").close();
          return
        }
        if (response.Data.Exam.TimeLimit != 0) {
          $scope.seconds = parseInt(response.Data.Exam.TimeLimit) * 60;
        }
        // $scope.seconds = 5*1000;
        //考试题目数量
        $scope.examData = response.Data;
        $scope.checkingQuestions = response.Data.Type0Questions;
        $scope.singleQuestions = response.Data.Type1Questions;
        $scope.multipleQuestions = response.Data.Type2Questions;
        $scope.adviseQuestions = response.Data.Type3Questions;
        $scope.gapFillingQuestions = response.Data.Type4Questions;
        
        $scope.examAllScore1 = commonService.examAllScore;
      });
    //倒计时
    $interval(function () {
      $scope.seconds -= 1;
      if ($scope.seconds == 0) {
        commonService.alertMs('考试时间到,系统将自动提交！');
        $scope.submitForm(1);
      }
    }, 1000);
    $scope.submitForm = function (e) {
      var str0 = "判断题第";
      var str1 = "单选题第";
      var str2 = "多选题第";
      var str3 = "意见题第";
      var str4 = "填空题第";
      $("input:hidden[name^='questionid']").each(function (index) {
        if ($("input[name='radio" + this.value + "']").length > 0 && $("input[name='radio" + this.value + "']:checked").length === 0) {
          if ($(this).siblings('.tibg').children('.questionNum').attr("type") == "0") {
            str0 += $(this).siblings('.tibg').children('.questionNum').html();
          }
          if ($(this).siblings('.tibg').children('.questionNum').attr("type") == "1") {
            str1 += $(this).siblings('.tibg').children('.questionNum').html();
          }
        }
        if ($("input[name='checkbox" + this.value + "']").length > 0 && $("input[name='checkbox" + this.value + "']:checked").length === 0) {
          if ($(this).siblings('.tibg').children('.questionNum').attr("type") == "2") {
            str2 += $(this).siblings('.tibg').children('.questionNum').html();
          }
        }
        if ($("textarea[name='textbox" + this.value + "']").length > 0 && !$("textarea[name='textbox" + this.value + "']").val()) {
          if ($(this).siblings('.tibg').children('.questionNum').attr("type") == "3") {
            str3 += $(this).siblings('.tibg').children('.questionNum').html();
          }
        }
      });
      str0 += "题、";
      str1 += "题、";
      str2 += "题、";
      str3 += "题、";
      if (str0 == "判断题第题、") {
        str0 = "";
      }
      if (str1 == "单选题第题、") {
        str1 = "";
      }
      if (str2 == "多选题第题、") {
        str2 = "";
      }
      if (str3 == "意见题第题、") {
        str3 = "";
      }
      var params = $("#editForm").serialize();
      $(".blankName").each(function (i) {
        var blankId = $scope.gapFillingQuestions[ i ].Id;
        var itemVal = '&blanktext' + blankId + '=';
        var len = $(this).find('input').length - 1;
        $(this).find('input').each(function (i) {
          if ($(this).val()) {
            if (i < len) {
              itemVal += $(this).val() + '♩';
            } else {
              itemVal += $(this).val();
            }
          }
        });
        if (itemVal == '&blanktext' + blankId + '=') {
          str4 += (i + 1) + ' 题';
        }
        params += itemVal;
      })
      if (str4 == "填空题第") {
        str4 = "";
      }
      if (e == "1" || ((str0 + str1 + str2 + str3 + str4) === "" || ((str0 + str1 + str2 + str3 + str4) !== "" && confirm(str0 + str1 + str2 + str3 + str4 + "未答,是否提交?")))) {
        commonService.getData(ALL_PORT.PostExam.url, 'POST', params)
          .then(function (response) {
            if (response.Type == 1) {
              commonService.alertMs(response.Message);
              $state.go('examReview', { examId: Id, recordId: response.Value });
            } else {
              if (response.Message.indexOf("等待阅卷") !== -1) {
                alert(response.Message);
                window.close();
                return
              }
              commonService.alertMs(response.Message);
            }
          }, function (error) {
            alert("提交失败！")
            window.close();
          });
      }
    };
    
    $scope.replaceInput = function (name) {
      var newName = name.replace(/\[@*\]+/g, "<input type='text' class='form-control'/>")
      return newName;
    }
  });
