/*! 2018 Baidu Inc. All Rights Reserved */

var exports = {}
var startY = 0
var userAgent = navigator.userAgent
exports.ios = (function () {
    console.log(userAgent.toLowerCase());
    var ua = userAgent.toLowerCase();
    if (/ip(hone|od|ad)/.test(userAgent.toLowerCase())) {
        var t = ua.match(/os (\d+)_(\d+)_?(\d+)?/);
        return +[
            parseInt(t[1], 10),
            parseInt(t[2], 10),
            parseInt(t[3] || 0, 10)
        ].join('');
    }
    return 0;
}());
exports.isWeixin = userAgent.indexOf('MicroMessenger') !== -1
exports.isAndroid43 = !!exports.isAndroid && parseFloat(exports.isAndroid[2]) < 4.4
exports.isQQ = /MQQBrowser/.test(userAgent)
exports.isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') < 1 && userAgent.indexOf('baidu') < 1 && !exports.isQQ
exports.isAndroid = (function () {

    return userAgent.match(/(Android);?[\s\/]+([\d.]+)?/);
}());
exports.isUC = (function () {
    return userAgent.match(/ UCBrowser/);
}());
exports.isUC10 = (function () {
    var m = userAgent.match(/UCBrowser\/(\d+(\.d)*)/);
    if (m && m[1]) {
        return m[1] < 11;
    }
    return false;
}());
exports.isPc = (function () {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}());

exports.isSwan = /baiduboxapp/.test(userAgent) && /swan/.test(userAgent)
exports.stopPageExposed = function (ele) {
  ele = ele || document.body
    ele.addEventListener('touchstart', function (e) {
    startY = e.touches[0].clientY
    })
    ele.addEventListener('touchmove', function (e) {
    var top = e.touches[0].clientY - startY > 0
        if (top && ele.scrollTop <= 0) {
      e.preventDefault()
            e.stopPropagation()
        } else if (!top && ele.scrollTop + ele.clientHeight >= ele.scrollHeight) {
      e.preventDefault()
            e.stopPropagation()
        } else {
      e.stopPropagation()
        }
  })
};
var inputPinBottomTimer
var fixHeight = 100
exports.focusFix = function (lite) {
  console.log(exports)
    if (exports.isAndroid && exports.isAndroid.length > 0) {
    return
    }
  var screenH = window.screen.height
    var fixDis = 0
    if (exports.ios === 1000) {
    var msg = lite.getElementsByClassName('qiao-mobile-lite-chat-msg')
        msg.style.minHeight = '200px'
    }
  if (exports.ios > 1030 && (exports.isSafari || exports.isQQ || exports.isWeixin) || exports.isSwan) {
    var rect = lite.getBoundingClientRect()
        if (exports.isSafari) {
      fixDis = 12
        }
    if (exports.ios >= 1112) {
      fixDis = 30
        } else if (exports.ios > 1100) {
      fixDis = 60
            if (exports.isQQ) {
        fixDis = 10
            }
    }
    if (/CriOS/.test(userAgent)) {
      fixDis = 150
        }
    if (exports.isWeixin) {
      fixDis = 150
        }
    if (exports.isSwan) {
      try {
        if (exports.isAndroid && document.body.offsetWidth == 360 && document.body.offsetHeight < 545) {
          fixDis = 70
                } else if (!exports.isAndroid && exports.ios < 1100 && document.body.offsetWidth == 375 && document.body.offsetHeight == 603) {
          fixDis = 70
                } else {
          fixDis = 150
                }
      } catch (error) {
        fixDis = 150
            }
    }
    if (rect.bottom > 0.5 * screenH) {
      lite.style.bottom = '50px'
        }
  }
  exports.fixInput(true)
};
exports.blurFix = function (lite) {
  lite.style.height = '50px'
    //exports.fixInput(false);
};
exports.fixInput = function (isStart) {
  if (!/SogouMobileBrowser/.test(userAgent)) {
    return
    }
  if (!isStart) {
    inputPinBottomTimer = clearTimeout(inputPinBottomTimer)
        return;
  }
  function doPinBottom () {
    var y = window.innerHeight + fixHeight
        if (window.scrollY < y) {
      window.scrollTo(0, y)
        }
    inputPinBottomTimer = setTimeout(doPinBottom, 100)
    }
  doPinBottom()
};
exports.scrollToBottom = function (ele, ct) {
  var maxIos10Safari = exports.ios > 0 && exports.ios <= 1000 && exports.isSafari
    if (maxIos10Safari || exports.ios > 0 && exports.ios < 1000 && /UCBrowser/.test(userAgent)) {
    // noinspection JSAnnotator
    function scroll () {
      if (ct === undefined) {
        return
            }
      var ctHeight = ct.scrollHeight
            var viewHeight = ct.offsetHeight
            var endScrollTop = ctHeight - viewHeight
            var top = endScrollTop
            ct.scrollTop = top < 0 ? 0 : top
        }
    setTimeout(function () {
      scroll()
        }, 0)
    } else {
    ele.scrollIntoView()
    }
}
export {
  exports
}
