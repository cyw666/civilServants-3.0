
function jyajax(exoptions) {

    var options = exoptions;
    options.url = exoptions.url || "";
    options.data = exoptions.data || "";
    options.type = exoptions.type || "POST";
    options.async = exoptions.async || false;
    options.contentType = exoptions.contentType || "application/x-www-form-urlencoded;charset=UTF-8";
    options.dataType = exoptions.contentType || "*/*";
    options.success = exoptions.success || function () { };
    options.error = exoptions.error || function () { };
    options.xhrFields = exoptions.xhrFields || undefined;
    // options.data.__RequestVerificationToken = "";
    var doflag = true;
    var oAjax = null;
    if (window.XMLHttpRequest) {
        oAjax = new XMLHttpRequest();
    } else {
        oAjax = new ActiveXObject("Microsoft.XMLHTTP");
    }

    //2.连接服务器  
    if (options.type == "GET") {
        if (options.data !== "") {
            options.url = options.url + "?" + options.data;
        }
    }


    oAjax.open(options.type, options.url, options.async);   //open(方法, url, 是否异步)

    oAjax.setRequestHeader("Content-Type", options.contentType);// application/x-www-form-urlencoded;charset=UTF-8   application/json
    oAjax.setRequestHeader("Accept", options.dataType);
    if (document.location.protocol + "//" + document.location.host != API_URL.substring(0, API_URL.lastIndexOf('/')) || (options.xhrFields !== undefined && options.xhrFields.withCredentials === true)) {
        oAjax.withCredentials = true;
    }


    //3.接收返回
    oAjax.onreadystatechange = function () {  //OnReadyStateChange事件
        //计算表达式的值,替换eval;
        function evil(fn) {
            var Fn = Function; //一个变量指向Function，防止有些前端编译工具报错
            return new Fn('return ' + fn)();
        }
        if (oAjax.readyState == 4) {  //4为完成
            doflag = false;
            if (oAjax.status == 200 || oAjax.status == 302) {    //200为成功
                if (oAjax.responseType === "");
                var json = evil("(" + oAjax.responseText + ")");
                options.success(json);
                //options.success(JSON.parse(oAjax.response));
                //var token = document.createElement("input");
                //token.type = "hide";    
                //token.value = JSON.parse(oAjax.response).token;
                //token.id = "__RequestVerificationToken";
                //token.name = "__RequestVerificationToken";
                //document.body.appendChild(token);
            } else {
                options.error();
            }
        }
    };
    //4.发送请求  
    if (options.type == "POST") {
        var sd;
        switch (options.contentType) {
            case "application/json":
                sd = jsonToString(options.data);
                break;
            case "application/x-www-form-urlencoded;charset=UTF-8":
            default:
                sd = objToString(options.data);
                break;
        }
        oAjax.send(sd);//  "?" "{a:sd,n:sdf}"
        //oAjax.send(JSON.stringify(options.data));
    }
    else {
        oAjax.send();
    }

    //if (options.async) {
    //    while (doflag) {

    //    }
    //}

}
//读取名称为name的cookie值，如果pro有值表示读取名称为name 属性为pro的属性值例如：user.name=x; name:user,pro:name;
function getCookie(name, pro, cookies) {
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
}

function setCookie(cName, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var cValue = escape(value) + ((exdays === undefined) ? '' :
        '; expires=' + exdate.toUTCString());
    document.cookie = [cName, '=', cValue].join('');
    var a = "";
}


function setCookie2(cName, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var cValue = encodeURIComponent(value) + ((exdays === null) ? '' :
        '; expires=' + exdate.toUTCString());
    document.cookie = [cName, '=', cValue].join('');
}

function getCookie2(cName) {
    var i, x, y, ARRcookies = document.cookie.split(';');
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf('='));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf('=') + 1);
        x = x.replace(/^\s+|\s+$/g, '');
        if (x === cName) {
            return decodeURIComponent(y);
        }
    }
}


function jsonToString(json) {
    var str = "";
    for (var i in json) {
        var pro = json[i];
        if (typeof (pro) == "object") {
            str += '"' + i + '":' + jsonToString(pro) + ',';
        }
        else {
            str += '"' + i + '":"' + pro + '",';
        }
    }
    return "{" + str.substring(0, str.length - 1) + "}";
}

function objToString(obj) {
    var str = "";
    for (var i in obj) {
        str += i + "=" + obj[i] + "&";
    }
    return str;
}

(function Right() {
    // alert(document.cookie);
    //try{
    // if (document.getElementById("pageright").getAttribute("data-AnonymousFlag").toString() == "False") {
    //var arr= document.URL.toString().match(/((http|ftp|https):\/\/)(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*(\/[a-zA-Z0-9\&%_\./-~-]*)? /);
    var pathname = window.location.pathname + window.location.search + window.location.hash; //"/Home/Login.html"
    var routearrs = [];
    var controller = "";
    var action = "";
    routearrs = pathname.match(/\/([a-zA-Z0-9]*)\/([a-zA-Z0-9]*).html/);
    if (routearrs) {
        controller = routearrs[1];
        action = routearrs[2];
    }
    else {

    }
    if (controller.toLowerCase() == "home" && action.toLowerCase() == "login") {
        controller = "";
        //action = "";
    }
    var async = false;
    //为火狐浏览器且跨域
    if (navigator.userAgent && navigator.userAgent.indexOf("Firefox") > 0 && document.location.protocol + "//" + document.location.host != API_URL.substring(0, API_URL.lastIndexOf('/'))) {
        async = true;
    }
    //除去首页权限验证 加快加载速度 20161108 安全？
    if (!!controller) {
        jyajax({
            url: API_URL + "/Page/Authorization",
            data: { controller: controller, action: action },
            type: "POST",
            async: async,
            success: function (data) {

                if (!!data && !data.isauth) {
                    // document.getElementById("pageright").setAttribute("data-RequestVerificationToken", data.token);
                    //如果userid=0为匿名用户，遇到允许匿名访问为false 时重定向.
                    //  if (!getCookie("tempguid") || (data.controller != controller && action != action)) {  //未登录跳转
                    if (data.Type !== undefined && data.Type != 1) {
                        if (data.Type == 3) {
                            alert("在其他设备上已经登录");
                        }
                        else if (data.Type == 9) {
                            alert("在其他平台登录或被其他人登录");
                            document.location = "/Home/Login.html?" + pathname;
                            return false;
                        }
                        else if (data.Type == 10) {
                            alert("您还不是本平台会员，将前往您所在的平台" + ":" + data.Message);
                            document.location = "http://" + data.Message;
                            return;
                        }
                        else if (data.Type == 11) {
                            alert("过期了");
                        }
                        else if (data.Type == 13) {
                            alert(data.Message);
                            document.location = "/Home/Login.html?" + pathname;
                            return false;
                        }
                        else if (data.Type == 15) {
                            // alert(data.Type + ":" + data.Message);
                            document.location = "/Home/Error.html?" + pathname;
                            return false;
                        }
                        else {
                            alert(data.Type + ":" + data.Message);
                            document.location = "/Home/Login.html?" + pathname;
                            return false;
                        }
                    }
                    else if (data.Type !== undefined && data.Type == 1) {
                        return true;
                    }
                    else {
                        document.location = "/Home/Login.html?" + pathname;
                    }
                }
                else if (!data) {
                    document.location = "/";
                }
            },
            error: function () {
                alert("服务器出错！请等待！");
                document.location = "/";
            }
        });
    }

    // }
    //}
    //catch(ex){
    //    document.location = "http://192.168.1.73:9021/";
    //}
})();








