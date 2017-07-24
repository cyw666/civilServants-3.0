'use strict';

/**
 * @ngdoc directive
 * @name luZhouApp.directive:tmSpecialImg
 * @description
 * # tmSpecialImg
 */
angular.module('luZhouApp')
  .directive('tmSpecialImg', function () {
    return {
      templateUrl: 'components/tmSpecialImg.html',
      restrict: 'EA',
      scope:{
        studySpecialData:'=',
        repeatFinish:'=',
      },
      link: function postLink(scope, element, attrs) {
        /*console.log(scope.$index)
        setTimeout(function () {
          $('.slider3').bxSlider({
            slideWidth: 210,
            minSlides: 5,
            maxSlides: 5,
            moveSlides: 1,
            slideMargin: 10,
            auto: true,
            pager:false
          });
        },100);*/
      }
    };
  });
