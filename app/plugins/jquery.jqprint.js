
(function ($) {
    var opt;

    $.fn.jqprint = function (options) {
        opt = $.extend({}, $.fn.jqprint.defaults, options);

        var $element = (this instanceof jQuery) ? this : $(this);
        var doc = "";
        var tab = "";
        if (opt.operaSupport) {
            tab = window.open("", "jqPrint-preview");
            tab.document.open();
            doc = tab.document;
        }
        else {
            var $iframe = $("<iframe  />");
            $iframe.prop("id", "print");
            if ($('iframe #print').length) $iframe = $('iframe #print').empty();

            if (!opt.debug) { $iframe.css({ position: "absolute", width: "0px", height: "0px", left: "-600px", top: "-600px" }); }

            $iframe.appendTo("body");
            doc = $iframe[0].contentWindow.document;
        }


        if (opt.importCSS) {
            if ($("link[media=print]").length > 0) {
                $("link[media=print]").each(function () {
                    doc.write("<link type='text/css' rel='stylesheet' href='" + $(this).attr("href") + "' media='print' />");
                });
            }
            else {
                $("link").each(function () {
                    doc.write("<link type='text/css' rel='stylesheet' href='" + $(this).attr("href") + "' />");
                });
            }
        }

        if (opt.printContainer) { doc.write($element.outer(opt.count)); }
        else { $element.each(function () { doc.write($(this).html()); }); }

        doc.close();

        (opt.operaSupport ? tab : $iframe[0].contentWindow).focus();
        setTimeout(function () { (opt.operaSupport ? tab : $iframe[0].contentWindow).print(); if (tab) { tab.close(); } }, 1000);
    }

    $.fn.jqprint.defaults = {
        debug: false,
        importCSS: true,
        printContainer: true,
        operaSupport: true,
        count: 1
    };

    // Thanks to 9__, found at http://users.livejournal.com/9__/380664.html
    jQuery.fn.outer = function (count) {
        var html = "";
        count = count || 1;
        var clone = this.clone();
        for (var i = 0; i < count; i++) {
            html += $('<div></div>').html(clone).html();
        }
        return html;
        //return $($('<div></div>').html(this.clone())).html();
    };
})(jQuery);