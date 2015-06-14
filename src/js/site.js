
// On desktop computers we don't need touch support
window.touchdevice = (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
if (window.touchdevice && window.PUSH && typeof CustomEvent !== 'undefined') window.PUSH();

var initPhotoSwipeFromDOM = (function() {

    function parseThumbnailElements(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            childElements,
            size,
            item;

        for(var i = 0; i < numNodes; i++) {
            el = thumbElements[i];

            // include only element nodes
            if(el.nodeType !== 1) {
                continue;
            }

            size = el.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: (window.isRetina) ? toRetina(el.getAttribute('data-img')) : el.getAttribute('data-img'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)/*,
                author: el.getAttribute('data-author')*/
            };

            item.el = el; // save link to element for getThumbBoundsFn

            childElements = el.children;
            if(childElements.length > 0) {
                item.msrc = childElements[0].getAttribute('src'); // thumbnail url
            }

            items.push(item);
        }

        return items;
    }

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

        var clickedGallery = clickedListItem.parentNode;

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
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    }

    function openPhotoSwipe(index, galleryElement) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function(index) {
                // See Options->getThumbBoundsFn section of docs for more info
                var thumbnail = items[index].el.children[0],
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            },

            addCaptionHTMLFn: function(item, captionEl, isFake) {
                if(!item.title) {
                    captionEl.children[0].innerText = '';
                    return false;
                }
                captionEl.children[0].innerHTML = item.title +  '<br/><small>Photo: ' + item.author + '</small>';
                return true;
            }
        };

        options.index = parseInt(index, 10);


        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    }

    return function(gallerySelector) {
        // select all gallery elements
        var galleryElements = document.querySelectorAll( gallerySelector );
        for(var i = 0, l = galleryElements.length; i < l; i++) {
            galleryElements[i].setAttribute('data-pswp-uid', i+1);
            galleryElements[i].onclick = onThumbnailsClick;
        }
    };
})();

function loadedPage(event) {
    // Lazy load images
    window.resetImageList();

    // Present the gallery
    initPhotoSwipeFromDOM('ol.gallery li');
}

window.addEventListener('load', loadedPage);
window.addEventListener('push', loadedPage);
