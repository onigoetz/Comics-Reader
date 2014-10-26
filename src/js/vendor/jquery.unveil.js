/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

window.isRetina = (function (window) {
    if (window.devicePixelRatio > 1)
        return true;

    var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
  	                  (min--moz-device-pixel-ratio: 1.5),\
  	                  (-o-min-device-pixel-ratio: 3/2),\
  	                  (min-resolution: 1.5dppx)";

    return !!(window.matchMedia && window.matchMedia(mediaQuery).matches);
})(window);

function toRetina(src) {
    return src.replace(/\.\w+$/, function (match) {
        return "@2x" + match;
    })
}

(function ($, isRetina) {
    $.fn.unveil = function (threshold, callback) {
        var $w = $(window),
            th = threshold || 0,
            images = this,
            loaded;

        this.one("unveil", function () {
            var source = this.getAttribute("data-src");

            if (isRetina) {
                source = toRetina(source);
            }

            if (source) {
                this.setAttribute("src", source);
                if (typeof callback === "function") callback.call(this);
            }
        });

        function unveil() {
            var inview = images.filter(function () {
                var $e = $(this);
                if ($e.is(":hidden")) return;

                var wt = $w.scrollTop(),
                    wb = wt + $w.height(),
                    et = $e.offset().top,
                    eb = et + $e.height();

                return eb >= wt - th && et <= wb + th;
            });

            loaded = inview.trigger("unveil");
            images = images.not(loaded);
        }

        $w.scroll(unveil);
        $w.resize(unveil);

        unveil();

        return this;
    };

})(window.jQuery || window.Zepto, window.isRetina);
