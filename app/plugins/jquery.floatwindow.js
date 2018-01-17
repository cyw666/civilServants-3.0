//定义漂浮插件
(function ($) {
  $.fn.adFloat = function (options) {
    return new AdFloat(this, options);
  };
  var AdFloat = function (element, options) {
    this.element = $(element);
    this.options = $.extend({
      width: 350, //广告容器的宽度
      height: 150, //广告容器的高度
      top: 0, //起始top位置
      left: 0, //超始left位置
      delay: 15, //延迟
      flystep: 1, //每次移多少
      closeid: null
    }, options || {});
    
    this.interval = null;
    this.xPos = this.options.left;
    this.yPos = this.options.top;
    this.yon = 0;
    this.xon = 0;
    
    this.init();
  };
  AdFloat.prototype = {
    init: function () {
      var me = this;
      me.element.css({
        left: me.options.left + "px",
        top: me.options.top + "px",
        width: me.options.width + "px",
        height: me.options.height + "px",
      });
      me.element.hover(
        function () {
          clearInterval(me.interval)
        },
        function () {
          me.interval = setInterval(function () {
            me.changePos();
          }, me.options.delay);
        }
      );
      $("#" + me.options.closeid).click(function () {
        me.close();
      });
      $(document).ready(function () {
        me.start();
      });
    },
    changePos: function () {
      var me = this;
      var clientWidth = $(window).width();
      var clientHeight = $(window).height();
      var Hoffset = me.element.height();
      var Woffset = me.element.width();
      me.element.css({
        left: me.xPos + document.documentElement.scrollLeft,
        top: me.yPos + document.documentElement.scrollTop
      });
      
      if (me.yon){
        me.yPos = me.yPos + me.options.flystep;
      } else{
        me.yPos = me.yPos - me.options.flystep;
      }
      //上顶点
      if (me.yPos < 0) {
        me.yon = 1;
        me.yPos = 0;
      }
      //到达底部
      if (me.yPos >= clientHeight - Hoffset) {
        me.yon = 0;
        me.yPos = me.yPos - me.options.flystep;
      }
      if (me.xon) {
        me.xPos = me.xPos + me.options.flystep;
      } else {
        me.xPos = me.xPos - me.options.flystep;
      }
      //最左边
      if (me.xPos < 0) {
        me.xon = 1;
        me.xPos = 0;
      }
      //最右边
      if (me.xPos >= clientWidth - Woffset) {
        me.xon = 0;
        me.xPos = me.xPos - me.options.flystep;
      }
    },
    start: function () {
      var me = this;
      me.element.css("top", me.yPos);
      me.interval = setInterval(function () {
        me.changePos();
      }, me.options.delay);
    },
    close: function () {
      var me = this;
      me.element.remove();
      clearInterval(me.interval);
    }
  };
})(jQuery)