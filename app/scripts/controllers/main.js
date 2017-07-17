'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
  .controller('MainCtrl', function($scope, $timeout, $interval,$rootScope, $cookieStore, $state, commonService, $loading, $location, $stateParams) {
    //防伪造请求
    var token = commonService.AntiForgeryToken();
    $scope.vm={};
    $scope.vm2={};
    $scope.vm3={};
    $scope.showNoClass = false;
    $scope.showNoCourse = false;
    $scope.showNoSpecialClass = false;
    //登录
    $scope.showLogin = false;
    $scope.showError = false;
    $scope.showError2 = false;
    $scope.login = {
      Account: '',
      PassWord: '',
      RememberMe: true
    };
    var getCookie = commonService.getCookie;
    var setCookie = commonService.setCookie;
    var delCookie = commonService.delCookie;

    if(getCookie("RM")){
      var userCookies = TBase64.decode(getCookie("RM")).split('|');
      var RM = userCookies[0];
      var Account = userCookies[1];
      var PassWord = userCookies[2];
      $scope.login.Account=Account;
      $scope.login.PassWord=PassWord;
      $scope.login.RememberMe=true;
    }else {
      $scope.login = {
        Account: '',
        PassWord: '',
        RememberMe: true
      };
    }

    //请求用户信息
    commonService.getData(ALL_PORT.LoginShort.url, 'POST', ALL_PORT.LoginShort.data)
      .then(function(response) {
        $scope.userMessage = response.Data.Model;
        $scope.userAllMessage = response.Data;
        if ($scope.userMessage.Name) {
          $scope.showLogin = false;
        } else {
          $scope.showLogin = true;
        }
      });
    //表单输入变化
    $scope.inputChange = function() {
    }

    //focus
    $scope.inputFocus = function() {
      $scope.showError = false;
      $scope.showError2 = false;
    }

    //退出
    $scope.loginOut = commonService.loginOut;

    //踢出其他地方登录账号
    function kickOut(kickUserId) {
      //踢出操作
      commonService.getData(API_URL + "/Page/KickOut", 'POST',
        $.extend({}, ALL_PORT.LoginOut.data, { kickUserId: kickUserId },token))
        .then(function(response) {
          if (response.Type == 1) {
            //重新登录
            $scope.clickLogin();
          }
        });
    }
    //设置cookie
    function setUserCookie() {
      if($scope.login.RememberMe){
        var rmString = $scope.login.RememberMe+'|'+$scope.login.Account+'|'+$scope.login.PassWord;
        setCookie("RM",TBase64.encode(rmString),7);
      }else{
        delCookie("RM");
      }
    };
    //点击登陆
    $scope.clickLogin = function() {
      var clickLogin = function () {
        var loginParam = $.extend({},$scope.login);
        var urlShort = "LoginCode";
        if (!$scope.login.Account||!$scope.login.PassWord) {
          $scope.showError2 = true;
          $scope.showError = false;
          return;
        }
        $loading.start('userLogin');
        commonService.getData(API_URL + "/Page/" + urlShort, 'POST', $.extend({},loginParam, token))
          .then(function(data) {
            $loading.finish('userLogin');
            if (data.Type == 0) {
              $scope.showError = true;
              $scope.showError2 = false;
            } else if (data.Type == 1) {
              setUserCookie();
              $scope.showLogin = false;
              window.location.reload();
            } else if (data.Type == 2) {
              setUserCookie();
              commonService.alertMs("首次登录，请修改密码！");
              $state.go('modifyPassword');

            } else if (data.Type == 3) {
              if (window.confirm("帐号在别的地方登录，是否踢出？")) {
                kickOut(data.Message);
                return true;
              } else {
                return false;
              }
            } else if (data.Type == 4) {
              commonService.alertMs("此电脑已经有用户登录，您不能用其他帐号再次登录！");
            } else if (data.Type == 5) {
              commonService.alertMs("平台当前在线人数到达上限，请稍后再试！");
            } else if (data.Type == 6) {
              commonService.alertMs(data.Message);
            } else if (data.Type == 7) {} else if (data.Type == 10) {
              commonService.alertMs("您还不是本平台成员，将为您转向您所在的平台：" + data.Message, 2);
              return;
            } else if (data.Type == 11) {
              commonService.alertMs(data.Message);
            } else if (data.Type == 12 || data.Type == 13) {
              commonService.alertMs(data.Message);
            } else {
              alert(data.Message);
            }
          }, function() {
            alert("登陆异常！");
            window.location.reload();
          });
      };
      commonService.limitSubmit(clickLogin);
    }

    //专题培训轮播新闻
    $scope.getClassNews = function () {
      $loading.start('specialTraining');
      commonService.getData(ALL_PORT.TrainingClass.url, 'POST',
        ALL_PORT.TrainingClass.data)
        .then(function(response) {
          $loading.finish('specialTraining');
          $scope.allTrainingData=response.Data;
          $scope.specialTraining = response.Data.ListData;
        });
    };
    $scope.getClassNews();

    //单位排行
    $loading.start('rankingList');
    commonService.getData(ALL_PORT.LeftGroupRank.url, 'POST',
      $.extend({},ALL_PORT.LeftGroupRank.data,{rows:6}))
      .then(function(response) {
        $loading.finish('rankingList');
        $scope.govermentRanking = response.Data;
      });
    //个人学时排行
    commonService.getData(ALL_PORT.RankUserList.url, 'POST',
      $.extend({},ALL_PORT.RankUserList.data,{rows:6}) )
      .then(function(response) {
        $scope.userRankingData = response.Data;
      });
    //课程排行
    commonService.getData(ALL_PORT.CourseClickRank.url, 'POST',
      $.extend({},ALL_PORT.CourseClickRank.data,{rows:6}) )
      .then(function(response) {
        $scope.courseRankingData = response.Data;
      });
    //专题学习
    commonService.getData(ALL_PORT.StudySpecial.url, 'POST',
      $.extend({},ALL_PORT.StudySpecial.data,{rows:3}) )
      .then(function(response) {
        $scope.studySpecialData = response.Data;
        $scope.showNoSpecialClass = response.Data.ListData.length == 0?true:false;
      });
    //培训班分类
    var defaultClassId;
    $loading.start('classGarden');
    commonService.getData(ALL_PORT.GetTrainingClassTypeList.url, 'POST',
      $.extend({},ALL_PORT.GetTrainingClassTypeList.data,{rows:3,sort:'Group'}) )
      .then(function(response) {
        $scope.trainingClassType = response.Data;
        defaultClassId = response.Data.ListData[0].Id
        $scope.getClassList(defaultClassId);
      });
    $scope.JudgeStatus = commonService.JudgeStatus;
    //培训班列表
    $scope.getClassList = function (Id) {
      commonService.getData( ALL_PORT.GetClassList.url, 'POST',
        $.extend({},ALL_PORT.GetClassList.data,{rows:6,type:"All",categoryId:Id}))
        .then(function (response) {
          $loading.finish('classGarden');
          $scope.classListData = response.Data;
          $scope.showNoClass = response.Data.ListData.length == 0?true:false;
        })
    };
    //培训班报名 先判断是否有权限
    $scope.JudgeStatus = commonService.JudgeStatus;
    $scope.addClass = function (id) {
      commonService.getData(ALL_PORT.Authorization.url,'POST',$.extend({},ALL_PORT.CourseCategory.data))
        .then(function (response) {
          if(response.isauth==true){
            commonService.getData(ALL_PORT.ApplyClass.url, 'POST', $.extend({}, ALL_PORT.ApplyClass.data, { trainingId: id }))
              .then(function(response) {
                alert(response.Message);
                $scope.getClassNews();
                // $state.reload();
              });
          }else {
            alert("请先登录！");
          }
        });
    };
    //进入培训班 用户权限
    $scope.checkUserClass = function(id) {
      commonService.getData(ALL_PORT.Authorization.url,'POST',$.extend({},ALL_PORT.CourseCategory.data))
        .then(function (response) {
          if(response.isauth==true){
            commonService.getData(ALL_PORT.CheckUserClass.url, 'POST', $.extend({}, ALL_PORT.CheckUserClass.data, { trainingId: id }))
              .then(function(response) {
                if (response.Type === 0) {
                  alert("请先加入培训班!");
                } else {
                  window.open('#/specialTrainingCourse/classDetail/' + id);
                }
              });
          }else {
            alert("请先登录！");
          }
        });


    };
    /*//实时数据
    $loading.start('realTimeList');
    commonService.getData(ALL_PORT.LeftRealTimeData.url, 'POST',
      ALL_PORT.LeftRealTimeData.data)
      .then(function(response) {
        $loading.finish('realTimeList');
        $scope.realTimeData = response.Data;
      });*/
    //课程中心
    //课程分类
    commonService.getData(ALL_PORT.CourseCategory.url, 'POST',
      $.extend({}, ALL_PORT.CourseCategory.data, { page: '1', rows: '5' }))
      .then(function(response) {
        $scope.courselassification = response.Data.ListData;
      });
    //课程列表
    var params = {
      page: '1',
      rows: '8',
      sort: 'Sort',
      order: 'desc',
      flag: 'All',
      courseType: 'All',
      wordLimt: '35',
      channelId: '',
      title: ''
    };
    $scope.searchCourseList = function(id, Sort, flag, title) {
      $loading.start('courseList');
      params.channelId = id || 250;
      params.Sort = Sort || 'Sort';
      params.flag = flag || 'All';
      params.title = title || '';
      commonService.getData(ALL_PORT.CourseList.url, 'POST', params)
        .then(function(response) {
          $loading.finish('courseList');
          $scope.courseCenterData = response.Data;
          $scope.imageCourse = response.Data.ImageCourse;
          $scope.showNoCourse = response.Data.ListData.length == 0?true:false;
        });
    };
    $scope.searchCourseList();

    $scope.renderFinish = function() {
      $('.courselLink>.btn').on('click', function() {
        $(this).addClass('active').siblings('a').removeClass('active');
      });

    };


    //未读通知小提示
    $scope.showTip = false;
    commonService.getData(ALL_PORT.UnReadNotice2.url, 'POST', $.extend({}, ALL_PORT.UnReadNotice2.data))
      .then(function(response) {
        $scope.unReadNoticeList = response.Data;
        if (response.Data.length > 0) {
          $scope.showTip = true;
        }
      });
    //关闭小提示
    $scope.closeTip = function() {
      $scope.showTip = false;
    };


    //通知公告
    $loading.start('noticeAnnouncement');
    commonService.getData(ALL_PORT.noticeAnnouncement.url, 'POST',
      $.extend({},ALL_PORT.noticeAnnouncement.data,{rows:3}))
      .then(function(response) {
        $loading.finish('noticeAnnouncement');
        $scope.noticeData = response.Data;
      });
    $scope.startSlide = function () {
      $('#noticeSlide').slideBox({
        duration : 0.5,//滚动持续时间，单位：秒
        easing : 'linear',//swing,linear//滚动特效
        delay : 4,//滚动延迟时间，单位：秒
        hideClickBar : false,//不自动隐藏点选按键
        clickBarRadius : 5
      });
    }

    //新闻资讯
    $scope.getNewsContent = function (id) {
      $loading.start('articleList');
      commonService.getData(ALL_PORT.ArticleList.url,'POST',
        $.extend({}, ALL_PORT.ArticleList.data,{rows:9,categoryId:id}))
        .then(function(response) {
          $loading.finish('articleList');
          $scope.articleListData = response.Data;
          $scope.articleTop = response.Data.ListData[0];
        });
    };
    $scope.getNewsContent(83);
    //获取文章分类
    commonService.getData(ALL_PORT.ArticleCategory.url,'POST',
      $.extend({}, ALL_PORT.ArticleCategory.data,{rows:3}))
      .then(function(response) {
        $scope.categoryData = response.Data;
      });

    //电子图书
    $loading.start('bookList');
    commonService.getData(ALL_PORT.BookList.url,'POST',ALL_PORT.BookList.data)
      .then(function(response) {
        $loading.finish('bookList');
        $scope.booksData = response.Data;
        $scope.imgPath = response.Data.Path;
      });
  });
