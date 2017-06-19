'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:MessagedetailCtrl
 * @description
 * # MessagedetailCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
    .controller('MessagedetailCtrl', function($scope, $timeout, $rootScope, $cookieStore, commonService, $location, $loading, $stateParams) {
        //判断能否访问
        // commonService.isVisit();
        //保持在线
        //commonService.keepOnline();
        $scope.token = commonService.AntiForgeryToken();

        $loading.start('messageListDetail');
        var Id = $stateParams.Id;
        //留言板详情
        var params = $.extend({}, ALL_PORT.MessageDetail.data, { id: Id })
        commonService.getData(ALL_PORT.MessageDetail.url, 'POST',
            params).then(function(response) {
            $loading.finish('messageListDetail');
            $scope.messageDetailData = response.Data;
        });

    });
