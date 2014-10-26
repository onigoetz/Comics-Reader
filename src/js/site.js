
window.photoViewer = null;

function viewerOnResize() {
    if (!window.photoViewer) return;
    window.photoViewer.resize();
}

function viewerLoad(page, data) {
    window.photoViewer = new PhotoViewer(page, data.images, {
        startAt: parseInt(data.index, 10)
    });
}

// Listen for orientation and resize changes
window.addEventListener("orientationchange", viewerOnResize, false);
window.addEventListener("resize", viewerOnResize, false);



function loadedPage(event) {
    var page = $('#content > .content');

    // Lazy load images
    page.find("img.lazy").unveil(100);

    // Kill any previous phpto viewer
    if (window.photoViewer) {
        window.photoViewer.kill();
        window.photoViewer = null;
    }

    // Present the gallery
    if (page.hasClass("gallery-page")) {

        var images = [],
            i = 0,
            lis = page.find("ol.gallery li");

        lis.on('tap', function() {
            viewerLoad(page[0], {images: images, index: $(this).data('index')})
        });

        lis.each(function () {
            var $this = $(this);

            $this.data('index', i);
            images[i] = (window.isRetina) ? toRetina($this.data('img')) : $this.data('img');
            i++;
        });
    }
}

$(window).on('load', loadedPage);
window.addEventListener('push', loadedPage);
