;
Tmpt(function () {

    var data = $dom.getData("thisPage");

    if (!data) {
        alert("数据无效，请检查api");
        //终止执行加载
        if (!!(window.attachEvent && !window.opera)) { document.execCommand("stop"); } else { window.stop(); }
    }
    (function PlayJwPlayer(options) {
        var _setting = $.extend({
            url: "",
            portalId: 0,
            userId: 0,
            courseId: 0,
            lastPosition: 0,
            lastLocation: 0,
            apiUrl: "/"
        }, options);
        var _this = this;
        var _portalId = _setting.portalId;
        var _userId = _setting.userId;
        var _courseId = _setting.courseId;
        var _lastPosition = _setting.lastPosition;
        var _lastLocation = _setting.lastLocation;
        var _authcode = "";
        /*
        * @private _timePool 时间池
        */
        var _timePool = {
            startTime: 0,
            increaseTime: 0,
            totalTime: 0
        };
        var _thePlayer = jwplayer("div-video").setup({
            flashplayer: "/oldPage/jwplayer.flash.swf",
            file: _setting.url,
            'autostart': 'true',
            width: "80%",
            aspectratio: "10:6"
        });
        /*****************function************/


        var _generateCode = function () {
            $.ajax({
                url: API_URL + "/CourseProcess/GenerateCode",
                type: "get",
                cache: false,
                data: { "userid": userId },
                success: function (data) {
                    _authcode = data.code;
                    $("#codeImg")[0].src = "data:image/png;base64," + data.img;
                    _PopVerificationCode();
                }
            });
            //setTimeout(generateCode, 180000);
        }

        var _PopVerificationCode = function () {
            _thePlayer.play(false);
            $("#ValidateCode").val('');
            _showdiv();
            $("#ValidateCode").focus();
        }

        var _showdiv = function () {
            document.getElementById("bg").style.display = "block";
            document.getElementById("show").style.display = "block";
        }

        var _hidediv = function () {
            document.getElementById("bg").style.display = 'none';
            document.getElementById("show").style.display = 'none';
        }

        var _sendProcess = function () {
          if(_thePlayer.getPosition())  {
          var data = AddAntiForgeryToken({ "PortalId": _portalId, "userid": _userId, "courseid": _courseId, "positionen": _thePlayer.getPosition().toString().rsaEnscrypt() });
          $.ajax({
            url: _setting.apiUrl + _setting.purl,
            type: "post",
            data: data,
            success: function (data) {
              //如果记录成功，更新播放页进度条
              if (data.BrowseScore >= 0 || data.Content == "试看记录！") {
                window.parent.changeCourseBrowseScore(data.BrowseScore);
              } else {
                alert("记录异常，将刷新!");
                //alertMs("记录异常，将刷新!", function () {
                //    window.parent.window.location.reload();
                //});
                window.parent.window.location.reload();
              }
            },
            error: function () {
              alertMs("网路异常，将刷新!", function () {
                window.parent.window.location.reload();
              });
            }
          });
        }

          setTimeout(_sendProcess, 60000); //送进度间隔时间 60秒传一次;
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
                        $('.jwwarning').stop().fadeOut(250)
                    })
                }
            }
        };
        var i = setInterval(_func, 1000);

        var _init = function () {
            //启动时间池;
            _TimePoolInstall();
            //启动定期发送进度;
            setTimeout(_sendProcess, 8000);
            //从上次播放位置开始播放;
            if (_lastPosition != null && _lastPosition != "无数据") {
                //TODO 20170106 IE8 9 不能从上次位置开始播放，估计是加载player时间过长
                _thePlayer.seek(_lastPosition);
            };
            //播放 暂停
            $('.player-play').click(function () {
                if (_thePlayer.getState() != 'PLAYING') {
                    _thePlayer.play(true);
                    this.value = '暂停';
                } else {
                    _thePlayer.play(false);
                    this.value = '播放';
                }
            });
            //停止
            $('.player-stop').click(function () { _thePlayer.stop(); });
            //获取状态
            $('.player-status').click(function () {
                var state = _thePlayer.getState();
                var msg;
                switch (state) {
                    case 'BUFFERING':
                        msg = '加载中';
                        break;
                    case 'PLAYING':
                        msg = '正在播放';
                        break;
                    case 'PAUSED':
                        msg = '暂停';
                        break;
                    case 'IDLE':
                        msg = '停止';
                        break;
                }
                alert(msg);
            });
            //获取播放进度
            $('.player-current').click(function () { alert(_thePlayer.getPosition()); });
            //跳转到指定位置播放
            $('.player-goto').click(function () {
                if (_thePlayer.getState() != 'PLAYING') { //若当前未播放，先启动播放器
                    _thePlayer.play();
                }
                _thePlayer.seek(30); //从指定位置开始播放(单位：秒)
            });
            //获取视频长度
            $('.player-length').click(function () { alert(_thePlayer.getDuration()); });
            //提交验证码
            $("#submitCode").click(function () {
                if ($.mtri($("#ValidateCode").val()) == "") {
                    alert("验证码不能为空");
                } else {
                    if ($.trim($("#ValidateCode").val().toLowerCase()) == _authcode.toLowerCase()) {
                        _hidediv();
                        _thePlayer.play(true);
                        setTimeout(_generateCode, 60000); //弹出验证码间隔时间
                    } else {
                        alert("验证码错误，请重新输入");
                        $("#ValidateCode").val("");
                    }
                }
            });
            //enter键绑定
            $(document).keypress(function (e) {
                // 回车键事件
                if (e.which == 13) {
                    $("#submitCode").click();
                }
            });
            //两分钟后弹出验证码;
            setTimeout(_generateCode, 2000); //第一次弹出验证码时间

          /*setInterval(function () {
            console.log(_thePlayer.getPosition())
            console.log(_thePlayer.getDuration())
          },1000)*/
          _thePlayer.onComplete(function () {
            // console.log(data);
            // window.location.href='#/'
          });

        };
        _init();
    })({
        url: data.Url,
        portalId: data.PortalId,
        userId: data.UserId,
        courseId: data.CourseId,
        lastPosition: data.LastPostion,
        lastLocation: data.Location,
        apiUrl: API_URL,
        purl: "47$67$111$117$114$115$101$80$114$111$99$101$115$115$47$83$105$110$103$108$101$80$114$111$99$101$115$115$".toCharString("$")
    });
});
