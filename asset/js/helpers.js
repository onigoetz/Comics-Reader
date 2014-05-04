/*
 * Some retina functions
 */
window.isRetina = (function (window) {
    if (window.devicePixelRatio > 1)
        return true;

    var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
  	                  (min--moz-device-pixel-ratio: 1.5),\
  	                  (-o-min-device-pixel-ratio: 3/2),\
  	                  (min-resolution: 1.5dppx)";

    if (window.matchMedia && window.matchMedia(mediaQuery).matches)
        return true;

    return false;
})(window);

function toRetina(src) {
    return src.replace(/\.\w+$/, function (match) {
        return "@2x" + match;
    })
}


/*
 * inArray replacement
 */
function inArray(needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (haystack[i] == needle) return true;
    }
    return false;
}

/**
 * requestAnimationFrame and cancel polyfill
 */
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

// click triggers tap
//http://ramin.is/blog/2012/03/04/triggering-zepto-tap-event-using-click/
// only do this if not on a touch device
if (!('ontouchend' in window)) {
    $(document).delegate('body', 'click', function (e) {
        if(!$('body').hasClass('carousel-active')) {
            $(e.target).trigger('tap');
        }
    });
}

_ = {};

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
_.debounce = function (func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};
