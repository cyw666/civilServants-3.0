'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:GuideviewCtrl
 * @description
 * # GuideviewCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
    .controller('GuideviewCtrl', function($rootScope,$location,pubSubService,$scope, $interval , $cookieStore, commonService, $loading) {

        //loading
        $loading.start('tmNewsInformation');
        $loading.start('noticeAnnouncement');
        $loading.start('friendlyLink');
        $loading.start('civilServiceTrainingLink');
        $loading.start('technicianTrainingLink');

        //新闻资讯
        commonService.getData(ALL_PORT.ArticleList.url, 'POST',
                $.extend({}, ALL_PORT.ArticleList.data, { page: '1', rows: '6', CategoryId: 83 }))
            .then(function(response) {
                $loading.finish('tmNewsInformation');
                $scope.allNews = response.Data;
                $scope.topNews = response.Data.ListData[0];
                var newsDate = response.Data.ListData;
                newsDate.shift();
                $scope.newsData = newsDate;
            });
        //通知公告
        commonService.getData(ALL_PORT.noticeAnnouncement.url, 'POST',
                ALL_PORT.noticeAnnouncement.data)
            .then(function(response) {
                $loading.finish('noticeAnnouncement');
                $scope.noticeData = response.Data;
            });

        //友情链接
        commonService.getData(ALL_PORT.Blogroll.url, 'POST',
                ALL_PORT.Blogroll.data)
            .then(function(response) {
                $loading.finish('friendlyLink');
                $scope.firenlyLinkData = response.Data;
            });

        //公务员培训新闻
        commonService.getData(ALL_PORT.ArticleList.url, 'POST',
                $.extend({}, ALL_PORT.ArticleList.data, { page: '1', rows: '5', CategoryId: 82 }))
            .then(function(response) {
                $loading.finish('civilServiceTrainingLink');
                $scope.civilServiceTrainingLink = response.Data;
            });
        //专业技术人员培训新闻
        commonService.getData(ALL_PORT.ArticleList.url, 'POST',
                $.extend({}, ALL_PORT.ArticleList.data, { page: '1', rows: '5', CategoryId: 74 }))
            .then(function(response) {
                $loading.finish('technicianTrainingLink');
                $scope.technicianTrainingLink = response.Data;
            });

        //重要通知
        commonService.getData(ALL_PORT.noticeAnnouncement.url,'POST',$.extend(ALL_PORT.noticeAnnouncement.data, {CategoryId :43 }))
            .then(function (response) {
                $scope.importantNoticeData=response.Data.ListData;
            });
    });

