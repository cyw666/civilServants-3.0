'use strict';

/**
 * @ngdoc service
 * @name luZhouApp.commonService
 * @description
 * # commonService
 * Service in the luZhouApp.
 */
angular.module('luZhouApp')
  .service('commonService', function ($http,$cookies,$cookieStore,$timeout,$location,$loading,$q,$interval,antiForgeryToken,$state) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    //警告功能 - start
    /**
     * this is a method replacing the alert and confirm
     * @param  {object or string} options       the content of alert things
     * @param  {number} opt_warntype  chooce alert type or confirm type or original
     * @param  {function} opt_callback1 return function of confirm
     * @param  {function} opt_callback2 return function of cancle
     * @return {html}               change the alert style
     */
    this.alertMs = function (options, opt_warntype, opt_callback1, opt_callback2) {
      var option = {
        warnType: 1, //1 为alert型; 2 为confirm型; 3 为系统alert型
        Title: "消息",
        Message: "错误",
        theme: "green" //"red","blue","green","yellow"可以在generateCSS的themes添加对象
      };
      var generate = {
        HTML: function (option) {
          var $html = "" +
            "<div id=\"msOut\">" +
            "    <div id=\"msBox\">" +
            "        <div class=\"msTitle\">" + option.Title + "</div>" +
            "        <div class=\"msMessage\">" + option.Message + "</div>" +
            "        <div class=\"msBtn\">" +
            "            <span class=\"msConfirm\">确定</span>" +
            (option.warnType == 2 ? "<span class=\"msReject\">取消</span>" : "") +
            "        </div>" +
            "    </div>" +
            "    <div class=\"msLayer\"></div>" +
            "</div>";
          $('body').append($html);
          this.CSS(option);
        },
        CSS: function (option) {
          var themes = { "red": "#CC3300", "blue": "#99CCFF", "green": "#8bb166", "yellow": "#FFFF66" };
          var themeColor = themes[option.theme];
          for (var color in themes) {
            if (color == option.theme) {
              themeColor = themes[color];
              break;
            }
          }
          $("#msOut").css({ "width": '100%', "height": '100%', "zIndex": '99999', "position": 'fixed', "top": '0', "left": '0' });
          $(".msLayer").css({ "width": '100%', "height": '100%', "filter": 'Alpha(opacity=40)', "backgroundColor": '#000', "opacity": '0.4' });
          $("#msBox").css({ "width": '500px', "height": '300px', "zIndex": '99999', "position": 'absolute', "opacity": "0" });
          $(".msTitle").css({ "display": 'block', "fontSize": '14px', "color": '#444', "padding": '10px 15px', "backgroundColor": '#f0f4f7', "borderRadius": '15px 15px 0 0', "borderBottom": '3px solid ' + themeColor, "fontWeight": 'bold' });
          $(".msMessage").css({ "padding": " 50px", "line-height": " 22px", "background-color": "#393D49", "color": "#fff", "font-weight": "300", "overflow": "hidden", "text-overflow": "ellipsis" });
          $(".msBtn").css({ "padding": '15px 0 10px 0', "borderRadius": '0 0 15px 15px', "textAlign": 'center', "background-color": "#f0f4f7" });
          $(".msConfirm").css({ "display": "inline-block", "height": "28px", "line-height": "28px", "margin": "0 6px", "padding": "0 15px", "border": "1px solid" + themeColor, "background-color": themeColor, "color": " #fff", "border-radius": "2px", "font-weight": "400", "cursor": "pointer", "text-decoration": "none" });
          $(".msReject").css({ "display": "inline-block", "height": "28px", "line-height": "28px", "margin": "0 6px", "padding": "0 15px", "border": "1px solid #dedede", "background-color": "#f1f1f1", "color": "#333", "border-radius": "2px", "font-weight": "400", "cursor": "pointer", "text-decoration": "none" });
          this.Event(opt_callback1, opt_callback2);
        },
        Event: function (opt_callback1, opt_callback2) {
          var $width = document.documentElement.clientWidth;  //屏幕宽
          var $height = document.documentElement.clientHeight; //屏幕高
          var boxWidth = $("#msBox").width();
          var boxHeight = $("#msBox").height();
          $("#msBox").css({ "left": ($width - boxWidth) / 2 + "px" });
          $("#msBox").stop().animate({ "top": ($height - boxHeight) / 2 + "px", "left": ($width - boxWidth) / 2 + "px", "opacity": "1" }, 300);
          $(".msConfirm").click(function () {
            $("#msBox").stop().animate({ "top": "0", "opacity": "0.2" }, 300, function () { $("#msOut").remove(); });
            if (typeof opt_callback1 === "function") {
              opt_callback1();
              $('.msOut').remove()
            }
          });
          $(".msReject").click(function () {
            $("#msBox").stop().animate({ "top": "0", "opacity": "0.2" }, 300, function () { $("#msOut").remove(); });
            if (typeof opt_callback2 === "function") {
              opt_callback2();
              $('.msOut').remove()
            }
          });
        }
      }
      if (typeof options === "string") {
        option.Message = options;
        if (typeof opt_warntype === "number") {
          if (opt_warntype != 3) {
            option = $.extend(option, { warnType: opt_warntype });
            generate.HTML(option);
          } else {
            alert(option.Message);
          }
        } else if (typeof opt_warntype === "function") {
          opt_callback1 = opt_warntype;
          generate.HTML(option);
        } else {
          generate.HTML(option);
        }
      } else if (typeof options === "object") {
        option = $.extend(option, options);
        if (typeof opt_warntype === "number") {
          if (opt_warntype != 3) {
            option = $.extend(option, { warnType: opt_warntype });
            generate.HTML(option);
          } else {
            alert(option.Message);
          }
        } else if (typeof opt_warntype === "function") {
          option = $.extend(option, options);
          opt_callback1 = opt_warntype;
          generate.HTML(option);
        } else {
          generate.HTML(option);
        }
      }

    };
    //获取cookie
    this.getCookie = function (name, pro) {
      function GetQueryString(name,value) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = value.match(reg);
        if (r !== null) {
          return unescape(r[2]);
        }
        return null;
      }

      if($cookieStore.get(name)){
        var cookie = $cookieStore.get(name);
        if(pro){
          return GetQueryString(pro,cookie);
        }else {
          return cookie;
        }

      }else if(document.location.protocol + "//" + document.location.host != API_URL.substring(0, API_URL.lastIndexOf('/'))){
        $http({
          method:'POST',
          url:API_URL+"/Page/RememberMe",
          data:null,
          headers:{
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          }
        }).success(function(response){
          if (response.Type == 1) {
            $cookieStore.put(name,response.Message);
            cookie =  $cookieStore.get(name);
            //console.log(cookies);
            if(pro){
              return GetQueryString(pro,cookie);
            }else {
              return cookie;
            }
          }
          else {
          }
        }).error(function (error, status) {
        });
      }else {

      }
    };
    this.getCookie2 = function(name, pro, cookies) {
      cookies = cookies || document.cookie;
      var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");  // (^| )longguid=([^;]*)(;|$)
      arr = cookies.match(reg);
      if (pro) {
        var cookie;
        if (arr) {
          cookie = unescape(arr[2]);
          var ar, re = new RegExp("(=|&| |^)" + pro + "=([^&;]*)(&|;|$)");
          ar = cookie.match(re);
          if (ar) {
            return unescape(ar[2]);
          }
          else return null;
        }
        else
          return null;
      }
      else {
        if (arr)
          return unescape(arr[2]);
        else
          return null;
      }
    };
    //保持在线
    this.keepOnline = function () {
      setInterval(function () {
        $http({
          method:'GET',
          url:ALL_PORT.KeepOnline.url
        }).success(function(response){
        });
      },60000);
    }
    //判断能否访问
    this.isVisit = function () {

      $http({
        method:'POST',
        url:ALL_PORT.Authorization.url,
        data:$.param($.extend({},ALL_PORT.Authorization.data))
      }).success(function(response){
        if(response.isauth==true){
        }else {
          alert("请先登录！");
          $location.path('main');
        }
      }).error(function (error, status) {

      });
    }
    //退出
    this.loginOut = function (str) {
      // console.log(antiForgeryToken.AntiForgeryToken());
      $loading.start('loginOut');
      $http({
        method:'POST',
        url:ALL_PORT.LoginOut.url,
        data:$.param($.extend({},ALL_PORT.LoginOut.data,antiForgeryToken.AntiForgeryToken())),
        headers:{
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        }
      }).success(function(response){
        $loading.finish('loginOut');
        $state.go('main');
        window.location.reload();
      }).error(function (error, status) {
      });
    }
    //防伪造请求
    this.AntiForgeryToken = function () {
      var token = new Object();
      $http({
        method:'POST',
        url:ALL_PORT.AntiForgeryToken.url,
        data:ALL_PORT.AntiForgeryToken.data,
        headers:{
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        }
      }).success(function(response){
        /*return $timeout(function () {
          $('.preventorgery').html(response.html);
          var value = $('.preventorgery input').val();
          var name = $('.preventorgery input').attr('name');
          token[name] = value;
          return token;
        },1000);*/
        $('body').append('<div class="preventorgery"></div>');
        $('.preventorgery').html(response.html);
        var value = $('.preventorgery input').val();
        var name = $('.preventorgery input').attr('name');
        token[name] = value;
        $('div.preventorgery').remove();
        return token;
      });
      return token;
    }
    //过滤日期
    this.dateFilter = function (str,value) {
      function dFormat(i) { return i < 10 ? "0" + i.toString() : i; }
      if (value == "yyyy-MM-dd hh:mm:ss") {
        var d = eval('new ' + str.substr(1, str.length - 2));
        var ar_date = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
        for (var i = 0; i < ar_date.length; i++) ar_date[i] = dFormat(ar_date[i]);
                return ar_date.slice(0, 3).join('-') + ' ' + ar_date.slice(3).join(':');
      } else if (value == "yyyy-MM-dd") {
        var d = eval('new ' + str.substr(1, str.length - 2));
        var ar_date = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
        for (var i = 0; i < ar_date.length; i++) ar_date[i] = dFormat(ar_date[i]);
        return ar_date.join('-');
      }
    }
    //获取总数量
    this.examAllCount = function (arr) {
      return arr.length;
    };
    //考试总分
    this.examAllScore = function (arr) {
      var sum =0;
      for (var i = 0;i<arr.length;i++) {
        sum += arr[i].Score;
      }
      return sum;
    };
    //考试总分2
    this.examAllScore2 = function (arr) {
      var sum =0;
      for (var i = 0;i<arr.length;i++) {
        sum += arr[i].Question.Score;
      }
      // debugger
      return sum;
    };
    //答对题目总数
    this.countIf = function (arr) {
      var count = 0;
      for (var i = 0;i<arr.length;i++) {
        if (arr[i].UserAnswer==arr[i].Question.Answer) {
          count++;
        }
      }
      return count;
    };
    //正确得分
    this.rightScore = function (arr) {
      var sum = 0;
      for (var i = 0;i<arr.length;i++) {
        sum+=arr[i].UserScore;
      }
      return sum;
    };

    //培训班报名状态
    this.JudgeStatus = function (status) {
      var outputHtml = "";
      if (status != "null") {
        switch (status) {
          case "Normal":
            outputHtml += "已报名";
            break;
          case "UnAudit":
            outputHtml += "等待审核";
            break;
          case "UnApprove":
            outputHtml += "审核未通过";
            break;
        }
      }
      else {
      }
      return outputHtml;
    };

    //播放refresh
    this.refresh = function (PortalId,userId,courseid) {
      var fresh = function () {
        $http({
          method: 'POST',
          url: ALL_PORT.Refresh.url,
          data: $.param($.extend({},ALL_PORT.Refresh.data,{PortalId:PortalId, userId:userId, courseid: courseid })),
        }).success(function(data) {
          if (!!data) {
            if ((data + '').indexOf("ok") > -1) {
              // setTimeout(fresh, 2000);
            }
            else {
              if (data.Type === 401) {
                clearTimeout(timer);
                document.body.innerHTML = "";//屏蔽页面
                if (confirm("消息：用户已登出，是否回到首页？  点击取消将关闭页面")) {
                  $state.go('main');
                  window.location.reload();
                }
                else {
                  window.close();
                }
              }
              else {
                clearTimeout(timer);
                document.body.innerHTML = "";
                alert("出现错误 将返回首页");
                $state.go('main');
                window.location.reload();
              }
            }
          }
          else {
            clearTimeout(timer);
            document.body.innerHTML = "";
            alert("出现错误 将返回首页");
            $state.go('main');
            window.location.reload();
          }
        }).error(function (ex) {
          alert("出现错误:" + ex.Message + ", 将返回首页");
          document.body.innerHTML = "";
          $state.go('main');
          window.location.reload();
        });
      }
      var timer = setInterval(fresh,3000);
      // clearInterval(timer);
    }
    // 视频播放页面当页面卸载（关闭）或刷新时调用
    this.beforeUnload = function (userid) {
      $(window).bind('beforeunload', function (e) {
        /*var confirmationMessage = '确定离开此页吗？本页不需要刷新或后退';
        (e || window.event).returnValue = confirmationMessage;     // Gecko and Trident
        return confirmationMessage;*/
        $http({
          method: 'POST',
          url: ALL_PORT.ClearPlayingCourse.url+ Math.round(Math.random() * 10000),
          data: $.param($.extend({},ALL_PORT.ClearPlayingCourse.data,{userid:userid})),
        }).success(function(response) {
          // console.log(response);
        });
      });
    };

    //获取数据
    this.getData = function(endpoint, method, params){
        var defer = $q.defer();
        $http({
            url: endpoint,
            method: method,
            headers: {
	            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            },
            data: $.param(params)
        }).success(function (data) {
            defer.resolve(data);
        }).error(function (data, status, headers, config) {
            // defer.resolve(data);
            defer.reject(data);
        });
        return defer.promise;

    };

    //上传文件
	  this.upload=function(event,types){

		var typeConfig = "";
		switch (types) {
		  case "Image":
		    typeConfig = "jpeg,jpg,png,gif,bmp";
                break;
            case "ImageTraining":
                typeConfig = "jpeg,jpg,png,gif,bmp";
                break;
            case "Attachment":
                typeConfig = "zip,rar,txt,doc,docx,xls,xlsx,ppt,pptx";
                break;
            default:
                typeConfig = "jpeg,jpg,png,gif,bmp,zip,rar,txt,doc,docx,xls,xlsx,ppt,pptx";
                break;
        }

        var file = event.files[0];
        var fileName = file.name;
        var file_typename = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);


        if (typeConfig.indexOf(file_typename) > -1) {//这里限定上传文件文件类型
            if (file) {
                var fileSize = 0;
                if (file.size > 1024 * 1024)
                    fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + "MB";
                else
                    fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + "KB";
            }
        }else{
            alert("文件后缀应为以下类型" + typeConfig + ",而不是" + file_typename + ",请重新选择文件");
        }


        if (window.FormData){
            var fd = new FormData();
            fd.append('fileType',types);
            fd.append('file',file);
            $http({
                url:API_URL_ADMIN+"/Common/ToLead",
                method:"POST",
                data:fd,
                transformRequest: angular.identity,
                headers:{
                    'Content-Type':undefined
                }
            }).success(function (response) {
                // alert(response);
                $('#hidValueImage').val(response);
                console.log($('#hidValueImage').val());
            }).error(function (error,status) {

            });
        }
		console.log(event.type,event.name);
        console.log(file, typeConfig);

    };

	  //获取文章分类
    this.getArticleCategory=function () {
        var arr=[];
	    $.ajax({
		    type: "POST",
		    async: false,
		    contentType: "application/x-www-form-urlencoded;charset=UTF-8",
		    xhrFields: {
			    withCredentials: true
		    },
		    url:ALL_PORT.ArticleCategory.url,
		    data: $.extend({},ALL_PORT.ArticleCategory.data),
		    success:function (response) {
			    arr = response.Data.ListData;
			    return arr;
		    }
	    });
	    return arr;
    };
    //获取验证码
    this.getVerifyCode=function () {
      $http({
        method: 'GET',
        url: ALL_PORT.GetVerifyCode.url,
        params : Math.random() * 10,
      }).success(function(response) {
        if ($("#codeImg")[0]) {
          $("#codeImg")[0].src = "data:image/png;base64," + response.img;
        }
      });
    }

    //收藏本站
    this.AddFavorite = function(title, url) {
      var title = title||document.title;
      var url = url||location.href;
      try {
        window.external.addFavorite(url, title);
      }
      catch (e) {
        try {
          window.sidebar.addPanel(title, url, "");
        }
        catch (e) {
          alert("抱歉，您所使用的浏览器无法完成此操作。\n\n加入收藏失败，请使用Ctrl+D进行添加");
        }
      }
    }

    //设为首页
    this.SetHome = function(obj, url) {
      var url = url || location.href;
      try{
        obj.style.behavior='url(#default#homepage)';
        obj.setHomePage(url);
      }catch(e){
        if(window.netscape){
          try{
            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
          }catch(e){
            alert("抱歉，此操作被浏览器拒绝！\n\n请在浏览器地址栏输入“about:config”并回车然后将[signed.applets.codebase_principal_support]设置为'true'");
          }
        }else{
          alert("抱歉，您所使用的浏览器无法完成此操作。\n\n您需要手动将【"+url+"】设置为首页。");
        }
      }
    }
  });
