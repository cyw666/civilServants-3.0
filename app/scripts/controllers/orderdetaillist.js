'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:OrderdetaillistCtrl
 * @description
 * # OrderdetaillistCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('OrderdetaillistCtrl', function ($scope, $state,$location, $stateParams,$rootScope, $cookieStore, commonService, $timeout, $loading) {
    $scope.orderId = $stateParams.orderId;
    //退出
    $scope.loginOut = commonService.loginOut;
    //请求用户信息
    $loading.start('loginOut');
    commonService.getData(ALL_PORT.LoginLong.url, 'POST', ALL_PORT.LoginLong.data).then(function(response) {
      $loading.finish('loginOut');
      $scope.userMessage = response.Data;
    });

    //获取订单详情
    $scope.getOrderDetailList = function () {
      $loading.start('orderDetailList');
      var params = $.extend({},ALL_PORT.GetOrderDetail.data,{orderId:$scope.orderId});
      commonService.getData(ALL_PORT.GetOrderDetail.url, 'POST', params)
        .then(function(response) {
          $loading.finish('orderDetailList');
          if(response.Type==1){
            $scope.orderDetailListData = response.Data;
          }else {
            alert(response.Message);
          }
        });
    };
    $scope.getOrderDetailList();
    //现金面付
    function payCash() {
      var params = $.extend({},ALL_PORT.InvoiceBeginPay.data,{orderId:$scope.orderId,payType:'payCash'});
      commonService.getData(ALL_PORT.InvoiceBeginPay.url, 'POST', params)
        .then(function(response) {
          if(response.Type==1){
            alert('下单成功！')
          }else {
            alert(response.Message);
          }
        });
    };

    $scope.payType='1';
    $scope.goPayConfirm = function (payType) {
      if(payType==1){
        $state.go('payconfirm',{orderId:$scope.orderId});
      }else if (payType==2){
        payCash();
      }else {
        alert('请选择支付方式！');
      }
    }
  });
