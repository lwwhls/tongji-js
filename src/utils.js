var md5 = require('../lib/md5');
var url = require('../lib/url');
var config = require('./config');

module.exports = {
    getSiteId: function () {
        var siteId = ''
        var scripts = document.getElementsByTagName("script")
        var el, url, re = /^https?:\/\/([\w\.]+?)\/tongji\.js\?(\w{1,50})$/i

        for (var i = 0; i <= scripts.length - 1; i++) {
            el = scripts[i]
            url = el ? el.src : ''
            if (url) {
                var matchs = url.match(re)
                if (matchs) {
                    siteId = matchs[2]
                    break;
                }
            }
        }
        return siteId
    },
    /*
     * 汇报普通数据
     * data 字符串,需要“&”开头，如 &a=1&b=2
     * */
    submitLog: function (data, siteId, cb) {
        var img = new Image

        img.onload = img.onerror = img.onabort = function () {
            img.onload = img.onerror = img.onabort = null
            img = null
            cb && (typeof cb === 'function') && cb(url)
        }
        this.outLog(config)
        this.outLog(data)
        var _data = encodeURIComponent(JSON.stringify(data))
        var code = md5(config.LogSubmitUrl + siteId + _data)
        var url = config.LogSubmitUrl + '?s=' + siteId + '&c=' + code + '&d=' + _data
        img.src = url
        this.outLog(url)
    },
    /*
     * 获取搜索引擎以及搜索词
     * 来源类型(direct:直接访问  搜索引擎域名:搜索引擎  other:外部链接)
     * 搜索引擎的 搜索词参数
     * 依赖 https://github.com/websanova/js-url 库提供的 url方法
     * */
    getSearchEngineInfo: function () {
        var infoArr = {};
        var ref = document.referrer
        var searchEngines = config.searchEngines
        if (ref) {
            var hostname = url('hostname', ref)
            infoArr['type'] = 'other';
            //infoArr['query'] = '';
            if (searchEngines[hostname]) {
                infoArr['type'] = [searchEngines[hostname]['engine'], hostname];
                //infoArr['query'] = searchEngines[hostname]['query'];
                infoArr['kw'] = this.getSearchKeywords(searchEngines[hostname]['query'])
            }
        } else {
            // 直接访问
            infoArr['type'] = 'direct';
            //infoArr['query'] = '';
        }
        return infoArr;
    },
    /*
     * 获取搜索引擎对应的搜索关键字
     * */
    getSearchKeywords: function (query) {
        var ref = document.referrer;
        var keywords = '其他'
        if (ref && query) {
            eval("var reg = /[?&](" + query + ")=(.+?)(&|$)/ig;");
            var keywordCollection = reg.exec(ref);
            if (keywordCollection != null) {
                keyword = RegExp.$2;
                keyword = decodeURI(keyword);
            }
        }
        keyword = encodeURI(keyword);
        return keywords;
    },
    /*
    loadScript: function (url, cb) {
        var el = document.createElement("script")
        el.charset = "utf-8"

        cb && (typeof cb === 'function') && (el.readyState ? el.onreadystatechange = function () {
            if ("loaded" === el.readyState || "complete" === el.readyState) el.onreadystatechange = s,
                cb()
        } : el.onload = function () {
            cb()
        })

        el.src = url

        var fsel = document.getElementsByTagName("script")[0]
        fsel.parentNode.insertBefore(el, fsel)
    },
    */
    // 汇报热力图等数据
    // data 字符串,需要“&”开头，如 &a=1&b=2
    heatmaplog: function (data, cb) {
        var img = new Image
        img.onload = img.onerror = img.onabort = function () {
            img.onload = img.onerror = img.onabort = null
            img = null
            cb && (typeof cb === 'function') && cb()
        }
        img.src = config.hotMapSubmitUrl + '?site=' + SiteId + '&click=1&data=' + encodeURIComponent(JSON.stringify(data))
    },
    
    // Is the given value an array? Use ES5 Array.isArray if it's available.
    isArray: Array.isArray || function (value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    },

    // Is the given value a plain object / an object whose constructor is `Object`?
    isPlainObject: function (value) {
        return !!value && Object.prototype.toString.call(value) === '[object Object]';
    },

    // Convert an array-like object to an array – for example `arguments`.
    toArray: function (value) {
        return Array.prototype.slice.call(value);
    },

    // Get the keys of an object. Use ES5 Object.keys if it's available.
    getKeys: Object.keys || function (obj) {
        var keys = [],
            key = '';
        for (key in obj) {
            if (obj.hasOwnProperty(key)) keys.push(key);
        }
        return keys;
    },

    // Unlike JavaScript's built-in escape functions, this method
    // only escapes characters that are not allowed in cookies.
    encode: function (value) {
        return String(value).replace(/[,;"\\=\s%]/g, function (character) {
            return encodeURIComponent(character);
        });
    },

    decode: function (value) {
        return decodeURIComponent(value);
    },

    // Return fallback if the value is not defined, otherwise return value.
    retrieve: function (value, fallback) {
        return value == null ? fallback : value;
    },


// 打印日志
    outLog: function (data) {
        if (/(\bdebug\b|^file:)/i.test(location.href) && console) {
            console.log(data)
        }
    }
};
