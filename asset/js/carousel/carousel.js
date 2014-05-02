/**
 * super simple carousel
 * animation between panes happens with css transitions
 */
function Carousel(source)
{
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
    var current_pane = 0;
	var pane_objects = new CarouselMap();
    var pane_count = listPanes(source);

	/*
	 * private methods
	 ****************************************************************** */

	/**
	 * Prepare a list of all the available panes
	 */
	function listPanes(source) {
		var i = 0;
		source.each(function() {
			var $this = $(this).data('index', i);
			images[i] = $this.data('img');

			i++;
		});

		source.on('tap', function () {
			self.init();

			self.show();

			self.showPane($(this).data('index'), false);
		});

		return i+1;
	}

	/**
	 * prepare the sliding window for scrolling, add a pane before,
	 * a pane after, and removes the useless ones
	 */
	function prepareSurroundingPanes() {
		var toKeep = [current_pane];

		//keep previous
		if(current_pane > 0) {
			addBefore(current_pane-1);
			toKeep.push(current_pane-1);
		}

		//also load next image
		if(current_pane < images.length) {
			addAfter(current_pane+1);
			toKeep.push(current_pane+1);
		}

		//remove useless preloaded images
		cleanPanes(toKeep);
		setPaneDimensions();
		alignCurrentPane(false)
	}

	/**
	 * same as prepareSurroundingPanes, but delayed at the end of animations
	 */
	var prepareSurroundingPanes_delayed = _.debounce(prepareSurroundingPanes, animation_time);

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
	function preloadPane(index, func) {
		if (!index in images) return; // do nothing if not found

		if (!pane_objects.has(index)) {
			var $li = $('<li></li>')[func](container);
			pane_objects.set(index, new CarouselPane(images[index], $li))
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
	    var panes = element.find(">ul>li");
		pane_count = panes.length;
        pane_width = $('body').width();
        panes.each(function() {
            $(this).width(pane_width);
        });
        container.width(pane_width*pane_count);
    }

	/**
	 * Move the container
	 */
    function setContainerOffset(percent, animate) {
        container.removeClass("animate");

        if(animate) {
            container.addClass("animate");
        }

        if(Modernizr.csstransforms3d) {
            container.css({
				"-webkit-transform": "translate3d("+ percent +"%,0,0) scale3d(1,1,1)",
				"transform": "translate3d("+ percent +"%,0,0) scale3d(1,1,1)"
			});
        }
        else if(Modernizr.csstransforms) {
            container.css({
				"-webkit-transform": "translate("+ percent +"%,0)",
				"transform": "translate("+ percent +"%,0)"
			});
        }
        else {
			var px = ((pane_width*pane_count) / 100) * percent;
            container.css("left", px+"px");
        }
    }

	/*
	 * Offset of the current active pane in percent
	 */
	function currentPaneOffset() {
		var container_width = pane_width*pane_count;

		var current_offset = pane_objects.get(current_pane).offset();
        return -((100/container_width)*current_offset);
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
        //console.log(ev);
        // disable browser scrolling
        ev.gesture && ev.gesture.preventDefault();

        switch(ev.type) {
			case 'dragright':
            case 'dragleft':
		        // disable browser scrolling
		        ev.gesture.preventDefault();

		        // stick to the finger
				var pane_offset = currentPaneOffset();
				var drag_offset = ((100/pane_width)*ev.gesture.deltaX) / pane_count;

		        // slow down at the first and last pane
		        if((current_pane == 0 && ev.gesture.direction == "right") ||
		            (current_pane == pane_count-1 && ev.gesture.direction == "left")) {
		            drag_offset *= .4;
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
				if($.contains(toolbar[0], ev.target)) {
					return true;
				}

                // more then 50% moved, navigate
                if(Math.abs(ev.gesture.deltaX) > pane_width/2) {
                    if(ev.gesture.direction == 'right') {
                        self.prev();
                    } else {
                        self.next();
                    }
                }
                else {
                    self.showPane(current_pane, true);
                }
                break;
			case 'tap':
				//console.log('TAP');
				//console.log(ev.gesture);
				if($.contains(toolbar[0], ev.target)) {

					var $target = $(ev.target.nodeName == "I"? ev.target.parentNode : ev.target);

					if ($target.hasClass('close')) self.hide();
					if ($target.hasClass('prev')) self.prev();
					if ($target.hasClass('next')) self.next();

					return true;
				}

				toolbar.toggle();
				break;
		}
	}

	/*
	 * public methods
	 ****************************************************************** */

    /**
     * initial
     */
    this.init = function() {
		if (initialized) {
			return true;
		}
        setPaneDimensions();

        $(window).on("load resize orientationchange", function() {
            setPaneDimensions();
        });

		hammertime = new Hammer(element[0], { drag_lock_to_axis: true }).on("dragleft dragright release swipeleft swiperight tap", handleTouch);

		initialized = true;
    };

    /**
     * show pane by index
     */
    this.showPane = function(index, animate) {
		if(index != current_pane) addAfter(index).show();

		setPaneDimensions();

        // between the bounds
        index = Math.max(0, Math.min(index, images.length-1));

        current_pane = index;
		alignCurrentPane(animate);

		//Adjust sliding window
		if(animate) {
			prepareSurroundingPanes_delayed();
		} else {
			prepareSurroundingPanes();
		}
    };

    this.next = function() { return self.showPane(current_pane+1, true); };
    this.prev = function() { return self.showPane(current_pane-1, true); };

	this.show = function() {
		$('body').addClass('carousel-active');
	};

	this.hide = function() {
		$('body').removeClass('carousel-active');
	};

	/**
	 * Remove all panes to delete the carousel
	 */
	this.destroy = function() {
		cleanPanes();
	}
}
