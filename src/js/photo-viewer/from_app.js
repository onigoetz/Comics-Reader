
window.platform = (function (window, userAgent) {
    var query = function (queryString) {
        var re = /([^&=]+)=([^&]+)/g,
            decodedSpace = /\+/g;

        var result = {},
            m, key, value;

        if (queryString) {
            queryString = queryString.replace(decodedSpace, '%20');

            while ((m = re.exec(queryString))) {
                key = decodeURIComponent( m[1] );
                value = decodeURIComponent( m[2] );
                result[ key ] = value;
            }
        }

        return result;
    }( window.location.href.split('?')[1] );

    var name;

    if (query['_app_platform'] === 'android') {
        name = 'android';
    }
    else if (query['_app_platform'] === 'ios') {
        name = 'ios';
    }
    else if (/\bCPU.*OS (\d+(_\d+)?)/i.exec(userAgent)) {
        name = 'ios';
    }
    else if (/\bAndroid (\d+(\.\d+)?)/.exec(userAgent)) {
        name = 'android';
    }

    return name;
}(window, navigator.userAgent));
