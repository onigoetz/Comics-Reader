/**
 * super simple carousel
 * animation between panes happens with css transitions
 */
function Carousel(source) {
    var animation_time = 300;

    var initialized = false;
    var self = this;

    var element = $("#carousel");
    var toolbar = element.find('.carousel-toolbar');
    var hammertime;

    //content
    var images = [];
    var container = element.find(">ul");
    var pane_width = 0;
    var current_pane = null;
    var pane_objects = new CarouselMap();
    var pane_count = 0;

    listPanes(source);

    /*
     * private methods
     ****************************************************************** */

    /**
     * Prepare a list of all the available panes
     */
    function listPanes(source) {
        var i = 0;
        source.each(function () {
            var $this = $(this).data('index', i);
            images[i] = $this.data('img');

            i++;
        });

        source.on('click', function () {
            self.init();

            self.show();

            self.showPane($(this).data('index'), false);
        });
    }

    /**
     * prepare the sliding window for scrolling, add a pane before,
     * a pane after, and removes the useless ones
     */
    function prepareSurroundingPanes() {
        var toKeep = [current_pane];

        //keep previous
        if (current_pane > 0) {
            addBefore(current_pane - 1);
            toKeep.push(current_pane - 1);
        }

        //also load next image
        if (current_pane < images.length) {
            addAfter(current_pane + 1);
            toKeep.push(current_pane + 1);
        }

        //remove useless preloaded images
        cleanPanes(toKeep);
        setPaneDimensions();
        alignCurrentPane(false);
    }

    /**
     * same as prepareSurroundingPanes, but delayed at the end of animations
     */
    var prepareSurroundingPanes_delayed = debounce(prepareSurroundingPanes, animation_time);

    /**
     * remove unused panes
     */
    function cleanPanes(keep) {
        keep = keep || [];
        var key, keys = pane_objects.keys();

        for (var i in pane_objects.keys()) {
            key = keys[i];
            if (keys.hasOwnProperty(i) && !inArray(key, keep)) {
                //delete `key`
                pane_objects.get(key).remove();
                pane_objects.remove(key);
            }
        }
    }

    /**
     * Preload a panel before or after
     */
    function preloadPane(index, where) {
        if (!(index in images)) return; // do nothing if not found

        if (!pane_objects.has(index)) {
            var $li = $('<li></li>')[where](container);
            pane_objects.set(index, new CarouselPane(images[index], $li));
        }

        return pane_objects.get(index);
    }

    /**
     * add a panel at the beginning
     */
    function addBefore(index) {
        return preloadPane(index, 'prependTo');
    }

    /**
     * Add a panel at the end
     */
    function addAfter(index) {
        return preloadPane(index, 'appendTo');
    }

    /**
     * set the pane dimensions and scale the container
     */
    function setPaneDimensions() {
        pane_count = pane_objects.length();
        pane_width = $('body').width();

        //adjust container
        container.width(pane_width*pane_count);

        //adjust panes
        var panes = pane_objects.all();
        for (var i in panes) {
            if (panes.hasOwnProperty(i)) {
                panes[i].value.setWidth(pane_width).fit();
            }
        }
    }

    /**
     * Move the container
     */
    function setContainerOffset(percent, animate) {
        container.removeClass("animate");

        if (animate) {
            container.addClass("animate");
        }

        if (Modernizr.csstransforms3d) {
            container.css({
                "-webkit-transform": "translate3d(" + percent + "%,0,0) scale3d(1,1,1)",
                "transform": "translate3d(" + percent + "%,0,0) scale3d(1,1,1)"
            });
        }
        else if (Modernizr.csstransforms) {
            container.css({
                "-webkit-transform": "translate(" + percent + "%,0)",
                "transform": "translate(" + percent + "%,0)"
            });
        }
        else {
            var px = ((pane_width * pane_count) / 100) * percent;
            container.css("left", px + "px");
        }
    }

    /**
     * Offset of the current active pane in percent
     */
    function currentPaneOffset() {
        var container_width = pane_width * pane_count;

        var current_offset = pane_objects.get(current_pane).offset();
        return -((100 / container_width) * current_offset);
    }

    /**
     * Return to the current offset
     */
    function alignCurrentPane(animate) {
        setContainerOffset(currentPaneOffset(), animate);
    }

    /**
     * Handle touch events
     */
    function handleTouch(ev) {
        // disable browser scrolling
        ev.gesture && ev.gesture.preventDefault();

        switch (ev.type) {
            case 'dragright':
            case 'dragleft':
                // disable browser scrolling
                ev.gesture.preventDefault();

                // stick to the finger
                var pane_offset = currentPaneOffset();
                var drag_offset = ((100 / pane_width) * ev.gesture.deltaX) / pane_count;

                // slow down at the first and last pane
                if ((current_pane === 0 && ev.gesture.direction == "right") ||
                    (current_pane == pane_count - 1 && ev.gesture.direction == "left")) {
                    drag_offset *= 0.4;
                }

                setContainerOffset(drag_offset + pane_offset);
                break;

            case 'swipeleft':
                self.next();
                ev.gesture.stopDetect();
                break;

            case 'swiperight':
                self.prev();
                ev.gesture.stopDetect();
                break;

            case 'release':
                //do nothing if we're in the toolbar
                if ($.contains(toolbar[0], ev.target)) {
                    return true;
                }

                // more then 33% moved, navigate
                if (Math.abs(ev.gesture.deltaX) > pane_width / 3) {
                    if (ev.gesture.direction == 'right') {
                        self.prev();
                    } else {
                        self.next();
                    }
                    return;
                }

                //or realign current pane
                alignCurrentPane(true);

                break;
            case 'tap':
                element.toggleClass('carousel-toolbar-visible');
                break;
        }
    }

    function handleToolbarTouch(ev) {
        var $target = $(ev.target.nodeName == "I" ? ev.target.parentNode : ev.target);
        if ($target.hasClass('close')) self.hide();
        if ($target.hasClass('prev')) self.prev();
        if ($target.hasClass('next')) self.next();
    }

    /*
     * public methods
     ****************************************************************** */

    /**
     * initialize
     */
    this.init = function () {
        if (initialized) {
            return true;
        }
        setPaneDimensions();

        $(window).on("load resize orientationchange", setPaneDimensions);

        hammertime = new Hammer(element.find('ul')[0], { drag_lock_to_axis: true }).on("dragleft dragright release swipeleft swiperight tap", handleTouch);

        element.find('.carousel-button').on('click', handleToolbarTouch);

        initialized = true;
    };

    /**
     * Show pane by index
     *
     * @param index
     * @param animate
     */
    this.showPane = function (index, animate) {
        //is it the first pane shown ? add it
        if (index != current_pane) addAfter(index).show();

        setPaneDimensions();

        // between the bounds
        index = Math.max(0, Math.min(index, images.length - 1));

        current_pane = index;
        alignCurrentPane(animate);

        //Adjust sliding window
        if (animate) {
            prepareSurroundingPanes_delayed();
        } else {
            prepareSurroundingPanes();
        }
    };

    /**
     * Go to next pane
     */
    this.next = function () {
        self.showPane(current_pane + 1, true);
    };

    /**
     * Go back to previous pane
     */
    this.prev = function () {
        self.showPane(current_pane - 1, true);
    };

    /**
     * Show the carousel
     */
    this.show = function () {
        $('body').addClass('carousel-active');
    };

    /**
     * Hide the carousel
     */
    this.hide = function () {
        $('body').removeClass('carousel-active');
    };

    /**
     * Remove all panes to delete the carousel
     */
    this.destroy = function () {
        cleanPanes();
    };
}
