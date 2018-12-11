// 主程序
require('../lib/json2');
require('../lib/md5');
require('../lib/url');
require('../lib/ua-parser');
require('../lib/config');
require('../lib/tiTools');

/**
 * 流量统计系统-客户端信息采集程序
 *
 * 在客户端采集并分析一些信息，如：
 * 基于 UserAgent 分析浏览器品牌、版本号、操作系统(windows Mac iOS Android等)、PC或移动端、移动设备品牌等信息
 * 基于 document.referrer 的来源分析，来源网址，如果是来自搜索引擎，还可以分析搜索关键词等信息
 * 基于 localStorage 或 cookie 记录用户信息，区分新老用户，及用户的停留时间等信息
 *
 * 注意事项：
 * 最好是将加载客户端JS脚本的域名和脚本汇报信息的域名区分开，以便在基于Nginx访问日志进行分析是更加方便。
 * 如加载客户端JS脚本的域名使用 tongji_js.domain.com
 * 汇报普通日志信息的域名使用 tongji_log.domain.com
 * 汇报热力图日志信息的域名使用 tongji_hotmap.domain.com
 * 统计系统普通访问后台的域名使用 tongji.domain.com
 * 统计系统管理后台的域名使用 tongji_admin.domain.com
 *
 *
 */

setTimeout(function () {
    "use strict";
    // 日志提交地址
    var LogSubmitUrl = TjConfig.logSubmitUrl;

    // 用户标识变量名
    var UidName = TjConfig.uidName;

    // 被统计网站的站点ID
    var siteId = TjTools.getSiteId();

    TjConfig.siteId = siteId;

    /*
    *  访问日志待提交数据名词
     os     : 操作系统
     osv    : 操作系统版本
     bs     : 浏览器
     bsv    : 浏览器版本
     ie     : IE6/7/8
     swh    : 分辨率
     ce     : 是否开启cookie，1是 0否
     lg     : 语言
     ft     : 第一次访问时间，单位秒
     rt     : 当次访问时间，单位秒
     j      : 是否支持java
     tit    : 网页标题，注意长度限制
     ref    : Referer，注意长度限制
     wsc    : 颜色
     cp     : 点击统计， [{x: 0, y: 1, u:'url'}]
     cn     : 日志提交次数
     srt    : 来源类型(direct:直接访问  搜索引擎域名:搜索引擎  other:外部链接)
     kw     : 搜索关键词
     egn    : 浏览器引擎
     egv    : 浏览器引擎版本
     vendor : 设备厂商
     model  : 设备型号
     type   : 设备类型（移动 PC 平板等）
     */
    function init() {
        var now = Math.round(new Date / 1000) // 当前时间，单位 秒
        var data
        var engineInfo = TjTools.getSearchEngineInfo();

        if (/(MSIE [678])/i.test(navigator.userAgent)) {
            data = {
                os: 'Windows',
                osv: '6.0',
                bs: 'IE',
                bsv: '6.0',
                swh: screen.width + "," + screen.height,
                ce: cookie.enabled() ? 1 : 0,
                lg: navigator.language,
                ft: now,
                rt: now,
                j: navigator.javaEnabled(),
                tit: document.title,
                ref: document.referrer,
                url: location.href,
                wsc: window.screen.colorDepth || 0,
                cn: 0,
                srt: engineInfo['type'],
                kw: ''
            }
        } else {
            var parser = new window.UAParser()
            var ua = parser.getResult()
            data = {
                os: ua.os.name,
                osv: ua.os.version,
                bs: ua.browser.name,
                bsv: ua.browser.version,
                swh: screen.width + "," + screen.height,
                ce: cookie.enabled() ? 1 : 0,
                lg: navigator.language,
                ft: now,
                rt: now,
                j: navigator.javaEnabled(),
                tit: document.title,
                ref: document.referrer,
                url: location.href,
                wsc: window.screen.colorDepth || 0,
                model: ua.device.model,
                type: ua.device.type,
                vendor: ua.device.vendor,
                egn: ua.engine.name,
                egv: ua.engine.version,
                cn: 0,
                srt: engineInfo['type'],
                kw: TjTools.getSearchKeywords(engineInfo['query'])
            }
        }

        if (/(MSIE 6)/i.test(navigator.userAgent)) {
            data.bsv = '6.0'
            data.ie = 'IE6'
        } else if (/(MSIE 7)/i.test(navigator.userAgent)) {
            data.bsv = '7.0'
            data.ie = 'IE7'
        } else if (/(MSIE 8)/i.test(navigator.userAgent)) {
            data.bsv = '8.0'
            data.ie = 'IE8'
        }

        // 用户访问网站网络性能监控
        data.perf = TjTools.getPerformanceTiming()

        // 首次访问时间
        var __ft = '__ft_' + siteId

        // 当次会话开始时间
        var __rt = '__rt_' + siteId

        // 数据提交次数，也就是当次回话第几次提交数据
        var __cn = '__cn_' + siteId

        var ft = cookie.get(__ft, '')
        var rt = cookie.get(__rt, '')
        var postcount = cookie.get(__cn, 0) || 0
        postcount = parseInt(postcount, 10)
        postcount += 1

        if (ft) {
            data.ft = ft
        } else {
            data.ft = now
            cookie.set(__ft, now, {path: '/', expires: 86400000})
        }

        if (rt) {
            data.rt = rt
        } else {
            data.rt = now
            cookie.set(__rt, now, {path: '/', expires: 86400})
        }

        cookie.set(__cn, postcount, {path: '/', expires: 86400000})

        data.cn = postcount
        var uid = cookie.get(TjConfig.uidName, '')       

        TjTools.submitLog(data,siteId,uid)

    }

    // 需要延迟执行，否则会有些方法等被报未定义错误
    setTimeout(function () {
        init()
    }, 0)

    function cookie() {
        return cookie.get.apply(cookie, arguments)
    }

    cookie.enabled = function () {
        if (navigator.cookieEnabled) return true;
        var ret = cookie.set('_', '_').get('_') === '_';
        cookie.remove('_');
        return ret;
    };

    cookie.set = function (key, value, options) {
        var d;
        options.expires && (d = new Date, d.setTime(d.getTime() + options.expires));
        document.cookie = TjTools.encode(key) + "=" + TjTools.encode(value) + (options.domain ? "; domain=" + options.domain : "") + (options.path ? "; path=" + options.path : "") + (d ? "; expires=" + d.toGMTString() : "") + (options.secure ? "; secure" : "")
    };

    cookie.get = function (a, d) {
        return (a = RegExp("(^| )" + a + "=([^;]*)(;|$)").exec(document.cookie)) ? a[2] : (d || '')
    };
setTimeout(function(){
    "use strict";

    var ua = require('../lib/ua-parser');
   //var url = require('../lib/url');
    var md5 = require('../lib/md5');
//    var config = require('./config');
    var utils = require('./utils');
    var netPref = require('./net-perf');
    var storage = require('./storage');

    // 被统计网站的站点ID
    var SiteId = utils.getSiteId()

    var now = Math.round(new Date / 1000); // 当前时间，单位 秒
    var data;
    var OLD_IE = 0; // 识别低版本IE

    var data = {
        os: 'Windows'
        , osv: '6.0'
        , bs: 'IE'
        , bsv: '6.0'
        , swh: screen.width + "," + screen.height
        , ce: navigator.cookieEnabled ? 1 : 0
        , lg: navigator.language
        , ft: now
        , rt: now
        , j: navigator.javaEnabled()
        , tit: document.title
        , ref: document.referrer
        , url: location.href
        , wsc: window.screen.colorDepth || 0
        , cn: 0
        , srt: utils.getSearchEngineInfo()
    }

    if (/(MSIE [678])/i.test(navigator.userAgent)) {
        if (/(MSIE 8)/i.test(navigator.userAgent)) {
            data.bsv = '8.0'
            data.ie = 'IE8'
            OLD_IE = 8
        } else if (/(MSIE 7)/i.test(navigator.userAgent)) {
            data.bsv = '7.0'
            data.ie = 'IE7'
            OLD_IE = 7
        } else if (/(MSIE 6)/i.test(navigator.userAgent)) {
            data.bsv = '6.0'
            data.ie = 'IE6'
            OLD_IE = 6
        }
    } else {
        data.os = ua.os.name
        data.osv = ua.os.version
        data.bs = ua.browser.name
        data.bsv = ua.browser.version

        data.dvm = ua.device.model
        data.dvt = ua.device.type
        data.dvv = ua.device.vendor

        data.egn = ua.engine.name
        data.egv = ua.engine.version
    }

    // 用户访问网站网络性能监控
    data.perf = netPref()

    // 用户固定身份标识，跨站点相同
    var UID_KEY = '__TONG_JI_UID'
    var UID = storage.get(UID_KEY)
    if (!UID) {
        UID = md5('' + now + Math.random(UID_KEY) + Math.random())
        storage.set(UID_KEY, UID, {expires: 86400 * 365})
    }

    // 回话标识，区分站点
    var SID_KEY ='__TJ_SID_' + SiteId
    var SID = storage.get(SID_KEY)
    if (!SID) {
        SID = md5(SiteId +'_'+ now + Math.random())
    }

    setTimeout(function(){
        storage.set(SID_KEY, SID, {expires: 3600})
    }, 0)

    data.uid = UID
    data.sid = SID

    // 首次访问某站点的时间
    var __ft ='__ft_'+ SiteId

    // 当次会话开始时间
    var __rt ='__rt_'+ SiteId

    var ft = storage.get(__ft)
    var rt = storage.get(__rt)

    if (ft) {
        data.ft = ft
    } else {
        data.ft = now
        storage.set(__ft, now, {expires: 86400 * 365})
    }

    if (rt) {
        data.rt = rt
    } else {
        data.rt = now
        storage.set(__rt, now, {expires: 86400})
    }

    utils.submitLog(data, SiteId)
}, 0);