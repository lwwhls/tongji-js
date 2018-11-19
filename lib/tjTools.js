window.TjTools = {
    getSiteId: function () {
        var siteId = ''
        var scripts = document.getElementsByTagName("script")
        var el, url, re = /^http:\/\/([\w\.]+?)\/index\.js\?(\w{1,50})$/i

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
    submitLog: function (data, siteId, uid, cb) {
        var img = new Image

        img.onload = img.onerror = img.onabort = function () {
            img.onload = img.onerror = img.onabort = null
            img = null
            cb && (typeof cb === 'function') && cb(url)
        }
        //this.outLog(data)
        var _data = encodeURIComponent(JSON.stringify(data))
        var code = md5(TjConfig.logSubmitUrl + siteId + uid + _data)
        var url = TjConfig.logSubmitUrl + '?s=' + siteId + '&u=' + uid + '&c=' + code + '&d=' + _data
        img.src = url
        //this.outLog(url)
    },
    /*
     * 获取搜索引擎以及搜索词
     * 来源类型(direct:直接访问  搜索引擎域名:搜索引擎  other:外部链接)
     * 搜索引擎的 搜索词参数
     * 依赖 https://github.com/websanova/js-url 库提供的 url方法
     * */
    getSearchEngineInfo: function () {
        var infoArr = [];
        var ref = document.referrer
        var searchEngines = TjConfig.searchEngines
        if (ref) {
            var hostname = url('hostname', ref)
            infoArr['type'] = 'other';
            infoArr['query'] = '';
            if (searchEngines[hostname]) {
                infoArr['type'] = searchEngines[hostname]['engine'];
                infoArr['query'] = searchEngines[hostname]['query'];
            }
        } else {
            // 直接访问
            infoArr['type'] = 'direct';
            infoArr['query'] = '';
        }
        return infoArr;
    },
    /*
     * 获取搜索引擎对应的搜索关键字
     * */
    getSearchKeywords: function (query) {

        var ref = document.referrer;

        query = "?" + query;

        var keyword = url(query, ref);
        if(!keyword){
            keyword = 'other'
        }
        keyword =  encodeURI(keyword)
        return keyword;
    },
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
    // 汇报热力图等数据
    // data 字符串,需要“&”开头，如 &a=1&b=2
    heatmaplog: function (data, cb) {
        var img = new Image
        img.onload = img.onerror = img.onabort = function () {
            img.onload = img.onerror = img.onabort = null
            img = null
            cb && (typeof cb === 'function') && cb()
        }
        img.src = TjConfig.hotMapSubmitUrl + '?site=' + SiteId + '&click=1&data=' + encodeURIComponent(JSON.stringify(data))
    },
    getPerformanceTiming: function () {
        var performance = window.performance;

        if (!performance) {
            // 当前浏览器不支持
            // console.log('你的浏览器不支持 performance 接口');
            return;
        }

        var t = performance.timing;
        var times = {};

        //【重要】页面加载完成的时间
        //【原因】这几乎代表了用户等待页面可用的时间
        times.load = t.loadEventEnd - t.navigationStart;

        //【重要】解析 DOM 树结构的时间
        //【原因】反省下你的 DOM 树嵌套是不是太多了！
        times.dr = t.domComplete - t.responseEnd;

        //【重要】重定向的时间
        //【原因】拒绝重定向！比如，http://example.com/ 就不该写成 http://example.com
        times.rr = t.redirectEnd - t.redirectStart;

        //【重要】DNS 查询时间
        //【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
        // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfault.com/a/1190000000633364)
        times.dns = t.domainLookupEnd - t.domainLookupStart;

        //【重要】读取页面第一个字节的时间
        //【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
        // TTFB 即 Time To First Byte 的意思
        // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
        times.ttfb = t.responseStart - t.navigationStart;

        //【重要】内容加载完成的时间
        //【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
        times.req = t.responseEnd - t.requestStart;

        //【重要】执行 onload 回调函数的时间
        //【原因】是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？
        times.le = t.loadEventEnd - t.loadEventStart;

        // DNS 缓存时间
        //times.appcache = t.domainLookupStart - t.fetchStart;

        // 卸载页面的时间
        //times.unloadEvent = t.unloadEventEnd - t.unloadEventStart;

        // TCP 建立连接完成握手的时间
        times.ct = t.connectEnd - t.connectStart;

        return times;
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
    },
};
