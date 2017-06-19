"undefined" == typeof jwplayer && (jwplayer = function (e) {
  if (jwplayer.api)return jwplayer.api.selectPlayer(e)
}, jwplayer.version = "6.8.4616", jwplayer.vid = document.createElement("video"), jwplayer.audio = document.createElement("audio"), jwplayer.source = document.createElement("source"), function (e) {
  function a(h) {
    return function () {
      return b(h)
    }
  }

  function l(h, b, a, k, j) {
    return function () {
      var d, f;
      if (j) a(h); else {
        try {
          if (d = h.responseXML)if (f = d.firstChild, d.lastChild && "parsererror" === d.lastChild.nodeName) {
            k && k("Invalid XML");
            return
          }
        } catch (g) {
        }
        if (d && f)return a(h);
        (d = c.parseXML(h.responseText)) && d.firstChild ? (h = c.extend({}, h, {responseXML: d}), a(h)) : k && k(h.responseText ? "Invalid XML" : b)
      }
    }
  }

  var g = document, f = window, d = navigator, c = e.utils = function () {
  };
  c.exists = function (h) {
    switch (typeof h) {
      case "string":
        return 0 < h.length;
      case "object":
        return null !== h;
      case "undefined":
        return !1
    }
    return !0
  };
  c.styleDimension = function (h) {
    return h + (0 < h.toString().indexOf("%") ? "" : "px")
  };
  c.getAbsolutePath = function (h, b) {
    c.exists(b) || (b = g.location.href);
    if (c.exists(h)) {
      var a;
      if (c.exists(h)) {
        a = h.indexOf("://");
        var k = h.indexOf("?");
        a = 0 < a && (0 > k || k > a)
      } else a = void 0;
      if (a)return h;
      a = b.substring(0, b.indexOf("://") + 3);
      var k = b.substring(a.length, b.indexOf("/", a.length + 1)), j;
      0 === h.indexOf("/") ? j = h.split("/") : (j = b.split("?")[0], j = j.substring(a.length + k.length + 1, j.lastIndexOf("/")), j = j.split("/").concat(h.split("/")));
      for (var d = [], f = 0; f < j.length; f++)j[f] && (c.exists(j[f]) && "." != j[f]) && (".." == j[f] ? d.pop() : d.push(j[f]));
      return a + k + "/" + d.join("/")
    }
  };
  c.extend = function () {
    var h = c.extend.arguments;
    if (1 < h.length) {
      for (var a = 1; a < h.length; a++)c.foreach(h[a], function (a, k) {
        try {
          c.exists(k) && (h[0][a] = k)
        } catch (b) {
        }
      });
      return h[0]
    }
    return null
  };
  var m = window.console = window.console || {
      log: function () {
      }
    };
  c.log = function () {
    var h = Array.prototype.slice.call(arguments, 0);
    "object" === typeof m.log ? m.log(h) : m.log.apply(m, h)
  };
  var b = c.userAgentMatch = function (h) {
    return null !== d.userAgent.toLowerCase().match(h)
  };
  c.isIE = c.isMSIE = a(/msie/i);
  c.isFF = a(/firefox/i);
  c.isChrome = a(/chrome/i);
  c.isIPod = a(/iP(hone|od)/i);
  c.isIPad =
    a(/iPad/i);
  c.isSafari602 = a(/Macintosh.*Mac OS X 10_8.*6\.0\.\d* Safari/i);
  c.isIETrident = function (h) {
    return h ? (h = parseFloat(h).toFixed(1), b(RegExp("msie\\s*" + h + "|trident/.+rv:\\s*" + h, "i"))) : b(/msie|trident/i)
  };
  c.isSafari = function () {
    return b(/safari/i) && !b(/chrome/i) && !b(/chromium/i) && !b(/android/i)
  };
  c.isIOS = function (h) {
    return h ? b(RegExp("iP(hone|ad|od).+\\sOS\\s" + h, "i")) : b(/iP(hone|ad|od)/i)
  };
  c.isAndroid = function (h, a) {
    var c = a ? !b(/chrome\/[23456789]/i) : !0;
    return h ? c && b(RegExp("android.*" + h, "i")) : c &&
      b(/android/i)
  };
  c.isMobile = function () {
    return c.isIOS() || c.isAndroid()
  };
  c.saveCookie = function (h, a) {
    g.cookie = "jwplayer." + h + "\x3d" + a + "; path\x3d/"
  };
  c.getCookies = function () {
    for (var h = {}, a = g.cookie.split("; "), c = 0; c < a.length; c++) {
      var k = a[c].split("\x3d");
      0 === k[0].indexOf("jwplayer.") && (h[k[0].substring(9, k[0].length)] = k[1])
    }
    return h
  };
  c.typeOf = function (h) {
    var a = typeof h;
    return "object" === a ? !h ? "null" : h instanceof Array ? "array" : a : a
  };
  c.translateEventResponse = function (h, a) {
    var b = c.extend({}, a);
    if (h == e.events.JWPLAYER_FULLSCREEN && !b.fullscreen) b.fullscreen = "true" == b.message ? !0 : !1, delete b.message; else if ("object" == typeof b.data) {
      var k = b.data;
      delete b.data;
      b = c.extend(b, k)
    } else"object" == typeof b.metadata && c.deepReplaceKeyName(b.metadata, ["__dot__", "__spc__", "__dsh__", "__default__"], [".", " ", "-", "default"]);
    c.foreach(["position", "duration", "offset"], function (h, a) {
      b[a] && (b[a] = Math.round(1E3 * b[a]) / 1E3)
    });
    return b
  };
  c.flashVersion = function () {
    if (c.isAndroid())return 0;
    var h = d.plugins, a;
    try {
      if ("undefined" !== h && (a = h["Shockwave Flash"]))return parseInt(a.description.replace(/\D+(\d+)\..*/,
        "$1"), 10)
    } catch (b) {
    }
    if ("undefined" != typeof f.ActiveXObject)try {
      if (a = new f.ActiveXObject("ShockwaveFlash.ShockwaveFlash"))return parseInt(a.GetVariable("$version").split(" ")[1].split(",")[0], 10)
    } catch (k) {
    }
    return 0
  };
  c.getScriptPath = function (h) {
    for (var a = g.getElementsByTagName("script"), b = 0; b < a.length; b++) {
      var c = a[b].src;
      if (c && 0 <= c.indexOf(h))return c.substr(0, c.indexOf(h))
    }
    return ""
  };
  c.deepReplaceKeyName = function (h, a, b) {
    switch (e.utils.typeOf(h)) {
      case "array":
        for (var k = 0; k < h.length; k++)h[k] = e.utils.deepReplaceKeyName(h[k],
          a, b);
        break;
      case "object":
        c.foreach(h, function (c, k) {
          var d;
          if (a instanceof Array && b instanceof Array) {
            if (a.length != b.length)return;
            d = a
          } else d = [a];
          for (var f = c, g = 0; g < d.length; g++)f = f.replace(RegExp(a[g], "g"), b[g]);
          h[f] = e.utils.deepReplaceKeyName(k, a, b);
          c != f && delete h[c]
        })
    }
    return h
  };
  var p = c.pluginPathType = {ABSOLUTE: 0, RELATIVE: 1, CDN: 2};
  c.getPluginPathType = function (h) {
    if ("string" == typeof h) {
      h = h.split("?")[0];
      var a = h.indexOf("://");
      if (0 < a)return p.ABSOLUTE;
      var b = h.indexOf("/");
      h = c.extension(h);
      return 0 > a &&
      0 > b && (!h || !isNaN(h)) ? p.CDN : p.RELATIVE
    }
  };
  c.getPluginName = function (h) {
    return h.replace(/^(.*\/)?([^-]*)-?.*\.(swf|js)$/, "$2")
  };
  c.getPluginVersion = function (h) {
    return h.replace(/[^-]*-?([^\.]*).*$/, "$1")
  };
  c.isYouTube = function (h) {
    return /^(http|\/\/).*(youtube\.com|youtu\.be)\/.+/.test(h)
  };
  c.youTubeID = function (h) {
    try {
      return /v[=\/]([^?&]*)|youtu\.be\/([^?]*)|^([\w-]*)$/i.exec(h).slice(1).join("").replace("?", "")
    } catch (a) {
      return ""
    }
  };
  c.isRtmp = function (h, a) {
    return 0 === h.indexOf("rtmp") || "rtmp" == a
  };
  c.foreach =
    function (a, b) {
      var d, k;
      for (d in a)"function" == c.typeOf(a.hasOwnProperty) ? a.hasOwnProperty(d) && (k = a[d], b(d, k)) : (k = a[d], b(d, k))
    };
  c.isHTTPS = function () {
    return 0 === f.location.href.indexOf("https")
  };
  c.repo = function () {
    var a = "http://p.jwpcdn.com/" + e.version.split(/\W/).splice(0, 2).join("/") + "/";
    try {
      c.isHTTPS() && (a = a.replace("http://", "https://ssl."))
    } catch (b) {
    }
    return a
  };
  c.ajax = function (a, b, d, k) {
    var j;
    0 < a.indexOf("#") && (a = a.replace(/#.*$/, ""));
    if (a && 0 <= a.indexOf("://") && a.split("/")[2] != f.location.href.split("/")[2] &&
      c.exists(f.XDomainRequest)) j = new f.XDomainRequest, j.onload = l(j, a, b, d, k), j.ontimeout = j.onprogress = function () {
    }, j.timeout = 5E3; else if (c.exists(f.XMLHttpRequest)) {
      var g = j = new f.XMLHttpRequest, t = a;
      j.onreadystatechange = function () {
        if (4 === g.readyState)switch (g.status) {
          case 200:
            l(g, t, b, d, k)();
            break;
          case 404:
            d("File not found")
        }
      }
    } else return d && d(), j;
    j.overrideMimeType && j.overrideMimeType("text/xml");
    j.onerror = function () {
      d("Error loading file")
    };
    setTimeout(function () {
      try {
        j.open("GET", a, !0), j.send()
      } catch (b) {
        d &&
        d(a)
      }
    }, 0);
    return j
  };
  c.parseXML = function (a) {
    var b;
    try {
      if (f.DOMParser) {
        if (b = (new f.DOMParser).parseFromString(a, "text/xml"), b.childNodes && b.childNodes.length && "parsererror" == b.childNodes[0].firstChild.nodeName)return
      } else b = new f.ActiveXObject("Microsoft.XMLDOM"), b.async = "false", b.loadXML(a)
    } catch (c) {
      return
    }
    return b
  };
  c.filterPlaylist = function (a, b) {
    var d = [], k, j, f, g;
    for (k = 0; k < a.length; k++)if (j = c.extend({}, a[k]), j.sources = c.filterSources(j.sources), 0 < j.sources.length) {
      for (f = 0; f < j.sources.length; f++)g =
        j.sources[f], g.label || (g.label = f.toString());
      d.push(j)
    }
    if (b && 0 === d.length)for (k = 0; k < a.length; k++)if (j = c.extend({}, a[k]), j.sources = c.filterSources(j.sources, !0), 0 < j.sources.length) {
      for (f = 0; f < j.sources.length; f++)g = j.sources[f], g.label || (g.label = f.toString());
      d.push(j)
    }
    return d
  };
  c.filterSources = function (a, b) {
    var d, k, j = c.extensionmap;
    if (a) {
      k = [];
      for (var f = 0; f < a.length; f++) {
        var g = a[f].type, m = a[f].file;
        m && (m = c.trim(m));
        g || (g = j.extType(c.extension(m)), a[f].type = g);
        b ? e.embed.flashCanPlay(m, g) && (d || (d = g),
          g == d && k.push(c.extend({}, a[f]))) : c.canPlayHTML5(g) && (d || (d = g), g == d && k.push(c.extend({}, a[f])))
      }
    }
    return k
  };
  c.canPlayHTML5 = function (a) {
    if (c.isAndroid() && ("hls" == a || "m3u" == a || "m3u8" == a))return !1;
    a = c.extensionmap.types[a];
    return !!a && !!e.vid.canPlayType && e.vid.canPlayType(a)
  };
  c.seconds = function (a) {
    a = a.replace(",", ".");
    var b = a.split(":"), c = 0;
    "s" == a.slice(-1) ? c = parseFloat(a) : "m" == a.slice(-1) ? c = 60 * parseFloat(a) : "h" == a.slice(-1) ? c = 3600 * parseFloat(a) : 1 < b.length ? (c = parseFloat(b[b.length - 1]), c += 60 * parseFloat(b[b.length -
              2]), 3 == b.length && (c += 3600 * parseFloat(b[b.length - 3]))) : c = parseFloat(a);
    return c
  };
  c.serialize = function (a) {
    return null == a ? null : "true" == a.toString().toLowerCase() ? !0 : "false" == a.toString().toLowerCase() ? !1 : isNaN(Number(a)) || 5 < a.length || 0 === a.length ? a : Number(a)
  }
}(jwplayer), function (e) {
  var a = "video/", l = e.foreach, g = {
    mp4: a + "mp4",
    vorbis: "audio/ogg",
    ogg: a + "ogg",
    webm: a + "webm",
    aac: "audio/mp4",
    mp3: "audio/mpeg",
    hls: "application/vnd.apple.mpegurl"
  }, f = {
    mp4: g.mp4, f4v: g.mp4, m4v: g.mp4, mov: g.mp4, m4a: g.aac, f4a: g.aac, aac: g.aac,
    mp3: g.mp3, ogv: g.ogg, ogg: g.vorbis, oga: g.vorbis, webm: g.webm, m3u8: g.hls, hls: g.hls
  }, a = "video", a = {
    flv: a,
    f4v: a,
    mov: a,
    m4a: a,
    m4v: a,
    mp4: a,
    aac: a,
    f4a: a,
    mp3: "sound",
    smil: "rtmp",
    m3u8: "hls",
    hls: "hls"
  }, d = e.extensionmap = {};
  l(f, function (a, f) {
    d[a] = {html5: f}
  });
  l(a, function (a, f) {
    d[a] || (d[a] = {});
    d[a].flash = f
  });
  d.types = g;
  d.mimeType = function (a) {
    var d;
    l(g, function (b, f) {
      !d && f == a && (d = b)
    });
    return d
  };
  d.extType = function (a) {
    return d.mimeType(f[a])
  }
}(jwplayer.utils), function (e) {
  var a = e.loaderstatus = {NEW: 0, LOADING: 1, ERROR: 2, COMPLETE: 3},
    l = document;
  e.scriptloader = function (g) {
    function f() {
      c = a.ERROR;
      b.sendEvent(m.ERROR)
    }

    function d() {
      c = a.COMPLETE;
      b.sendEvent(m.COMPLETE)
    }

    var c = a.NEW, m = jwplayer.events, b = new m.eventdispatcher;
    e.extend(this, b);
    this.load = function () {
      var b = e.scriptloader.loaders[g];
      if (b && (b.getStatus() == a.NEW || b.getStatus() == a.LOADING)) b.addEventListener(m.ERROR, f), b.addEventListener(m.COMPLETE, d); else if (e.scriptloader.loaders[g] = this, c == a.NEW) {
        c = a.LOADING;
        var h = l.createElement("script");
        h.addEventListener ? (h.onload = d, h.onerror =
            f) : h.readyState && (h.onreadystatechange = function () {
            ("loaded" == h.readyState || "complete" == h.readyState) && d()
          });
        l.getElementsByTagName("head")[0].appendChild(h);
        h.src = g
      }
    };
    this.getStatus = function () {
      return c
    }
  };
  e.scriptloader.loaders = {}
}(jwplayer.utils), function (e) {
  e.trim = function (a) {
    return a.replace(/^\s*/, "").replace(/\s*$/, "")
  };
  e.pad = function (a, e, g) {
    for (g || (g = "0"); a.length < e;)a = g + a;
    return a
  };
  e.xmlAttribute = function (a, e) {
    for (var g = 0; g < a.attributes.length; g++)if (a.attributes[g].name && a.attributes[g].name.toLowerCase() ==
      e.toLowerCase())return a.attributes[g].value.toString();
    return ""
  };
  e.extension = function (a) {
    if (!a || "rtmp" == a.substr(0, 4))return "";
    a = a.substring(a.lastIndexOf("/") + 1, a.length).split("?")[0].split("#")[0];
    if (-1 < a.lastIndexOf("."))return a.substr(a.lastIndexOf(".") + 1, a.length).toLowerCase()
  };
  e.stringToColor = function (a) {
    a = a.replace(/(#|0x)?([0-9A-F]{3,6})$/gi, "$2");
    3 == a.length && (a = a.charAt(0) + a.charAt(0) + a.charAt(1) + a.charAt(1) + a.charAt(2) + a.charAt(2));
    return parseInt(a, 16)
  }
}(jwplayer.utils), function (e) {
  var a =
    "touchmove", l = "touchstart";
  e.touch = function (g) {
    function f(k) {
      k.type == l ? (b = !0, h = c(n.DRAG_START, k)) : k.type == a ? b && (q || (d(n.DRAG_START, k, h), q = !0), d(n.DRAG, k)) : (b && (q ? d(n.DRAG_END, k) : (k.cancelBubble = !0, d(n.TAP, k))), b = q = !1, h = null)
    }

    function d(a, b, d) {
      if (p[a] && (b.preventManipulation && b.preventManipulation(), b.preventDefault && b.preventDefault(), b = d ? d : c(a, b))) p[a](b)
    }

    function c(a, b) {
      var d = null;
      b.touches && b.touches.length ? d = b.touches[0] : b.changedTouches && b.changedTouches.length && (d = b.changedTouches[0]);
      if (!d)return null;
      var c = m.getBoundingClientRect(), d = {
        type: a,
        target: m,
        x: d.pageX - window.pageXOffset - c.left,
        y: d.pageY,
        deltaX: 0,
        deltaY: 0
      };
      a != n.TAP && h && (d.deltaX = d.x - h.x, d.deltaY = d.y - h.y);
      return d
    }

    var m = g, b = !1, p = {}, h = null, q = !1, n = e.touchEvents;
    document.addEventListener(a, f);
    document.addEventListener("touchend", function (a) {
      b && q && d(n.DRAG_END, a);
      b = q = !1;
      h = null
    });
    document.addEventListener("touchcancel", f);
    g.addEventListener(l, f);
    g.addEventListener("touchend", f);
    this.addEventListener = function (a, b) {
      p[a] = b
    };
    this.removeEventListener =
      function (a) {
        delete p[a]
      };
    return this
  }
}(jwplayer.utils), function (e) {
  e.touchEvents = {
    DRAG: "jwplayerDrag",
    DRAG_START: "jwplayerDragStart",
    DRAG_END: "jwplayerDragEnd",
    TAP: "jwplayerTap"
  }
}(jwplayer.utils), function (e) {
  e.key = function (a) {
    var l, g, f;
    this.edition = function () {
      return f && f.getTime() < (new Date).getTime() ? "invalid" : l
    };
    this.token = function () {
      return g
    };
    e.exists(a) || (a = "");
    try {
      a = e.tea.decrypt(a, "36QXq4W@GSBV^teR");
      var d = a.split("/");
      (l = d[0]) ? /^(free|pro|premium|ads)$/i.test(l) ? (g = d[1], d[2] && 0 < parseInt(d[2]) &&
          (f = new Date, f.setTime(String(d[2])))) : l = "invalid" : l = "free"
    } catch (c) {
      l = "invalid"
    }
  }
}(jwplayer.utils), function (e) {
  var a = e.tea = {};
  a.encrypt = function (f, d) {
    if (0 == f.length)return "";
    var c = a.strToLongs(g.encode(f));
    1 >= c.length && (c[1] = 0);
    for (var m = a.strToLongs(g.encode(d).slice(0, 16)), b = c.length, e = c[b - 1], h = c[0], q, n = Math.floor(6 + 52 / b), k = 0; 0 < n--;) {
      k += 2654435769;
      q = k >>> 2 & 3;
      for (var j = 0; j < b; j++)h = c[(j + 1) % b], e = (e >>> 5 ^ h << 2) + (h >>> 3 ^ e << 4) ^ (k ^ h) + (m[j & 3 ^ q] ^ e), e = c[j] += e
    }
    c = a.longsToStr(c);
    return l.encode(c)
  };
  a.decrypt = function (f,
                        d) {
    if (0 == f.length)return "";
    for (var c = a.strToLongs(l.decode(f)), m = a.strToLongs(g.encode(d).slice(0, 16)), b = c.length, e = c[b - 1], h = c[0], q, n = 2654435769 * Math.floor(6 + 52 / b); 0 != n;) {
      q = n >>> 2 & 3;
      for (var k = b - 1; 0 <= k; k--)e = c[0 < k ? k - 1 : b - 1], e = (e >>> 5 ^ h << 2) + (h >>> 3 ^ e << 4) ^ (n ^ h) + (m[k & 3 ^ q] ^ e), h = c[k] -= e;
      n -= 2654435769
    }
    c = a.longsToStr(c);
    c = c.replace(/\0+$/, "");
    return g.decode(c)
  };
  a.strToLongs = function (a) {
    for (var d = Array(Math.ceil(a.length / 4)), c = 0; c < d.length; c++)d[c] = a.charCodeAt(4 * c) + (a.charCodeAt(4 * c + 1) << 8) + (a.charCodeAt(4 * c +
        2) << 16) + (a.charCodeAt(4 * c + 3) << 24);
    return d
  };
  a.longsToStr = function (a) {
    for (var d = Array(a.length), c = 0; c < a.length; c++)d[c] = String.fromCharCode(a[c] & 255, a[c] >>> 8 & 255, a[c] >>> 16 & 255, a[c] >>> 24 & 255);
    return d.join("")
  };
  var l = {
    code: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d", encode: function (a, d) {
      var c, e, b, p, h = [], q = "", n, k, j = l.code;
      k = ("undefined" == typeof d ? 0 : d) ? g.encode(a) : a;
      n = k.length % 3;
      if (0 < n)for (; 3 > n++;)q += "\x3d", k += "\x00";
      for (n = 0; n < k.length; n += 3)c = k.charCodeAt(n), e = k.charCodeAt(n +
        1), b = k.charCodeAt(n + 2), p = c << 16 | e << 8 | b, c = p >> 18 & 63, e = p >> 12 & 63, b = p >> 6 & 63, p &= 63, h[n / 3] = j.charAt(c) + j.charAt(e) + j.charAt(b) + j.charAt(p);
      h = h.join("");
      return h = h.slice(0, h.length - q.length) + q
    }, decode: function (a, d) {
      d = "undefined" == typeof d ? !1 : d;
      var c, e, b, p, h, q = [], n, k = l.code;
      n = d ? g.decode(a) : a;
      for (var j = 0; j < n.length; j += 4)c = k.indexOf(n.charAt(j)), e = k.indexOf(n.charAt(j + 1)), p = k.indexOf(n.charAt(j + 2)), h = k.indexOf(n.charAt(j + 3)), b = c << 18 | e << 12 | p << 6 | h, c = b >>> 16 & 255, e = b >>> 8 & 255, b &= 255, q[j / 4] = String.fromCharCode(c, e,
        b), 64 == h && (q[j / 4] = String.fromCharCode(c, e)), 64 == p && (q[j / 4] = String.fromCharCode(c));
      p = q.join("");
      return d ? g.decode(p) : p
    }
  }, g = {
    encode: function (a) {
      a = a.replace(/[\u0080-\u07ff]/g, function (a) {
        a = a.charCodeAt(0);
        return String.fromCharCode(192 | a >> 6, 128 | a & 63)
      });
      return a = a.replace(/[\u0800-\uffff]/g, function (a) {
        a = a.charCodeAt(0);
        return String.fromCharCode(224 | a >> 12, 128 | a >> 6 & 63, 128 | a & 63)
      })
    }, decode: function (a) {
      a = a.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, function (a) {
        a = (a.charCodeAt(0) & 15) << 12 |
          (a.charCodeAt(1) & 63) << 6 | a.charCodeAt(2) & 63;
        return String.fromCharCode(a)
      });
      return a = a.replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, function (a) {
        a = (a.charCodeAt(0) & 31) << 6 | a.charCodeAt(1) & 63;
        return String.fromCharCode(a)
      })
    }
  }
}(jwplayer.utils), function (e) {
  e.events = {
    COMPLETE: "COMPLETE",
    ERROR: "ERROR",
    API_READY: "jwplayerAPIReady",
    JWPLAYER_READY: "jwplayerReady",
    JWPLAYER_FULLSCREEN: "jwplayerFullscreen",
    JWPLAYER_RESIZE: "jwplayerResize",
    JWPLAYER_ERROR: "jwplayerError",
    JWPLAYER_SETUP_ERROR: "jwplayerSetupError",
    JWPLAYER_MEDIA_BEFOREPLAY: "jwplayerMediaBeforePlay",
    JWPLAYER_MEDIA_BEFORECOMPLETE: "jwplayerMediaBeforeComplete",
    JWPLAYER_COMPONENT_SHOW: "jwplayerComponentShow",
    JWPLAYER_COMPONENT_HIDE: "jwplayerComponentHide",
    JWPLAYER_MEDIA_BUFFER: "jwplayerMediaBuffer",
    JWPLAYER_MEDIA_BUFFER_FULL: "jwplayerMediaBufferFull",
    JWPLAYER_MEDIA_ERROR: "jwplayerMediaError",
    JWPLAYER_MEDIA_LOADED: "jwplayerMediaLoaded",
    JWPLAYER_MEDIA_COMPLETE: "jwplayerMediaComplete",
    JWPLAYER_MEDIA_SEEK: "jwplayerMediaSeek",
    JWPLAYER_MEDIA_TIME: "jwplayerMediaTime",
    JWPLAYER_MEDIA_VOLUME: "jwplayerMediaVolume",
    JWPLAYER_MEDIA_META: "jwplayerMediaMeta",
    JWPLAYER_MEDIA_MUTE: "jwplayerMediaMute",
    JWPLAYER_MEDIA_LEVELS: "jwplayerMediaLevels",
    JWPLAYER_MEDIA_LEVEL_CHANGED: "jwplayerMediaLevelChanged",
    JWPLAYER_CAPTIONS_CHANGED: "jwplayerCaptionsChanged",
    JWPLAYER_CAPTIONS_LIST: "jwplayerCaptionsList",
    JWPLAYER_CAPTIONS_LOADED: "jwplayerCaptionsLoaded",
    JWPLAYER_PLAYER_STATE: "jwplayerPlayerState",
    state: {BUFFERING: "BUFFERING", IDLE: "IDLE", PAUSED: "PAUSED", PLAYING: "PLAYING"},
    JWPLAYER_PLAYLIST_LOADED: "jwplayerPlaylistLoaded",
    JWPLAYER_PLAYLIST_ITEM: "jwplayerPlaylistItem",
    JWPLAYER_PLAYLIST_COMPLETE: "jwplayerPlaylistComplete",
    JWPLAYER_DISPLAY_CLICK: "jwplayerViewClick",
    JWPLAYER_CONTROLS: "jwplayerViewControls",
    JWPLAYER_USER_ACTION: "jwplayerUserAction",
    JWPLAYER_INSTREAM_CLICK: "jwplayerInstreamClicked",
    JWPLAYER_INSTREAM_DESTROYED: "jwplayerInstreamDestroyed",
    JWPLAYER_AD_TIME: "jwplayerAdTime",
    JWPLAYER_AD_ERROR: "jwplayerAdError",
    JWPLAYER_AD_CLICK: "jwplayerAdClicked",
    JWPLAYER_AD_COMPLETE: "jwplayerAdComplete",
    JWPLAYER_AD_IMPRESSION: "jwplayerAdImpression",
    JWPLAYER_AD_COMPANIONS: "jwplayerAdCompanions",
    JWPLAYER_AD_SKIPPED: "jwplayerAdSkipped"
  }
}(jwplayer), function (e) {
  var a = e.utils;
  e.events.eventdispatcher = function (l, g) {
    function f(c, b, d) {
      if (c)for (var h = 0; h < c.length; h++) {
        var g = c[h];
        if (g) {
          null !== g.count && 0 === --g.count && delete c[h];
          try {
            g.listener(b)
          } catch (f) {
            a.log('Error handling "' + d + '" event listener [' + h + "]: " + f.toString(), g.listener, b)
          }
        }
      }
    }

    var d, c;
    this.resetEventListeners = function () {
      d = {};
      c = []
    };
    this.resetEventListeners();
    this.addEventListener = function (c, b, g) {
      try {
        a.exists(d[c]) || (d[c] = []), "string" ==
        a.typeOf(b) && (b = (new Function("return " + b))()), d[c].push({listener: b, count: g || null})
      } catch (h) {
        a.log("error", h)
      }
      return !1
    };
    this.removeEventListener = function (c, b) {
      if (d[c]) {
        try {
          for (var g = 0; g < d[c].length; g++)if (d[c][g].listener.toString() == b.toString()) {
            d[c].splice(g, 1);
            break
          }
        } catch (h) {
          a.log("error", h)
        }
        return !1
      }
    };
    this.addGlobalListener = function (d, b) {
      try {
        "string" == a.typeOf(d) && (d = (new Function("return " + d))()), c.push({listener: d, count: b || null})
      } catch (g) {
        a.log("error", g)
      }
      return !1
    };
    this.removeGlobalListener =
      function (d) {
        if (d) {
          try {
            for (var b = c.length; b--;)c[b].listener.toString() == d.toString() && c.splice(b, 1)
          } catch (g) {
            a.log("error", g)
          }
          return !1
        }
      };
    this.sendEvent = function (m, b) {
      a.exists(b) || (b = {});
      a.extend(b, {id: l, version: e.version, type: m});
      g && a.log(m, b);
      f(d[m], b, m);
      f(c, b, m)
    }
  }
}(window.jwplayer), function (e) {
  var a = {}, l = {};
  e.plugins = function () {
  };
  e.plugins.loadPlugins = function (g, f) {
    l[g] = new e.plugins.pluginloader(new e.plugins.model(a), f);
    return l[g]
  };
  e.plugins.registerPlugin = function (g, f, d, c) {
    var m = e.utils.getPluginName(g);
    a[m] || (a[m] = new e.plugins.plugin(g));
    a[m].registerPlugin(g, f, d, c)
  }
}(jwplayer), function (e) {
  e.plugins.model = function (a) {
    this.addPlugin = function (l) {
      var g = e.utils.getPluginName(l);
      a[g] || (a[g] = new e.plugins.plugin(l));
      return a[g]
    };
    this.getPlugins = function () {
      return a
    }
  }
}(jwplayer), function (e) {
  var a = jwplayer.utils, l = jwplayer.events;
  e.pluginmodes = {FLASH: 0, JAVASCRIPT: 1, HYBRID: 2};
  e.plugin = function (g) {
    function f() {
      switch (a.getPluginPathType(g)) {
        case a.pluginPathType.ABSOLUTE:
          return g;
        case a.pluginPathType.RELATIVE:
          return a.getAbsolutePath(g,
            window.location.href)
      }
    }

    function d() {
      q = setTimeout(function () {
        m = a.loaderstatus.COMPLETE;
        n.sendEvent(l.COMPLETE)
      }, 1E3)
    }

    function c() {
      m = a.loaderstatus.ERROR;
      n.sendEvent(l.ERROR)
    }

    var m = a.loaderstatus.NEW, b, p, h, q, n = new l.eventdispatcher;
    a.extend(this, n);
    this.load = function () {
      if (m == a.loaderstatus.NEW)if (0 < g.lastIndexOf(".swf")) b = g, m = a.loaderstatus.COMPLETE, n.sendEvent(l.COMPLETE); else if (a.getPluginPathType(g) == a.pluginPathType.CDN) m = a.loaderstatus.COMPLETE, n.sendEvent(l.COMPLETE); else {
        m = a.loaderstatus.LOADING;
        var k = new a.scriptloader(f());
        k.addEventListener(l.COMPLETE, d);
        k.addEventListener(l.ERROR, c);
        k.load()
      }
    };
    this.registerPlugin = function (c, d, g, f) {
      q && (clearTimeout(q), q = void 0);
      h = d;
      g && f ? (b = f, p = g) : "string" == typeof g ? b = g : "function" == typeof g ? p = g : !g && !f && (b = c);
      m = a.loaderstatus.COMPLETE;
      n.sendEvent(l.COMPLETE)
    };
    this.getStatus = function () {
      return m
    };
    this.getPluginName = function () {
      return a.getPluginName(g)
    };
    this.getFlashPath = function () {
      if (b)switch (a.getPluginPathType(b)) {
        case a.pluginPathType.ABSOLUTE:
          return b;
        case a.pluginPathType.RELATIVE:
          return 0 < g.lastIndexOf(".swf") ? a.getAbsolutePath(b, window.location.href) : a.getAbsolutePath(b, f())
      }
      return null
    };
    this.getJS = function () {
      return p
    };
    this.getTarget = function () {
      return h
    };
    this.getPluginmode = function () {
      if ("undefined" != typeof b && "undefined" != typeof p)return e.pluginmodes.HYBRID;
      if ("undefined" != typeof b)return e.pluginmodes.FLASH;
      if ("undefined" != typeof p)return e.pluginmodes.JAVASCRIPT
    };
    this.getNewInstance = function (a, b, c) {
      return new p(a, b, c)
    };
    this.getURL = function () {
      return g
    }
  }
}(jwplayer.plugins),
  function (e) {
    var a = e.utils, l = e.events, g = a.foreach;
    e.plugins.pluginloader = function (f, d) {
      function c() {
        h ? k.sendEvent(l.ERROR, {message: q}) : p || (p = !0, b = a.loaderstatus.COMPLETE, k.sendEvent(l.COMPLETE))
      }

      function m() {
        n || c();
        if (!p && !h) {
          var b = 0, d = f.getPlugins();
          a.foreach(n, function (g) {
            g = a.getPluginName(g);
            var k = d[g];
            g = k.getJS();
            var f = k.getTarget(), k = k.getStatus();
            if (k == a.loaderstatus.LOADING || k == a.loaderstatus.NEW) b++; else if (g && (!f || parseFloat(f) > parseFloat(e.version))) h = !0, q = "Incompatible player version", c()
          });
          0 == b && c()
        }
      }

      var b = a.loaderstatus.NEW, p = !1, h = !1, q, n = d, k = new l.eventdispatcher;
      a.extend(this, k);
      this.setupPlugins = function (b, c, d) {
        var k = {length: 0, plugins: {}}, h = 0, j = {}, e = f.getPlugins();
        g(c.plugins, function (g, f) {
          var m = a.getPluginName(g), p = e[m], l = p.getFlashPath(), n = p.getJS(), q = p.getURL();
          l && (k.plugins[l] = a.extend({}, f), k.plugins[l].pluginmode = p.getPluginmode(), k.length++);
          try {
            if (n && c.plugins && c.plugins[q]) {
              var C = document.createElement("div");
              C.id = b.id + "_" + m;
              C.style.position = "absolute";
              C.style.top = 0;
              C.style.zIndex =
                h + 10;
              j[m] = p.getNewInstance(b, a.extend({}, c.plugins[q]), C);
              h++;
              b.onReady(d(j[m], C, !0));
              b.onResize(d(j[m], C))
            }
          } catch (F) {
            a.log("ERROR: Failed to load " + m + ".")
          }
        });
        b.plugins = j;
        return k
      };
      this.load = function () {
        if (!(a.exists(d) && "object" != a.typeOf(d))) {
          b = a.loaderstatus.LOADING;
          g(d, function (b) {
            a.exists(b) && (b = f.addPlugin(b), b.addEventListener(l.COMPLETE, m), b.addEventListener(l.ERROR, j))
          });
          var c = f.getPlugins();
          g(c, function (a, b) {
            b.load()
          })
        }
        m()
      };
      var j = this.pluginFailed = function () {
        h || (h = !0, q = "File not found", c())
      };
      this.getStatus = function () {
        return b
      }
    }
  }(jwplayer), function () {
  jwplayer.parsers = {
    localName: function (e) {
      return e ? e.localName ? e.localName : e.baseName ? e.baseName : "" : ""
    }, textContent: function (e) {
      return e ? e.textContent ? jwplayer.utils.trim(e.textContent) : e.text ? jwplayer.utils.trim(e.text) : "" : ""
    }, getChildNode: function (e, a) {
      return e.childNodes[a]
    }, numChildren: function (e) {
      return e.childNodes ? e.childNodes.length : 0
    }
  }
}(jwplayer), function (e) {
  var a = e.parsers;
  (a.jwparser = function () {
  }).parseEntry = function (l, g) {
    for (var f =
      [], d = [], c = e.utils.xmlAttribute, m = 0; m < l.childNodes.length; m++) {
      var b = l.childNodes[m];
      if ("jwplayer" == b.prefix) {
        var p = a.localName(b);
        "source" == p ? (delete g.sources, f.push({
            file: c(b, "file"),
            "default": c(b, "default"),
            label: c(b, "label"),
            type: c(b, "type")
          })) : "track" == p ? (delete g.tracks, d.push({
              file: c(b, "file"),
              "default": c(b, "default"),
              kind: c(b, "kind"),
              label: c(b, "label")
            })) : (g[p] = e.utils.serialize(a.textContent(b)), "file" == p && g.sources && delete g.sources)
      }
      g.file || (g.file = g.link)
    }
    if (f.length) {
      g.sources = [];
      for (m =
             0; m < f.length; m++)0 < f[m].file.length && (f[m]["default"] = "true" == f[m]["default"] ? !0 : !1, f[m].label.length || delete f[m].label, g.sources.push(f[m]))
    }
    if (d.length) {
      g.tracks = [];
      for (m = 0; m < d.length; m++)0 < d[m].file.length && (d[m]["default"] = "true" == d[m]["default"] ? !0 : !1, d[m].kind = !d[m].kind.length ? "captions" : d[m].kind, d[m].label.length || delete d[m].label, g.tracks.push(d[m]))
    }
    return g
  }
}(jwplayer), function (e) {
  var a = jwplayer.utils, l = a.xmlAttribute, g = e.localName, f = e.textContent, d = e.numChildren, c = e.mediaparser = function () {
  };
  c.parseGroup = function (e, b) {
    var p, h, q = [];
    for (h = 0; h < d(e); h++)if (p = e.childNodes[h], "media" == p.prefix && g(p))switch (g(p).toLowerCase()) {
      case "content":
        l(p, "duration") && (b.duration = a.seconds(l(p, "duration")));
        0 < d(p) && (b = c.parseGroup(p, b));
        l(p, "url") && (b.sources || (b.sources = []), b.sources.push({
          file: l(p, "url"),
          type: l(p, "type"),
          width: l(p, "width"),
          label: l(p, "label")
        }));
        break;
      case "title":
        b.title = f(p);
        break;
      case "description":
        b.description = f(p);
        break;
      case "guid":
        b.mediaid = f(p);
        break;
      case "thumbnail":
        b.image ||
        (b.image = l(p, "url"));
        break;
      case "group":
        c.parseGroup(p, b);
        break;
      case "subtitle":
        var n = {};
        n.file = l(p, "url");
        n.kind = "captions";
        if (0 < l(p, "lang").length) {
          var k = n;
          p = l(p, "lang");
          var j = {
            zh: "Chinese",
            nl: "Dutch",
            en: "English",
            fr: "French",
            de: "German",
            it: "Italian",
            ja: "Japanese",
            pt: "Portuguese",
            ru: "Russian",
            es: "Spanish"
          };
          p = j[p] ? j[p] : p;
          k.label = p
        }
        q.push(n)
    }
    b.hasOwnProperty("tracks") || (b.tracks = []);
    for (h = 0; h < q.length; h++)b.tracks.push(q[h]);
    return b
  }
}(jwplayer.parsers), function (e) {
  function a(a) {
    for (var b = {}, d = 0; d <
    a.childNodes.length; d++) {
      var h = a.childNodes[d], f = c(h);
      if (f)switch (f.toLowerCase()) {
        case "enclosure":
          b.file = l.xmlAttribute(h, "url");
          break;
        case "title":
          b.title = g(h);
          break;
        case "guid":
          b.mediaid = g(h);
          break;
        case "pubdate":
          b.date = g(h);
          break;
        case "description":
          b.description = g(h);
          break;
        case "link":
          b.link = g(h);
          break;
        case "category":
          b.tags = b.tags ? b.tags + g(h) : g(h)
      }
    }
    b = e.mediaparser.parseGroup(a, b);
    b = e.jwparser.parseEntry(a, b);
    return new jwplayer.playlist.item(b)
  }

  var l = jwplayer.utils, g = e.textContent, f = e.getChildNode,
    d = e.numChildren, c = e.localName;
  e.rssparser = {};
  e.rssparser.parse = function (g) {
    for (var b = [], e = 0; e < d(g); e++) {
      var h = f(g, e);
      if ("channel" == c(h).toLowerCase())for (var l = 0; l < d(h); l++) {
        var n = f(h, l);
        "item" == c(n).toLowerCase() && b.push(a(n))
      }
    }
    return b
  }
}(jwplayer.parsers), function (e) {
  e.playlist = function (a) {
    var l = [];
    if ("array" == e.utils.typeOf(a))for (var g = 0; g < a.length; g++)l.push(new e.playlist.item(a[g])); else l.push(new e.playlist.item(a));
    return l
  }
}(jwplayer), function (e) {
  var a = e.item = function (l) {
    var g = jwplayer.utils,
      f = g.extend({}, a.defaults, l);
    f.tracks = l && g.exists(l.tracks) ? l.tracks : [];
    0 == f.sources.length && (f.sources = [new e.source(f)]);
    for (var d = 0; d < f.sources.length; d++) {
      var c = f.sources[d]["default"];
      f.sources[d]["default"] = c ? "true" == c.toString() : !1;
      f.sources[d] = new e.source(f.sources[d])
    }
    if (f.captions && !g.exists(l.tracks)) {
      for (l = 0; l < f.captions.length; l++)f.tracks.push(f.captions[l]);
      delete f.captions
    }
    for (d = 0; d < f.tracks.length; d++)f.tracks[d] = new e.track(f.tracks[d]);
    return f
  };
  a.defaults = {
    description: "", image: "",
    mediaid: "", title: "", sources: [], tracks: []
  }
}(jwplayer.playlist), function (e) {
  var a = jwplayer, l = a.utils, g = a.events, f = a.parsers;
  e.loader = function () {
    function a(c) {
      try {
        var d = c.responseXML.childNodes;
        c = "";
        for (var l = 0; l < d.length && !(c = d[l], 8 != c.nodeType); l++);
        "xml" == f.localName(c) && (c = c.nextSibling);
        if ("rss" != f.localName(c)) m("Not a valid RSS feed"); else {
          var n = new e(f.rssparser.parse(c));
          b.sendEvent(g.JWPLAYER_PLAYLIST_LOADED, {playlist: n})
        }
      } catch (k) {
        m()
      }
    }

    function c(a) {
      m(a.match(/invalid/i) ? "Not a valid RSS feed" :
        "")
    }

    function m(a) {
      b.sendEvent(g.JWPLAYER_ERROR, {message: a ? a : "Error loading file"})
    }

    var b = new g.eventdispatcher;
    l.extend(this, b);
    this.load = function (b) {
      l.ajax(b, a, c)
    }
  }
}(jwplayer.playlist), function (e) {
  var a = jwplayer.utils, l = {file: void 0, label: void 0, type: void 0, "default": void 0};
  e.source = function (g) {
    var f = a.extend({}, l);
    a.foreach(l, function (d) {
      a.exists(g[d]) && (f[d] = g[d], delete g[d])
    });
    f.type && 0 < f.type.indexOf("/") && (f.type = a.extensionmap.mimeType(f.type));
    "m3u8" == f.type && (f.type = "hls");
    "smil" == f.type &&
    (f.type = "rtmp");
    return f
  }
}(jwplayer.playlist), function (e) {
  var a = jwplayer.utils, l = {file: void 0, label: void 0, kind: "captions", "default": !1};
  e.track = function (g) {
    var f = a.extend({}, l);
    g || (g = {});
    a.foreach(l, function (d) {
      a.exists(g[d]) && (f[d] = g[d], delete g[d])
    });
    return f
  }
}(jwplayer.playlist), function (e) {
  function a(a, c, d) {
    var g = a.style;
    g.backgroundColor = "#000";
    g.color = "#FFF";
    g.width = l.styleDimension(d.width);
    g.height = l.styleDimension(d.height);
    g.display = "table";
    g.opacity = 1;
    d = document.createElement("p");
    g = d.style;
    g.verticalAlign = "middle";
    g.textAlign = "center";
    g.display = "table-cell";
    g.font = "15px/20px Arial, Helvetica, sans-serif";
    d.innerHTML = c.replace(":", ":\x3cbr\x3e");
    a.innerHTML = "";
    a.appendChild(d)
  }

  var l = e.utils, g = e.events, f = !0, d = !1, c = document, m = e.embed = function (b) {
    function p(a, b) {
      l.foreach(b, function (b, c) {
        "function" == typeof a[b] && a[b].call(a, c)
      })
    }

    function h() {
      if (!E)if ("array" == l.typeOf(t.playlist) && 2 > t.playlist.length && (0 == t.playlist.length || !t.playlist[0].sources || 0 == t.playlist[0].sources.length)) k(); else if (!B)if ("string" ==
        l.typeOf(t.playlist)) {
        var a = new e.playlist.loader;
        a.addEventListener(g.JWPLAYER_PLAYLIST_LOADED, function (a) {
          t.playlist = a.playlist;
          B = d;
          h()
        });
        a.addEventListener(g.JWPLAYER_ERROR, function (a) {
          B = d;
          k(a)
        });
        B = f;
        a.load(t.playlist)
      } else if (y.getStatus() == l.loaderstatus.COMPLETE) {
        for (a = 0; a < t.modes.length; a++)if (t.modes[a].type && m[t.modes[a].type]) {
          var c = l.extend({}, t), n = new m[t.modes[a].type](r, t.modes[a], c, y, b);
          if (n.supportsConfig())return n.addEventListener(g.ERROR, q), n.embed(), p(b, c.events), b
        }
        var u;
        t.fallback ?
          (u = "No suitable players found and fallback enabled", D = setTimeout(function () {
            j(u, f)
          }, 10), l.log(u), new m.download(r, t, k)) : (u = "No suitable players found and fallback disabled", j(u, d), l.log(u), r.parentNode.replaceChild(w, r))
      }
    }

    function q(a) {
      u(A + a.message)
    }

    function n(a) {
      u("Could not load plugins: " + a.message)
    }

    function k(a) {
      a && a.message ? u("Error loading playlist: " + a.message) : u(A + "No playable sources found")
    }

    function j(a, c) {
      D && (clearTimeout(D), D = null);
      D = setTimeout(function () {
        D = null;
        b.dispatchEvent(g.JWPLAYER_SETUP_ERROR,
          {message: a, fallback: c})
      }, 0)
    }

    function u(b) {
      E || (t.fallback ? (E = f, a(r, b, t), j(b, f)) : j(b, d))
    }

    var t = new m.config(b.config), r, v, w, x = t.width, z = t.height, A = "Error loading player: ", y = e.plugins.loadPlugins(b.id, t.plugins), B = d, E = d, D = null;
    t.fallbackDiv && (w = t.fallbackDiv, delete t.fallbackDiv);
    t.id = b.id;
    v = c.getElementById(b.id);
    t.aspectratio ? b.config.aspectratio = t.aspectratio : delete b.config.aspectratio;
    r = c.createElement("div");
    r.id = v.id;
    r.style.width = 0 < x.toString().indexOf("%") ? x : x + "px";
    r.style.height = 0 < z.toString().indexOf("%") ?
      z : z + "px";
    v.parentNode.replaceChild(r, v);
    this.embed = function () {
      E || (y.addEventListener(g.COMPLETE, h), y.addEventListener(g.ERROR, n), y.load())
    };
    this.errorScreen = u;
    return this
  };
  e.embed.errorScreen = a
}(jwplayer), function (e) {
  function a(a) {
    if (a.playlist)for (var c = 0; c < a.playlist.length; c++)a.playlist[c] = new f(a.playlist[c]); else {
      var e = {};
      g.foreach(f.defaults, function (b) {
        l(a, e, b)
      });
      e.sources || (a.levels ? (e.sources = a.levels, delete a.levels) : (c = {}, l(a, c, "file"), l(a, c, "type"), e.sources = c.file ? [c] : []));
      a.playlist =
        [new f(e)]
    }
  }

  function l(a, c, f) {
    g.exists(a[f]) && (c[f] = a[f], delete a[f])
  }

  var g = e.utils, f = e.playlist.item;
  (e.embed.config = function (d) {
    var c = {
      fallback: !0,
      height: 270,
      primary: "html5",
      width: 480,
      base: d.base ? d.base : g.getScriptPath("jwplayer.js"),
      aspectratio: ""
    };
    d = g.extend(c, e.defaults, d);
    var c = {type: "html5", src: d.base + "jwplayer.html5.js"}, f = {type: "flash", src: d.base + "jwplayer.flash.swf"};
    d.modes = "flash" == d.primary ? [f, c] : [c, f];
    d.listbar && (d.playlistsize = d.listbar.size, d.playlistposition = d.listbar.position, d.playlistlayout =
      d.listbar.layout);
    d.flashplayer && (f.src = d.flashplayer);
    d.html5player && (c.src = d.html5player);
    a(d);
    f = d.aspectratio;
    if ("string" != typeof f || !g.exists(f)) c = 0; else {
      var b = f.indexOf(":");
      -1 == b ? c = 0 : (c = parseFloat(f.substr(0, b)), f = parseFloat(f.substr(b + 1)), c = 0 >= c || 0 >= f ? 0 : 100 * (f / c) + "%")
    }
    -1 == d.width.toString().indexOf("%") ? delete d.aspectratio : c ? d.aspectratio = c : delete d.aspectratio;
    return d
  }).addConfig = function (d, c) {
    a(c);
    return g.extend(d, c)
  }
}(jwplayer), function (e) {
  var a = e.utils, l = document;
  e.embed.download = function (g,
                               f, d) {
    function c(b, c) {
      for (var d = l.querySelectorAll(b), g = 0; g < d.length; g++)a.foreach(c, function (a, b) {
        d[g].style[a] = b
      })
    }

    function e(a, b, c) {
      a = l.createElement(a);
      b && (a.className = "jwdownload" + b);
      c && c.appendChild(a);
      return a
    }

    var b = a.extend({}, f), p = b.width ? b.width : 480, h = b.height ? b.height : 320, q;
    f = f.logo ? f.logo : {prefix: "./", file: "logo.png", margin: 10};
    var n, k, j, b = b.playlist, u, t = ["mp4", "aac", "mp3"];
    if (b && b.length) {
      u = b[0];
      q = u.sources;
      for (b = 0; b < q.length; b++) {
        var r = q[b], v = r.type ? r.type : a.extensionmap.extType(a.extension(r.file));
        r.file && a.foreach(t, function (b) {
          v == t[b] ? (n = r.file, k = u.image) : a.isYouTube(r.file) && (j = r.file)
        })
      }
      n ? (q = n, d = k, g && (b = e("a", "display", g), e("div", "icon", b), e("div", "logo", b), q && b.setAttribute("href", a.getAbsolutePath(q))), b = "#" + g.id + " .jwdownload", g.style.width = "", g.style.height = "", c(b + "display", {
          width: a.styleDimension(Math.max(320, p)),
          height: a.styleDimension(Math.max(180, h)),
          background: "black center no-repeat " + (d ? "url(" + d + ")" : ""),
          backgroundSize: "contain",
          position: "relative",
          border: "none",
          display: "block"
        }),
          c(b + "display div", {
            position: "absolute",
            width: "100%",
            height: "100%"
          }), c(b + "logo", {
          top: f.margin + "px",
          right: f.margin + "px",
          background: "top right no-repeat url(" + f.prefix + f.file + ")"
        }), c(b + "icon", {background: "center no-repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAgNJREFUeNrs28lqwkAYB/CZqNVDDj2r6FN41QeIy8Fe+gj6BL275Q08u9FbT8ZdwVfotSBYEPUkxFOoks4EKiJdaDuTjMn3wWBO0V/+sySR8SNSqVRKIR8qaXHkzlqS9jCfzzWcTCYp9hF5o+59sVjsiRzcegSckFzcjT+ruN80TeSlAjCAAXzdJSGPFXRpAAMYwACGZQkSdhG4WCzehMNhqV6vG6vVSrirKVEw66YoSqDb7cqlUilE8JjHd/y1MQefVzqdDmiaJpfLZWHgXMHn8F6vJ1cqlVAkEsGuAn83J4gAd2RZymQygX6/L1erVQt+9ZPWb+CDwcCC2zXGJaewl/DhcHhK3DVj+KfKZrMWvFarcYNLomAv4aPRSFZVlTlcSPA5fDweW/BoNIqFnKV53JvncjkLns/n/cLdS+92O7RYLLgsKfv9/t8XlDn4eDyiw+HA9Jyz2eyt0+kY2+3WFC5hluej0Ha7zQQq9PPwdDq1Et1sNsx/nFBgCqWJ8oAK1aUptNVqcYWewE4nahfU0YQnk4ntUEfGMIU2m01HoLaCKbTRaDgKtaVLk9tBYaBcE/6Artdr4RZ5TB6/dC+9iIe/WgAMYADDpAUJAxjAAAYwgGFZgoS/AtNNTF7Z2bL0BYPBV3Jw5xFwwWcYxgtBP5OkE8i9G7aWGOOCruvauwADALMLMEbKf4SdAAAAAElFTkSuQmCC)"})) :
        j ? (f = j, g = e("iframe", "", g), g.src = "http://www.youtube.com/embed/" + a.youTubeID(f), g.width = p, g.height = h, g.style.border = "none") : d()
    }
  }
}(jwplayer), function (e) {
  var a = e.utils, l = e.events, g = {};
  (e.embed.flash = function (d, c, m, b, p) {
    function h(a, b, c) {
      var d = document.createElement("param");
      d.setAttribute("name", b);
      d.setAttribute("value", c);
      a.appendChild(d)
    }

    function q(a, b, c) {
      return function () {
        try {
          c && document.getElementById(p.id + "_wrapper").appendChild(b);
          var d = document.getElementById(p.id).getPluginConfig("display");
          "function" == typeof a.resize && a.resize(d.width, d.height);
          b.style.left = d.x;
          b.style.top = d.h
        } catch (g) {
        }
      }
    }

    function n(b) {
      if (!b)return {};
      var c = {}, d = [];
      a.foreach(b, function (b, g) {
        var k = a.getPluginName(b);
        d.push(b);
        a.foreach(g, function (a, b) {
          c[k + "." + a] = b
        })
      });
      c.plugins = d.join(",");
      return c
    }

    var k = new e.events.eventdispatcher, j = a.flashVersion();
    a.extend(this, k);
    this.embed = function () {
      m.id = p.id;
      if (10 > j)return k.sendEvent(l.ERROR, {message: "Flash version must be 10.0 or greater"}), !1;
      var f, e, r = p.config.listbar, v = a.extend({},
        m);
      if (d.id + "_wrapper" == d.parentNode.id) f = document.getElementById(d.id + "_wrapper"); else {
        f = document.createElement("div");
        e = document.createElement("div");
        e.style.display = "none";
        e.id = d.id + "_aspect";
        f.id = d.id + "_wrapper";
        f.style.position = "relative";
        f.style.display = "block";
        f.style.width = a.styleDimension(v.width);
        f.style.height = a.styleDimension(v.height);
        if (p.config.aspectratio) {
          var w = parseFloat(p.config.aspectratio);
          e.style.display = "block";
          e.style.marginTop = p.config.aspectratio;
          f.style.height = "auto";
          f.style.display =
            "inline-block";
          r && ("bottom" == r.position ? e.style.paddingBottom = r.size + "px" : "right" == r.position && (e.style.marginBottom = -1 * r.size * (w / 100) + "px"))
        }
        d.parentNode.replaceChild(f, d);
        f.appendChild(d);
        f.appendChild(e)
      }
      f = b.setupPlugins(p, v, q);
      0 < f.length ? a.extend(v, n(f.plugins)) : delete v.plugins;
      "undefined" != typeof v["dock.position"] && "false" == v["dock.position"].toString().toLowerCase() && (v.dock = v["dock.position"], delete v["dock.position"]);
      f = v.wmode ? v.wmode : v.height && 40 >= v.height ? "transparent" : "opaque";
      e = "height width modes events primary base fallback volume".split(" ");
      for (r = 0; r < e.length; r++)delete v[e[r]];
      e = a.getCookies();
      a.foreach(e, function (a, b) {
        "undefined" == typeof v[a] && (v[a] = b)
      });
      e = window.location.href.split("/");
      e.splice(e.length - 1, 1);
      e = e.join("/");
      v.base = e + "/";
      g[d.id] = v;
      a.isIE() ? (e = '\x3cobject classid\x3d"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" " width\x3d"100%" height\x3d"100%"id\x3d"' + d.id + '" name\x3d"' + d.id + '" tabindex\x3d0""\x3e', e += '\x3cparam name\x3d"movie" value\x3d"' + c.src + '"\x3e', e += '\x3cparam name\x3d"allowfullscreen" value\x3d"true"\x3e\x3cparam name\x3d"allowscriptaccess" value\x3d"always"\x3e',
          e += '\x3cparam name\x3d"seamlesstabbing" value\x3d"true"\x3e', e += '\x3cparam name\x3d"wmode" value\x3d"' + f + '"\x3e', e += '\x3cparam name\x3d"bgcolor" value\x3d"#000000"\x3e', e += "\x3c/object\x3e", d.outerHTML = e, f = document.getElementById(d.id)) : (e = document.createElement("object"), e.setAttribute("type", "application/x-shockwave-flash"), e.setAttribute("data", c.src), e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), e.setAttribute("bgcolor", "#000000"), e.setAttribute("id", d.id), e.setAttribute("name",
          d.id), e.setAttribute("tabindex", 0), h(e, "allowfullscreen", "true"), h(e, "allowscriptaccess", "always"), h(e, "seamlesstabbing", "true"), h(e, "wmode", f), d.parentNode.replaceChild(e, d), f = e);
      p.config.aspectratio && (f.style.position = "absolute");
      p.container = f;
      p.setPlayer(f, "flash")
    };
    this.supportsConfig = function () {
      if (j)if (m) {
        if ("string" == a.typeOf(m.playlist))return !0;
        try {
          var b = m.playlist[0].sources;
          if ("undefined" == typeof b)return !0;
          for (var c = 0; c < b.length; c++)if (b[c].file && f(b[c].file, b[c].type))return !0
        } catch (d) {
        }
      } else return !0;
      return !1
    }
  }).getVars = function (a) {
    return g[a]
  };
  var f = e.embed.flashCanPlay = function (d, c) {
    if (a.isYouTube(d) || a.isRtmp(d, c) || "hls" == c)return !0;
    var f = a.extensionmap[c ? c : a.extension(d)];
    return !f ? !1 : !!f.flash
  }
}(jwplayer), function (e) {
  var a = e.utils, l = a.extensionmap, g = e.events;
  e.embed.html5 = function (f, d, c, m, b) {
    function p(a, b, c) {
      return function () {
        try {
          var d = document.querySelector("#" + f.id + " .jwmain");
          c && d.appendChild(b);
          "function" == typeof a.resize && (a.resize(d.clientWidth, d.clientHeight), setTimeout(function () {
            a.resize(d.clientWidth,
              d.clientHeight)
          }, 400));
          b.left = d.style.left;
          b.top = d.style.top
        } catch (g) {
        }
      }
    }

    function h(a) {
      q.sendEvent(a.type, {message: "HTML5 player not found"})
    }

    var q = this, n = new g.eventdispatcher;
    a.extend(q, n);
    q.embed = function () {
      if (e.html5) {
        m.setupPlugins(b, c, p);
        f.innerHTML = "";
        var k = e.utils.extend({}, c);
        delete k.volume;
        k = new e.html5.player(k);
        b.container = document.getElementById(b.id);
        b.setPlayer(k, "html5")
      } else k = new a.scriptloader(d.src), k.addEventListener(g.ERROR, h), k.addEventListener(g.COMPLETE, q.embed), k.load()
    };
    q.supportsConfig = function () {
      if (e.vid.canPlayType)try {
        if ("string" == a.typeOf(c.playlist))return !0;
        for (var b = c.playlist[0].sources, d = 0; d < b.length; d++) {
          var f;
          var g = b[d].file, h = b[d].type;
          if (null !== navigator.userAgent.match(/BlackBerry/i) || a.isAndroid() && ("m3u" == a.extension(g) || "m3u8" == a.extension(g)) || a.isRtmp(g, h)) f = !1; else {
            var p = l[h ? h : a.extension(g)], m;
            if (!p || p.flash && !p.html5) m = !1; else {
              var n = p.html5, q = e.vid;
              if (n)try {
                m = q.canPlayType(n) ? !0 : !1
              } catch (A) {
                m = !1
              } else m = !0
            }
            f = m
          }
          if (f)return !0
        }
      } catch (y) {
      }
      return !1
    }
  }
}(jwplayer),
  function (e) {
    var a = e.embed, l = e.utils, g = /\.(js|swf)$/;
    e.embed = l.extend(function (f) {
      function d() {
        r = "Adobe SiteCatalyst Error: Could not find Media Module"
      }

      var c = l.repo(), m = l.extend({}, e.defaults), b = l.extend({}, m, f.config), p = f.config, h = b.plugins, q = b.analytics, n = "/jwplayer/jwpsrv.js", k = "./sharing.js", j = "./related.js", u = "./gapro.js", m = e.key ? e.key : m.key, t = (new e.utils.key(m)).edition(), r, h = h ? h : {};
      "ads" == t && b.advertising && (g.test(b.advertising.client) ? h[b.advertising.client] = b.advertising : h[c + b.advertising.client +
        ".js"] = b.advertising);
      delete p.advertising;
      p.key = m;
      b.analytics && g.test(b.analytics.client) && (n = b.analytics.client);
      delete p.analytics;
      q && "ads" !== t && delete q.enabled;
      if ("free" == t || !q || !1 !== q.enabled) h[n] = q ? q : {};
      delete h.sharing;
      delete h.related;
      switch (t) {
        case "ads":
          if (p.sitecatalyst)try {
            window.s && window.s.hasOwnProperty("Media") ? new e.embed.sitecatalyst(f) : d()
          } catch (v) {
            d()
          }
        case "premium":
          b.related && (g.test(b.related.client) && (j = b.related.client), h[j] = b.related), b.ga && (g.test(b.ga.client) && (u = b.ga.client),
            h[u] = b.ga);
        case "pro":
          b.sharing && (g.test(b.sharing.client) && (k = b.sharing.client), h[k] = b.sharing), b.skin && (p.skin = b.skin.replace(/^(beelden|bekle|five|glow|modieus|roundster|stormtrooper|vapor)$/i, l.repo() + "skins/$1.xml"))
      }
      p.plugins = h;
      f.config = p;
      f = new a(f);
      r && f.errorScreen(r);
      return f
    }, e.embed)
  }(jwplayer), function (e) {
  var a = jwplayer.utils;
  e.sitecatalyst = function (e) {
    function g(c) {
      b.debug && a.log(c)
    }

    function f(a) {
      a = a.split("/");
      a = a[a.length - 1];
      a = a.split("?");
      return a[0]
    }

    function d() {
      if (!k) {
        k = !0;
        var a =
          m.getPosition();
        g("stop: " + h + " : " + a);
        s.Media.stop(h, a)
      }
    }

    function c() {
      j || (d(), j = !0, g("close: " + h), s.Media.close(h), u = !0, n = 0)
    }

    var m = e, b = a.extend({}, m.config.sitecatalyst), p = {
      onPlay: function () {
        if (!u) {
          var a = m.getPosition();
          k = !1;
          g("play: " + h + " : " + a);
          s.Media.play(h, a)
        }
      }, onPause: d, onBuffer: d, onIdle: c, onPlaylistItem: function (d) {
        try {
          u = !0;
          c();
          n = 0;
          var g;
          if (b.mediaName) g = b.mediaName; else {
            var e = m.getPlaylistItem(d.index);
            g = e.title ? e.title : e.file ? f(e.file) : e.sources && e.sources.length ? f(e.sources[0].file) : ""
          }
          h =
            g;
          q = b.playerName ? b.playerName : m.id
        } catch (k) {
          a.log(k)
        }
      }, onTime: function () {
        if (u) {
          var a = m.getDuration();
          if (-1 == a)return;
          j = k = u = !1;
          g("open: " + h + " : " + a + " : " + q);
          s.Media.open(h, a, q);
          g("play: " + h + " : 0");
          s.Media.play(h, 0)
        }
        a = m.getPosition();
        if (3 <= Math.abs(a - n)) {
          var b = n;
          g("seek: " + b + " to " + a);
          g("stop: " + h + " : " + b);
          s.Media.stop(h, b);
          g("play: " + h + " : " + a);
          s.Media.play(h, a)
        }
        n = a
      }, onComplete: c
    }, h, q, n, k = !0, j = !0, u;
    a.foreach(p, function (a) {
      m[a](p[a])
    })
  }
}(jwplayer.embed), function (e, a) {
  var l = [], g = e.utils, f = e.events,
    d = f.state, c = document, m = e.api = function (b) {
      function l(a, b) {
        return function (c) {
          return b(a, c)
        }
      }

      function h(a, b) {
        t[a] || (t[a] = [], n(f.JWPLAYER_PLAYER_STATE, function (b) {
          var c = b.newstate;
          b = b.oldstate;
          if (c == a) {
            var d = t[c];
            if (d)for (var g = 0; g < d.length; g++) {
              var f = d[g];
              "function" == typeof f && f.call(this, {oldstate: b, newstate: c})
            }
          }
        }));
        t[a].push(b);
        return j
      }

      function q(a, b) {
        try {
          a.jwAddEventListener(b, 'function(dat) { jwplayer("' + j.id + '").dispatchEvent("' + b + '", dat); }')
        } catch (c) {
          g.log("Could not add internal listener")
        }
      }

      function n(a, b) {
        u[a] || (u[a] = [], r && v && q(r, a));
        u[a].push(b);
        return j
      }

      function k() {
        if (v) {
          if (r) {
            var a = Array.prototype.slice.call(arguments, 0), b = a.shift();
            if ("function" === typeof r[b]) {
              switch (a.length) {
                case 6:
                  return r[b](a[0], a[1], a[2], a[3], a[4], a[5]);
                case 5:
                  return r[b](a[0], a[1], a[2], a[3], a[4]);
                case 4:
                  return r[b](a[0], a[1], a[2], a[3]);
                case 3:
                  return r[b](a[0], a[1], a[2]);
                case 2:
                  return r[b](a[0], a[1]);
                case 1:
                  return r[b](a[0])
              }
              return r[b]()
            }
          }
          return null
        }
        w.push(arguments)
      }

      var j = this, u = {}, t = {}, r, v = !1, w = [], x,
        z = {}, A = {};
      j.container = b;
      j.id = b.id;
      j.getBuffer = function () {
        return k("jwGetBuffer")
      };
      j.getContainer = function () {
        return j.container
      };
      j.addButton = function (a, b, c, d) {
        try {
          A[d] = c, k("jwDockAddButton", a, b, "jwplayer('" + j.id + "').callback('" + d + "')", d)
        } catch (f) {
          g.log("Could not add dock button" + f.message)
        }
      };
      j.removeButton = function (a) {
        k("jwDockRemoveButton", a)
      };
      j.callback = function (a) {
        if (A[a]) A[a]()
      };
      j.forceState = function (a) {
        k("jwForceState", a);
        return j
      };
      j.releaseState = function () {
        return k("jwReleaseState")
      };
      j.getDuration =
        function () {
          return k("jwGetDuration")
        };
      j.getFullscreen = function () {
        return k("jwGetFullscreen")
      };
      j.getHeight = function () {
        return k("jwGetHeight")
      };
      j.getLockState = function () {
        return k("jwGetLockState")
      };
      j.getMeta = function () {
        return j.getItemMeta()
      };
      j.getMute = function () {
        return k("jwGetMute")
      };
      j.getPlaylist = function () {
        var a = k("jwGetPlaylist");
        "flash" == j.renderingMode && g.deepReplaceKeyName(a, ["__dot__", "__spc__", "__dsh__", "__default__"], [".", " ", "-", "default"]);
        return a
      };
      j.getPlaylistItem = function (a) {
        g.exists(a) ||
        (a = j.getPlaylistIndex());
        return j.getPlaylist()[a]
      };
      j.getPlaylistIndex = function () {
        return k("jwGetPlaylistIndex")
      };
      j.getPosition = function () {
        return k("jwGetPosition")
      };
      j.getRenderingMode = function () {
        return j.renderingMode
      };
      j.getState = function () {
        return k("jwGetState")
      };
      j.getVolume = function () {
        return k("jwGetVolume")
      };
      j.getWidth = function () {
        return k("jwGetWidth")
      };
      j.setFullscreen = function (a) {
        g.exists(a) ? k("jwSetFullscreen", a) : k("jwSetFullscreen", !k("jwGetFullscreen"));
        return j
      };
      j.setMute = function (a) {
        g.exists(a) ?
          k("jwSetMute", a) : k("jwSetMute", !k("jwGetMute"));
        return j
      };
      j.lock = function () {
        return j
      };
      j.unlock = function () {
        return j
      };
      j.load = function (a) {
        k("jwLoad", a);
        return j
      };
      j.playlistItem = function (a) {
        k("jwPlaylistItem", parseInt(a, 10));
        return j
      };
      j.playlistPrev = function () {
        k("jwPlaylistPrev");
        return j
      };
      j.playlistNext = function () {
        k("jwPlaylistNext");
        return j
      };
      j.resize = function (a, b) {
        if ("flash" !== j.renderingMode) k("jwResize", a, b); else {
          var d = c.getElementById(j.id + "_wrapper"), f = c.getElementById(j.id + "_aspect");
          f && (f.style.display =
            "none");
          d && (d.style.display = "block", d.style.width = g.styleDimension(a), d.style.height = g.styleDimension(b))
        }
        return j
      };
      j.play = function (b) {
        b === a ? (b = j.getState(), b == d.PLAYING || b == d.BUFFERING ? k("jwPause") : k("jwPlay")) : k("jwPlay", b);
        return j
      };
      j.pause = function (b) {
        b === a ? (b = j.getState(), b == d.PLAYING || b == d.BUFFERING ? k("jwPause") : k("jwPlay")) : k("jwPause", b);
        return j
      };
      j.stop = function () {
        k("jwStop");
        return j
      };
      j.seek = function (a) {
        k("jwSeek", a);
        return j
      };
      j.setVolume = function (a) {
        k("jwSetVolume", a);
        return j
      };
      j.createInstream =
        function () {
          return new m.instream(this, r)
        };
      j.setInstream = function (a) {
        return x = a
      };
      j.loadInstream = function (a, b) {
        x = j.setInstream(j.createInstream()).init(b);
        x.loadItem(a);
        return x
      };
      j.getQualityLevels = function () {
        return k("jwGetQualityLevels")
      };
      j.getCurrentQuality = function () {
        return k("jwGetCurrentQuality")
      };
      j.setCurrentQuality = function (a) {
        k("jwSetCurrentQuality", a)
      };
      j.getCaptionsList = function () {
        return k("jwGetCaptionsList")
      };
      j.getCurrentCaptions = function () {
        return k("jwGetCurrentCaptions")
      };
      j.setCurrentCaptions =
        function (a) {
          k("jwSetCurrentCaptions", a)
        };
      j.getControls = function () {
        return k("jwGetControls")
      };
      j.getSafeRegion = function () {
        return k("jwGetSafeRegion")
      };
      j.setControls = function (a) {
        k("jwSetControls", a)
      };
      j.destroyPlayer = function () {
        k("jwPlayerDestroy")
      };
      j.playAd = function (a) {
        var b = e(j.id).plugins;
        b.vast && b.vast.jwPlayAd(a)
      };
      j.pauseAd = function () {
        var a = e(j.id).plugins;
        a.vast ? a.vast.jwPauseAd() : k("jwPauseAd")
      };
      var y = {
        onBufferChange: f.JWPLAYER_MEDIA_BUFFER,
        onBufferFull: f.JWPLAYER_MEDIA_BUFFER_FULL,
        onError: f.JWPLAYER_ERROR,
        onSetupError: f.JWPLAYER_SETUP_ERROR,
        onFullscreen: f.JWPLAYER_FULLSCREEN,
        onMeta: f.JWPLAYER_MEDIA_META,
        onMute: f.JWPLAYER_MEDIA_MUTE,
        onPlaylist: f.JWPLAYER_PLAYLIST_LOADED,
        onPlaylistItem: f.JWPLAYER_PLAYLIST_ITEM,
        onPlaylistComplete: f.JWPLAYER_PLAYLIST_COMPLETE,
        onReady: f.API_READY,
        onResize: f.JWPLAYER_RESIZE,
        onComplete: f.JWPLAYER_MEDIA_COMPLETE,
        onSeek: f.JWPLAYER_MEDIA_SEEK,
        onTime: f.JWPLAYER_MEDIA_TIME,
        onVolume: f.JWPLAYER_MEDIA_VOLUME,
        onBeforePlay: f.JWPLAYER_MEDIA_BEFOREPLAY,
        onBeforeComplete: f.JWPLAYER_MEDIA_BEFORECOMPLETE,
        onDisplayClick: f.JWPLAYER_DISPLAY_CLICK,
        onControls: f.JWPLAYER_CONTROLS,
        onQualityLevels: f.JWPLAYER_MEDIA_LEVELS,
        onQualityChange: f.JWPLAYER_MEDIA_LEVEL_CHANGED,
        onCaptionsList: f.JWPLAYER_CAPTIONS_LIST,
        onCaptionsChange: f.JWPLAYER_CAPTIONS_CHANGED,
        onAdError: f.JWPLAYER_AD_ERROR,
        onAdClick: f.JWPLAYER_AD_CLICK,
        onAdImpression: f.JWPLAYER_AD_IMPRESSION,
        onAdTime: f.JWPLAYER_AD_TIME,
        onAdComplete: f.JWPLAYER_AD_COMPLETE,
        onAdCompanions: f.JWPLAYER_AD_COMPANIONS,
        onAdSkipped: f.JWPLAYER_AD_SKIPPED
      };
      g.foreach(y, function (a) {
        j[a] =
          l(y[a], n)
      });
      var B = {onBuffer: d.BUFFERING, onPause: d.PAUSED, onPlay: d.PLAYING, onIdle: d.IDLE};
      g.foreach(B, function (a) {
        j[a] = l(B[a], h)
      });
      j.remove = function () {
        if (!v)throw"Cannot call remove() before player is ready";
        w = [];
        m.destroyPlayer(this.id)
      };
      j.setup = function (a) {
        if (e.embed) {
          var b = c.getElementById(j.id);
          b && (a.fallbackDiv = b);
          b = j;
          w = [];
          m.destroyPlayer(b.id);
          b = e(j.id);
          b.config = a;
          (new e.embed(b)).embed();
          return b
        }
        return j
      };
      j.registerPlugin = function (a, b, c, d) {
        e.plugins.registerPlugin(a, b, c, d)
      };
      j.setPlayer = function (a,
                              b) {
        r = a;
        j.renderingMode = b
      };
      j.detachMedia = function () {
        if ("html5" == j.renderingMode)return k("jwDetachMedia")
      };
      j.attachMedia = function (a) {
        if ("html5" == j.renderingMode)return k("jwAttachMedia", a)
      };
      j.removeEventListener = function (a, b) {
        var c = u[a];
        if (c)for (var d = c.length; d--;)c[d] === b && c.splice(d, 1)
      };
      j.dispatchEvent = function (a, b) {
        var c = u[a];
        if (c)for (var c = c.slice(0), d = g.translateEventResponse(a, b), e = 0; e < c.length; e++) {
          var k = c[e];
          if ("function" === typeof k)try {
            a === f.JWPLAYER_PLAYLIST_LOADED && g.deepReplaceKeyName(d.playlist,
              ["__dot__", "__spc__", "__dsh__", "__default__"], [".", " ", "-", "default"]), k.call(this, d)
          } catch (h) {
            g.log("There was an error calling back an event handler")
          }
        }
      };
      j.dispatchInstreamEvent = function (a) {
        x && x.dispatchEvent(a, arguments)
      };
      j.callInternal = k;
      j.playerReady = function (a) {
        v = !0;
        r || j.setPlayer(c.getElementById(a.id));
        j.container = c.getElementById(j.id);
        g.foreach(u, function (a) {
          q(r, a)
        });
        n(f.JWPLAYER_PLAYLIST_ITEM, function () {
          z = {}
        });
        n(f.JWPLAYER_MEDIA_META, function (a) {
          g.extend(z, a.metadata)
        });
        for (j.dispatchEvent(f.API_READY); 0 <
        w.length;)k.apply(this, w.shift())
      };
      j.getItemMeta = function () {
        return z
      };
      j.isBeforePlay = function () {
        return k("jwIsBeforePlay")
      };
      j.isBeforeComplete = function () {
        return k("jwIsBeforeComplete")
      };
      return j
    };
  m.selectPlayer = function (a) {
    var d;
    g.exists(a) || (a = 0);
    a.nodeType ? d = a : "string" == typeof a && (d = c.getElementById(a));
    return d ? (a = m.playerById(d.id)) ? a : m.addPlayer(new m(d)) : "number" == typeof a ? l[a] : null
  };
  m.playerById = function (a) {
    for (var c = 0; c < l.length; c++)if (l[c].id == a)return l[c];
    return null
  };
  m.addPlayer = function (a) {
    for (var c =
      0; c < l.length; c++)if (l[c] == a)return a;
    l.push(a);
    return a
  };
  m.destroyPlayer = function (a) {
    for (var d = -1, f, e = 0; e < l.length; e++)l[e].id == a && (d = e, f = l[e]);
    0 <= d && (a = f.id, e = c.getElementById(a + ("flash" == f.renderingMode ? "_wrapper" : "")), g.clearCss && g.clearCss("#" + a), e && ("html5" == f.renderingMode && f.destroyPlayer(), f = c.createElement("div"), f.id = a, e.parentNode.replaceChild(f, e)), l.splice(d, 1));
    return null
  };
  e.playerReady = function (a) {
    var c = e.api.playerById(a.id);
    c ? c.playerReady(a) : e.api.selectPlayer(a.id).playerReady(a)
  }
}(window.jwplayer),
  function (e) {
    var a = e.events, l = e.utils, g = a.state;
    e.api.instream = function (f, d) {
      function c(a, b) {
        h[a] || (h[a] = [], d.jwInstreamAddEventListener(a, 'function(dat) { jwplayer("' + f.id + '").dispatchInstreamEvent("' + a + '", dat); }'));
        h[a].push(b);
        return this
      }

      function e(b, d) {
        q[b] || (q[b] = [], c(a.JWPLAYER_PLAYER_STATE, function (a) {
          var c = a.newstate, d = a.oldstate;
          if (c == b) {
            var e = q[c];
            if (e)for (var f = 0; f < e.length; f++) {
              var g = e[f];
              "function" == typeof g && g.call(this, {oldstate: d, newstate: c, type: a.type})
            }
          }
        }));
        q[b].push(d);
        return this
      }

      var b, p, h = {}, q = {}, n = this;
      n.type = "instream";
      n.init = function () {
        f.callInternal("jwInitInstream");
        return n
      };
      n.loadItem = function (a, c) {
        b = a;
        p = c || {};
        "array" == l.typeOf(a) ? f.callInternal("jwLoadArrayInstream", b, p) : f.callInternal("jwLoadItemInstream", b, p)
      };
      n.removeEvents = function () {
        h = q = {}
      };
      n.removeEventListener = function (a, b) {
        var c = h[a];
        if (c)for (var d = c.length; d--;)c[d] === b && c.splice(d, 1)
      };
      n.dispatchEvent = function (a, b) {
        var c = h[a];
        if (c)for (var c = c.slice(0), d = l.translateEventResponse(a, b[1]), e = 0; e < c.length; e++) {
          var f =
            c[e];
          "function" == typeof f && f.call(this, d)
        }
      };
      n.onError = function (b) {
        return c(a.JWPLAYER_ERROR, b)
      };
      n.onMediaError = function (b) {
        return c(a.JWPLAYER_MEDIA_ERROR, b)
      };
      n.onFullscreen = function (b) {
        return c(a.JWPLAYER_FULLSCREEN, b)
      };
      n.onMeta = function (b) {
        return c(a.JWPLAYER_MEDIA_META, b)
      };
      n.onMute = function (b) {
        return c(a.JWPLAYER_MEDIA_MUTE, b)
      };
      n.onComplete = function (b) {
        return c(a.JWPLAYER_MEDIA_COMPLETE, b)
      };
      n.onPlaylistComplete = function (b) {
        return c(a.JWPLAYER_PLAYLIST_COMPLETE, b)
      };
      n.onPlaylistItem = function (b) {
        return c(a.JWPLAYER_PLAYLIST_ITEM,
          b)
      };
      n.onTime = function (b) {
        return c(a.JWPLAYER_MEDIA_TIME, b)
      };
      n.onBuffer = function (a) {
        return e(g.BUFFERING, a)
      };
      n.onPause = function (a) {
        return e(g.PAUSED, a)
      };
      n.onPlay = function (a) {
        return e(g.PLAYING, a)
      };
      n.onIdle = function (a) {
        return e(g.IDLE, a)
      };
      n.onClick = function (b) {
        return c(a.JWPLAYER_INSTREAM_CLICK, b)
      };
      n.onInstreamDestroyed = function (b) {
        return c(a.JWPLAYER_INSTREAM_DESTROYED, b)
      };
      n.onAdSkipped = function (b) {
        return c(a.JWPLAYER_AD_SKIPPED, b)
      };
      n.play = function (a) {
        d.jwInstreamPlay(a)
      };
      n.pause = function (a) {
        d.jwInstreamPause(a)
      };
      n.hide = function () {
        f.callInternal("jwInstreamHide")
      };
      n.destroy = function () {
        n.removeEvents();
        f.callInternal("jwInstreamDestroy")
      };
      n.setText = function (a) {
        d.jwInstreamSetText(a ? a : "")
      };
      n.getState = function () {
        return d.jwInstreamState()
      };
      n.setClick = function (a) {
        d.jwInstreamClick && d.jwInstreamClick(a)
      }
    }
  }(window.jwplayer), function (e) {
  var a = e.api, l = a.selectPlayer;
  a.selectPlayer = function (a) {
    return (a = l(a)) ? a : {
        registerPlugin: function (a, d, c) {
          e.plugins.registerPlugin(a, d, c)
        }
      }
  }
}(jwplayer));
