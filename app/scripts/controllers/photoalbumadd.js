'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:PhotoalbumaddCtrl
 * @description
 * # photoAlbumAddCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
    .controller('photoAlbumAddCtrl', function($scope, $location, $loading, $stateParams, $state,commonService) {
        $scope.Id = $stateParams.Id;
        $scope.location = '添加相册';

        //判断能否访问
        // commonService.isVisit();
        //保持在线
        //commonService.keepOnline();

        commonService.getData(ALL_PORT.PhotoAlbumAdd.url, 'POST',
            $.extend({}, ALL_PORT.PhotoAlbumAdd.data, { TrainingId: $scope.Id }))

        .then(function(response) {
            $scope.data = response.Data;
        });


        //添加相册
        $scope.getPhotoAlbumAdd = function() {
            $scope.hidValueImage = $('#hidValueImage').val();
            commonService.getData(ALL_PORT.GetPhotoAlbumAdd.url, 'POST',
                    $.extend({}, ALL_PORT.GetPhotoAlbumAdd.data, { Name: $scope.name, Description: $scope.description, ImgUrl: $scope.hidValueImage, TrainingId: $scope.Id }))
                .then(function(response) {
                    alert(response.Message);
                    if (response.Type > 0) {
                      $state.go('photoAlbumList',{Id:$scope.Id});
                    }

                });
        };


		// $scope.fileChanged = function(ele){
		//     $scope.files = ele.files;
		//     $scope.$apply(); //传播Model的变化。
		// }
		//
		// //上传图片
		// $scope.upload=function (event,types) {
	    	// commonService.upload(event,types);
		// };
    });
