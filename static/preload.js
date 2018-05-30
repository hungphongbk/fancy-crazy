var o = (function (window, document, cookie) {
  var $ = jQuery;

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  $.cachedScript = function (url, options) {
    options = $.extend(options || {}, {
      dataType: "script",
      cache: true,
      url: url
    });
    return $.ajax(options);
  };

  return {
    dev: getCookie('dev') === "1",
    loadCss: function (url) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.type = 'text/css';
      var before = document.getElementsByTagName('link')[0];
      before.parentNode.insertBefore(link, before);
    },
    loadJs: function (url) {
      if (typeof url === 'string') url = [url];
      (function r() {
        if (url.length > 0) $.cachedScript(url.shift()).done(r);
      })();
    }
  };
})(window, document, document.cookie);
