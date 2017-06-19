$(function () {
    keepOnline();
});
///更新用户在线缓存
function keepOnline() {
    var myDate = new Date();
    var date = myDate.getMinutes() + ":" + myDate.getSeconds();
    //console.log(date)
    $.ajax({
        url: API_URL + "/Page/KeepOnline",
        type: "get",
        cache:false
    });
    //$.get(API_URL + "/Page/KeepOnline?" + Math.round(Math.random() * 10000));
    setTimeout(keepOnline, 60000);
}
