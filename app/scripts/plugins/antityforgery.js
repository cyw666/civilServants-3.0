
'use strict';
function AntiForgeryToken(formid) {
    if (!!formid) {
        $.ajax({
            url: API_URL + "/page/AntiForgeryToken",
            type: "POST",
            async: true,
            contentType: "application/x-www-form-urlencoded;charset=UTF-8",
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                if (typeof formid === "string") {
                    if ($("#" + formid).find("[name='__RequestVerificationToken']").length > 0) {
                        $("#" + formid).find("[name='__RequestVerificationToken']").remove();
                    }
                    $("#" + formid).prepend(data.html);
                }
                else {
                    if ($(formid).find("[name='__RequestVerificationToken']").length > 0) {
                        $(formid).find("[name='__RequestVerificationToken']").remove();
                    }
                    $(formid).prepend(data.html);
                }
            }
        });
    }
};
function AntiForgeryToken2(the) {
    if (!!the) {
        $.ajax({
            url: API_URL + "/page/AntiForgeryToken",
            type: "POST",
            async: true,
            contentType: "application/x-www-form-urlencoded;charset=UTF-8",
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                the.outerHTML = data.html;
            }
        });
    }
};

function AntiForgeryToken3($selector) {
    $selector = $($selector);
    if ($selector.length > 0) {
        $.ajax({
            url: API_URL + "/page/AntiForgeryToken",
            type: "POST",
            async: true,
            contentType: "application/x-www-form-urlencoded;charset=UTF-8",
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                if ($selector.find("[name='__RequestVerificationToken']").length > 0) {
                    $selector.find("[name='__RequestVerificationToken']").remove();
                }
                $selector.prepend(data.html);
            }
        });
    }
};


$("form.forgerytoken").each(function (i, v) {
    AntiForgeryToken(v);
});
$("input.forgerytoken").each(function () {
    AntiForgeryToken2(this);
});

function AddAntiForgeryToken(data, $outer) {
    if (!!$outer) {
        data.__RequestVerificationToken = $('input[name=__RequestVerificationToken]', $outer).val();
        return data;
    }
    else {
        data.__RequestVerificationToken = $('input[name=__RequestVerificationToken]').val();
        return data;
    }
};
/**
  加密
*/
String.prototype.rsaEnscrypt = function (publicKey) {
    if (!publicKey) {
        publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCa4KHNwDX44gGmmIAtRu4gjVYtGWZzcm4t+1wjUD4dn7fMLPvuK7ai4UrfDeEJE1RPwudJw+lJ6crql8wSIg7/DbTlG3ihsCT6dT9H5B9OoeR7K9VWUesaW/iyVL6HXiYOANabW14pvJATDmdq91Tfgp6PSQyvdfiRdV4r07crpQIDAQAB";
    }
    var rsaProvider = new JSEncrypt();
    rsaProvider.setPublicKey(publicKey);
    var strEncrypt = rsaProvider.encrypt(this.replace(/\+/g, '%2B'));
    return strEncrypt;
}
