'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:PollreviewCtrl
 * @description
 * # PollreviewCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('PollreviewCtrl', function ($scope, $timeout, $rootScope, $cookieStore, commonService, $location, $loading, $stateParams) {
    
    var parameter1 = $stateParams.parameter1;
    var parameter2 = $stateParams.parameter2;
    $loading.start('examReview');
    commonService.getData(ALL_PORT.PollReview2.url, 'POST',
      $.extend({}, ALL_PORT.PollReview2.data, {parameter1: parameter1, parameter2: parameter2}))
      .then(function (response) {
        $loading.finish('examReview');
        $scope.allQuestions = response.TypeAllQuestions;
      });
    
    $scope.getRatePoll = function (count, sort) {
      var val = (sort * 100 / count).toFixed(2);
      return val;
    }
  });
