'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:ArticleCtrl
 * @description
 * # ArticleCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('ArticleCtrl', function ($scope, $state, $rootScope, $cookieStore, commonService, $stateParams, $loading) {
    $scope.categoryId = $stateParams.categoryId?$stateParams.categoryId:'';
    //保持在线
    //commonService.keepOnline();
    //获取文章分类
    commonService.getData(ALL_PORT.ArticleCategory.url,'POST',
      $.extend({}, ALL_PORT.ArticleCategory.data))
      .then(function(response) {
        $scope.categoryData = response.Data;
      });

    //分页
    var params = {
      page:1,
      rows:15,
      categoryId:$scope.categoryId,
      titleNav:'文章列表'
    };
    $scope.paginationConf = $.extend({},paginationConf,{itemsPerPage: 15});
    $scope.refreshList = function (options) {
      $loading.start('articleList');
      params.categoryId = options.categoryId?options.categoryId:params.categoryId;
      commonService.getData(ALL_PORT.ArticleList.url,'POST',
        $.extend({}, ALL_PORT.ArticleList.data,params,options))
        .then(function(response) {
          $loading.finish('articleList');
          $scope.articleListData = response.Data;
          $scope.paginationConf.totalItems = response.Data.Count;
        });
    };
    $scope.$watch('paginationConf.currentPage', function() {
      var pageOptions = {
        page: $scope.paginationConf.currentPage,
        search: $scope.searchTitle
      };
      $scope.refreshList(pageOptions);
    });

    //热门文章
    $scope.hotArticle = function () {
      $loading.start('articleHot');
      var options = {
        page:1,
        rows:10,
        sort:'ClickCount',
        order:'desc',
        categoryId:null,
        titleNav:'热门文章',
        wordLimt:35
      };
      commonService.getData(ALL_PORT.ArticleList.url,'POST',
        $.extend({}, ALL_PORT.ArticleList.data,options))
        .then(function(response) {
          $loading.finish('articleHot');
          $scope.hotArticleData = response.Data;
        });
    };
    $scope.hotArticle();
  });
