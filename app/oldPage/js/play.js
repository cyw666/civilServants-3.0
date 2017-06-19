//# sourceURL="play.js";

(function Player(options) {
    var _setting = $({
        api: "",
    }, options);

    var _data = $dom.getData('topPage');
    var init = function () {
        $(window).bind('beforeunload', function () {
            $.ajax({
                type: "post",
                url: API_URL + "/Page/ClearPlayingCourse?" + Math.round(Math.random() * 10000),
                data: { "userid": _data.UserId },
                success: function (data, textStatus) { }
            });
        });
        refresh();
        var iframeTag = document.getElementsByTagName("iframe")[0];
        iframeTag.removeAttribute("ifsrc");
        iframeTag.setAttribute('src', '');///Content/commonPages/{{PlayPage}}
      if ((!!_data && _data.Content == null)) {  //
            if ((!!_data.PortalId) && (!!_data.UserId) && (!!_data.CourseId)) {
                check();
                open();
            }
            else {
                alert("数据无效，请检查api");
                //终止执行加载
                if (!!(window.attachEvent && !window.opera)) {
                    document.execCommand("stop");
                }
                else {
                    window.stop();
                }
                close();
            }
        }
        else if (!!_data && !!_data.Content) {
            alert('同时只能打开一门课程,请关闭之前页面,并于' + _data.Content + '秒后重试！');
            document.getElementsByTagName("body")[0].innerHTML = "";
            close();
        }
    };
    var open = function () {
        //侧边栏开关
        var toggle = 0;
        $('.toggleSideSec').on('click', function () {
            if (toggle === 0) {
                $('.side_section').hide();
                $('.iframeOuter').css('right', '12px');
                $('.toggleSideSec').css('right', '0');
                $(this).css('background', 'url("../oldPage/images/1.jpg")');
                toggle = 1
            } else {
                $('.side_section').show();
                $('.iframeOuter').css('right', '336px');
                $('.toggleSideSec').css('right', '324px');
                $(this).css('background', 'url("../oldPage/images/2.jpg")');
                toggle = 0
            }
        });
        $('.toggleSideSec').click();
    }
    var close = function () {
        if (navigator.userAgent.indexOf("MSIE") > 0) {
            if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
                window.opener = null;
                window.close();
            } else {
                window.open('', '_top');
                window.top.close();
            }
        }
        else if (navigator.userAgent.indexOf("Chrome") > 0) {
            window.location.href = "about:blank";
            window.close();
        }
        else if (navigator.userAgent.indexOf("Firefox") > 0) {
            window.location.href = 'about:blank ';
        } else {
            window.opener = null;
            window.open('', '_self', '');
            window.close();
        }
    };
    var refresh = function () {
        $.ajax({
            url: API_URL + "/CourseProcess/Refresh",
            type: "post",
            data: { "PortalId": _data.PortalId, "userId": _data.UserId, "courseid": _data.CourseId },
            success: function (data) {
                if (!!data) {
                    if ((data + '').indexOf("ok") > -1) {
                        //alert("请重新登录！");
                        //clearTimeout(refresh);
                        //closeWebPage();
                        setTimeout(refresh, 2000);
                    }
                    else {
                        if (data.Type === 401) {
                            clearTimeout(refresh);
                            document.body.innerHTML = "";//屏蔽页面
                            if (confirm("消息：用户已登出，是否回到首页？  点击取消将关闭页面")) {
                                window.location.href = "/";
                            }
                            else {
                                close();
                            }
                        }
                        else {
                            clearTimeout(refresh);
                            document.body.innerHTML = "";
                            alert("出现错误 将返回首页");
                            window.location.href = "/";
                        }
                    }
                }
                else {
                    clearTimeout(refresh);
                    document.body.innerHTML = "";
                    alert("出现错误 将返回首页");
                    window.location.href = "/";
                }

            },
            error: function () {
                alert("出现错误:" + ex.Message + ", 将返回首页");
                document.body.innerHTML = "";
                window.location.href = "/";
            }
        });
    };
    var check = function () {
        showdiv();
        $('#drag').drag({
            ifsrc:  _data.PlayPage
        });
    };


    init();
})({
    api: API_URL
});

function showdiv() {
    document.getElementById("bg").style.display = "block";
    // document.getElementById("show").style.display = "block";
};
function hidediv() {
    document.getElementById("bg").style.display = 'none';
    // document.getElementById("show").style.display = 'none';
};



//笔记添加
function noterefresh(noteId) {
    var note_title = $('.textarea-wrap').find('input').val(),
    note_content = $('.textarea-wrap').find('textarea').val(),
    note_date = new Date,
    note_year = note_date.getFullYear(),
    note_month = note_date.getMonth() + 1,
    note_day = note_date.getDay();
    var new_note = "<div id=\"" + noteId + "\" class=\"notes\"><div class=\"title\" style=\"line-height: 1.2;margin-bottom: 10px;\">标题:" + note_title + "<span class=\"time\" style=\"color:#999;font-size: 12px;float: right\">" + note_year + "-" + note_month + "-" + note_day + "</span></div><div class=\"content\" style=\"background:none\">" + note_content + "<span class=\"delnote\" onclick=\"delNote(" + noteId + ")\">删除</span></div></div>";
    $('.newNote').after(new_note);
    $('.textarea-wrap').find('input').val('');
    $('.textarea-wrap').find('textarea').val('');
};

