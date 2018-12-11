module.exports = function () {
    var performance = window.performance;
    var times = {};
    if (!performance) {
        // 当前浏览器不支持
        // console.log('你的浏览器不支持 performance 接口');
        return times;
    }

    var t = performance.timing;

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
    // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfault.com/a/1190000000633364)
    times.dns = t.domainLookupEnd - t.domainLookupStart;

    //【重要】读取页面第一个字节的时间
    //【原因】这可以理解为用户拿到你的资源占用的时间
    // TTFB 即 Time To First Byte 的意思
    // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
    times.ttfb = t.responseStart - t.navigationStart;

    //【重要】内容加载完成的时间
    //【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
    times.req = t.responseEnd - t.requestStart;

    //【重要】执行 onload 回调函数的时间
    //【原因】是否太多不必要的操作都放到 onload 回调函数里执行了，可考虑延迟加载、按需加载的策略
    times.le = t.loadEventEnd - t.loadEventStart;

    // DNS 缓存时间
    //times.appcache = t.domainLookupStart - t.fetchStart;

    // 卸载页面的时间
    //times.unloadEvent = t.unloadEventEnd - t.unloadEventStart;

    // TCP 建立连接完成握手的时间
    times.ct = t.connectEnd - t.connectStart;

    return times;
}