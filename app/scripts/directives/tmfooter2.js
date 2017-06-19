'use strict';

/**
 * @ngdoc directive
 * @name luZhouApp.directive:tmFooter2
 * @description
 * # tmFooter2
 */
angular.module('luZhouApp')
  .directive('tmFooter2', function () {
    return {
      templateUrl: 'components/tmFooter2.html',
      restrict: 'EA',
      transclude: true,
      scope: {},
      controller: function($scope, $http, $rootScope, $element, $attrs) {
        /*// 控制器逻辑放在这里
        //友情链接
        $http({
          method: 'POST',
          url: API_URL + "/Page/Blogroll",
          params: {},
        }).success(function(response) {
          $scope.firenlyLinkData = response.Data.ListData;
        }).error(function(error, status) {

        });*/
      },
      link: function postLink(scope, element, attrs) {}
    };
  });
