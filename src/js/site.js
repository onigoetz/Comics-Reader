
// On desktop computers we don't need touch support
window.touchdevice = (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);

function image(preset, image) {
    if(!image){
        return "";
    }

    return baseURL + "images/cache/" + preset + "/" + image.replace('#', '%23');
}

function renderHeader(url, data) {
    var head = [];

    var loc = window.location;
    var fullURL = loc.protocol + "//" + loc.host + (loc.port? ":" + loc.port : "") + baseURL;

    if (url != fullURL) {
        head.push(
            <a href={baseURL} className="btn btn-link btn-nav pull-right" data-transition="slide-out">
                <span className="icon icon-home"></span>
            </a>
        );

        url = baseURL;
        var title = "Home";

        if (data.parent) {
            url = baseURL + "list/" + data.parent.path;
            title = data.parent.name;
        }

        head.push(
            <a href={url} className="btn btn-link btn-nav pull-left" data-transition="slide-out">
                <span className="icon icon-left-nav"></span>{title}
            </a>
        );
    }

    head.push(<h1 className="title">{data.title}</h1>);

    return <header className="bar bar-nav">{head}</header>;
}


function is_numeric(mixed_var) {
    var whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
    return (typeof mixed_var === 'number' || (typeof mixed_var === 'string' && whitespace.indexOf(mixed_var.slice(-1)) === -1)) && mixed_var !== '' && !isNaN(mixed_var);
}

function renderList(data) {
    var content = [];
    var currentLetter = '', firstLetter, folder;

    for(var i in data.data) {
        if (data.data.hasOwnProperty(i)) {
            folder = data.data[i];

            firstLetter = folder.name.substring(0, 1).toUpperCase();

            if(is_numeric(firstLetter)) {
                firstLetter = "#";
            }

            if (firstLetter != currentLetter) {
                currentLetter = firstLetter;
                content.push(<li className="table-view-divider">{currentLetter}</li>);
            }

            var cell, url;

            if (folder.type == "tome") {
                url = baseURL + "book/" + folder.path;
            } else {
                url = baseURL + "list/" + folder.path;
            }

            cell = <a href={url} className="navigate-right" data-transition="slide-in">
                <div className="media-body">
                    <img className="media-object pull-left lazy" data-src={image('small', folder.thumb)} width="60" height="75" />
                    {folder.name}
                    {folder.type != "tome"? <p>{folder.count} Tomes</p> : ""}
                </div>
            </a>;

            content.push(<li className="table-view-cell media">{cell}</li>)
        }
    }

    return <div className="content"><ul className="table-view">{content}</ul></div>;
}

function renderBook(data) {
    var photoSwipe = [];

    var book = [], items=[];
    var element, page;

    for (var i in data.book) {
        if (data.book.hasOwnProperty(i)) {
            page = data.book[i];

            var small = image("small", page.src),
                big = window.isRetina ? toRetina(image("big", page.src)) : image("big", page.src);

            element = <li><img data-src={small} className="lazy" /></li>;

            photoSwipe.push({el: element, w: page.width, h: page.height, src: big, msrc: small});
            book.push(element)
        }
    }

    var gallery = <div className="content gallery-page">
        <ol className="gallery">{book}</ol>
    </div>;

    initGallery(gallery, photoSwipe);

    return gallery;
}

window.addEventListener('load', () => {
    // Lazy load images
    window.resetImageList();

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
                h: parseInt(size[1], 10)
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

    var gallery = document.querySelectorAll('ol.gallery')[0];
    initGallery(gallery, parseThumbnailElements(gallery));
});

window.addEventListener('push', () => {
    // Lazy load images
    window.resetImageList();
});
