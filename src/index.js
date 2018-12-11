// 主程序
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