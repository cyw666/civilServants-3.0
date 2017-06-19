'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:OriginalarticleCtrl
 * @description
 * # OriginalarticleCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('OriginalarticleCtrl', function ($scope, $stateParams, commonService, $location,$state) {
    //保持在线
    //commonService.keepOnline();

    var token = commonService.AntiForgeryToken();

    $scope.config = ueditorConfig;


    //发布话题
    $scope.publishTopic = function() {
      // $scope.content=$scope.ueditorGetContent('container');
      if ($scope.title.length < 2) {
        alert('输入标题字数请大于两个字符');
      }
      else {
        commonService.getData(ALL_PORT.AddOriginalArticle.url, 'POST', $.extend({}, ALL_PORT.AddOriginalArticle.data, {
          Name: $scope.title,
          Content: $scope.content
        }, token))
          .then(function(response) {
            if (response.Type === 1) {
              alert(response.Message);
              // $state.go('classDetail',{Id:$scope.Id});
            } else {
              alert(response.Message);
            }

          });
      }
    };
  });
