'use strict';

/**
 * @ngdoc directive
 * @name luZhouApp.directive:header
 * @description
 * # header
 */
angular.module('luZhouApp')
  .directive('tmHeader', function () {
    return {
      templateUrl: 'components/tmHeader.html',
      restrict: 'EA',
      scope: {},
      controller: function ($scope, $http, $loading, commonService, $state,$stateParams,$element, $attrs) {
        // 控制器逻辑放在这里
        //收藏本站
        $scope.addFavorite = commonService.AddFavorite;
        //设为首页
        $scope.setHome = commonService.SetHome;
        //搜索新闻
        $scope.findNews = function() {
          $state.go('search',{text:$scope.searchNewsField});
        };
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
