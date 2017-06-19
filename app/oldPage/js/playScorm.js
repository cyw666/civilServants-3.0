
//var buttonform;
var _data = $dom.getData("thisPage") || {};
var portalId = _data.PortalId; // document.getElementById("portalId").value;
var userId = _data.UserId;// document.getElementById("userId").value;
var courseId = _data.CourseId;// document.getElementById("courseId").value;
var lastPostion = _data.LastPostion || "";
if (!portalId || !userId || !courseId) {
    alert("数据无效，请检查api");

    //终止执行加载
    if (!!(window.attachEvent && !window.opera))
    { document.execCommand("stop"); }
    else
    {
        window.stop();
    }
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
                url: API_URL + "/CourseProcess/ScormProcess?m=" + paraName + "&v=" + value,
                data: { "PortalId": portalId, "userid": userId, "courseid": courseId, "position": value },
                success: function (result) {
                    if (result.Type == 1) {
                        window.parent.changeCourseBrowseScore(result.BrowseScore);
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
    /*if (paraName == "cmi.core.session_time") {
       $.ajax({
           type: "get",
           url: API_URL + "/CourseProcess/ScormProcess?m=" + paraName + "&v=" + value,
           data: { "PortalId": portalId, "userid": userId, "courseid": courseId, "position": value },
           success: function (result) {
               alert("In LMSSetValue -- result is :" + result)
           }
       });
    }*/
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
            return lastPostion;
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


function API() { }

API.LMSInitialize = LMSInitialize;
API.LMSSetValue = LMSSetValue;
API.LMSGetValue = LMSGetValue;
API.LMSCommit = LMSCommit;
API.LMSFinish = LMSFinish;
API.LMSGetLastError = LMSGetLastError;
API.LMSGetErrorString = LMSGetErrorString;
