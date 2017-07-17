'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:OrderlistCtrl
 * @description
 * # OrderlistCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('OrderlistCtrl', function ($scope, $stateParams, $state, $cookieStore, commonService, $loading) {
    //退出
    $scope.loginOut = commonService.loginOut;
    //请求用户信息
    $loading.start('loginOut');
    commonService.getData(ALL_PORT.LoginLong.url, 'POST', ALL_PORT.LoginLong.data).then(function (response) {
      $loading.finish('loginOut');
      $scope.userMessage = response.Data;
    });

    //订单列表
    $scope.paginationConf = $.extend({}, paginationConf, {itemsPerPage: 4});
    $scope.getOrderList = function (options) {
      $loading.start('orderList');
      var parmas = $.extend({}, ALL_PORT.GetMyOrder.data, options);
      commonService.getData(ALL_PORT.GetMyOrder.url, 'POST', parmas)
        .then(function (response) {
          $loading.finish('orderList');
          $scope.orderListData = response.Data;
          $scope.paginationConf.totalItems = response.Data.Count;
        });
    };

    $scope.$watch('paginationConf.currentPage', function () {
      var pageOptions = {
        page: $scope.paginationConf.currentPage,
      };
      $scope.getOrderList(pageOptions);
    });

    //删除订单
    $scope.delOrder = function (orderId) {
      commonService.getData(ALL_PORT.DelOrder.url, 'POST', {orderId: orderId})
        .then(function (response) {
          if (response.Type == 1) {
            alert(response.Message);
            $scope.getOrderList({page: $scope.paginationConf.currentPage});
          } else {
            alert(response.Message);
          }
        });
    };
    //取消订单
    $scope.cancelOrder = function (orderId) {
      commonService.getData(ALL_PORT.CancelOrder.url, 'POST', {orderId: orderId})
        .then(function (response) {
          if (response.Type == 1) {
            alert(response.Message);
            $scope.getOrderList({page: $scope.paginationConf.currentPage});
          } else {
            alert(response.Message);
          }
        });
    };
    //再次购买
    $scope.restoreOrder = function (orderId) {
      commonService.getData(ALL_PORT.RestoreOrder.url, 'POST', {orderId: orderId})
        .then(function (response) {
          if (response.Type == 1) {
            alert(response.Message);
            // $scope.getOrderList({page:$scope.paginationConf.currentPage});
            $state.go('shoppingcart');
          } else {
            alert(response.Message);
          }
        });
    };
  });
