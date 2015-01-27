
// On desktop computers we don't need touch support
window.touchdevice = (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
if (window.touchdevice && typeof CustomEvent !== 'undefined') window.PUSH();

window.gallery = null;

function viewerLoad(images, index) {
    var pswpElement = document.querySelectorAll('.pswp')[0];
    var options = {
        index: index
    };

    // Initializes and opens PhotoSwipe
    window.gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, images, options);
    window.gallery.init();
}

function loadedPage(event) {
    var page = $('#content > .content');

    // Lazy load images
    page.find("img.lazy").unveil(100);

    // Present the gallery
    if (page.hasClass("gallery-page")) {

        var images = [],
            i = 0,
            lis = page.find("ol.gallery li");

        lis.on(window.touchdevice? 'tap' : 'click', function() {
            viewerLoad(images, $(this).data('index'))
        });

        lis.each(function () {
            var $this = $(this),
                img = (window.isRetina) ? toRetina($this.data('img')) : $this.data('img');

            $this.data('index', i);
            images[i] = {src:img, w:$this.data('width'), h:$this.data('height')};
            i++;
        });
    }
}

$(window).on('load', loadedPage);
window.addEventListener('push', loadedPage);
