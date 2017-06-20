'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('LoginCtrl', function ($scope, $timeout, $rootScope, $cookieStore, $state, commonService, $loading,$stateParams) {
    //防伪造请求
    var token = commonService.AntiForgeryToken();
    $scope.showVerifyCode = false;
    //保持在线
    //commonService.keepOnline();
    //登录
    $scope.showLogin = true;
    $scope.login = {
      Account: '',
      PassWord: '',
      RememberMe: true
    };
    $scope.showError = false;
    $scope.userMessage={
      RememberMe:null
    };
    $scope.clickLogin;
    //请求用户信息
    commonService.getData(ALL_PORT.LoginShort.url, 'POST', ALL_PORT.LoginShort.data)
      .then(function(response) {
        $scope.userMessage = response.Data.Model;
        $scope.userAllMessage = response.Data;
        if ($scope.userMessage.Name) {
          alert('用户已登录！');
          window.close();
        } else {
          if ($scope.userMessage.RememberMe) {
            $scope.login.RememberMe = true;
            rememberPW();
          }else {
            $scope.login = {
              Account: '',
              PassWord: ''
            };
          }
        }
      });
    //获取验证码
    $scope.getVerifyCode = commonService.getVerifyCode;
    $scope.getVerifyCode();
    //表单输入变化
    $scope.inputChange = function() {
      // $scope.getVerifyCode();
    }

    //focus
    $scope.inputFocus = function() {
      $scope.showError = false;
      $scope.showValidateCodeError = false;
    }

    //退出
    $scope.loginOut = commonService.loginOut;

    //踢出其他地方登录账号
    function kickOut(kickUserId) {
      //踢出操作
      commonService.getData(API_URL + "/Page/KickOut", 'POST',
        $.extend({}, ALL_PORT.LoginOut.data, { kickUserId: kickUserId },token))
        .then(function(response) {
          if (response.Type == 1) {
            //重新登录
            //console.log(response.Type);
            //window.location.reload();
            $scope.clickLogin($scope.userMessage.RememberMe);
          }
        });
    }

    //点击登陆
    var encryptUserName;
    var encryptPassWorld;
    $scope.clickLogin = function(rememberMe) {
      encryptUserName = $scope.login.Account.rsaEnscrypt();
      encryptPassWorld = $scope.login.PassWord.rsaEnscrypt();

      var loginParam1 = $.extend({},$scope.login,{Account:encryptUserName,PassWord:encryptPassWorld});
      var loginParam2 = $.extend({},$scope.login);
      var urlShort = "LoginMe";
      var loginParam = {};
      if ($scope.login.ValidateCode) {
        urlShort = "Login";
        loginParam = loginParam1;
      } else if (rememberMe) {
        urlShort = "LoginMe";
        loginParam = loginParam2;
      } else {
        urlShort = "LoginCode";
        loginParam = loginParam1;
      }
      if (!$scope.login.Account) {
        alert('用户名不能为空！');
        return;
      }
      if (!$scope.login.PassWord) {
        alert('密码不能为空！');
        return;
      }
      if (!$scope.login.ValidateCode&&$scope.showVerifyCode) {
        alert('验证码不能为空！');
        return;
      }


      commonService.getData(API_URL + "/Page/" + urlShort, 'POST', $.extend({},loginParam, token))
        .then(function(data) {
          if (data.Type == 0) {
            $scope.showError = true;
            $scope.getVerifyCode();
          } else if (data.Type == 1) {
            /*$location.path($rootScope.rememberUrl);*/
            // window.location.reload();
            $state.go($stateParams.name,JSON.parse($stateParams.params));
          } else if (data.Type == 2) {
            commonService.alertMs("首次登录，请修改密码！");
            $state.go('modifyPassword');

          } else if (data.Type == 3) {
            if (window.confirm("帐号在别的地方登录，是否踢出？")) {
              kickOut(data.Message);
              return true;
            } else {
              $scope.getVerifyCode();
              return false;
            }
          } else if (data.Type == 4) {
            commonService.alertMs("此电脑已经有用户登录，您不能用其他帐号再次登录！");
            $scope.getVerifyCode();
          } else if (data.Type == 5) {
            commonService.alertMs("平台当前在线人数到达上限，请稍后再试！");
            $scope.getVerifyCode();
          } else if (data.Type == 6) {
            commonService.alertMs(data.Message);
            $scope.getVerifyCode();
          } else if (data.Type == 7) {
            $scope.showValidateCodeError=true;
            $scope.getVerifyCode();
          } else if (data.Type == 10) {
            commonService.alertMs("您还不是本平台成员，将为您转向您所在的平台：" + data.Message, 2);
            $scope.getVerifyCode();
            return;
          } else if (data.Type == 11) {
            commonService.alertMs(data.Message);
            $scope.getVerifyCode();
          } else if (data.Type == 12 || data.Type == 13) {
            commonService.alertMs(data.Message);
            $scope.getVerifyCode();
          } else {
            $scope.getVerifyCode();
          }
        }, function(data) {
          alert("登陆异常！");
          window.location.reload();
        });
    }
    //记住密码
    function rememberPW() {
      var userid = commonService.getCookie2('rememberMe', "userid");
      var pwd = commonService.getCookie2('rememberMe', 'pwd');
      // var rememberMe = $cookieStore.get("rememberMe");
      // console.log(userid, pwd);
      commonService.getData(API_URL + "/Page/GetLoginName", 'POST', { name: userid })
        .then(function(response) {
          if (response.Type == 1) {
            //console.log(response.Message);
            $scope.login.Account = response.Message;
            $scope.login.PassWord = pwd;
            $("#txtAccount,#txtPwd").change(function () {
              // $("#ValidateCode").parents(".ValidateCodeform").show();
              $scope.showVerifyCode = true;
              $scope.login.ValidateCode = '';
            });
          }
        });
    };
  });
