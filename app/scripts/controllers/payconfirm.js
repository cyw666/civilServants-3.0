'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:PayconfirmCtrl
 * @description
 * # PayconfirmCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('PayconfirmCtrl', function ($scope, $location,$state, $stateParams,$rootScope, $cookieStore, commonService, $timeout, $loading) {
    $scope.orderId = $stateParams.orderId;
    //防伪造请求
    $scope.token = commonService.AntiForgeryToken();
    //退出
    $scope.loginOut = commonService.loginOut;
    //请求用户信息
    $loading.start('loginOut');
    commonService.getData(ALL_PORT.LoginLong.url, 'POST', ALL_PORT.LoginLong.data).then(function(response) {
      $loading.finish('loginOut');
      $scope.userMessage = response.Data;
    });
    //订单详细列表
    $scope.getOrderDetailList = function () {
      $loading.start('payConfirm');
      var params = $.extend({},ALL_PORT.GetOrderDetail.data,{orderId:$scope.orderId});
      commonService.getData(ALL_PORT.GetOrderDetail.url, 'POST', params)
        .then(function(response) {
          $loading.finish('payConfirm');
          if(response.Type==1){
            $scope.orderDetailListData = response.Data;
          }else {
            alert(response.Message);
          }
        });
    };
    $scope.getOrderDetailList();
    //跳转支付宝支付
    function getConfirmPay (InvoiceId) {
      commonService.getData(ALL_PORT.PayForInvoice.url, 'POST', {invoiceId:InvoiceId})
        .then(function(response) {
          if(response.Type==1){
            $scope.payContent = response.Data;
          }else {
            alert(response.Message);
          }
        });
    };

    //确认支付生成票据
    $scope.payType='Alipay';
    $scope.goPayConfirm = function (payType) {
      if(payType){
        var params = $.extend({},ALL_PORT.InvoiceBeginPay.data,{orderId:$scope.orderId,payType:payType});
        commonService.getData(ALL_PORT.InvoiceBeginPay.url, 'POST', params)
          .then(function(response) {
            if(response.Type==1){
              // $state.go('alipaydefault',{invoiceId:response.Data.InvoiceId});
              getConfirmPay(response.Data.InvoiceId);
            }else {
              alert(response.Message);
            }
          });
      }else {
        alert('请选择支付方式！');
      }
    };
  });
