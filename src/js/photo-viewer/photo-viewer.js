


var PhotoViewer = (function (platform) {
	var loaderImg = [
		"data:image/gif;base64,",
		"R0lGODlhEAAQAPIAAAAAAP///zw8PLy8vP///5ycnHx8fGxsbCH+GkNyZWF0ZWQgd2l0aCBhamF4",
		"bG9hZC5pbmZvACH5BAAKAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAAQAAADMwi63P4wyklr",
		"E2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQACgABACwAAAAA",
		"EAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUk",
		"KhIAIfkEAAoAAgAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9",
		"HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkEAAoAAwAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYum",
		"CYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkEAAoABAAsAAAAABAAEAAAAzII",
		"unInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQACgAF",
		"ACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJ",
		"ibufbSlKAAAh+QQACgAGACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFG",
		"xTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAAKAAcALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdce",
		"CAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
	].join('');

	var defaultLoadingElm = (function () {
		var elm = document.createElement('div');
		var s = elm.style;
		s.width = '100%';
		s.height = '100%';
		s.background = 'url(' + loaderImg + ') no-repeat center center';
		return elm;
	}());

	var defaultOpts = {
		// Automatically update the page title as the user swipes through
		// photos?
		automaticTitles: true,
		// Hide the titlebar automatically, using whichever gestures are
		// recognized on the device's native photo viewer.
		autoHideTitle: true,
		// An element used as a placeholder while photos are loading.
		// A duplicate is made each time it is used.
		loadingElm: defaultLoadingElm,
		// Photo index to start at.
		startAt: 0
	};

	return PhotoViewer;

	// PhotoViewer takes over the content pane of your app screen.
	// It wraps SlideViewer for the common case of simply displaying
	// a set of photos in the content of your app.
	function PhotoViewer(page, urls, opts) {
		var self = this;
		var slideviewer;
		var eventBus = new EventBus();
		var content = page; //SGOETZ
		content.setAttribute("data-no-scroll", "true");
		content.style.overflow = 'visible';
		var topbar = document.getElementById('content').querySelector('header'); //SGOETZ
		var title = topbar.querySelector('.title'); //SGOETZ

		var topbarVisible = true;
		var wrapper = document.createElement('div');
		wrapper.style.width = '100%';
		wrapper.style.height = '100%';

		self.on = eventBus.on;
		self.off = eventBus.off;

		function validateArgs() {
			if (!page) throw new TypeError("Page argument required!");
			if (!urls) throw new TypeError("You gave me an empty list of urls, I can't do anything with that!");
			if (!Array.isArray(urls)) {
				throw new TypeError("PhotoViewer setSource expects an array of photo URLs for a source, '" + newSource + "' given.");
			}
			opts = opts || {};
			for (var o in defaultOpts) {
                if (!defaultOpts.hasOwnProperty(o)) continue;
				opts[o] = opts[o] === undefined ? defaultOpts[o] : opts[o];
			}
		}
		validateArgs();

        //ONIGOETZ :: make these publicly available
        self.resize = appLayout;
        self.kill = appBack;

		// Force 3d acceleration of the loading image to avoid flickers
		// on iOS.
		opts.loadingElm.style.webkitBackfaceVisibility = 'hidden';
		replaceChildren(content, opts.loadingElm);

		if (opts.autoHideTitle) {
			Clickable(wrapper);
			wrapper.addEventListener('click', toggleTitleBar, false);
		}

		updateTitle(opts.startAt, urls.length);

		page.addEventListener('appLayout', appLayout, false);
		page.addEventListener('appBack', appBack, false);

        afterAppShow();

		function appLayout() {
			if (!slideviewer) return;
			slideviewer.refreshSize();
			slideviewer.eachMaster(function (elm) {
				var wrap = elm.querySelector('div');
				var img = elm.querySelector('img');
				if (wrap && img) {
					centerImage(wrap, img);
				}
			});
		}

		function appBack() {
			//page.removeEventListener('appShow', appShow, false);
			page.removeEventListener('appShow', afterAppShow, false);
			page.removeEventListener('appLayout', appLayout, false);
			page.removeEventListener('appBack', appBack, false);
			if (!slideviewer) return;

			if (platform === 'android') {
				// Android cannot have any 3d!
				slideviewer.disable3d();
				var elm = slideviewer.curMaster();
				var img = elm.querySelector('img');
				img.style.webkitBackfaceVisibility = '';

				// This clips the image under the titlebar, but is the only
				// way we can seem to avoid flicker when removing 3d from
				// the slideviewer.
				content.style.overflow = 'hidden';
			}
			slideviewer.eachMaster(function (elm, page) {
				if (page !== slideviewer.page()) {
					elm.style.visibility = 'hidden';
				}
			});
		}


		function toggleTitleBar() {
			if (topbarVisible) showTitleBar();
			else hideTitleBar();
		}

		function showTitleBar() {
			if (platform == 'ios') {
				topbar.style.opacity = '1';
				topbar.style.pointerEvents = '';
			} else {
				setTransform(topbar, '');
			}
			topbarVisible = false;
		}

		function hideTitleBar() {
			if (platform == 'ios') {
				topbar.style.opacity = '0';
				topbar.style.pointerEvents = 'none';
			} else {
				setTransform(topbar, 'translate3d(0, -100%, 0)');
			}
			topbarVisible = true;
		}

		function updateTitle(i, len) {
			if (opts.automaticTitles) {
				title.innerText = (i + 1) + " of " + len;
			}
		}

		function afterAppShow() {
			if (platform == 'ios') {
				setTransition(topbar, 'opacity 0.5s ease-in-out 200ms');
			} else {
				setTransition(topbar, 'transform 0.5s ease-in-out 200ms');
			}

			// We don't want to have the slideview in the page when we
			// are transitioning in, as having a 3d transform within a
			// 3d transform makes things really laggy. Hence, we wait
			// until after the app is shown to add the "real" slideview
			// to the page.
			replaceChildren(content, wrapper);

			slideviewer = new PhotoViewer._SlideViewer(wrapper, source, {
				allowScroll: false,
				length: urls.length,
				startAt: opts.startAt,
				bufferDist: 50
			});
			slideviewer.on('flip', onFlip);
			onFlip(opts.startAt, slideviewer.curMaster());

			if (platform == 'ios') {
				slideviewer.on('move', hideTitleBar);
			}

			function source(i) {
				var wrap = document.createElement('div');
				var ws = wrap.style;
				ws.position = 'absolute';
				ws.top = '0px';
				ws.left = '0px';
				ws.width = '100%';
				ws.height = '100%';
				ws.overflow = 'hidden';
				// Android 4.2 occasionally leaves behind artifacts if
				// the wrapper has a transparent background.
				ws.background = 'black';

				var loading = opts.loadingElm.cloneNode(true /* deep copy */);
				wrap.appendChild(loading);

				var img = document.createElement('img');
				img.src = urls[i];

				// Hack to get rid of flickering on images (iPhone bug) by
				// forcing hardware acceleration. See
				// http://stackoverflow.com/questions/3461441/prevent-flicker-on-webkit-transition-of-webkit-transform
				img.style.webkitBackfaceVisibility = 'hidden';

				// For desktop browsers
				img.style.webkitUserSelect = 'none';
				img.style.webkitUserDrag = 'none';

				img.style.margin = '0 auto';
				img.style.display = 'none';

				img.onload = function () {
					centerImage(wrap, img);
					img.style.display = 'block';
					wrap.removeChild(loading);
				};
				wrap.appendChild(img);
				return wrap;
			}

			var zoomable;
			function onFlip(page, elm) {
				updateTitle(page, urls.length);

				if (PhotoViewer._Zoomable.deviceSupported) {
					var wrap = elm.querySelector('div');
					var img = elm.querySelector('img');

					if (zoomable) zoomable.reset().destroy();
					zoomable = new PhotoViewer._Zoomable(wrap, img, slideviewer);
				}

				eventBus.fire('flip', page);
			}
		}

		function centerImage(wrap, img) {
			// I shouldn't really have to do this, but offsetHeight and friends
			// seem to be failing sparadically. Oh well, we can do this manually!
			var h = img.naturalHeight;
			var w = img.naturalWidth;
			var r = h / w;
			var ch = opts.autoHideTitle ? window.innerHeight : content.offsetHeight;
			var cw = content.offsetWidth;

			if (h > ch) {
				h = ch;
				w = h / r;
			}

			if (w > cw) {
				w = cw;
				h = w * r;
			}

			var oh = opts.autoHideTitle ? topbar.offsetHeight : 0;
			var marginTop = round(Math.max((ch - h) / 2, 0));

			var is = img.style;
			is.marginTop = marginTop + 'px';
			is.width = w + 'px';
			is.height = h + 'px';

			var ws = wrap.style;
			ws.width = cw + 'px';
			ws.height = ch + 'px';
			ws.top = -oh + 'px';
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

	function round(num, places) {
		if (places === undefined) places = 0;

		var factor = Math.pow(10, places);
		return Math.round(num * factor) / factor;
	}

	// Removes all children of node, then adds
	// newChild as a child.
	function replaceChildren(node, newChild) {
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
		node.appendChild(newChild);
	}

	function setTransition(elm, val) {
		elm.style.transition = val;
		elm.style.webkitTransition = '-webkit-' + val;
	}

	function setTransform(elm, val) {
		elm.style.transform = val;
		elm.style.webkitTransform = val;
	}
}(window.platform));
