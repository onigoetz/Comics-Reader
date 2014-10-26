PhotoViewer._SlideViewer = (function () {
	var defaultOpts = {
		// Should we allow scrolling in scrollable
		// regions inside or outside of the slideviewer?
		// If set to true, we will ignore all gestures
		// which start off moving more in the y
		// direction than in the x direction.
		allowScroll: true,
		// If your source function is bounded by some
		// known limit, you can set it here.
		length: 10,
		// If you want to start somewhere other than
		// on the first slide, setting this (rather
		// than calling .setPage()) will prevent your
		// source function being called more times
		// than necessary.
		startAt: 0,
		// How far from the point of initial contact does the user
		// have to move their fingers before we interpret their
		// action?
		bufferDist: 10,
		// What should we show to the user when the generator threw
		// an error or returned an invalid output? You can override
		// this when shipping your application, so that in the event
		// something does go wrong in your code, you can show a
		// friendlier error page.
		errorGenerator: defaultErrorGenerator
	};

	// Wrapper is an element which will contain the slideviewer. It should
	// have an explict height (and width, if not display: block) set.
	// Source is a generator function. Given a page index, it should
	// return an element to use as the slide for that page index.
	function SlideViewer(wrapper, source, opts) {
		var self = this;
		var slider;
		var masters = [];
		var activeMaster = 0;
		var xPos = 0;
		var minX = 0;
		var snapThreshold = 0;
		var pageWidth = 0;
		var inputhandler = new InputHandler();

		function validateArgs() {
			if (!isElement(wrapper)) {
				throw new TypeError("SlideViewer first argument should be a DOM node which wraps the slider. Got " + wrapper);
			}
			if (typeof source !== 'function') {
				throw new TypeError("SlideViewer second argument should be a generator function!");
			}

			opts = opts || {};
			for (var opt in defaultOpts) {
				if (defaultOpts.hasOwnProperty(opt) && opts[opt] === undefined) {
					opts[opt] = defaultOpts[opt];
				}
			}
		}
		validateArgs();

		var len = opts.length;
		var page = opts.startAt;

		function init() {
			wrapper.style.postition = 'relative';
			wrapper.innerHTML = '';

			slider = document.createElement('div');
			var s = slider.style;
			s.position = 'relative';
			s.top = '0';
			s.height = '100%';
			s.width = '100%';
			s[prefixStyle('transitionTimingFunction')] = 'ease-out';
			wrapper.appendChild(slider);

			for (var i = -1; i < 2; i++) {
				var page = document.createElement('div');
				s = page.style;
				s.position = 'absolute';
				s.top = '0';
				s.height = '100%';
				s.width = '100%';
				s.left = i * 100 + '%';

				slider.appendChild(page);
				masters.push({elm: page});
			}

			inputhandler.attach(wrapper, slider);
			inputhandler.on('start', onStart);
			inputhandler.on('resize', self.refreshSize);
			eventBus.on('destroy', function () {
				inputhandler.detach();
			});

			self.refreshSize();
			self.setPage(opts.startAt);
		}

		var eventBus = new EventBus();
		self.on = eventBus.on;
		self.off = eventBus.off;

		self.refreshSize = function () {
			pageWidth = wrapper.clientWidth;
			minX = (1 - len) * pageWidth;
			snapThreshold = Math.round(pageWidth * 0.15);
			setTransitionDuration(0);
			setPos(-page * pageWidth);
			return self;
		};

		self.setLen = function (n) {
			len = n;
			self.refreshSize();
			return self;
		};

		self.page = function () {
			return page;
		};

		var prevPage = -1;
		self.setPage = function (newPage) {
			if (typeof newPage !== 'number') {
				throw new TypeError("SlideViewer.setPage() requires a number! ('" + newPage + "' given)");
			}
			function positionMasters(a, b, c) {
				var m = masters;
				var sa = m[a].elm.style;
				var sb = m[b].elm.style;
				var sc = m[c].elm.style;

				sa.left = (page - 1) * 100 + '%';
				if (page === 0) sa.visibility = 'hidden';
				else sa.visibility = 'visible';

				sb.left = page * 100 + '%';
				sb.visibility = 'visible';

				sc.left = (page + 1) * 100 + '%';
				if (page === len - 1) sc.visibility = 'hidden';
				else sc.visibility = 'visible';

				m[a].newPage = page - 1;
				m[b].newPage = page;
				m[c].newPage = page + 1;
			}
			page = clamp(newPage, 0, len - 1);
			setTransitionDuration(0);
			setPos(-page * pageWidth);

			activeMaster = mod(page + 1, 3);

			if (activeMaster === 0) {
				positionMasters(2, 0, 1);
			} else if (activeMaster == 1) {
				positionMasters(0, 1, 2);
			} else {
				positionMasters(1, 2, 0);
			}

			for (var i = 0; i < 3; i++) {
				var m = masters[i];
				if (m.newPage == m.page) continue;

				m.elm.innerHTML = '';
				if (m.newPage >= 0 && m.newPage < opts.length) {
					m.elm.appendChild(getElement(m.newPage));
				}

				m.page = m.newPage;
			}

			if (prevPage !== newPage) {
				eventBus.fire('flip', newPage, masters[activeMaster].elm);
				prevPage = newPage;
			}

			return self;
		};

		self.curMaster = function () {
			for (var i = 0; i < 3; i++) {
				if (masters[i].page == page) return masters[i].elm;
			}
			throw Error("No master is displaying our current page. This is a bug! Current page: " + i + ", masters: " + JSON.serialize(masters));
		};

		self.eachMaster = function (cb) {
			for (var i = 0; i < 3; i++) {
				cb(masters[i].elm, masters[i].page);
			}
		};

		self.invalidate = function () {
			for (var i = 0; i < 3; i++) masters[i].page = -1;
			self.setPage(page);
			return self;
		};

		self.destroy = function () {
			eventBus.fire('destroy');
			return self;
		};

		self.disable = function () {
			inputhandler.disableTouch();
		};

		self.enable = function () {
			inputhandler.enableTouch();
		};

		// Are we actually moving the slideviewer in response
		// to a user's touch currently? Useful for determining
		// what component should handle a touch interaction.
		self.moving = function () {
			return directionLocked;
		};

		// Although this typically makes things slower, it can
		// reduce the occurance of rare bugs, especially bugs
		// relating to the manipulation of the slideviewer
		// element (such as fading it in and out).
		var use3dAcceleration = true;
		self.disable3d = function () {
			use3dAcceleration = false;
			setPos(xPos);
		};

		// Note that 3d is enabled by default. This should only be used in
		// conjuction with the disable3d() method above.
		self.enable3d = function () {
			use3dAcceleration = true;
			setPos(xPos);
		};

		function setPos(x, cb) {
// 			console.log("setting position to ", x);
			var unchanged = x === xPos;
			var transform = prefixStyle('transform');
			xPos = x;
			// translateZ(0) does not affect our appearance, but hints to the
			// renderer that it should hardware accelerate us, and thus makes
			// things much faster and smoother (usually). For reference, see:
			//     http://www.html5rocks.com/en/tutorials/speed/html5/
			if (use3dAcceleration) {
				slider.style[transform] = 'translateX(' + x + 'px) translateZ(0)';
				slider.style.left = '';
			} else {
				slider.style[transform] = '';
				slider.style.left = x + 'px';
			}

			if (cb) {
				if (unchanged || !supportsTransitions) {
					// We don't get a transitionEnd event if
					// 1) The animated property is unchanged, or
					// 2) The browser doesn't support transitions (duh)
					cb();
				} else {
					inputhandler.on('transitionEnd', cb);
				}
			}
		}

		function setTransitionDuration(t) {
			slider.style[prefixStyle('transitionDuration')] = t + 'ms';
		}

		var startedMoving = false;
		var directionLocked = false;
		function onStart(point) {
			inputhandler.off('start');
			inputhandler.on('end', onEndNoMove);

			var startX = point.pageX;
			var startY = point.pageY;
			var prevX = startX;
			var prevY = startY;
			startedMoving = false;
			directionLocked = false;

			setTransitionDuration(0);
			inputhandler.on('move', onMove);

			function onMove(e, point) {
				var dx = point.pageX - prevX;
				prevX = point.pageX;
				prevY = point.pageY;

				var absX = Math.abs(prevX - startX);
				var absY = Math.abs(prevY - startY);

				// We take a buffer to figure out if the swipe
				// was most likely intended for our consumption.
				// (and not just the start of a zoom operation
				// or other gesture).
				if (!startedMoving && absX < opts.bufferDist && absY < opts.bufferDist) {
					return;
				}
				startedMoving = true;

				// We are scrolling vertically, so skip SlideViewer and give the control back to the browser
				if (absY > absX && !directionLocked && opts.allowScroll) {
					inputhandler.off('move');
					inputhandler.off('end');
					inputhandler.on('start', onStart);
					return;
				}
				directionLocked = true;

				var newX = xPos + dx;
				if (newX > 0 || newX < minX) {
					newX = xPos + (dx / 2);
				}

				e.preventDefault();
				inputhandler.off('end').on('end', onEnd);
				setPos(newX);
				eventBus.fire('move', newX);
			}

			function onEnd(point) {
				inputhandler.off('move');
				inputhandler.off('end');

				prevX = point.pageX;
				var deltaX = prevX - startX;
				var dist = Math.abs(deltaX);
				var newX, time;

				if (xPos > 0 || xPos < minX) dist *= 0.15;

				if (dist < snapThreshold) {
					time = Math.floor(300 * dist / snapThreshold);
					setTransitionDuration(time);

					newX = -page * pageWidth;
					setPos(newX, onTransitionEnd);
					return;
				}

				if (deltaX > 0) {
					page = Math.floor(-xPos / pageWidth);
				} else {
					page = Math.ceil(-xPos / pageWidth);
				}

				newX = -page * pageWidth;

				time = Math.floor(200 * Math.abs(xPos - newX) / pageWidth);
				setTransitionDuration(time);

				setPos(newX, onTransitionEnd);
			}

			function onEndNoMove() {
				inputhandler.off('move');
				inputhandler.off('end');
				inputhandler.on('start', onStart);
			}

			function onTransitionEnd() {
				inputhandler.off('transitionEnd');
				self.setPage(page);
				inputhandler.on('start', onStart);
			}
		}

		function getElement(i) {
			var element, err;
			try {
				element = source(i);
			} catch (e) {
				err = Error("Exception returned from source() function with input " + i + ". Message: " + e.message);
				err.original = e;
				return opts.errorGenerator(err);
			}

			// In case they return us a zepto or jQuery
			// object rather than a raw DOM node
			if (!isElement(element) && element.length) {
				element = element[0];
			}

			if (!isElement(element)) {
				err = new TypeError("Invalid type returned from source() function. Got type " + typeof element + " (with value " + element + "), expected HTMLElement. Input was " + i);
				return opts.errorGenerator(err);
			}

			return element;
		}

		init();
	}

	SlideViewer.needsPreventDefaultHack = (function () {
		var match = /\bAndroid (\d+(\.\d+)?)/.exec(navigator.userAgent);
		if (!match) return false;

		var version = parseFloat(match[1]);
		return version < 4.1;
	}());

	function defaultErrorGenerator(err) {
		if (window.console && console.error) {
			if (err.original) {
				console.error(err.original);
				console.log(err.original.stack);
			} else {
				console.error(err);
				console.log(err.stack);
			}
		}
		var elm = document.createElement('p');
		elm.innerHTML = "There was an error creating this page! Contact the developer for more information." +
			"<br><br>" + err.message + "<br><br>" +
			"If you are the developer, this means you made a mistake in your source() function. If you want to ensure users never see this page, you can override opts.errorGenerator to generate a more user-friendly error page.";
		return elm;
	}

	function InputHandler() {
		var self = this;
		var hasTouch = 'ontouchstart' in window;
		var transitionEndMapping = {
			''			: 'transitionend',
			'webkit'	: 'webkitTransitionEnd',
			'Moz'		: 'transitionend',
			'O'			: 'oTransitionEnd',
			'ms'		: 'MSTransitionEnd'
		};

		var transitionEndEvent = transitionEndMapping[vendor];
		var resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize';
		var startEvent  = hasTouch ? 'touchstart'  : 'mousedown';
		var moveEvent   = hasTouch ? 'touchmove'   : 'mousemove';
		var endEvent    = hasTouch ? 'touchend'    : 'mouseup';
		var cancelEvent = hasTouch ? 'touchcancel' : 'mouseout';

		var lastTouch;
		var touchDisabled = false;

		function findTouch(touches, touchID) {
			for (var i = 0; i < touches.length; i++) {
				if (touches[i].identifier == touchID) return touches[i];
			}
			return null;
		}

		function handleEvent(e) {
			var t = e.type;
			if (t == resizeEvent) {
				eventBus.fire('resize', e);
				return;
			} else if (t == transitionEndEvent) {
				eventBus.fire('transitionEnd', e);
				return;
			}

			if ((t === startEvent || t === moveEvent) && SlideViewer.needsPreventDefaultHack) {
				// Kills native scrolling, but lets our slider work properly.
				// See http://code.google.com/p/android/issues/detail?id=19827
				// and http://code.google.com/p/android/issues/detail?id=5491
				e.preventDefault();
			}

			if (touchDisabled) {
				if (hasTouch && t == startEvent) {
					lastTouch = e.changedTouches[0];
				}
				return;
			}

			var touchID = lastTouch ? lastTouch.identifier : '', touch;
			if (t == startEvent) {
				if (hasTouch) {
					if (lastTouch) return;
				   lastTouch = e.changedTouches[0];
				}
				eventBus.fire('start', hasTouch ? e.changedTouches[0] : e);
			} else if (t == moveEvent) {
				if (!hasTouch) {
					eventBus.fire('move', e, e);
					return
				}

				touch = findTouch(e.touches, touchID);
				lastTouch = touch;
				eventBus.fire('move', e, touch);
			} else if (t == cancelEvent || t == endEvent) {
				if (!hasTouch) {
					eventBus.fire('end', e);
					return;
				}

				if (!lastTouch) return;

				touch = findTouch(e.changedTouches, touchID);
				if (!touch) touch = findTouch(e.touches, touchID);

				eventBus.fire('end', touch);
				lastTouch = null;
			}
		}

		var eventBus = new EventBus();
		self.on = eventBus.on;
		self.off = eventBus.off;

		var wrapper;
		var slider;
		self.attach = function (newWrapper, newSlider) {
			if (wrapper || slider) self.detach();
			wrapper = newWrapper;
			slider = newSlider;

			window.addEventListener(resizeEvent, handleEvent, false);
			slider.addEventListener(transitionEndEvent, handleEvent, false);

			wrapper.addEventListener(startEvent , handleEvent, false);
			wrapper.addEventListener(moveEvent  , handleEvent, false);
			wrapper.addEventListener(endEvent   , handleEvent, false);
			wrapper.addEventListener(cancelEvent, handleEvent, false);

			return self;
		};

		self.detach = function () {
			window.removeEventListener(resizeEvent, handleEvent, false);
			slider.removeEventListener(transitionEndEvent, handleEvent, false);

			wrapper.removeEventListener(startEvent , handleEvent, false);
			wrapper.removeEventListener(moveEvent  , handleEvent, false);
			wrapper.removeEventListener(endEvent   , handleEvent, false);
			wrapper.removeEventListener(cancelEvent, handleEvent, false);

			return self;
		};

		// If a touch is currently happening, simulates touchcancel.
		// Prevents further touch events from being processed.
		self.disableTouch = function () {
			if (lastTouch) {
				eventBus.fire('end', lastTouch);
				lastTouch = null;
			}
			touchDisabled = true;
		};

		// Simulates a touchstart if a touch is currently in progress.
		// Otherwise, enables the processing of future touches.
		self.enableTouch = function () {
			if (lastTouch) {
				eventBus.fire('start', lastTouch);
			}
			touchDisabled = false;
		}
	}

	// http://github.com/crazy2be/EventBus.js
	function EventBus() {
		var self = this;
		var callbacks = {};
		self.callbacks = callbacks;

		// remove modifies the list which it is passed,
		// removing all occurances of val.
		function remove(list, val) {
			for (var i = 0; i < list.length; i++) {
				if (list[i] === val) {
					list.splice(i, 1);
				}
			}
		}

		// Register a callback for the specified event. If the
		// callback is already registered for the event, it is
		// not added again.
		self.on = function (ev, cb) {
			var list = callbacks[ev] || [];
			remove(list, cb);
			list.push(cb);
			callbacks[ev] = list;
			return self;
		};

		// Remove a callback for the specified event. If the callback
		// has not been registered, it does not do anything. If the
		// second argument is undefined, it removes all handlers for
		// the specified event.
		self.off = function (ev, cb) {
			if (cb === undefined) {
				delete callbacks[ev];
				return self;
			}
			var list = callbacks[ev];
			if (!list) return self;
			remove(list, cb);
			return self;
		};

		// Fire an event, passing each registered handler all of
		// the specified arguments. Within the handler, this is
		// set to null.
		self.fire = function (ev, arg1, arg2/*, ...*/) {
			var list = callbacks[ev];
			if (!list) return;
			var args = Array.prototype.slice.call(arguments, 1);
			for (var i = 0; i < list.length; i++) {
				list[i].apply(null, args);
			}
			return self;
		}
	}

	var supportsTransitions = false;
	var vendor = (function () {
		var dummyStyle = document.createElement('div').style;
		var vendors = 'webkitT,MozT,msT,OT,t'.split(',');

		for (var i = 0; i < vendors.length; i++) {
			var transform  = vendors[i] + 'ransform';
			var transition = vendors[i] + 'ransition';
			if (transition in dummyStyle) {
				supportsTransitions = true;
			}
			if (transform in dummyStyle) {
				return vendors[i].substr(0, vendors[i].length - 1);
			}
		}

		return false;
	})();

	function prefixStyle(style) {
		if (vendor === '') return style;
		style = style.charAt(0).toUpperCase() + style.substr(1);
		return vendor + style;
	}

	// Mod in javascript is messed up for negative numbers.
	function mod(a, b) {
		return ((a % b) + b) % b;
	}

	function clamp(n, min, max) {
		return Math.max(min, Math.min(max, n));
	}

	function isElement(o) {
		if (typeof HTMLElement === "object") {
			return o instanceof HTMLElement
		} else {
			return o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName === "string"
		}
	}

	return SlideViewer;
}());
