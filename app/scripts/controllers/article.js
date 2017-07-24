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

  });
