'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:TryplayCtrl
 * @description
 * # TryplayCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('TryplayCtrl', function ($scope, $http, $state, $timeout, $interval, $sce, $cookieStore, commonService, $location, $loading, $stateParams) {
    $scope.Id = $stateParams.Id;
    $scope.token = commonService.AntiForgeryToken();
    
    //加载视频信息
    $scope.allPlayInfo;
    $scope.userId;
    var loadOnce = 0;
    
    //添加购物车
    function addCourseToCart(courseid) {
      var params = $.extend({}, ALL_PORT.AddCourseToCart.data, {courseid: courseid});
      commonService.getData(ALL_PORT.AddCourseToCart.url, 'POST', params)
        .then(function (response) {
          if (response.Type == 1) {
            $state.go('shoppingcart', {}, {reload: true});
          } else {
            alert(response.Message);
            commonService.closeWindow();
          }
        });
    };
    //播放倒计时
    var timePlay;
    
    function countDown(courseid) {
      var courseid = courseid;
      $cookieStore.put('second', 5);
      timePlay = $cookieStore.get('second');
      var timePromise = undefined;
      timePromise = $interval(function () {
        if (timePlay <= 0) {
          $interval.cancel(timePromise);
          timePromise = undefined;
          $('.playPage').html('');
          var t = confirm('试看结束，是否购买此课程？');
          if (t) {
            addCourseToCart(courseid);
          } else {
            commonService.closeWindow();
          }
        } else {
          timePlay--;
          $cookieStore.put('second', timePlay);
        }
      }, 1000, 150);
    };
    //加载视频信息
    $scope.loadPlayInfo = function () {
      $http({
        method: 'POST',
        url: ALL_PORT.Play.url,
        data: $.param($.extend({}, ALL_PORT.Play.data, {id: $scope.Id})),
      }).success(function (response) {
        $scope.userId = response.Data.UserId;
        $scope.allPlayInfo = response.Data;
        if (response.Data && response.Data.Content == null) {
          if ((response.Data.PortalId) && (response.Data.UserId) && (response.Data.CourseId)) {
            //refresh
            if (loadOnce == 0) {
              commonService.refresh($scope.allPlayInfo.PortalId, $scope.allPlayInfo.UserId, $scope.allPlayInfo.CourseId);
              loadOnce = 1;
            }
            $scope.options = response.Data.PlayPage;
            $scope.resultCourseDetail = response.Data.resultCourseDetail;
            $scope.resultCourseNote = response.Data.resultCourseNote;
            
          } else {
            commonService.alertMs("数据无效，请检查api");
            window.open("about:blank", "_top").close();
          }
        } else if (response.Data && response.Data.Content) {
          commonService.alertMs('同时只能打开一门课程,请关闭之前页面,并于' + response.Data.Content + '秒后重试！');
          window.open("about:blank", "_top").close();
        }
        
      });
    };
    $scope.loadPlayInfo();
    
    //播放单视频
    var playMp4 = function () {
      var params = $.extend({}, ALL_PORT.PlayJwplay.data, {courseid: $scope.allPlayInfo.CourseId})
      $scope.playMp4Data = {};
      var _timePool = {
        startTime: 0,
        increaseTime: 0,
        totalTime: 0
      };
      
      commonService.getData(ALL_PORT.PlayJwplay.url, 'POST', params)
        .then(function (response) {
          $scope.playMp4Data = response.Data;
          var _portalId = response.Data.PortalId;
          var _userId = response.Data.UserId;
          var _courseId = response.Data.CourseId;
          var _lastPosition = response.Data.LastPostion;
          var _lastLocation = response.Data.Location;
          
          var _thePlayer = jwplayer('myplayer').setup({
            flashplayer: "jwplayer/jwplayer.flash.swf",
            file: $scope.playMp4Data.Url,
            autostart: 'true',
            width: "100%",
            height: "100%"
          });
          countDown(_courseId);
        }, function () {
          window.open("about:blank", "_top").close();
        });
      
      
    };
    //播放精英课程
    var playJy = function () {
      var params = $.extend({}, ALL_PORT.PlayJY.data, {courseId: $scope.allPlayInfo.CourseId})
      $scope.playMJyData = {};
      commonService.getData(ALL_PORT.PlayJY.url, 'POST', params)
        .then(function (response) {
          $scope.playMJyData = response.Data;
          $scope.BatchId = response.Data.BatchId;
          $scope.CourseId = response.Data.CourseId;
          $scope.LastPostion = response.Data.LastPostion;
          $scope.PortalId = response.Data.PortalId;
          $scope.PortalURL = response.Data.PortalURL;
          $scope.Url = response.Data.Url;
          $scope.UserId = response.Data.UserId;
          
          $scope.jyIframeSrc = $sce.trustAsResourceUrl($scope.Url);
          countDown($scope.CourseId);
          if (!$scope.PortalId || !$scope.UserId || !$scope.CourseId) {
            commonService.alertMs("数据无效，请检查api");
            window.open("about:blank", "_top").close();
          } else if (!$scope.Url || !$scope.PortalURL) {
            commonService.alertMs("没有视频资源！");
            window.open("about:blank", "_top").close();
          }
        });
    };
    //播放scorm视频
    var playScorm = function () {
      var params = $.extend({}, ALL_PORT.PlayScorm.data, {courseId: $scope.allPlayInfo.CourseId})
      $scope.playScormData = {};
      commonService.getData(ALL_PORT.PlayScorm.url, 'POST', params)
        .then(function (response) {
          $scope.playScormData = response.Data;
          var BatchId2 = response.Data.BatchId;
          var courseId = response.Data.CourseId;
          var LastPostion2 = response.Data.LastPostion;
          var portalId = response.Data.PortalId;
          var PortalURL2 = response.Data.PortalURL;
          var Url2 = response.Data.Url;
          var userId = response.Data.UserId;
          
          $scope.scormIframeSrc = $sce.trustAsResourceUrl(Url2);
          if (!portalId || !userId || !courseId) {
            commonService.alertMs("数据无效，请检查api");
            window.open("about:blank", "_top").close();
          }
          countDown(courseId);
        });
    };
    //播放single视频
    var playSingle = function () {
      var params = $.extend({}, ALL_PORT.PlaySingle.data, {courseId: $scope.allPlayInfo.CourseId})
      $scope.playSingleData = {};
      
      commonService.getData(ALL_PORT.PlaySingle.url, 'POST', params)
        .then(function (response) {
          $scope.playSingleData = response.Data;
          var _portalId = response.Data.PortalId;
          var _userId = response.Data.UserId;
          var _courseId = response.Data.CourseId;
          var _lastPosition = response.Data.LastPostion;
          var _lastLocation = response.Data.Location;
          var url = response.Data.Url;
          var authcode = "";
          if (!_portalId || !_userId || !_courseId) {
            commonService.alertMs("数据无效，请检查api");
            window.open("about:blank", "_top").close();
          }
          var MediaPlayer;
          MediaPlayer = document.MediaPlayer;
          MediaPlayer.Filename = url;
          MediaPlayer.currentPosition = 0;
          countDown(_courseId);
        }, function () {
          window.open("about:blank", "_top").close();
        });
    };
    //播放pdf
    var initPdf = function (data) {
      var _url = data.Url;
      var _userId = data.UserId;
      var _courseId = data.CourseId;
      var _lastPosition = data.LastPostion || 1; //上次观看的位置
      var _lastLocation = data.Location || 1; //记录进度的位置
      var totalId = 0;
      var pdfTime = 0;
      $('#documentViewer').FlexPaperViewer(
        {
          config: {
            SWFFile: escape(_url),
            Scale: 0.6,
            ZoomTransition: 'easeOut',
            ZoomTime: 0.5,
            ZoomInterval: 0.2,
            FitPageOnLoad: true,
            FitWidthOnLoad: false,
            FullScreenAsMaxWindow: false,
            ProgressiveLoading: false,
            MinZoomSize: 0.2,
            MaxZoomSize: 5,
            SearchMatchAll: false,
            InitViewMode: 'Portrait',
            RenderingOrder: 'flash',
            StartAtPage: _lastPosition,
            ViewModeToolsVisible: true,
            ZoomToolsVisible: true,
            NavToolsVisible: true,
            CursorToolsVisible: true,
            SearchToolsVisible: true,
            WMode: 'window',
            localeChain: 'zh_CN',
            jsDirectory: 'plugins/FlexPaper_2.3.6/js/',
            cssDirectory: 'plugins/FlexPaper_2.3.6/css/',
          }
        }
      );
      $('#documentViewer').bind('onDocumentLoaded', function (e, totalPages) {
        totalId = totalPages;
        cutTime();
      });
      $(window).keydown(function (event) {
        var keyCode = event.keyCode;
        switch (keyCode) {
          case 13:
            $FlexPaper('documentViewer').nextPage();
            break;
          case 40:
            $FlexPaper('documentViewer').nextPage();
            break;
          case 38:
            $FlexPaper('documentViewer').prevPage();
            break;
        }
      })
      var lastpagenum = parseFloat(_lastPosition);
      var newLocation = parseFloat(_lastLocation);
      $('#documentViewer').bind('onCurrentPageChanged', function (e, pagenum) {
        var pagenum = parseInt(pagenum);
        if (!totalId) {
          return
        }
        else {
          if (pdfTime < 10) {
            if (pagenum > newLocation) {
              $FlexPaper('documentViewer').gotoPage(lastpagenum);
              alert("你翻太快了");
            }
            else {
              lastpagenum = pagenum;
              pdfTime = 0;           //页面改变时间重置；
            }
          }
          else {
            if (pagenum == newLocation + 1) {
              sendProcess(pagenum);
              newLocation = pagenum;
              lastpagenum = pagenum;
              pdfTime = 0;           //页面改变时间重置；
            }
            else if (pagenum > newLocation + 1) {
              $FlexPaper("documentViewer").gotoPage(lastpagenum);
              alert("你翻太快了");
            }
            else {
              lastpagenum = pagenum;
              pdfTime = 0;           //页面改变时间重置；
            }
          }
        }
      });
      var sendProcess = function (pagenum) {
        var data = {course_id: _courseId, lesson_id: pagenum, user_id: _userId, total_id: totalId};
        var params = $.extend({}, data, $scope.token);
        commonService.getData(ALL_PORT.ProcessOffice.url, 'POST', params)
          .then(function (response) {
            //如果记录成功，更新播放页进度条
            $scope.loadPlayInfo();
          })
      }
      
      function cutTime() {
        pdfTime = pdfTime + 1;
        $("#stime").html(pdfTime);
        setTimeout(cutTime, 1000);
      }
    }
    var playPdf = function () {
      var params = $.extend({}, ALL_PORT.PlayOffice.data, {courseId: $scope.allPlayInfo.CourseId})
      commonService.getData(ALL_PORT.PlayOffice.url, 'POST', params)
        .then(function (response) {
          initPdf(response.Data);
        })
    }
    //多拽滑块完成回调
    $scope.showPlayMp4 = false;
    $scope.showPlayJy = false;
    $scope.showPlayScorm = false;
    $scope.showPlaySingle = false;
    $scope.showPlayPdf = false;
    $scope.dragReady = function () {
      document.getElementById("tryPlayBg").style.display = 'none';
      var playPage = $scope.allPlayInfo.PlayPage.split('?')[0];
      if (playPage == 'PlayJwplay.html') {
        $scope.showPlayMp4 = true;
        playMp4();
      } else if (playPage == 'PlayJy.html') {
        $scope.showPlayJy = true;
        playJy();
      } else if (playPage == 'PlayScorm.html') {
        $scope.showPlayScorm = true;
        playScorm();
      } else if (playPage == 'PlaySingle.html') {
        $scope.showPlaySingle = true;
        playSingle();
      } else if (playPage == 'PlayOffice.html') {
        $scope.showPlayPdf = true;
        playPdf();
      }
    };
    
  });
