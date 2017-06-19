;//轮播插件
function JYSlide(slide, arg) {
    var para = {};
    para.nav = arg.nav || ".slide-nav"
    para.content = arg.content || ".slide-content"
    para.cssClass = arg.cssClass || "selected"
    para.event = arg.event || "mouseover"
    para.autoPlay = arg.autoPlay || false
    para.timeOut = arg.timeOut || 3000
    para.arrow = arg.arrow || false
    para.indexEnable = arg.indexEnable

    var _this = this;
    var arrowPrev = $(slide).find('.btn_arrow.prev')
    var arrowNext = $(slide).find('.btn_arrow.next')

    this.slide = slide;
    this.content = $(slide).find(para.content);
    this.length = this.content.length;
    this.nav = $(slide).find(para.nav);
    this.interval = para.timeOut;
    this.cssClass = para.cssClass;
    this.event = para.event
    this.index = 0;
    this.isAutoPlay = para.autoPlay;
    this.arrow = para.arrow;
    this.indexEnable = para.indexEnable;

    if (this.arrow) {
        $(slide).on('mouseover', function () {
            arrowPrev.css('display', 'block')
            arrowNext.css('display', 'block')
        })
        $(slide).on('mouseleave', function () {
            arrowPrev.css('display', 'none')
            arrowNext.css('display', 'none')
        })
        arrowPrev.on('click', function () {
            _this.playPrev();
            clearInterval(_this.time)
            return false
        })
        arrowNext.on('click', function () {
            _this.playNext();
            clearInterval(_this.time)
            return false
        })
    }


    this.nav.on(_this.event, function () {
        clearInterval(_this.time)
        _this.doSlide(this);
        return false;
    });


    this.init();

    if (this.isAutoPlay === true) {
        this.autoPlay();

        $(slide).on('mouseover', function (e) {
            e.stopPropagation();
            clearInterval(_this.time)
            return false;
        });

        $(slide).on('mouseout', function (e) {

            e.stopPropagation();
            _this.autoPlay();
            return false;
        });
    }
};

JYSlide.prototype.init = function () {
    this.nav.eq(this.index).addClass(this.cssClass).show().siblings().removeClass(this.cssClass);
    this.content.eq(this.index).show().siblings().hide();
    if (this.indexEnable === "disable") {
        $(this.slide).find(this.nav).hide();
    }
};
JYSlide.prototype.doSlide = function (dom) {
    this.index = this.nav.index(dom);
    this.init();
};
JYSlide.prototype.autoPlay = function () {
    var the = this;
    var autoPlay = function () {
        the.playNext()
    }//.bind(this)                     //for ie8
    this.time = setInterval(autoPlay, this.interval);
};
JYSlide.prototype.playNext = function () {
    this.index++
    if (this.index >= this.length - 1) {
        this.index = -1;
    }
    this.init();
};

JYSlide.prototype.playPrev = function () {
    this.index--
    if (this.index === -1) {
        this.index = this.length - 1;
    }
    this.init();
};

$(".JYSlide").each(function () {
    var para = {
        "nav": ".ui-tabs-nav-item",
        "content": ".ui-tabs-panel",
        "cssClass": "ui-tabs-selected",
        "event": "click",
        "autoPlay": true,
        "timeOut": 2000,
        "arrow": false,
        "indexEnable": "true"
    }
    new JYSlide(this, para);
});

$('.JYTab').each(function () {
    var para = {
        "nav": ".slide-nav",
        "content": ".slide-content",
        "cssClass": "selected",
        "event": "mouseover"
    }
    new JYSlide(this, para);
});
