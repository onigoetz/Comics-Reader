/* lazyload.js (c) Lorenzo Giuliani
 * https://css-tricks.com/snippets/javascript/lazy-loading-images/
 * MIT License (http://www.opensource.org/licenses/mit-license.html)
 *
 * expects a list of:
 * `<img src="blank.gif" data-src="my_image.png" width="600" height="400" class="lazy">`
 */

!function(window){
    var images;

    //helper
    function $q(q, res){
        if (document.querySelectorAll) {
            res = document.querySelectorAll(q);
        } else {
            var d=document,
                a=d.styleSheets[0] || d.createStyleSheet();
            a.addRule(q,'f:b');
            for(var l=d.all,b=0,c=[],f=l.length;b<f;b++)
                l[b].currentStyle.f && c.push(l[b]);

            a.removeRule(0);
            res = c;
        }
        return res;
    }

    function loadImage (el, fn) {
        el.src = el.getAttribute('data-src');

        el.classList.remove("lazy");

        if (fn) {
            fn();
        }
    }

    function elementInViewport(el) {
        var threshold = 100;

        var rect = el.getBoundingClientRect();

        var viewportTop = window.pageYOffset || document.documentElement.scrollTop,
            viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
            viewportBottom = viewportTop + viewportHeight;

        var imageTop = rect.top + document.body.scrollTop,
            imageBottom = imageTop + el.offsetHeight;

        return (
            imageBottom >= viewportTop - threshold //Image is already in viewport
            && imageTop <= viewportBottom + threshold //Image will be revealed very soon
        );
    }

    function processScroll(){
        var i = images.length;
        while (i--) {
            if (elementInViewport(images[i])) {
                loadImage(images[i], function () {
                    images.splice(i, i);
                });
            }
        }
    }

    function resetImageList() {
        var i;
        images = [];

        var query = $q('img.lazy');

        // Array.prototype.slice.call is not callable under our lovely IE8
        for (i = 0; i < query.length; i++) {
            images.push(query[i]);
        }

        // Ratchet compatibility
        var contents = $q('.content');
        for (i = 0; i < contents.length; i++) {
            contents[i].addEventListener('scroll', processScroll);
        }

        processScroll();
    }

    resetImageList();

    //Make it ready for the rest
    window.addEventListener('scroll', processScroll);

    window.resetImageList = resetImageList;
}(window);
