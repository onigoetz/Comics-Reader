function CarouselPane(src, $li) {
    var shown = false;

    var image = new Image();
    image.src = src;

    this.fit = function() {
        //get info
        var max_width = $li.width(),
            max_height = $li.height(),
            img_width = image.width,
            img_height = image.height;

        //calculate
        var scale_width = max_width / img_width,
            scale_height = max_height / img_height,

            scale = Math.min(scale_width, scale_height),

            width = img_width * scale,
            height = img_height * scale;

        //calculate left/top
        var left = (max_width - width) / 2,
            top = (max_height - height) / 2;

        $(image).css({
            width: width + 'px',
            height: height + 'px',
            left: left + 'px',
            top: top + 'px'
        });
    };

    this.setWidth = function(width) {
        console.log('width', width);
        $li.css('width', width + 'px');
        return this;
    };

    this.offset = function () {
        return $li.position().left;
    };

    this.show = function () {
        if (shown) return;

        $li.append(image);

        window.requestAnimationFrame(this.fit);
        shown = true;
    };

    /*
     * Some mobile browser have a glitch that the memory isn't really
     * freed on content deletion, but a replacement works, so we replace
     * the content of the image by a null image and delete it
     */
    this.remove = function () {
        if (image === null || typeof image === "undefined") {
            return;
        }

        if (image.src.indexOf(this.src) > -1) {
            image.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
            if (!(image.parentNode === null || typeof image.parentNode === "undefined")) {
                $(image).empty().remove();
            }
        }

        $li.remove();
    };

    this.show();
}