//提交笔记
function addNote() {
    $.ajax({
        url: API_URL + "/Page/AddNote",
        type: "post",
        data: $("#noteFrom").serialize(),
        dataType: "json",
        success: function (data) {
            if (data.Type > 0) {
                alert("添加笔记成功");
                noterefresh(data.Type);
            }
            else {
                alert("添加评论失败");
            }

        }
    });
};
//删除笔记
function delNote(id) {
    var $id = "#" + id;
    $.ajax({
        url: API_URL + "/Page/DelNote",
        data: AddAntiForgeryToken({ id: id }),
        type: "post",
        dataType: "json",
        success: function (data) {
            if (data.Type > 0) {
                alert("删除笔记成功");
                $($id).remove();
            }
            else {
                alert("删除笔记失败");
            }

        }
    })
};

///课程评论
$(function () {
    $("#btnCourseComment").click(function () {
        var courseProgress = parseInt($('.jd_bg').css("width"));
        if (courseProgress < parseInt($('.jd_box').css("width"))) {
            alert("课程为学完不可评论，请学完课程");
            return false;
        }

        var commnet = $("#txtCourseComment").val();
        if (commnet.length < 20) {
            alert("评论内容不能小于20字");
            return false;
        }

        var mainId = $("#txtCourseId").val();
        var rate = $("#result").html();
        $.ajax({
            url: API_URL + "/Page/CourseCommentAdd",
            type: "Post",
            data: AddAntiForgeryToken({ mainId: mainId, parentId: "0", content: commnet, rate: rate }),
            async: true,
            success: function (result) {
                if (result.Type > 0) {
                    getCourseComment(mainId);
                    $("#txtCourseComment").val("");
                }
                else {
                    alert(result.Message);
                }
            }
        });
    });
    ///课程详情页评论打分
    var star = $(".newComment #star");
    var star_word = document.getElementById("star_word");
    var result = document.getElementById("result");
    var onc = 0;
    var k = -1;
    var j = 0;
    var word = ['很差', '差', '一般', "好", "很好"];
    var bgrange = [0, -241, -483, -725, -967, -1209];
    var evrange = [0, 24, 48, 72, 96, 121];
    star.on("mouseenter", function () {
        star_word.style.display = "block";
        star.on("mousemove", function (e) {
            var ev = e || window.event;
            for (var i = 0; i < evrange.length; i++) {
                (function (i) {
                    if (evrange[i] < ev.offsetX && ev.offsetX < evrange[i + 1]) {
                        star.css("background-position-x", bgrange[i + 1] + "px");
                        star_word.innerHTML = word[i];
                        result.innerHTML = (i + 1);
                        j++;
                    }
                })(i);
                if (!j) { break };
            };
            j--;
        })
        if (k = -1) {
            k++;
        } else {
            k = 0;
        }
    });
    star.on("mouseout", function () {
        if (!k) {
            star_word.style.display = "none";
            result.innerHTML = 0;
            star.css("background-position-x", 0);
        }
        k--;
    });
    star.on("click", function (e) {
        var ev = e || window.event;
        for (var i = 0; i < evrange.length; i++) {
            (function (i) {
                if (evrange[i] < ev.offsetX && ev.offsetX < evrange[i + 1]) {
                    star.css("background-position-x", bgrange[i + 1] + "px");
                    star_word.innerHTML = word[i];
                    result.innerHTML = (i + 1);
                }
            })(i)
        };
        k = 1;
    });
    // $(".notes").find(".delnote").on("click",function(){
    //     $.ajax({
    //         url: API_URL + "/Page/CourseNoteList",
    //         dataType: "json",
    //         type: "get",
    //         success:function(data){
    //             var the_id = data.Type;

    //         }
    //     })

    // })
    var mark = ["0", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"];
    k = 0;
    for (var i = 0; i < mark.length; i++) {
        if (mark[i] == $('.star').html()) {
            $(".star").css("background-position-x", -mark[i] * 242 + "px");
            k++;
        }
        if (k) break;
    }
});

function getCourseComment(str) {
    $.ajax({
        type: "Post",
        url: API_URL + "/Page/CourseComment",
        data: AddAntiForgeryToken({ id: str, page: 1, rows: 100, sort: "Id", order: "Desc" }),
        async: true,
        success: function (data) {
            alert("评论成功，等待审核！");
            // document.execCommand("Refresh");
        }
    });
}

/*
 * 修改播放页面上的进度
 * @param {int} browseScore 进度值
 */
function changeCourseBrowseScore(browseScore) {
    var oldcolor = $('.jd_bg').css("background-color");
    var reg = /(\s?\d{1,3},?){3}/;
    var color = oldcolor.match(reg)[0].split(",");
    if (browseScore) {
        var div = document.getElementById("BrowseScore");
        div["data-pro"] = browseScore;
        div.childNodes[1].childNodes[0].style.width = browseScore + "%";
        color[0] = 255 - Math.floor(browseScore);
        color = "rgb(" + color.join(",") + ")";
        $('.jd_bg').css({ "background-color": color });
        div.childNodes[3].innerHTML = browseScore + "%";
    }

}
