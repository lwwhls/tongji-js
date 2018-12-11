
module.exports = {
   // 访问日志提交地址
   LogSubmitUrl: '//tongji.domain.com/access/',

   // 热力图信息提交地址
   HotmapSubmitUrl: '//tongji.domain.com/hotmap/',

    // 被统计网站的站点ID
    siteId: '',

    //搜索引擎配置
    searchEngines: {
        'www.baidu.com': {
        //    'mainname': '百度',
        //    'maindomain': 'baidu.com',
        //    'webname': '百度',
            'queryword': 'wd',
            'engine': 'baidu',
        },
        'news.baidu.com': {
        //    'mainname': '百度',
        //    'maindomain': 'baidu.com',
        //    'webname': '百度新闻',
            'queryword': 'wd',
            'engine': 'baidu',
        },
        /*
        'image.baidu.com': {
            'mainname': '百度',
            'maindomain': 'baidu.com',
            'webname': '百度图片',
            'queryword': 'word',
            'engine': 'baidu',
        },
        'v.baidu.com': {
            'mainname': '百度',
            'maindomain': 'baidu.com',
            'webname': '百度视频',
            'queryword': 'word',
            'engine': 'baidu',
        },
        'zhidao.baidu.com': {
            'mainname': '百度',
            'maindomain': 'baidu.com',
            'webname': '百度知道',
            'queryword': 'word',
            'engine': 'baidu',
        },
        */
        'www.sogou.com': {
        //   'mainname': '搜狗',
        //   'maindomain': 'sogou.com',
        //   'webname': '搜狗',
            'queryword': 'query',
            'engine': 'sogou',
        },
        'news.sogou.com': {
        //    'mainname': '搜狗',
        //    'maindomain': 'sogou.com',
        //    'webname': '搜狗新闻',
            'queryword': 'query',
            'engine': 'sogou',
        },
        /*
        'pic.sogou.com': {
            'mainname': '搜狗',
            'maindomain': 'sogou.com',
            'webname': '搜狗图片',
            'queryword': 'query',
            'engine': 'sogou',
        },
        'v.sogou.com': {
            'mainname': '搜狗',
            'maindomain': 'sogou.com',
            'webname': '搜狗视频',
            'queryword': 'query',
            'engine': 'sogou',
        },
        'zhihu.sogou.com': {
            'mainname': '搜狗',
            'maindomain': 'sogou.com',
            'webname': '搜狗知乎',
            'queryword': 'query',
            'engine': 'sogou',
        },
        */
        'www.so.com': {
        //    'mainname': '360搜索',
        //    'maindomain': 'so.com',
        //    'webname': '360搜索',
            'queryword': 'q',
            'engine': '360',
        },
        'news.so.com': {
        //    'mainname': '360搜索',
        //    'maindomain': 'so.com',
        //    'webname': ' 360搜索 新闻',
            'queryword': 'q',
            'engine': '360',
        },
        /*
        'image.so.com': {
            'mainname': '360搜索',
            'maindomain': 'so.com',
            'webname': ' 360搜索 图片',
            'queryword': 'q',
            'engine': '360',
        },
        'video.so.com': {
            'mainname': '360搜索',
            'maindomain': 'so.com',
            'webname': '360搜索 视频',
            'queryword': 'q',
            'engine': '360',
        },
        'wenda.so.com': {
            'mainname': '360搜索',
            'maindomain': 'so.com',
            'webname': '360搜索 问答',
            'queryword': 'q',
            'engine': '360',
        },
        'search.yahoo.com': {
            'mainname': 'Yahoo',
            'maindomain': 'yahoo.com',
            'webname': 'Yahoo ',
            'queryword': 'p',
            'engine': 'yahoo',
        },
        'tw.search.yahoo.com': {
            'mainname': 'Yahoo',
            'maindomain': 'tw.search.yahoo.com',
            'webname': 'Yahoo',
            'queryword': 'p',
            'engine': 'yahoo',
        },
        */
        'google.com.hk': {
        //    'mainname': 'Google',
        //    'maindomain': 'google.com.hk',
        //    'webname': 'Google',
            'queryword': 'q',
            'engine': 'google',
        },
        'www.google.com.hk': {
        //    'mainname': 'Google',
        //    'maindomain': 'www.google.com.hk',
        //    'webname': 'Google',
            'queryword': 'q',
            'engine': 'google',
        },
        /*
        'search.114chn.com': {
            'mainname': '中国电信114',
            'maindomain': '114chn.com',
            'webname': '中国电信114',
            'queryword': 'key',
            'engine': '114',
        },
        's.etao.com': {
            'mainname': '一淘搜索',
            'maindomain': 's.etao.com',
            'webname': '一淘搜索',
            'queryword': 'q',
            'engine': 'etao',
        },
        'i.easou.com': {
            'mainname': '宜搜',
            'maindomain': 'easou.com',
            'webname': '宜搜',
            'queryword': 'q',
            'engine': 'easou',
        },
        'www.chinaso.com': {
            'mainname': '中国搜索',
            'maindomain': 'chinaso.com',
            'webname': '中国搜索',
            'queryword': 'q',
            'engine': 'chinaso',
        },
        'news.chinaso.com': {
            'mainname': '中国搜索',
            'maindomain': 'chinaso.com',
            'webname': '中国搜索新闻',
            'queryword': 'q',
            'engine': 'chinaso',
        },
        'video.chinaso.com': {
            'mainname': '中国搜索',
            'maindomain': 'chinaso.com',
            'webname': '中国搜索 视频',
            'queryword': 'q',
            'engine': 'chinaso',
        },
        'image.chinaso.com': {
            'mainname': '中国搜索',
            'maindomain': 'chinaso.com',
            'webname': '中国搜索 图片',
            'queryword': 'q',
            'engine': 'chinaso',
        },
        'gougou.hk': {
            'mainname': '狗狗搜索',
            'maindomain': 'gougou.hk',
            'webname': '狗狗搜索',
            'queryword': 'q',
            'engine': 'gougou',
        },
        */
        'cn.bing.com': {
        //    'mainname': '必应搜索',
        //    'maindomain': 'bing.com',
        //    'webname': '必应搜索',
            'queryword': 'q',
            'engine': 'bing',

        },
        /*
        'so.m.sm.cn': {
            'mainname': '神马搜索',
            'maindomain': 'm.sm.cn',
            'webname': '神马',
            'queryword': 'q',
            'engine': 'sm',

        },
        'm.sm.cn': {
            'mainname': '神马搜索',
            'maindomain': 'm.sm.cn',
            'webname': '神马搜索',
            'queryword': 'q',
            'engine': 'sm',

        }
        */
    }
}