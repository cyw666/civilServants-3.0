'use strict';

/**
 * @ngdoc directive
 * @name luZhouApp.directive:tmStarBox
 * @description
 * # tmStarBox
 */
angular.module('luZhouApp')
  .directive('tmStarBox', function () {
    return {
      require : '?ngModel', // ?ngModel
      restrict : 'EA',
      replace : true,
      templateUrl : 'components/tmStarBox.html',
      scope: {ngModel : '='},
      link: function ($scope, element, attrs, ngModel) {
        $scope.myStars = [1,2,3,4,5];
        $scope.clickCnt = 0;
        $scope.$watch('ngModel', function(newValue) {
          var dataList = newValue;
          // console.log(dataList);
          if(!dataList) return;
          $scope.myStar = dataList;
          $scope.clickCnt = dataList;
        })
        $scope.stars = function (myStar) {
          $scope.clickCnt = myStar;
          ngModel.$setViewValue(myStar);
        }

        $scope.mouseoverStar = function (myStar) {
          $scope.hoverCnt = myStar;
        }
        $scope.mouseleaveStar = function (myStar) {
          $scope.hoverCnt = 0;
        }
      }
    }
  });
