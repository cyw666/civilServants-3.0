'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:ShoppingcartCtrl
 * @description
 * # ShoppingcartCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('ShoppingcartCtrl', function ($scope, $location, $state,$rootScope, $cookieStore, commonService, $timeout, $loading) {
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

    //购物车列表
    var totalCount;
    $scope.getShoppingCartList = function () {
      $loading.start('shoppingCart');
      commonService.getData(ALL_PORT.GetMyShoppingCart.url, 'POST',
        $.extend({}, ALL_PORT.GetMyShoppingCart.data))
        .then(function(response) {
          $loading.finish('shoppingCart');
          if(response.Type==1){
            $scope.shoppingCartData = response.Data;
            totalCount = response.Data.Count;
          }else {
            alert(response.Message);
          }
        });
    }
    $scope.getShoppingCartList();

    $scope.delCourseFromCart = function (courseid) {
      commonService.getData(ALL_PORT.DelCourseFromCart.url, 'POST',
        $.extend({}, ALL_PORT.DelCourseFromCart.data,{courseid:courseid}))
        .then(function(response) {
          if(response.Type==1){
            alert(response.Message);
            $scope.getShoppingCartList();
          }else {
            alert(response.Message);
          }
        });
    };

    //下单
    $scope.addOrder = function () {
      var addOrder = function () {
        if(totalCount>0){
          commonService.getData(ALL_PORT.AddOrder.url, 'POST',
            $.extend({}, ALL_PORT.AddOrder.data))
            .then(function(response) {
              if(response.Type==1){
                // alert(response.Message);response.OrderId
                $state.go('orderdetaillist',{orderId:response.Data.OrderId});
              }else {
                alert(response.Message);
              }
            });
        }else {
          alert('购物车为空，请添加商品到购物车！')
        }
      };
      commonService.limitSubmit(addOrder);
    }
  });
