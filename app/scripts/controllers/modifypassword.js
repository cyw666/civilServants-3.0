'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:ModifypasswordCtrl
 * @description
 * # modifyPasswordCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
    .controller('modifyPasswordCtrl', function($scope, commonService,$loading) {
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


        $scope.token = commonService.AntiForgeryToken();
        $scope.txtNewPwd = '';
        $scope.txtOldPwd = '';
        $scope.txtRepeatNewPwd = ''

        $scope.modifyPwd = function() {
            if ($scope.txtNewPwd !== $scope.txtRepeatNewPwd) {
                alert('新密码不一致');
            } else if ($scope.txtNewPwd === '' || $scope.txtNewPwd === null || $scope.txtOldPwd === '' ||
                $scope.txtOldPwd === null) {
                alert("请填写信息");
            } else {
                commonService.getData(ALL_PORT.UpdatePwd.url, 'POST',
                        $.extend({}, ALL_PORT.UpdatePwd.data, { NewPwd: $scope.txtNewPwd, OldPwd: $scope.txtOldPwd }, $scope.token))
                    .then(function(response) {
                        alert(response.Message);
                        window.reload();
                    });
            }
        };

    });
