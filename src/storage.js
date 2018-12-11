
module.exports = {
    drive: 'local',

    set: function(key, value, options) {
        return this[this.drive].set(key, value, options)
    },
    
    get: function(key, defaultValue) {
        return this[this.drive].get(key, defaultValue)
    },

    local: {
        set: function (key, value, options)
        {
            var now = Math.round(new Date().getTime() / 1000);
            options.expires = options.expires || 86400;

            var data = {value: value, time: now, expires: options.expires, options: options}

            localStorage.setItem(key, JSON.stringify(data));
        },

        get: function (key, defaultValue)
        {
            var itemValue = localStorage.getItem(key);
            if (!itemValue) {
                return defaultValue
            }

            var data = JSON.parse(itemValue);
            var now = Math.round(new Date().getTime() / 1000);

            if (now - data.time > data.expires) {
                return defaultValue
            } else {
                return data.value;
            }
        }
    },

    cookie: {
        /*
        enabled: function () {
            if (navigator.cookieEnabled) return true;

            //var ret = cookie.set('_', '_').get('_') === '_';
            //cookie.remove('_');
            return false;
        },
        */
        set: function(key, value, options) {
            var d;
            options.expires && (d = new Date, d.setTime(d.getTime() + options.expires * 1000));
            document.cookie = utils.encode(key) + "=" + utils.encode(value) + (options.domain ? "; domain=" + options.domain: "") + (options.path ? "; path=" + options.path: "") + (d ? "; expires=" + d.toGMTString() : "") + (options.secure ? "; secure": "")
        },

        get: function(a, d) {
            return (a = RegExp("(^| )" + a + "=([^;]*)(;|$)").exec(document.cookie)) ? a[2] : (d || '')
        }
    }
}