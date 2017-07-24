'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:SpeciallearningoneCtrl
 * @description
 * # SpeciallearningoneCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('SpeciallearningoneCtrl', function ($scope, $http, commonService, $location, $loading) {
    //专题新闻轮播
    commonService.getData(ALL_PORT.ArticleList.url, 'POST',
      $.extend({},ALL_PORT.ArticleList.data,{rows:4,CategoryCode:'specialNewsSlide',TitleNav:'专题新闻轮播'}))
      .then(function(response) {
        $scope.slideData = response.Data;
      });
    /*$scope.startSlide = function () {
      $('#specialNewSlide').slideBox({
        duration : 0.5,//滚动持续时间，单位：秒
        easing : 'linear',//swing,linear//滚动特效
        delay : 4,//滚动延迟时间，单位：秒
        hideClickBar : false,//不自动隐藏点选按键
        clickBarRadius : 5
      });
    };*/
    $scope.startSlide = function () {
      setTimeout(function () {
        $('.specialNewSlide').bxSlider({
          slideWidth: 345,
          auto:true,
          controls:false,
          autoHover:true,
        });
      },500);
    };

    //习近平重要讲话新闻
    commonService.getData(ALL_PORT.ArticleList.url, 'POST',
      $.extend({},ALL_PORT.ArticleList.data,{rows:7,CategoryCode:'importantTalk',TitleNav:'习近平重要讲话'}))
      .then(function(response) {
        $scope.specialNewsData = response.Data;
      });

    //学习通知
    commonService.getData(ALL_PORT.ArticleList.url, 'POST',
      $.extend({},ALL_PORT.ArticleList.data,{rows:7,CategoryCode:'LearningInform',TitleNav:'学习通知'}))
      .then(function(response) {
        $scope.learningInformData = response.Data;
      });

    //专题课程
    var courseListParams = {
      page: 1,
      rows: 10,
      sort: 'Sort',
      order: 'desc',
      courseType: 'All',
      channelId: '',
      title: '',
      titleNav: '课程中心',
      wordLimt: 35,
      teacher: ''
    };
    commonService.getData(ALL_PORT.CourseList.url, 'POST',
      $.extend({},ALL_PORT.CourseList.data,{rows:8,channelCode:'xiJinPingCourse',TitleNav:'习近平总书记系列重要讲话精神'}))
      .then(function(response) {
        $scope.specialCourseData = response.Data;
      });

    //评论观点
    commonService.getData(ALL_PORT.ArticleList.url, 'POST',
      $.extend({},ALL_PORT.ArticleList.data,{rows:5,CategoryCode:'commentsNews',TitleNav:'评论观点'}))
      .then(function(response) {
        $scope.commentsNewsData = response.Data;
      });
    //理论阐述
    commonService.getData(ALL_PORT.ArticleList.url, 'POST',
      $.extend({},ALL_PORT.ArticleList.data,{rows:5,CategoryCode:'theory',TitleNav:'理论阐述'}))
      .then(function(response) {
        $scope.theoryData = response.Data;
      });
    //各地动态
    commonService.getData(ALL_PORT.ArticleList.url, 'POST',
      $.extend({},ALL_PORT.ArticleList.data,{rows:5,CategoryCode:'placeState',TitleNav:'各地动态'}))
      .then(function(response) {
        $scope.placeStateData = response.Data;
      });

    //专题学习轮播
    $loading.start('specialTraining');
    commonService.getData(ALL_PORT.StudySpecial.url, 'POST',
      $.extend({},ALL_PORT.StudySpecial.data,{rows:10,TitleNav:'专题图片'}) )
      .then(function(response) {
        $loading.finish('specialTraining');
        $scope.studySpecialData = response.Data;
      });

    $scope.repeatFinish = function () {
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
      },500);
    };

  });
