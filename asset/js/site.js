var $doc = $(document);
var $content = null;
var carouselInstance = null;

function load_page(url) {
    $('body').addClass('ui-loading');
    $.ajax({
        type: 'GET',
        url: url,
        success: function (content) {
            $doc.trigger('page-hide');

            $content.empty().html(content);

            $doc.trigger('page-show');
        }
    });
}

// When a page is shown
$doc.on("page-show", function (e) {
    var page = $('div.ui-page')
    if (page.hasClass("gallery-page")) {
        carouselInstance = new Carousel(page.find("ol.gallery li"));
    }

    page.find("img.lazy").unveil(100);

    $('body').removeClass('ui-loading');

    return true;
});

//before we remove a page from DOM
$doc.on("page-hide", function (e) {
    if (carouselInstance != null) {
        carouselInstance.destroy();
    }

    return true;
});

//disable default clicks
$doc.on('click', 'a', function () {
    return false;
});

//bind on tap, avoid the 300ms wait on safari
$doc.on('tap', 'a[href]', function () {
    load_page($(this).attr('href'));

    history.pushState(null, null, this.href);

    return false;
});

//when the page is ready
$doc.ready(function () {
    $content = $("#content");
    $doc.trigger('page-show');
});

window.onpopstate = function () {
    load_page(document.location);
};
