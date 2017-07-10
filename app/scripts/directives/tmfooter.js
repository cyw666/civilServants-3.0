'use strict';

/**
 * @ngdoc directive
 * @name luZhouApp.directive:tmFooter
 * @description
 * # tmFooter
 */
angular.module('luZhouApp')
    .directive('tmFooter', function() {
        return {
            templateUrl: 'components/tmFooter.html',
            restrict: 'EA',
            transclude: true,
            scope: {},
            controller: function($scope, $http,$loading, commonService, $element, $attrs) {
                // 控制器逻辑放在这里
                //友情链接
              commonService.getData(ALL_PORT.Blogroll.url,'POST',ALL_PORT.Blogroll.data)
                .then(function (response) {
                  $scope.firenlyLinkData = response.Data.ListData;
                })
            },
            link: function postLink(scope, element, attrs) {
              scope.$watch('linkNode',function () {
                if (scope.linkNode){
                  window.open(scope.linkNode.Url);
                }
              },true);
            }
        };
    });
