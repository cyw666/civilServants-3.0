'use strict';

/**
 * @ngdoc directive
 * @name luZhouApp.directive:tmPoll
 * @description
 * # tmPoll
 */
angular.module('luZhouApp')
  .directive('tmPoll', function () {
    return {
      templateUrl: 'components/tmPoll.html',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        scope.focusInput = function () {
          var timer = setTimeout(function () {
            $(".radio_question_item").on('click', function (e) {
              e.stopPropagation();
              $(this).find('.advise').focus();
            });
            $(".checkbox_question_item").on('click', function (e) {
              e.stopPropagation();
              $(this).find('.advise').focus();
            });
            clearTimeout(timer);
          }, 600);
        }
      }
    };
  });
