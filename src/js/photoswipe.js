
var initGallery = (function() {
    var galleryContent;

    // find nearest parent element
    function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    }

    function onThumbnailsClick(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        var clickedListItem = closest(eTarget, function(el) {
            return el.tagName === 'LI';
        });

        if(!clickedListItem) {
            return;
        }

        var childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) {
                continue;
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }

        if(index >= 0) {
            openPhotoSwipe( index );
        }
        return false;
    }

    function openPhotoSwipe(index) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options;

        options = {
            index: parseInt(index, 10),
            getThumbBoundsFn: function(index) {
                // See Options->getThumbBoundsFn section of docs for more info
                var thumbnail = galleryContent[index].el.children[0],
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }
        };


        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, galleryContent, options);
        gallery.init();
    }

    return function(gallery, items) {
        gallery.onclick = onThumbnailsClick;

        galleryContent = items;
    };
})();
