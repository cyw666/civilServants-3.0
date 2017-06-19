'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:ClassarticledetailCtrl
 * @description
 * # classArticleDetailCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
    .controller('classArticleDetailCtrl', function($scope, $loading, $stateParams, commonService) {
        $scope.Id = $stateParams.Id;

        //判断能否访问
        // commonService.isVisit();
        //保持在线
        //commonService.keepOnline();

        $scope.isshow = true;

        $loading.start('tmshowarticledetail');

        //班级文章内容
        var classArticleDetail = commonService.getData(ALL_PORT.ClassArticleDetail.url, 'POST', $.extend({}, ALL_PORT.ClassArticleDetail.data, { Id: $scope.Id }));
        classArticleDetail.then(function(response) {
            $loading.finish('tmshowarticledetail');
            $scope.articleData = response.Data.Model;
            $scope.Data = response.Data.Model;
            $scope.CreatedDate = response.Data.Model.CreatedDate;
	        console.log($scope.CreatedDate);
        });
    });
