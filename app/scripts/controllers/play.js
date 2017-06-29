'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:PlayCtrl
 * @description
 * # PlayCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
    .controller('PlayCtrl', function($scope, $http, $timeout,$interval, $rootScope, $cookieStore, commonService, $location, $loading, $stateParams,$sce) {
        $scope.Id = $stateParams.Id;
        // $scope.iframSrc = "../../oldPage/play.html?id=" + $scope.Id;
      //(请勿删除)
      //保持在线
      //commonService.keepOnline();
      $scope.token = commonService.AntiForgeryToken();
      //星级评分
      var word = ['','很差', '差', '一般', "好", "很好"];
      $scope.ratingText='';
      var level = $scope.drLevel;
      $scope.$watch('drLevel', function(newValue) {
        $scope.ratingText = word[$scope.drLevel];
      })
      //加载视频信息
      $scope.allPlayInfo;
      $scope.userId;
      var loadOnce = 0;
      $scope.loadPlayInfo=function () {
        $http({
          method: 'POST',
          url: ALL_PORT.Play.url,
          data: $.param($.extend({},ALL_PORT.Play.data,{id:$scope.Id})),
        }).success(function(response) {
          $scope.userId=response.Data.UserId;
          $scope.allPlayInfo = response.Data;
          if (response.Data && response.Data.Content == null) {
            if ((response.Data.PortalId) && (response.Data.UserId) && (response.Data.CourseId)) {
              //refresh
              if (loadOnce==0){
                commonService.refresh($scope.allPlayInfo.PortalId,$scope.allPlayInfo.UserId,$scope.allPlayInfo.CourseId);
                loadOnce=1;
              }
              $scope.options=response.Data.PlayPage;
              $scope.resultCourseDetail = response.Data.resultCourseDetail;
              $scope.resultCourseNote = response.Data.resultCourseNote;

            }else {
              alert("数据无效，请检查api");
              window.close();
            }
          }else if (response.Data && response.Data.Content){
            alert('同时只能打开一门课程,请关闭之前页面,并于' + response.Data.Content + '秒后重试！');
            window.close();
          }

        });
      };

      commonService.beforeUnload($scope.userId);
      //获取评论信息
      $scope.getComment = function () {
        $http({
          method: 'POST',
          url: ALL_PORT.CourseComment.url,
          data: $.param($.extend({},ALL_PORT.CourseComment.data,{id:$scope.Id})),
        }).success(function(response) {
          $scope.resultComment = response.Data;
        });
      }
      $scope.getComment();

      $scope.loadPlayInfo();
      //播放单视频
      var playMp4 = function () {
        var params = $.extend({}, ALL_PORT.PlayJwplay.data, { courseid: $scope.allPlayInfo.CourseId })
        $scope.playMp4Data={};
        var _timePool = {
          startTime: 0,
          increaseTime: 0,
          totalTime: 0
        };

        commonService.getData(ALL_PORT.PlayJwplay.url, 'POST', params)
          .then(function(response) {
            $scope.playMp4Data = response.Data;
            var _portalId = response.Data.PortalId;
            var _userId = response.Data.UserId;
            var _courseId = response.Data.CourseId;
            var _lastPosition = response.Data.LastPostion;
            var _lastLocation = response.Data.Location;

            var _thePlayer = jwplayer('myplayer').setup({
              flashplayer: "jwplayer/jwplayer.flash.swf",
              // file: "http://test7.jy365.net"+$scope.playMp4Data.Url,
              file: $scope.playMp4Data.Url,
              autostart: 'true',
              width: "100%",
              height:"100%"
            });

            var _sendProcess = function () {
              if(_thePlayer.getPosition())  {
                var data = $.extend({},{ "PortalId": _portalId, "userid": _userId, "courseid": _courseId, "positionen": _thePlayer.getPosition().toString().rsaEnscrypt()},$scope.token);
                commonService.getData(ALL_PORT.SingleProcess.url, 'POST', data)
                  .then(function (data) {
                    $scope.loadPlayInfo();
                    //如果记录成功，更新播放页进度条
                    /*if (data.BrowseScore >= 0 || data.Content == "试看记录！") {
                      $scope.loadPlayInfo();
                    } else {
                      alert("记录异常，将刷新!");
                      // window.location.reload();
                    }*/
                  },function () {
                    alert("网路异常，将刷新!");
                    window.location.reload();
                  });

              }

              setTimeout(_sendProcess, 30000); //送进度间隔时间 30秒传一次;
            };

            //时间池流程：时间池为最后一次进度时间累加当前播放页停留时间，即允许用户随意拖动，不影响进度时间
            var _TimePoolInstall = function () {
              _timePool.startTime = parseFloat(_lastLocation) + 1;
              setInterval(function () {
                //只有在播放且当前播放位置接近时间池时，时间池才会向前走;
                if (_thePlayer.getState() == 'PLAYING' && _thePlayer.getPosition() > (_timePool.totalTime - 5)) {
                  _timePool.increaseTime += 1
                }
              }, 1000);
              setInterval(_processCheck, 1000);
            }

            var _processCheck = function () {
              _timePool.totalTime = _timePool.startTime + _timePool.increaseTime;
              var curProcess = _thePlayer.getPosition() - 0.2;
              if (_thePlayer.getState() == 'PLAYING') {
                if (curProcess > _timePool.totalTime) {

                  _thePlayer.play(false);
                  alert("请不要在未播放区域拖动，否则可能丢失进度！");
                  _thePlayer.seek(_timePool.totalTime - 1); //TODO 放前面？
                  // thePlayer.play(true);
                }
              }
            }

            var _jwWarning = function () {
              var theWidth = $('.jwrail').eq(0).width();
              var _left_01 = _timePool.totalTime / _thePlayer.getDuration() * theWidth;
              var _left_02 = parseInt($('.jwoverlay')[0].style.left, 10);
              $('.jwwarning')[0].style.left = $('.jwoverlay')[0].style.left;
              if (_left_01 < _left_02) {
                $('.jwwarning').stop().fadeTo(50, 1);
              } else {
                $('.jwwarning').stop().hide();
              }
            };
            //启动时间池样式捕捉时间池;
            //多次触发开关
            var k = 0;
            var _func = function () {
              if (k < 1) {
                if ($('.jwrail').length >= 1) {
                  $('.jwrail').eq(0).append('<span class="jwwarning">禁止拖动至此</span>');
                  $('.jwrail').eq(0).children('.Buffer').after('<span class="jwwarningbuffer"></span>');
                  k++;
                  setInterval(function () {
                    var the_time = _timePool.totalTime;
                    var duration = _thePlayer.getDuration();
                    var the_width = $('.jwrail').eq(0).width();
                    $('.jwwarningbuffer')[0].style.left = the_time < duration ? (the_time / duration * the_width + "px") : (duration / duration * the_width + "px")
                  }, 100);
                  window.clearInterval(i);
                  $('.jwrail').mousemove(function () {
                    _jwWarning();
                  })
                  $('.jwrail').mouseout(function () {
                    $('.jwwarning').stop().fadeOut(250);
                  })
                }
              }
            };
            var i = setInterval(_func, 1000);

            var initPlay = function () {
              //启动时间池;
              _TimePoolInstall();
              //启动定期发送进度;
              setTimeout(_sendProcess, 8000);
              //从上次播放位置开始播放;
              if (_lastPosition != null && _lastPosition != "无数据") {
                //TODO 20170106 IE8 9 不能从上次位置开始播放，估计是加载player时间过长
                _thePlayer.seek(_lastPosition);
              };
            }
            initPlay();

          },function () {
            window.close();
          });


      };
      //播放精英课程
      var playJy = function () {
        var params = $.extend({}, ALL_PORT.PlayJY.data, { courseId: $scope.allPlayInfo.CourseId })
        $scope.playMJyData={};
        commonService.getData(ALL_PORT.PlayJY.url, 'POST', params)
          .then(function (response) {
            $scope.playMJyData=response.Data;
            $scope.BatchId=response.Data.BatchId;
            $scope.CourseId=response.Data.CourseId;
            $scope.LastPostion=response.Data.LastPostion;
            $scope.PortalId=response.Data.PortalId;
            $scope.PortalURL=response.Data.PortalURL;
            $scope.Url=response.Data.Url;
            $scope.UserId=response.Data.UserId;

            // $scope.jyIframeSrc =$sce.trustAsResourceUrl( $scope.Url+'?url=192.168.1.25/api/CourseProcess/JYProcess?batchId='+$scope.BatchId+'&portalId='+$scope.PortalId+'&UserId='+$scope.UserId+'&courseId='+$scope.CourseId);
            $scope.jyIframeSrc = $sce.trustAsResourceUrl($scope.Url+'?url='+$scope.PortalURL+'/api/CourseProcess/JYProcess?batchId='+$scope.BatchId+'&portalId='+$scope.PortalId+'&UserId='+$scope.UserId+'&courseId='+$scope.CourseId);
            if (!$scope.PortalId || !$scope.UserId || !$scope.CourseId) {
              alert("数据无效，请检查api");
              window.close();
            }else if(!$scope.Url||!$scope.PortalURL){
              alert("没有视频资源！");
              window.close();
            }
          });
      };
      //播放scorm视频
      var playScorm = function () {
        var params = $.extend({}, ALL_PORT.PlayScorm.data, { courseId: $scope.allPlayInfo.CourseId })
        $scope.playScormData={};
        commonService.getData(ALL_PORT.PlayScorm.url, 'POST', params)
          .then(function (response) {
            $scope.playScormData=response.Data;
            var BatchId2=response.Data.BatchId;
            var courseId=response.Data.CourseId;
            var LastPostion2=response.Data.LastPostion;
            var portalId=response.Data.PortalId;
            var PortalURL2=response.Data.PortalURL;
            var Url2=response.Data.Url;
            var userId=response.Data.UserId;

            $scope.scormIframeSrc = $sce.trustAsResourceUrl(Url2);
            if (!portalId || !userId || !courseId) {
              alert("数据无效，请检查api");
              window.close();
            }

            function LMSInitialize(value) {
              var reCode = "";
              return true;
            }
            var paraValue;
            var paraName;
            function LMSSetValue(name, value) {
              var reCode = "";
              switch (name) {
                case "cmi.core.student_id":
                  paraName = "cmi.core.student_id";
                  break;
                case "cmi.core.student_name":
                  paraName = "cmi.core.student_name";
                  break;
                case "cmi.core.lesson_location":
                  paraName = "cmi.core.lesson_location";
                  $.ajax({
                    type: "post",
                    async: false,
                    url: API_URL + "/CourseProcess/ScormProcess?m=" + paraName + "&v=" + value,
                    data: { "PortalId": portalId, "userid": userId, "courseid": courseId, "position": value },
                    success: function (result) {
                      if (result.Type == 1) {
                        // window.parent.changeCourseBrowseScore(result.BrowseScore);
                        $scope.loadPlayInfo();
                      }
                    }
                  });

                  break;
                case "cmi.core.credit":
                  paraName = "cmi.core.credit";
                  break;
                case "cmi.core.lesson_status":
                  paraName = "cmi.core.lesson_status";
                  break;
                case "cmi.core.entry":
                  paraName = "cmi.core.entry";
                  break;
                case "cmi.core.score":
                  paraName = "cmi.core.score";
                  break;
                case "cmi.core.score.raw":
                  paraName = "cmi.core.score.raw";
                  break;
                case "cmi.core.total_time":
                  paraName = "cmi.core.total_time";
                  break;
                case "cmi.core.lesson_mode":
                  paraName = "cmi.core.lesson_mode";
                  break;
                case "cmi.core.exit":
                  paraName = "";
                  break;
                case "cmi.core.session_time":
                  paraName = "cmi.core.session_time";
                  $.ajax({
                    type: "post",
                    async: false,
                    url: API_URL + "/CourseProcess/ScormProcess?m=" + paraName + "&v=" + value,
                    data: { "PortalId": portalId, "userid": userId, "courseid": courseId, "position": value },
                    success: function (result) {

                    }
                  });
                  break;
                case "cmi.suspend_data":
                  paraName = "cmi.suspend_data";
                  break;
                default:
                  break;
              }
              //if (paraName == "cmi.core.session_time") {
              //    $.ajax({
              //        type: "get",
              //        url: API_URL + "/CourseProcess/ScormProcess?m=" + paraName + "&v=" + value,
              //        data: { "PortalId": portalId, "userid": userId, "courseid": courseId, "position": value },
              //        success: function (result) {
              //            alert("In LMSSetValue -- result is :" + result)
              //        }
              //    });
              //}
              reCode = "true";

              return reCode;

            }

            function LMSGetValue(name) {
              var reCode = "";
              switch (name) {
                case "cmi.core.student_id":
                  reCode = "get.cmi.core.student_id";
                  break;
                case "cmi.core.student_name":
                  reCode = "get.cmi.core.student_name";
                  break;
                case "cmi.core.lesson_location":
                  reCode = "get.cmi.core.lesson_location";
                  return LastPostion2;
                  //$.ajax({
                  //    type: "post",
                  //    asnyc: false,
                  //    url: API_URL + "/CourseProcess/GetScormProcess?m=" + reCode,
                  //    data: { "PortalId": portalId, "userid": userId, "courseid": courseId, "position": "1" },
                  //    success: function (result) {
                  //        if (result.Type === 1) {
                  //            return result.Location;
                  //        }
                  //        else {
                  //            return "";
                  //        }
                  //    }
                  //});
                  break;
                case "cmi.core.credit":
                  reCode = "get.cmi.core.credit";
                  break;
                case "cmi.core.lesson_status":
                  reCode = "get.cmi.core.lesson_status";
                  return "true";
                  break;
                case "cmi.core.entry":
                  reCode = "get.cmi.core.entry";
                  break;
                case "cmi.core.score":
                  reCode = "get.cmi.core.score";
                  break;
                case "cmi.core.score.raw":
                  reCode = "get.cmi.core.score.raw";
                  break;
                case "cmi.core.total_time":
                  reCode = "get.cmi.core.total_time";
                  break;
                case "cmi.core.lesson_mode":
                  reCode = "get.cmi.core.lesson_mode";
                  break;
                case "cmi.core.exit":
                  reCode = "get.cmi.core.exit";
                  break;
                case "cmi.core.session_time":
                  reCode = "get.cmi.core.session_time";

                  break;
                case "cmi.suspend_data":
                  reCode = "get.cmi.suspend_data";
                  break;
                default:
                  break;
              }
              //if (paraName == "cmi.core.session_time") {
              //    $.ajax({
              //        type: "get",
              //        url: API_URL + "/CourseProcess/ScormProcess?m=" + paraName,
              //        data: { "PortalId": portalId, "userid": userId, "courseid": courseId, "position": "1" },
              //        success: function (result) {
              //            alert("In LMSGetValue -- result is :" + result);
              //        }
              //    });
              //}
              reCode = "true";
              return reCode;
            }

            function LMSCommit(value) {
              var reCode = "";
              return reCode;
            }

            function LMSFinish(value) {
              var reCode = "";
              reCode = LMSCommit(value);
              return reCode;
            }

            function LMSGetLastError() {
              var reCode = "0";
              return reCode;
            }

            function LMSGetErrorString(value) {
              var reCode = "";
              return reCode;
            }


            window.API = new Object();

            API.LMSInitialize = LMSInitialize;
            API.LMSSetValue = LMSSetValue;
            API.LMSGetValue = LMSGetValue;
            API.LMSCommit = LMSCommit;
            API.LMSFinish = LMSFinish;
            API.LMSGetLastError = LMSGetLastError;
            API.LMSGetErrorString = LMSGetErrorString;
          });
      };
      //播放single视频
      var playSingle = function () {
        var params = $.extend({}, ALL_PORT.PlaySingle.data, { courseId: $scope.allPlayInfo.CourseId })
        $scope.playSingleData={};
        var _timePool = {
          startTime: 0,
          increaseTime: 0,
          totalTime: 0
        };
        commonService.getData(ALL_PORT.PlaySingle.url, 'POST', params)
          .then(function(response) {
            $scope.playSingleData = response.Data;
            var _portalId = response.Data.PortalId;
            var _userId = response.Data.UserId;
            var _courseId = response.Data.CourseId;
            var _lastPosition = response.Data.LastPostion;
            var _lastLocation = response.Data.Location;
            var url = response.Data.Url;
            var authcode = "";
            if (!_portalId || !_userId || !_courseId) {
              alert("数据无效，请检查api");
              window.close();
            }
            var MediaPlayer;
            // var au = "47$67$111$117$114$115$101$80$114$111$99$101$115$115$47$83$105$110$103$108$101$80$114$111$99$101$115$115$".toCharString("$");
            // console.log(au);
            function sendProcess() {
              var data = $.extend({},{ "PortalId": _portalId, "userid": _userId, "courseid": _courseId, "positionen": MediaPlayer.currentPosition},$scope.token);
              commonService.getData(ALL_PORT.SingleProcess.url, 'POST', data)
                .then(function (data) {
                  console.log(data);
                  $scope.loadPlayInfo();
                },function () {
                  alert("网路异常，将刷新!");
                  window.location.reload();
                });

              setTimeout(sendProcess, 30000); //送进度间隔时间 30秒传一次;
            };
            MediaPlayer = document.MediaPlayer;
            MediaPlayer.Filename = url;
            MediaPlayer.currentPosition = _lastPosition;

            _timePool.startTime = parseFloat(_lastPosition)+1;
            // MediaPlayer.stop();
            // $interval.cancel(timePromise);
            var timePromise = $interval(function(){
              _timePool.increaseTime+=1;
              _timePool.totalTime = _timePool.startTime+_timePool.increaseTime;
              if (MediaPlayer.currentPosition>_timePool.totalTime){
                alert('请不要在未播放区域拖动，否则可能丢失进度!');
                MediaPlayer.currentPosition = _timePool.totalTime-3;
              }
            },1000);
            $("#btncurrentPosition").click(function () {
              MediaPlayer.currentPosition = MediaPlayer.currentPosition;
            });

            $("#btnduration").click(function () {
              alert(MediaPlayer.duration);
            });

            $("#btnURL").click(function () {
              alert(MediaPlayer.URL);
            });

            $("#btnplay").click(function () {
              MediaPlayer.play();
            });

            $("#btnstop").click(function () {
              MediaPlayer.stop();
            });

            $("#btnpause").click(function () {
              MediaPlayer.pause();
            });

            $("#btnmute").click(function () {
              MediaPlayer.settings.mute = true;
            });

            $("#btnfullScreen").click(function () {
              MediaPlayer.fullScreen = true;
            });

            $("#btnplayState").click(function () {
              alert(MediaPlayer.playState);
            });

            setTimeout(sendProcess, 2000);//第一次送进度时间



          },function () {
            window.close();
          });
      }
      //多拽滑块完成回调
      $scope.showPlayMp4 = false;
      $scope.showPlayJy = false;
      $scope.showPlayScorm = false;
      $scope.showPlaySingle = false;
      $scope.dragReady=function () {
        document.getElementById("playBg").style.display = 'none';
        // console.log("logReady",$scope.options);
        var playPage = $scope.allPlayInfo.PlayPage.split('?')[0];
        // console.log(playPage);
        if(playPage=='PlayJwplay.html'){
          $scope.showPlayMp4 = true;
          playMp4();
        }else if (playPage=='PlayJy.html'){
          $scope.showPlayJy = true;
          playJy();
        }else if (playPage=='PlayScorm.html') {
          $scope.showPlayScorm = true;
          playScorm();
        }else if (playPage=='PlaySingle.html') {
          $scope.showPlaySingle = true;
          playSingle();
        }
      };

      $scope.vm = {};

      //编辑笔记后提交请求
      $scope.editNote = function(options) {
        var editNoteParams = $.extend({}, ALL_PORT.AddNote.data, $scope.token, options);
        if (editNoteParams.Name.length < 2) {
          alert('笔记名称字数不能少于2个字！');
        } else if (editNoteParams.Content.length < 7) {
          alert('笔记内容字数不能少于7个字');
        } else if (editNoteParams.Content.length >= 249) {
          alert('笔记内容字数不能超过249个字');
        } else if (editNoteParams.Name.length >= 2 && editNoteParams.Content.length < 249) {
          $http({
            method: 'POST',
            url: ALL_PORT.AddNote.url,
            data: $.param(editNoteParams),
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            }
          }).success(function(response) {
            $scope.noteName='';
            $scope.noteContent='';
            alert('添加完成！');
            $scope.loadPlayInfo();
          }).error(function(error, status) {});
        }

      };

      //删除笔记
      $scope.delNote = function(id) {
        $http({
          method: 'POST',
          url: ALL_PORT.DelNote.url,
          data: $.param($.extend({}, ALL_PORT.DelNote.data, $scope.token, { Id: id })),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          }
        }).success(function(response) {
          if (response.Type == 1) {
            alert("删除成功！");
            $scope.loadPlayInfo();
          }else {
            alert(response.Message);
          }
        }).error(function(error, status) {});
      };

      //提交评论
      $scope.editComment = function(options) {
        var editCommentParams = $.extend({}, ALL_PORT.CourseCommentAdd.data, $scope.token, options);
        if (editCommentParams.content.length < 7) {
          alert('评论内容字数不能少于7个字！');
        } else if (editCommentParams.content.length >= 249) {
          alert('评论内容字数不能超过249个字！');
        }
        else if ($scope.resultCourseDetail.BrowseScore<100) {
          alert('课程为学完不可评论，请学完课程！');
        } else {
          $http({
            method: 'POST',
            url: ALL_PORT.CourseCommentAdd.url,
            data: $.param(editCommentParams),
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            }
          }).success(function(response) {
            if (response.Type==1){
              $scope.drLevel=1;
              $scope.comment='';
              alert("评论成功，等待审核！");
              $scope.getComment();
            }else {
              alert(response.Message);
            }
          }).error(function(error, status) {});
        }

      };

    });
