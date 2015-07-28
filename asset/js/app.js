'use strict';

!(function (window) {
    var images;

    //helper
    function $q(q, res) {
        if (document.querySelectorAll) {
            res = document.querySelectorAll(q);
        } else {
            var d = document,
                a = d.styleSheets[0] || d.createStyleSheet();
            a.addRule(q, 'f:b');
            for (var l = d.all, b = 0, c = [], f = l.length; b < f; b++) l[b].currentStyle.f && c.push(l[b]);

            a.removeRule(0);
            res = c;
        }
        return res;
    }

    function loadImage(el, fn) {
        el.src = el.getAttribute('data-src');

        el.classList.remove("lazy");

        if (fn) {
            fn();
        }
    }

    function elementInViewport(el) {
        var threshold = 100;

        var rect = el.getBoundingClientRect();

        var viewportTop = window.pageYOffset || document.documentElement.scrollTop,
            viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
            viewportBottom = viewportTop + viewportHeight;

        var imageTop = rect.top + document.body.scrollTop,
            imageBottom = imageTop + el.offsetHeight;

        return imageBottom >= viewportTop - threshold //Image is already in viewport
         && imageTop <= viewportBottom + threshold //Image will be revealed very soon
        ;
    }

    function processScroll() {
        var i = images.length;
        while (i--) {
            if (elementInViewport(images[i])) {
                loadImage(images[i], function () {
                    images.splice(i, i);
                });
            }
        }
    }

    function resetImageList() {
        var i;
        images = [];

        var query = $q('img.lazy');

        // Array.prototype.slice.call is not callable under our lovely IE8
        for (i = 0; i < query.length; i++) {
            images.push(query[i]);
        }

        // Ratchet compatibility
        var contents = $q('.content');
        for (i = 0; i < contents.length; i++) {
            contents[i].addEventListener('scroll', processScroll);
        }

        processScroll();
    }

    resetImageList();

    //Make it ready for the rest
    window.addEventListener('scroll', processScroll);

    window.resetImageList = resetImageList;
})(window);
/* lazyload.js (c) Lorenzo Giuliani
 * https://css-tricks.com/snippets/javascript/lazy-loading-images/
 * MIT License (http://www.opensource.org/licenses/mit-license.html)
 *
 * expects a list of:
 * `<img src="blank.gif" data-src="my_image.png" width="600" height="400" class="lazy">`
 */
/* ========================================================================
 * Ratchet: push.js v2.0.2
 * http://goratchet.com/components#push
 * ========================================================================
 * inspired by @defunkt's jquery.pjax.js
 * Copyright 2014 Connor Sears
 * Licensed under MIT (https://github.com/twbs/ratchet/blob/master/LICENSE)
 * ======================================================================== */

/* global _gaq: true */

'use strict';

(function () {
    'use strict';

    var noop = function noop() {};

    // Pushstate caching
    // ==================

    var isScrolling;
    var maxCacheLength = 20;
    var cacheMapping = sessionStorage;
    var domCache = {};
    // Change these to unquoted camelcase in the next major version bump
    var transitionMap = {
        'slide-in': 'slide-out',
        'slide-out': 'slide-in',
        fade: 'fade'
    };

    var bars = {
        bartab: '.bar-tab',
        barnav: '.bar-nav',
        barfooter: '.bar-footer',
        barheadersecondary: '.bar-header-secondary'
    };

    var cacheReplace = function cacheReplace(data, updates) {
        PUSH.id = data.id;
        if (updates) {
            data = getCached(data.id);
        }
        cacheMapping[data.id] = JSON.stringify(data);
        window.history.replaceState(data.id, data.title, data.url);
    };

    var cachePush = function cachePush() {
        var id = PUSH.id;

        var cacheForwardStack = JSON.parse(cacheMapping.cacheForwardStack || '[]');
        var cacheBackStack = JSON.parse(cacheMapping.cacheBackStack || '[]');

        cacheBackStack.push(id);

        while (cacheForwardStack.length) {
            delete cacheMapping[cacheForwardStack.shift()];
        }
        while (cacheBackStack.length > maxCacheLength) {
            delete cacheMapping[cacheBackStack.shift()];
        }

        window.history.pushState(null, '', getCached(PUSH.id).url);

        cacheMapping.cacheForwardStack = JSON.stringify(cacheForwardStack);
        cacheMapping.cacheBackStack = JSON.stringify(cacheBackStack);
    };

    var cachePop = function cachePop(id, direction) {
        var forward = direction === 'forward';
        var cacheForwardStack = JSON.parse(cacheMapping.cacheForwardStack || '[]');
        var cacheBackStack = JSON.parse(cacheMapping.cacheBackStack || '[]');
        var pushStack = forward ? cacheBackStack : cacheForwardStack;
        var popStack = forward ? cacheForwardStack : cacheBackStack;

        if (PUSH.id) {
            pushStack.push(PUSH.id);
        }
        popStack.pop();

        cacheMapping.cacheForwardStack = JSON.stringify(cacheForwardStack);
        cacheMapping.cacheBackStack = JSON.stringify(cacheBackStack);
    };

    var getCached = function getCached(id) {
        return JSON.parse(cacheMapping[id] || null) || {};
    };

    var getTarget = function getTarget(e) {
        var target = findTarget(e.target);

        if (!target || e.which > 1 || e.metaKey || e.ctrlKey || isScrolling || location.protocol !== target.protocol || location.host !== target.host || !target.hash && /#/.test(target.href) || target.hash && target.href.replace(target.hash, '') === location.href.replace(location.hash, '') || target.getAttribute('data-ignore') === 'push') {
            return;
        }

        return target;
    };

    // Main event handlers (touchend, popstate)
    // ==========================================

    var touchend = function touchend(e) {
        var target = getTarget(e);

        if (!target) {
            return;
        }

        e.preventDefault();

        PUSH({
            url: target.href,
            hash: target.hash,
            timeout: target.getAttribute('data-timeout'),
            transition: target.getAttribute('data-transition')
        });
    };

    var popstate = function popstate(e) {
        var key;
        var barElement;
        var activeObj;
        var activeDom;
        var direction;
        var transition;
        var transitionFrom;
        var transitionFromObj;
        var id = e.state;

        if (!id || !cacheMapping[id]) {
            return;
        }

        direction = PUSH.id < id ? 'forward' : 'back';

        cachePop(id, direction);

        activeObj = getCached(id);
        activeDom = domCache[id];

        if (activeObj.title) {
            document.title = activeObj.title;
        }

        if (direction === 'back') {
            transitionFrom = JSON.parse(direction === 'back' ? cacheMapping.cacheForwardStack : cacheMapping.cacheBackStack);
            transitionFromObj = getCached(transitionFrom[transitionFrom.length - 1]);
        } else {
            transitionFromObj = activeObj;
        }

        if (direction === 'back' && !transitionFromObj.id) {
            return PUSH.id = id;
        }

        transition = direction === 'back' ? transitionMap[transitionFromObj.transition] : transitionFromObj.transition;

        if (!activeDom) {
            return PUSH({
                id: activeObj.id,
                url: activeObj.url,
                title: activeObj.title,
                timeout: activeObj.timeout,
                transition: transition,
                ignorePush: true
            });
        }

        if (transitionFromObj.transition) {
            activeObj = extendWithDom(activeObj, '.content', activeDom.cloneNode(true));
            for (key in bars) {
                if (bars.hasOwnProperty(key)) {
                    barElement = document.querySelector(bars[key]);
                    if (activeObj[key]) {
                        swapContent(activeObj[key], barElement);
                    } else if (barElement) {
                        barElement.parentNode.removeChild(barElement);
                    }
                }
            }
        }

        swapContent((activeObj.contents || activeDom).cloneNode(true), document.querySelector('.content'), transition, function () {
            triggerStateChange();
        });

        PUSH.id = id;

        document.body.offsetHeight; // force reflow to prevent scroll
    };

    // Core PUSH functionality
    // =======================

    var PUSH = function PUSH(options) {
        var key;
        var xhr = PUSH.xhr;

        options.container = options.container || options.transition ? document.querySelector('.content') : document.body;

        for (key in bars) {
            if (bars.hasOwnProperty(key)) {
                options[key] = options[key] || document.querySelector(bars[key]);
            }
        }

        if (xhr && xhr.readyState < 4) {
            xhr.onreadystatechange = noop;
            xhr.abort();
        }

        xhr = new XMLHttpRequest();
        xhr.open('GET', options.url, true);
        xhr.setRequestHeader('X-PUSH', 'true');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        xhr.onreadystatechange = function () {
            if (options._timeout) {
                clearTimeout(options._timeout);
            }
            if (xhr.readyState === 4) {
                xhr.status === 200 ? success(xhr, options) : failure(options.url);
            }
        };

        if (!PUSH.id) {
            cacheReplace({
                id: +new Date(),
                url: window.location.href,
                title: document.title,
                timeout: options.timeout,
                transition: options.transition
            });
        }

        cacheCurrentContent();

        if (options.timeout) {
            options._timeout = setTimeout(function () {
                xhr.abort('timeout');
            }, options.timeout);
        }

        xhr.send();

        if (xhr.readyState && !options.ignorePush) {
            cachePush();
        }
    };

    function cacheCurrentContent() {
        domCache[PUSH.id] = document.body.cloneNode(true);
    }

    // Main XHR handlers
    // =================

    var success = function success(xhr, options) {
        var key;
        var barElement;
        var data = parseXHR(xhr, options);

        if (!data.contents) {
            return locationReplace(options.url);
        }

        if (data.title) {
            document.title = data.title;
        }

        if (options.transition) {
            for (key in bars) {
                if (bars.hasOwnProperty(key)) {
                    barElement = document.querySelector(bars[key]);
                    if (data[key]) {
                        swapContent(data[key], barElement);
                    } else if (barElement) {
                        barElement.parentNode.removeChild(barElement);
                    }
                }
            }
        }

        swapContent(data.contents, options.container, options.transition, function () {
            cacheReplace({
                id: options.id || +new Date(),
                url: data.url,
                title: data.title,
                timeout: options.timeout,
                transition: options.transition
            }, options.id);
            triggerStateChange();
        });

        if (!options.ignorePush && window._gaq) {
            _gaq.push(['_trackPageview']); // google analytics
        }
        if (!options.hash) {
            return;
        }
    };

    var failure = function failure(url) {
        throw new Error('Could not get: ' + url);
    };

    // PUSH helpers
    // ============

    var swapContent = function swapContent(swap, container, transition, complete) {
        var enter;
        var containerDirection;
        var swapDirection;

        if (!transition) {
            if (container) {
                container.innerHTML = swap.innerHTML;
            } else if (swap.classList.contains('content')) {
                document.body.appendChild(swap);
            } else {
                document.body.insertBefore(swap, document.querySelector('.content'));
            }
        } else {
            enter = /in$/.test(transition);

            if (transition === 'fade') {
                container.classList.add('in');
                container.classList.add('fade');
                swap.classList.add('fade');
            }

            if (/slide/.test(transition)) {
                swap.classList.add('sliding-in', enter ? 'right' : 'left');
                swap.classList.add('sliding');
                container.classList.add('sliding');
            }

            container.parentNode.insertBefore(swap, container);
        }

        if (!transition) {
            complete && complete();
        }

        if (transition === 'fade') {
            container.offsetWidth; // force reflow
            container.classList.remove('in');
            var fadeContainerEnd = function fadeContainerEnd() {
                container.removeEventListener('webkitTransitionEnd', fadeContainerEnd);
                swap.classList.add('in');
                swap.addEventListener('webkitTransitionEnd', fadeSwapEnd);
            };
            var fadeSwapEnd = function fadeSwapEnd() {
                swap.removeEventListener('webkitTransitionEnd', fadeSwapEnd);
                container.parentNode.removeChild(container);
                swap.classList.remove('fade');
                swap.classList.remove('in');
                complete && complete();
            };
            container.addEventListener('webkitTransitionEnd', fadeContainerEnd);
        }

        if (/slide/.test(transition)) {
            var slideEnd = function slideEnd() {
                swap.removeEventListener('webkitTransitionEnd', slideEnd);
                swap.classList.remove('sliding', 'sliding-in');
                swap.classList.remove(swapDirection);
                container.parentNode.removeChild(container);
                complete && complete();
            };

            container.offsetWidth; // force reflow
            swapDirection = enter ? 'right' : 'left';
            containerDirection = enter ? 'left' : 'right';
            container.classList.add(containerDirection);
            swap.classList.remove(swapDirection);
            swap.addEventListener('webkitTransitionEnd', slideEnd);
        }
    };

    var triggerStateChange = function triggerStateChange() {
        var e = new CustomEvent('push', {
            detail: { state: getCached(PUSH.id) },
            bubbles: true,
            cancelable: true
        });

        window.dispatchEvent(e);
    };

    var findTarget = function findTarget(target) {
        var i;
        var toggles = document.querySelectorAll('a');

        for (; target && target !== document; target = target.parentNode) {
            for (i = toggles.length; i--;) {
                if (toggles[i] === target) {
                    return target;
                }
            }
        }
    };

    var locationReplace = function locationReplace(url) {
        window.history.replaceState(null, '', '#');
        window.location.replace(url);
    };

    var extendWithDom = function extendWithDom(obj, fragment, dom) {
        var i;
        var result = {};

        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                result[i] = obj[i];
            }
        }

        Object.keys(bars).forEach(function (key) {
            var el = dom.querySelector(bars[key]);
            if (el) {
                el.parentNode.removeChild(el);
            }
            result[key] = el;
        });

        result.contents = dom.querySelector(fragment);

        return result;
    };

    var parseXHR = function parseXHR(xhr, options) {
        var data = {};
        var responseText = xhr.responseText;

        data.url = options.url;

        if (!responseText) {
            return data;
        }

        var json = JSON.parse(responseText);

        data.title = json.title;

        var barnav = renderHeader(options.url, json);
        var content;

        if (json.book) {
            content = renderBook(json);
        } else {
            content = renderList(json);
        }

        if (options.transition) {
            data.barnav = barnav;
            data.contents = content;
        } else {
            data.contents = React.createElement("div", {}, barnav, content);
        }

        return data;
    };

    // Attach PUSH event handlers
    // ==========================
    if (window.touchdevice) {
        window.addEventListener('touchstart', function () {
            isScrolling = false;
        });
        window.addEventListener('touchmove', function () {
            isScrolling = true;
        });
        window.addEventListener('touchend', touchend);
        window.addEventListener('click', function (e) {
            if (getTarget(e)) {
                e.preventDefault();
            }
        });
    } else {
        window.addEventListener('click', touchend);
    }

    window.addEventListener('popstate', popstate);
    window.PUSH = PUSH;
})();
'use strict';

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.PhotoSwipe = factory();
	}
})(window, function () {

	'use strict';
	var PhotoSwipe = function PhotoSwipe(template, UiClass, items, options) {

		/*>>framework-bridge*/
		/**
   *
   * Set of generic functions used by gallery.
   * 
   * You're free to modify anything here as long as functionality is kept.
   * 
   */
		var framework = {
			features: null,
			bind: function bind(target, type, listener, unbind) {
				var methodName = (unbind ? 'remove' : 'add') + 'EventListener';
				type = type.split(' ');
				for (var i = 0; i < type.length; i++) {
					if (type[i]) {
						target[methodName](type[i], listener, false);
					}
				}
			},
			isArray: function isArray(obj) {
				return obj instanceof Array;
			},
			createEl: function createEl(classes, tag) {
				var el = document.createElement(tag || 'div');
				if (classes) {
					el.className = classes;
				}
				return el;
			},
			getScrollY: function getScrollY() {
				var yOffset = window.pageYOffset;
				return yOffset !== undefined ? yOffset : document.documentElement.scrollTop;
			},
			unbind: function unbind(target, type, listener) {
				framework.bind(target, type, listener, true);
			},
			removeClass: function removeClass(el, className) {
				var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
				el.className = el.className.replace(reg, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
			},
			addClass: function addClass(el, className) {
				if (!framework.hasClass(el, className)) {
					el.className += (el.className ? ' ' : '') + className;
				}
			},
			hasClass: function hasClass(el, className) {
				return el.className && new RegExp('(^|\\s)' + className + '(\\s|$)').test(el.className);
			},
			getChildByClass: function getChildByClass(parentEl, childClassName) {
				var node = parentEl.firstChild;
				while (node) {
					if (framework.hasClass(node, childClassName)) {
						return node;
					}
					node = node.nextSibling;
				}
			},
			arraySearch: function arraySearch(array, value, key) {
				var i = array.length;
				while (i--) {
					if (array[i][key] === value) {
						return i;
					}
				}
				return -1;
			},
			extend: function extend(o1, o2, preventOverwrite) {
				for (var prop in o2) {
					if (o2.hasOwnProperty(prop)) {
						if (preventOverwrite && o1.hasOwnProperty(prop)) {
							continue;
						}
						o1[prop] = o2[prop];
					}
				}
			},
			easing: {
				sine: {
					out: function out(k) {
						return Math.sin(k * (Math.PI / 2));
					},
					inOut: function inOut(k) {
						return -(Math.cos(Math.PI * k) - 1) / 2;
					}
				},
				cubic: {
					out: function out(k) {
						return --k * k * k + 1;
					}
				}
				/*
    	elastic: {
    		out: function ( k ) {
    				var s, a = 0.1, p = 0.4;
    			if ( k === 0 ) return 0;
    			if ( k === 1 ) return 1;
    			if ( !a || a < 1 ) { a = 1; s = p / 4; }
    			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
    			return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );
    			},
    	},
    	back: {
    		out: function ( k ) {
    			var s = 1.70158;
    			return --k * k * ( ( s + 1 ) * k + s ) + 1;
    		}
    	}
    */
			},

			/**
    * 
    * @return {object}
    * 
    * {
    *  raf : request animation frame function
    *  caf : cancel animation frame function
    *  transfrom : transform property key (with vendor), or null if not supported
    *  oldIE : IE8 or below
    * }
    * 
    */
			detectFeatures: function detectFeatures() {
				if (framework.features) {
					return framework.features;
				}
				var helperEl = framework.createEl(),
				    helperStyle = helperEl.style,
				    vendor = '',
				    features = {};

				// IE8 and below
				features.oldIE = document.all && !document.addEventListener;

				features.touch = 'ontouchstart' in window;

				if (window.requestAnimationFrame) {
					features.raf = window.requestAnimationFrame;
					features.caf = window.cancelAnimationFrame;
				}

				features.pointerEvent = navigator.pointerEnabled || navigator.msPointerEnabled;

				// fix false-positive detection of old Android in new IE
				// (IE11 ua string contains "Android 4.0")

				if (!features.pointerEvent) {

					var ua = navigator.userAgent;

					// Detect if device is iPhone or iPod and if it's older than iOS 8
					// http://stackoverflow.com/a/14223920
					//
					// This detection is made because of buggy top/bottom toolbars
					// that don't trigger window.resize event.
					// For more info refer to _isFixedPosition variable in core.js

					if (/iP(hone|od)/.test(navigator.platform)) {
						var v = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
						if (v && v.length > 0) {
							v = parseInt(v[1], 10);
							if (v >= 1 && v < 8) {
								features.isOldIOSPhone = true;
							}
						}
					}

					// Detect old Android (before KitKat)
					// due to bugs related to position:fixed
					// http://stackoverflow.com/questions/7184573/pick-up-the-android-version-in-the-browser-by-javascript

					var match = ua.match(/Android\s([0-9\.]*)/);
					var androidversion = match ? match[1] : 0;
					androidversion = parseFloat(androidversion);
					if (androidversion >= 1) {
						if (androidversion < 4.4) {
							features.isOldAndroid = true; // for fixed position bug & performance
						}
						features.androidVersion = androidversion; // for touchend bug
					}
					features.isMobileOpera = /opera mini|opera mobi/i.test(ua);

					// p.s. yes, yes, UA sniffing is bad, propose your solution for above bugs.
				}

				var styleChecks = ['transform', 'perspective', 'animationName'],
				    vendors = ['', 'webkit', 'Moz', 'ms', 'O'],
				    styleCheckItem,
				    styleName;

				for (var i = 0; i < 4; i++) {
					vendor = vendors[i];

					for (var a = 0; a < 3; a++) {
						styleCheckItem = styleChecks[a];

						// uppercase first letter of property name, if vendor is present
						styleName = vendor + (vendor ? styleCheckItem.charAt(0).toUpperCase() + styleCheckItem.slice(1) : styleCheckItem);

						if (!features[styleCheckItem] && styleName in helperStyle) {
							features[styleCheckItem] = styleName;
						}
					}

					if (vendor && !features.raf) {
						vendor = vendor.toLowerCase();
						features.raf = window[vendor + 'RequestAnimationFrame'];
						if (features.raf) {
							features.caf = window[vendor + 'CancelAnimationFrame'] || window[vendor + 'CancelRequestAnimationFrame'];
						}
					}
				}

				if (!features.raf) {
					var lastTime = 0;
					features.raf = function (fn) {
						var currTime = new Date().getTime();
						var timeToCall = Math.max(0, 16 - (currTime - lastTime));
						var id = window.setTimeout(function () {
							fn(currTime + timeToCall);
						}, timeToCall);
						lastTime = currTime + timeToCall;
						return id;
					};
					features.caf = function (id) {
						clearTimeout(id);
					};
				}

				// Detect SVG support
				features.svg = !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;

				framework.features = features;

				return features;
			}
		};

		framework.detectFeatures();

		// Override addEventListener for old versions of IE
		if (framework.features.oldIE) {

			framework.bind = function (target, type, listener, unbind) {

				type = type.split(' ');

				var methodName = (unbind ? 'detach' : 'attach') + 'Event',
				    evName,
				    _handleEv = function _handleEv() {
					listener.handleEvent.call(listener);
				};

				for (var i = 0; i < type.length; i++) {
					evName = type[i];
					if (evName) {

						if (typeof listener === 'object' && listener.handleEvent) {
							if (!unbind) {
								listener['oldIE' + evName] = _handleEv;
							} else {
								if (!listener['oldIE' + evName]) {
									return false;
								}
							}

							target[methodName]('on' + evName, listener['oldIE' + evName]);
						} else {
							target[methodName]('on' + evName, listener);
						}
					}
				}
			};
		}

		/*>>framework-bridge*/

		/*>>core*/
		//function(template, UiClass, items, options)

		var self = this;

		/**
   * Static vars, don't change unless you know what you're doing.
   */
		var DOUBLE_TAP_RADIUS = 25,
		    NUM_HOLDERS = 3;

		/**
   * Options
   */
		var _options = {
			allowPanToNext: true,
			spacing: 0.12,
			bgOpacity: 1,
			mouseUsed: false,
			loop: true,
			pinchToClose: true,
			closeOnScroll: true,
			closeOnVerticalDrag: true,
			verticalDragRange: 0.75,
			hideAnimationDuration: 333,
			showAnimationDuration: 333,
			showHideOpacity: false,
			focus: true,
			escKey: true,
			arrowKeys: true,
			mainScrollEndFriction: 0.35,
			panEndFriction: 0.35,
			isClickableElement: function isClickableElement(el) {
				return el.tagName === 'A';
			},
			getDoubleTapZoom: function getDoubleTapZoom(isMouseClick, item) {
				if (isMouseClick) {
					return 1;
				} else {
					return item.initialZoomLevel < 0.7 ? 1 : 1.33;
				}
			},
			maxSpreadZoom: 1.33,
			modal: true,

			// not fully implemented yet
			scaleMode: 'fit', // TODO
			alwaysFadeIn: false // TODO
		};
		framework.extend(_options, options);

		/**
   * Private helper variables & functions
   */

		var _getEmptyPoint = function _getEmptyPoint() {
			return { x: 0, y: 0 };
		};

		var _isOpen,
		    _isDestroying,
		    _closedByScroll,
		    _currentItemIndex,
		    _containerStyle,
		    _containerShiftIndex,
		    _currPanDist = _getEmptyPoint(),
		    _startPanOffset = _getEmptyPoint(),
		    _panOffset = _getEmptyPoint(),
		    _upMoveEvents,
		    // drag move, drag end & drag cancel events array
		_downEvents,
		    // drag start events array
		_globalEventHandlers,
		    _viewportSize = {},
		    _currZoomLevel,
		    _startZoomLevel,
		    _translatePrefix,
		    _translateSufix,
		    _updateSizeInterval,
		    _itemsNeedUpdate,
		    _currPositionIndex = 0,
		    _offset = {},
		    _slideSize = _getEmptyPoint(),
		    // size of slide area, including spacing
		_itemHolders,
		    _prevItemIndex,
		    _indexDiff = 0,
		    // difference of indexes since last content update
		_dragStartEvent,
		    _dragMoveEvent,
		    _dragEndEvent,
		    _dragCancelEvent,
		    _transformKey,
		    _pointerEventEnabled,
		    _isFixedPosition = true,
		    _likelyTouchDevice,
		    _modules = [],
		    _requestAF,
		    _cancelAF,
		    _initalClassName,
		    _initalWindowScrollY,
		    _oldIE,
		    _currentWindowScrollY,
		    _features,
		    _windowVisibleSize = {},
		    _renderMaxResolution = false,
		   

		// Registers PhotoSWipe module (History, Controller ...)
		_registerModule = function _registerModule(name, module) {
			framework.extend(self, module.publicMethods);
			_modules.push(name);
		},
		    _getLoopedId = function _getLoopedId(index) {
			var numSlides = _getNumItems();
			if (index > numSlides - 1) {
				return index - numSlides;
			} else if (index < 0) {
				return numSlides + index;
			}
			return index;
		},
		   

		// Micro bind/trigger
		_listeners = {},
		    _listen = function _listen(name, fn) {
			if (!_listeners[name]) {
				_listeners[name] = [];
			}
			return _listeners[name].push(fn);
		},
		    _shout = function _shout(name) {
			var listeners = _listeners[name];

			if (listeners) {
				var args = Array.prototype.slice.call(arguments);
				args.shift();

				for (var i = 0; i < listeners.length; i++) {
					listeners[i].apply(self, args);
				}
			}
		},
		    _getCurrentTime = function _getCurrentTime() {
			return new Date().getTime();
		},
		    _applyBgOpacity = function _applyBgOpacity(opacity) {
			_bgOpacity = opacity;
			self.bg.style.opacity = opacity * _options.bgOpacity;
		},
		    _applyZoomTransform = function _applyZoomTransform(styleObj, x, y, zoom, item) {
			if (!_renderMaxResolution || item && item !== self.currItem) {
				zoom = zoom / (item ? item.fitRatio : self.currItem.fitRatio);
			}

			styleObj[_transformKey] = _translatePrefix + x + 'px, ' + y + 'px' + _translateSufix + ' scale(' + zoom + ')';
		},
		    _applyCurrentZoomPan = function _applyCurrentZoomPan(allowRenderResolution) {
			if (_currZoomElementStyle) {

				if (allowRenderResolution) {
					if (_currZoomLevel > self.currItem.fitRatio) {
						if (!_renderMaxResolution) {
							_setImageSize(self.currItem, false, true);
							_renderMaxResolution = true;
						}
					} else {
						if (_renderMaxResolution) {
							_setImageSize(self.currItem);
							_renderMaxResolution = false;
						}
					}
				}

				_applyZoomTransform(_currZoomElementStyle, _panOffset.x, _panOffset.y, _currZoomLevel);
			}
		},
		    _applyZoomPanToItem = function _applyZoomPanToItem(item) {
			if (item.container) {

				_applyZoomTransform(item.container.style, item.initialPosition.x, item.initialPosition.y, item.initialZoomLevel, item);
			}
		},
		    _setTranslateX = function _setTranslateX(x, elStyle) {
			elStyle[_transformKey] = _translatePrefix + x + 'px, 0px' + _translateSufix;
		},
		    _moveMainScroll = function _moveMainScroll(x, dragging) {

			if (!_options.loop && dragging) {
				// if of current item during scroll (float)
				var newSlideIndexOffset = _currentItemIndex + (_slideSize.x * _currPositionIndex - x) / _slideSize.x;
				var delta = Math.round(x - _mainScrollPos.x);

				if (newSlideIndexOffset < 0 && delta > 0 || newSlideIndexOffset >= _getNumItems() - 1 && delta < 0) {
					x = _mainScrollPos.x + delta * _options.mainScrollEndFriction;
				}
			}

			_mainScrollPos.x = x;
			_setTranslateX(x, _containerStyle);
		},
		    _calculatePanOffset = function _calculatePanOffset(axis, zoomLevel) {
			var m = _midZoomPoint[axis] - _offset[axis];
			return _startPanOffset[axis] + _currPanDist[axis] + m - m * (zoomLevel / _startZoomLevel);
		},
		    _equalizePoints = function _equalizePoints(p1, p2) {
			p1.x = p2.x;
			p1.y = p2.y;
			if (p2.id) {
				p1.id = p2.id;
			}
		},
		    _roundPoint = function _roundPoint(p) {
			p.x = Math.round(p.x);
			p.y = Math.round(p.y);
		},
		    _mouseMoveTimeout = null,
		    _onFirstMouseMove = function _onFirstMouseMove() {
			// Wait until mouse move event is fired at least twice during 100ms
			// We do this, because some mobile browsers trigger it on touchstart
			if (_mouseMoveTimeout) {
				framework.unbind(document, 'mousemove', _onFirstMouseMove);
				framework.addClass(template, 'pswp--has_mouse');
				_options.mouseUsed = true;
				_shout('mouseUsed');
			}
			_mouseMoveTimeout = setTimeout(function () {
				_mouseMoveTimeout = null;
			}, 100);
		},
		    _bindEvents = function _bindEvents() {
			framework.bind(document, 'keydown', self);

			if (_features.transform) {
				// don't bind click event in browsers that don't support transform (mostly IE8)
				framework.bind(self.scrollWrap, 'click', self);
			}

			if (!_options.mouseUsed) {
				framework.bind(document, 'mousemove', _onFirstMouseMove);
			}

			framework.bind(window, 'resize scroll', self);

			_shout('bindEvents');
		},
		    _unbindEvents = function _unbindEvents() {
			framework.unbind(window, 'resize', self);
			framework.unbind(window, 'scroll', _globalEventHandlers.scroll);
			framework.unbind(document, 'keydown', self);
			framework.unbind(document, 'mousemove', _onFirstMouseMove);

			if (_features.transform) {
				framework.unbind(self.scrollWrap, 'click', self);
			}

			if (_isDragging) {
				framework.unbind(window, _upMoveEvents, self);
			}

			_shout('unbindEvents');
		},
		    _calculatePanBounds = function _calculatePanBounds(zoomLevel, update) {
			var bounds = _calculateItemSize(self.currItem, _viewportSize, zoomLevel);
			if (update) {
				_currPanBounds = bounds;
			}
			return bounds;
		},
		    _getMinZoomLevel = function _getMinZoomLevel(item) {
			if (!item) {
				item = self.currItem;
			}
			return item.initialZoomLevel;
		},
		    _getMaxZoomLevel = function _getMaxZoomLevel(item) {
			if (!item) {
				item = self.currItem;
			}
			return item.w > 0 ? _options.maxSpreadZoom : 1;
		},
		   

		// Return true if offset is out of the bounds
		_modifyDestPanOffset = function _modifyDestPanOffset(axis, destPanBounds, destPanOffset, destZoomLevel) {
			if (destZoomLevel === self.currItem.initialZoomLevel) {
				destPanOffset[axis] = self.currItem.initialPosition[axis];
				return true;
			} else {
				destPanOffset[axis] = _calculatePanOffset(axis, destZoomLevel);

				if (destPanOffset[axis] > destPanBounds.min[axis]) {
					destPanOffset[axis] = destPanBounds.min[axis];
					return true;
				} else if (destPanOffset[axis] < destPanBounds.max[axis]) {
					destPanOffset[axis] = destPanBounds.max[axis];
					return true;
				}
			}
			return false;
		},
		    _setupTransforms = function _setupTransforms() {

			if (_transformKey) {
				// setup 3d transforms
				var allow3dTransform = _features.perspective && !_likelyTouchDevice;
				_translatePrefix = 'translate' + (allow3dTransform ? '3d(' : '(');
				_translateSufix = _features.perspective ? ', 0px)' : ')';
				return;
			}

			// Override zoom/pan/move functions in case old browser is used (most likely IE)
			// (so they use left/top/width/height, instead of CSS transform)

			_transformKey = 'left';
			framework.addClass(template, 'pswp--ie');

			_setTranslateX = function (x, elStyle) {
				elStyle.left = x + 'px';
			};
			_applyZoomPanToItem = function (item) {

				var zoomRatio = item.fitRatio > 1 ? 1 : item.fitRatio,
				    s = item.container.style,
				    w = zoomRatio * item.w,
				    h = zoomRatio * item.h;

				s.width = w + 'px';
				s.height = h + 'px';
				s.left = item.initialPosition.x + 'px';
				s.top = item.initialPosition.y + 'px';
			};
			_applyCurrentZoomPan = function () {
				if (_currZoomElementStyle) {

					var s = _currZoomElementStyle,
					    item = self.currItem,
					    zoomRatio = item.fitRatio > 1 ? 1 : item.fitRatio,
					    w = zoomRatio * item.w,
					    h = zoomRatio * item.h;

					s.width = w + 'px';
					s.height = h + 'px';

					s.left = _panOffset.x + 'px';
					s.top = _panOffset.y + 'px';
				}
			};
		},
		    _onKeyDown = function _onKeyDown(e) {
			var keydownAction = '';
			if (_options.escKey && e.keyCode === 27) {
				keydownAction = 'close';
			} else if (_options.arrowKeys) {
				if (e.keyCode === 37) {
					keydownAction = 'prev';
				} else if (e.keyCode === 39) {
					keydownAction = 'next';
				}
			}

			if (keydownAction) {
				// don't do anything if special key pressed to prevent from overriding default browser actions
				// e.g. in Chrome on Mac cmd+arrow-left returns to previous page
				if (!e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
					if (e.preventDefault) {
						e.preventDefault();
					} else {
						e.returnValue = false;
					}
					self[keydownAction]();
				}
			}
		},
		    _onGlobalClick = function _onGlobalClick(e) {
			if (!e) {
				return;
			}

			// don't allow click event to pass through when triggering after drag or some other gesture
			if (_moved || _zoomStarted || _mainScrollAnimating || _verticalDragInitiated) {
				e.preventDefault();
				e.stopPropagation();
			}
		},
		    _updatePageScrollOffset = function _updatePageScrollOffset() {
			self.setScrollOffset(0, framework.getScrollY());
		};

		// Micro animation engine
		var _animations = {},
		    _numAnimations = 0,
		    _stopAnimation = function _stopAnimation(name) {
			if (_animations[name]) {
				if (_animations[name].raf) {
					_cancelAF(_animations[name].raf);
				}
				_numAnimations--;
				delete _animations[name];
			}
		},
		    _registerStartAnimation = function _registerStartAnimation(name) {
			if (_animations[name]) {
				_stopAnimation(name);
			}
			if (!_animations[name]) {
				_numAnimations++;
				_animations[name] = {};
			}
		},
		    _stopAllAnimations = function _stopAllAnimations() {
			for (var prop in _animations) {

				if (_animations.hasOwnProperty(prop)) {
					_stopAnimation(prop);
				}
			}
		},
		    _animateProp = function _animateProp(name, b, endProp, d, easingFn, onUpdate, onComplete) {
			var startAnimTime = _getCurrentTime(),
			    t;
			_registerStartAnimation(name);

			var animloop = function animloop() {
				if (_animations[name]) {

					t = _getCurrentTime() - startAnimTime; // time diff
					//b - beginning (start prop)
					//d - anim duration

					if (t >= d) {
						_stopAnimation(name);
						onUpdate(endProp);
						if (onComplete) {
							onComplete();
						}
						return;
					}
					onUpdate((endProp - b) * easingFn(t / d) + b);

					_animations[name].raf = _requestAF(animloop);
				}
			};
			animloop();
		};

		var publicMethods = {

			// make a few local variables and functions public
			shout: _shout,
			listen: _listen,
			viewportSize: _viewportSize,
			options: _options,

			isMainScrollAnimating: function isMainScrollAnimating() {
				return _mainScrollAnimating;
			},
			getZoomLevel: function getZoomLevel() {
				return _currZoomLevel;
			},
			getCurrentIndex: function getCurrentIndex() {
				return _currentItemIndex;
			},
			isDragging: function isDragging() {
				return _isDragging;
			},
			isZooming: function isZooming() {
				return _isZooming;
			},
			setScrollOffset: function setScrollOffset(x, y) {
				_offset.x = x;
				_currentWindowScrollY = _offset.y = y;
				_shout('updateScrollOffset', _offset);
			},
			applyZoomPan: function applyZoomPan(zoomLevel, panX, panY, allowRenderResolution) {
				_panOffset.x = panX;
				_panOffset.y = panY;
				_currZoomLevel = zoomLevel;
				_applyCurrentZoomPan(allowRenderResolution);
			},

			init: function init() {

				if (_isOpen || _isDestroying) {
					return;
				}

				var i;

				self.framework = framework; // basic function
				self.template = template; // root DOM element of PhotoSwipe
				self.bg = framework.getChildByClass(template, 'pswp__bg');

				_initalClassName = template.className;
				_isOpen = true;

				_features = framework.detectFeatures();
				_requestAF = _features.raf;
				_cancelAF = _features.caf;
				_transformKey = _features.transform;
				_oldIE = _features.oldIE;

				self.scrollWrap = framework.getChildByClass(template, 'pswp__scroll-wrap');
				self.container = framework.getChildByClass(self.scrollWrap, 'pswp__container');

				_containerStyle = self.container.style; // for fast access

				// Objects that hold slides (there are only 3 in DOM)
				self.itemHolders = _itemHolders = [{ el: self.container.children[0], wrap: 0, index: -1 }, { el: self.container.children[1], wrap: 0, index: -1 }, { el: self.container.children[2], wrap: 0, index: -1 }];

				// hide nearby item holders until initial zoom animation finishes (to avoid extra Paints)
				_itemHolders[0].el.style.display = _itemHolders[2].el.style.display = 'none';

				_setupTransforms();

				// Setup global events
				_globalEventHandlers = {
					resize: self.updateSize,
					scroll: _updatePageScrollOffset,
					keydown: _onKeyDown,
					click: _onGlobalClick
				};

				// disable show/hide effects on old browsers that don't support CSS animations or transforms,
				// old IOS, Android and Opera mobile. Blackberry seems to work fine, even older models.
				var oldPhone = _features.isOldIOSPhone || _features.isOldAndroid || _features.isMobileOpera;
				if (!_features.animationName || !_features.transform || oldPhone) {
					_options.showAnimationDuration = _options.hideAnimationDuration = 0;
				}

				// init modules
				for (i = 0; i < _modules.length; i++) {
					self['init' + _modules[i]]();
				}

				// init
				if (UiClass) {
					var ui = self.ui = new UiClass(self, framework);
					ui.init();
				}

				_shout('firstUpdate');
				_currentItemIndex = _currentItemIndex || _options.index || 0;
				// validate index
				if (isNaN(_currentItemIndex) || _currentItemIndex < 0 || _currentItemIndex >= _getNumItems()) {
					_currentItemIndex = 0;
				}
				self.currItem = _getItemAt(_currentItemIndex);

				if (_features.isOldIOSPhone || _features.isOldAndroid) {
					_isFixedPosition = false;
				}

				template.setAttribute('aria-hidden', 'false');
				if (_options.modal) {
					if (!_isFixedPosition) {
						template.style.position = 'absolute';
						template.style.top = framework.getScrollY() + 'px';
					} else {
						template.style.position = 'fixed';
					}
				}

				if (_currentWindowScrollY === undefined) {
					_shout('initialLayout');
					_currentWindowScrollY = _initalWindowScrollY = framework.getScrollY();
				}

				// add classes to root element of PhotoSwipe
				var rootClasses = 'pswp--open ';
				if (_options.mainClass) {
					rootClasses += _options.mainClass + ' ';
				}
				if (_options.showHideOpacity) {
					rootClasses += 'pswp--animate_opacity ';
				}
				rootClasses += _likelyTouchDevice ? 'pswp--touch' : 'pswp--notouch';
				rootClasses += _features.animationName ? ' pswp--css_animation' : '';
				rootClasses += _features.svg ? ' pswp--svg' : '';
				framework.addClass(template, rootClasses);

				self.updateSize();

				// initial update
				_containerShiftIndex = -1;
				_indexDiff = null;
				for (i = 0; i < NUM_HOLDERS; i++) {
					_setTranslateX((i + _containerShiftIndex) * _slideSize.x, _itemHolders[i].el.style);
				}

				if (!_oldIE) {
					framework.bind(self.scrollWrap, _downEvents, self); // no dragging for old IE
				}

				_listen('initialZoomInEnd', function () {
					self.setContent(_itemHolders[0], _currentItemIndex - 1);
					self.setContent(_itemHolders[2], _currentItemIndex + 1);

					_itemHolders[0].el.style.display = _itemHolders[2].el.style.display = 'block';

					if (_options.focus) {
						// focus causes layout,
						// which causes lag during the animation,
						// that's why we delay it untill the initial zoom transition ends
						template.focus();
					}

					_bindEvents();
				});

				// set content for center slide (first time)
				self.setContent(_itemHolders[1], _currentItemIndex);

				self.updateCurrItem();

				_shout('afterInit');

				if (!_isFixedPosition) {

					// On all versions of iOS lower than 8.0, we check size of viewport every second.
					//
					// This is done to detect when Safari top & bottom bars appear,
					// as this action doesn't trigger any events (like resize).
					//
					// On iOS8 they fixed this.
					//
					// 10 Nov 2014: iOS 7 usage ~40%. iOS 8 usage 56%.

					_updateSizeInterval = setInterval(function () {
						if (!_numAnimations && !_isDragging && !_isZooming && _currZoomLevel === self.currItem.initialZoomLevel) {
							self.updateSize();
						}
					}, 1000);
				}

				framework.addClass(template, 'pswp--visible');
			},

			// Closes the gallery, then destroy it
			close: function close() {
				if (!_isOpen) {
					return;
				}

				_isOpen = false;
				_isDestroying = true;
				_shout('close');
				_unbindEvents();

				_showOrHide(self.currItem, null, true, self.destroy);
			},

			// destroys gallery (unbinds events, cleans up intervals and timeouts to avoid memory leaks)
			destroy: function destroy() {
				_shout('destroy');

				if (_showOrHideTimeout) {
					clearTimeout(_showOrHideTimeout);
				}

				template.setAttribute('aria-hidden', 'true');
				template.className = _initalClassName;

				if (_updateSizeInterval) {
					clearInterval(_updateSizeInterval);
				}

				framework.unbind(self.scrollWrap, _downEvents, self);

				// we unbind lost event at the end, as closing animation may depend on it
				framework.unbind(window, 'scroll', self);

				_stopDragUpdateLoop();

				_stopAllAnimations();

				_listeners = null;
			},

			/**
    * Pan image to position
    * @param {Number} x     
    * @param {Number} y     
    * @param {Boolean} force Will ignore bounds if set to true.
    */
			panTo: function panTo(x, y, force) {
				if (!force) {
					if (x > _currPanBounds.min.x) {
						x = _currPanBounds.min.x;
					} else if (x < _currPanBounds.max.x) {
						x = _currPanBounds.max.x;
					}

					if (y > _currPanBounds.min.y) {
						y = _currPanBounds.min.y;
					} else if (y < _currPanBounds.max.y) {
						y = _currPanBounds.max.y;
					}
				}

				_panOffset.x = x;
				_panOffset.y = y;
				_applyCurrentZoomPan();
			},

			handleEvent: function handleEvent(e) {
				e = e || window.event;
				if (_globalEventHandlers[e.type]) {
					_globalEventHandlers[e.type](e);
				}
			},

			goTo: function goTo(index) {

				index = _getLoopedId(index);

				var diff = index - _currentItemIndex;
				_indexDiff = diff;

				_currentItemIndex = index;
				self.currItem = _getItemAt(_currentItemIndex);
				_currPositionIndex -= diff;

				_moveMainScroll(_slideSize.x * _currPositionIndex);

				_stopAllAnimations();
				_mainScrollAnimating = false;

				self.updateCurrItem();
			},
			next: function next() {
				self.goTo(_currentItemIndex + 1);
			},
			prev: function prev() {
				self.goTo(_currentItemIndex - 1);
			},

			// update current zoom/pan objects
			updateCurrZoomItem: function updateCurrZoomItem(emulateSetContent) {
				if (emulateSetContent) {
					_shout('beforeChange', 0);
				}

				// itemHolder[1] is middle (current) item
				if (_itemHolders[1].el.children.length) {
					var zoomElement = _itemHolders[1].el.children[0];
					if (framework.hasClass(zoomElement, 'pswp__zoom-wrap')) {
						_currZoomElementStyle = zoomElement.style;
					} else {
						_currZoomElementStyle = null;
					}
				} else {
					_currZoomElementStyle = null;
				}

				_currPanBounds = self.currItem.bounds;
				_startZoomLevel = _currZoomLevel = self.currItem.initialZoomLevel;

				_panOffset.x = _currPanBounds.center.x;
				_panOffset.y = _currPanBounds.center.y;

				if (emulateSetContent) {
					_shout('afterChange');
				}
			},

			invalidateCurrItems: function invalidateCurrItems() {
				_itemsNeedUpdate = true;
				for (var i = 0; i < NUM_HOLDERS; i++) {
					if (_itemHolders[i].item) {
						_itemHolders[i].item.needsUpdate = true;
					}
				}
			},

			updateCurrItem: function updateCurrItem(beforeAnimation) {

				if (_indexDiff === 0) {
					return;
				}

				var diffAbs = Math.abs(_indexDiff),
				    tempHolder;

				if (beforeAnimation && diffAbs < 2) {
					return;
				}

				self.currItem = _getItemAt(_currentItemIndex);
				_renderMaxResolution = false;

				_shout('beforeChange', _indexDiff);

				if (diffAbs >= NUM_HOLDERS) {
					_containerShiftIndex += _indexDiff + (_indexDiff > 0 ? -NUM_HOLDERS : NUM_HOLDERS);
					diffAbs = NUM_HOLDERS;
				}
				for (var i = 0; i < diffAbs; i++) {
					if (_indexDiff > 0) {
						tempHolder = _itemHolders.shift();
						_itemHolders[NUM_HOLDERS - 1] = tempHolder; // move first to last

						_containerShiftIndex++;
						_setTranslateX((_containerShiftIndex + 2) * _slideSize.x, tempHolder.el.style);
						self.setContent(tempHolder, _currentItemIndex - diffAbs + i + 1 + 1);
					} else {
						tempHolder = _itemHolders.pop();
						_itemHolders.unshift(tempHolder); // move last to first

						_containerShiftIndex--;
						_setTranslateX(_containerShiftIndex * _slideSize.x, tempHolder.el.style);
						self.setContent(tempHolder, _currentItemIndex + diffAbs - i - 1 - 1);
					}
				}

				// reset zoom/pan on previous item
				if (_currZoomElementStyle && Math.abs(_indexDiff) === 1) {

					var prevItem = _getItemAt(_prevItemIndex);
					if (prevItem.initialZoomLevel !== _currZoomLevel) {
						_calculateItemSize(prevItem, _viewportSize);
						_setImageSize(prevItem);
						_applyZoomPanToItem(prevItem);
					}
				}

				// reset diff after update
				_indexDiff = 0;

				self.updateCurrZoomItem();

				_prevItemIndex = _currentItemIndex;

				_shout('afterChange');
			},

			updateSize: function updateSize(force) {

				if (!_isFixedPosition && _options.modal) {
					var windowScrollY = framework.getScrollY();
					if (_currentWindowScrollY !== windowScrollY) {
						template.style.top = windowScrollY + 'px';
						_currentWindowScrollY = windowScrollY;
					}
					if (!force && _windowVisibleSize.x === window.innerWidth && _windowVisibleSize.y === window.innerHeight) {
						return;
					}
					_windowVisibleSize.x = window.innerWidth;
					_windowVisibleSize.y = window.innerHeight;

					//template.style.width = _windowVisibleSize.x + 'px';
					template.style.height = _windowVisibleSize.y + 'px';
				}

				_viewportSize.x = self.scrollWrap.clientWidth;
				_viewportSize.y = self.scrollWrap.clientHeight;

				_updatePageScrollOffset();

				_slideSize.x = _viewportSize.x + Math.round(_viewportSize.x * _options.spacing);
				_slideSize.y = _viewportSize.y;

				_moveMainScroll(_slideSize.x * _currPositionIndex);

				_shout('beforeResize'); // even may be used for example to switch image sources

				// don't re-calculate size on inital size update
				if (_containerShiftIndex !== undefined) {

					var holder, item, hIndex;

					for (var i = 0; i < NUM_HOLDERS; i++) {
						holder = _itemHolders[i];
						_setTranslateX((i + _containerShiftIndex) * _slideSize.x, holder.el.style);

						hIndex = _currentItemIndex + i - 1;

						if (_options.loop && _getNumItems() > 2) {
							hIndex = _getLoopedId(hIndex);
						}

						// update zoom level on items and refresh source (if needsUpdate)
						item = _getItemAt(hIndex);

						// re-render gallery item if `needsUpdate`,
						// or doesn't have `bounds` (entirely new slide object)
						if (item && (_itemsNeedUpdate || item.needsUpdate || !item.bounds)) {

							self.cleanSlide(item);

							self.setContent(holder, hIndex);

							// if "center" slide
							if (i === 1) {
								self.currItem = item;
								self.updateCurrZoomItem(true);
							}

							item.needsUpdate = false;
						} else if (holder.index === -1 && hIndex >= 0) {
							// add content first time
							self.setContent(holder, hIndex);
						}
						if (item && item.container) {
							_calculateItemSize(item, _viewportSize);
							_setImageSize(item);
							_applyZoomPanToItem(item);
						}
					}
					_itemsNeedUpdate = false;
				}

				_startZoomLevel = _currZoomLevel = self.currItem.initialZoomLevel;
				_currPanBounds = self.currItem.bounds;

				if (_currPanBounds) {
					_panOffset.x = _currPanBounds.center.x;
					_panOffset.y = _currPanBounds.center.y;
					_applyCurrentZoomPan(true);
				}

				_shout('resize');
			},

			// Zoom current item to
			zoomTo: function zoomTo(destZoomLevel, centerPoint, speed, easingFn, updateFn) {
				/*
    	if(destZoomLevel === 'fit') {
    		destZoomLevel = self.currItem.fitRatio;
    	} else if(destZoomLevel === 'fill') {
    		destZoomLevel = self.currItem.fillRatio;
    	}
    */

				if (centerPoint) {
					_startZoomLevel = _currZoomLevel;
					_midZoomPoint.x = Math.abs(centerPoint.x) - _panOffset.x;
					_midZoomPoint.y = Math.abs(centerPoint.y) - _panOffset.y;
					_equalizePoints(_startPanOffset, _panOffset);
				}

				var destPanBounds = _calculatePanBounds(destZoomLevel, false),
				    destPanOffset = {};

				_modifyDestPanOffset('x', destPanBounds, destPanOffset, destZoomLevel);
				_modifyDestPanOffset('y', destPanBounds, destPanOffset, destZoomLevel);

				var initialZoomLevel = _currZoomLevel;
				var initialPanOffset = {
					x: _panOffset.x,
					y: _panOffset.y
				};

				_roundPoint(destPanOffset);

				// _startZoomLevel = destZoomLevel;
				var onUpdate = function onUpdate(now) {
					if (now === 1) {
						_currZoomLevel = destZoomLevel;
						_panOffset.x = destPanOffset.x;
						_panOffset.y = destPanOffset.y;
					} else {
						_currZoomLevel = (destZoomLevel - initialZoomLevel) * now + initialZoomLevel;
						_panOffset.x = (destPanOffset.x - initialPanOffset.x) * now + initialPanOffset.x;
						_panOffset.y = (destPanOffset.y - initialPanOffset.y) * now + initialPanOffset.y;
					}

					if (updateFn) {
						updateFn(now);
					}

					_applyCurrentZoomPan(now === 1);
				};

				if (speed) {
					_animateProp('customZoomTo', 0, 1, speed, easingFn || framework.easing.sine.inOut, onUpdate);
				} else {
					onUpdate(1);
				}
			}

		};

		/*>>core*/

		/*>>gestures*/
		/**
   * Mouse/touch/pointer event handlers.
   * 
   * separated from @core.js for readability
   */

		var MIN_SWIPE_DISTANCE = 30,
		    DIRECTION_CHECK_OFFSET = 10; // amount of pixels to drag to determine direction of swipe

		var _gestureStartTime,
		    _gestureCheckSpeedTime,
		   

		// pool of objects that are used during dragging of zooming
		p = {},
		    // first point
		p2 = {},
		    // second point (for zoom gesture)
		delta = {},
		    _currPoint = {},
		    _startPoint = {},
		    _currPointers = [],
		    _startMainScrollPos = {},
		    _releaseAnimData,
		    _posPoints = [],
		    // array of points during dragging, used to determine type of gesture
		_tempPoint = {},
		    _isZoomingIn,
		    _verticalDragInitiated,
		    _oldAndroidTouchEndTimeout,
		    _currZoomedItemIndex = 0,
		    _centerPoint = _getEmptyPoint(),
		    _lastReleaseTime = 0,
		    _isDragging,
		    // at least one pointer is down
		_isMultitouch,
		    // at least two _pointers are down
		_zoomStarted,
		    // zoom level changed during zoom gesture
		_moved,
		    _dragAnimFrame,
		    _mainScrollShifted,
		    _currentPoints,
		    // array of current touch points
		_isZooming,
		    _currPointsDistance,
		    _startPointsDistance,
		    _currPanBounds,
		    _mainScrollPos = _getEmptyPoint(),
		    _currZoomElementStyle,
		    _mainScrollAnimating,
		    // true, if animation after swipe gesture is running
		_midZoomPoint = _getEmptyPoint(),
		    _currCenterPoint = _getEmptyPoint(),
		    _direction,
		    _isFirstMove,
		    _opacityChanged,
		    _bgOpacity,
		    _wasOverInitialZoom,
		    _isEqualPoints = function _isEqualPoints(p1, p2) {
			return p1.x === p2.x && p1.y === p2.y;
		},
		    _isNearbyPoints = function _isNearbyPoints(touch0, touch1) {
			return Math.abs(touch0.x - touch1.x) < DOUBLE_TAP_RADIUS && Math.abs(touch0.y - touch1.y) < DOUBLE_TAP_RADIUS;
		},
		    _calculatePointsDistance = function _calculatePointsDistance(p1, p2) {
			_tempPoint.x = Math.abs(p1.x - p2.x);
			_tempPoint.y = Math.abs(p1.y - p2.y);
			return Math.sqrt(_tempPoint.x * _tempPoint.x + _tempPoint.y * _tempPoint.y);
		},
		    _stopDragUpdateLoop = function _stopDragUpdateLoop() {
			if (_dragAnimFrame) {
				_cancelAF(_dragAnimFrame);
				_dragAnimFrame = null;
			}
		},
		    _dragUpdateLoop = function _dragUpdateLoop() {
			if (_isDragging) {
				_dragAnimFrame = _requestAF(_dragUpdateLoop);
				_renderMovement();
			}
		},
		    _canPan = function _canPan() {
			return !(_options.scaleMode === 'fit' && _currZoomLevel === self.currItem.initialZoomLevel);
		},
		   

		// find the closest parent DOM element
		_closestElement = function _closestElement(_x, _x2) {
			var _again = true;

			_function: while (_again) {
				var el = _x,
				    fn = _x2;
				_again = false;

				if (!el) {
					return false;
				}

				// don't search elements above pswp__scroll-wrap
				if (el.className && el.className.indexOf('pswp__scroll-wrap') > -1) {
					return false;
				}

				if (fn(el)) {
					return el;
				}

				_x = el.parentNode;
				_x2 = fn;
				_again = true;
				continue _function;
			}
		},
		    _preventObj = {},
		    _preventDefaultEventBehaviour = function _preventDefaultEventBehaviour(e, isDown) {
			_preventObj.prevent = !_closestElement(e.target, _options.isClickableElement);

			_shout('preventDragEvent', e, isDown, _preventObj);
			return _preventObj.prevent;
		},
		    _convertTouchToPoint = function _convertTouchToPoint(touch, p) {
			p.x = touch.pageX;
			p.y = touch.pageY;
			p.id = touch.identifier;
			return p;
		},
		    _findCenterOfPoints = function _findCenterOfPoints(p1, p2, pCenter) {
			pCenter.x = (p1.x + p2.x) * 0.5;
			pCenter.y = (p1.y + p2.y) * 0.5;
		},
		    _pushPosPoint = function _pushPosPoint(time, x, y) {
			if (time - _gestureCheckSpeedTime > 50) {
				var o = _posPoints.length > 2 ? _posPoints.shift() : {};
				o.x = x;
				o.y = y;
				_posPoints.push(o);
				_gestureCheckSpeedTime = time;
			}
		},
		    _calculateVerticalDragOpacityRatio = function _calculateVerticalDragOpacityRatio() {
			var yOffset = _panOffset.y - self.currItem.initialPosition.y; // difference between initial and current position
			return 1 - Math.abs(yOffset / (_viewportSize.y / 2));
		},
		   

		// points pool, reused during touch events
		_ePoint1 = {},
		    _ePoint2 = {},
		    _tempPointsArr = [],
		    _tempCounter,
		    _getTouchPoints = function _getTouchPoints(e) {
			// clean up previous points, without recreating array
			while (_tempPointsArr.length > 0) {
				_tempPointsArr.pop();
			}

			if (!_pointerEventEnabled) {
				if (e.type.indexOf('touch') > -1) {

					if (e.touches && e.touches.length > 0) {
						_tempPointsArr[0] = _convertTouchToPoint(e.touches[0], _ePoint1);
						if (e.touches.length > 1) {
							_tempPointsArr[1] = _convertTouchToPoint(e.touches[1], _ePoint2);
						}
					}
				} else {
					_ePoint1.x = e.pageX;
					_ePoint1.y = e.pageY;
					_ePoint1.id = '';
					_tempPointsArr[0] = _ePoint1; //_ePoint1;
				}
			} else {
					_tempCounter = 0;
					// we can use forEach, as pointer events are supported only in modern browsers
					_currPointers.forEach(function (p) {
						if (_tempCounter === 0) {
							_tempPointsArr[0] = p;
						} else if (_tempCounter === 1) {
							_tempPointsArr[1] = p;
						}
						_tempCounter++;
					});
				}
			return _tempPointsArr;
		},
		    _panOrMoveMainScroll = function _panOrMoveMainScroll(axis, delta) {

			var panFriction,
			    overDiff = 0,
			    newOffset = _panOffset[axis] + delta[axis],
			    startOverDiff,
			    dir = delta[axis] > 0,
			    newMainScrollPosition = _mainScrollPos.x + delta.x,
			    mainScrollDiff = _mainScrollPos.x - _startMainScrollPos.x,
			    newPanPos,
			    newMainScrollPos;

			// calculate fdistance over the bounds and friction
			if (newOffset > _currPanBounds.min[axis] || newOffset < _currPanBounds.max[axis]) {
				panFriction = _options.panEndFriction;
				// Linear increasing of friction, so at 1/4 of viewport it's at max value.
				// Looks not as nice as was expected. Left for history.
				// panFriction = (1 - (_panOffset[axis] + delta[axis] + panBounds.min[axis]) / (_viewportSize[axis] / 4) );
			} else {
					panFriction = 1;
				}

			newOffset = _panOffset[axis] + delta[axis] * panFriction;

			// move main scroll or start panning
			if (_options.allowPanToNext || _currZoomLevel === self.currItem.initialZoomLevel) {

				if (!_currZoomElementStyle) {

					newMainScrollPos = newMainScrollPosition;
				} else if (_direction === 'h' && axis === 'x' && !_zoomStarted) {

					if (dir) {
						if (newOffset > _currPanBounds.min[axis]) {
							panFriction = _options.panEndFriction;
							overDiff = _currPanBounds.min[axis] - newOffset;
							startOverDiff = _currPanBounds.min[axis] - _startPanOffset[axis];
						}

						// drag right
						if ((startOverDiff <= 0 || mainScrollDiff < 0) && _getNumItems() > 1) {
							newMainScrollPos = newMainScrollPosition;
							if (mainScrollDiff < 0 && newMainScrollPosition > _startMainScrollPos.x) {
								newMainScrollPos = _startMainScrollPos.x;
							}
						} else {
							if (_currPanBounds.min.x !== _currPanBounds.max.x) {
								newPanPos = newOffset;
							}
						}
					} else {

						if (newOffset < _currPanBounds.max[axis]) {
							panFriction = _options.panEndFriction;
							overDiff = newOffset - _currPanBounds.max[axis];
							startOverDiff = _startPanOffset[axis] - _currPanBounds.max[axis];
						}

						if ((startOverDiff <= 0 || mainScrollDiff > 0) && _getNumItems() > 1) {
							newMainScrollPos = newMainScrollPosition;

							if (mainScrollDiff > 0 && newMainScrollPosition < _startMainScrollPos.x) {
								newMainScrollPos = _startMainScrollPos.x;
							}
						} else {
							if (_currPanBounds.min.x !== _currPanBounds.max.x) {
								newPanPos = newOffset;
							}
						}
					}

					//
				}

				if (axis === 'x') {

					if (newMainScrollPos !== undefined) {
						_moveMainScroll(newMainScrollPos, true);
						if (newMainScrollPos === _startMainScrollPos.x) {
							_mainScrollShifted = false;
						} else {
							_mainScrollShifted = true;
						}
					}

					if (_currPanBounds.min.x !== _currPanBounds.max.x) {
						if (newPanPos !== undefined) {
							_panOffset.x = newPanPos;
						} else if (!_mainScrollShifted) {
							_panOffset.x += delta.x * panFriction;
						}
					}

					return newMainScrollPos !== undefined;
				}
			}

			if (!_mainScrollAnimating) {

				if (!_mainScrollShifted) {
					if (_currZoomLevel > self.currItem.fitRatio) {
						_panOffset[axis] += delta[axis] * panFriction;
					}
				}
			}
		},
		   

		// Pointerdown/touchstart/mousedown handler
		_onDragStart = function _onDragStart(e) {

			// Allow dragging only via left mouse button.
			// As this handler is not added in IE8 - we ignore e.which
			//
			// http://www.quirksmode.org/js/events_properties.html
			// https://developer.mozilla.org/en-US/docs/Web/API/event.button
			if (e.type === 'mousedown' && e.button > 0) {
				return;
			}

			if (_initialZoomRunning) {
				e.preventDefault();
				return;
			}

			if (_oldAndroidTouchEndTimeout && e.type === 'mousedown') {
				return;
			}

			if (_preventDefaultEventBehaviour(e, true)) {
				e.preventDefault();
			}

			_shout('pointerDown');

			if (_pointerEventEnabled) {
				var pointerIndex = framework.arraySearch(_currPointers, e.pointerId, 'id');
				if (pointerIndex < 0) {
					pointerIndex = _currPointers.length;
				}
				_currPointers[pointerIndex] = { x: e.pageX, y: e.pageY, id: e.pointerId };
			}

			var startPointsList = _getTouchPoints(e),
			    numPoints = startPointsList.length;

			_currentPoints = null;

			_stopAllAnimations();

			// init drag
			if (!_isDragging || numPoints === 1) {

				_isDragging = _isFirstMove = true;
				framework.bind(window, _upMoveEvents, self);

				_isZoomingIn = _wasOverInitialZoom = _opacityChanged = _verticalDragInitiated = _mainScrollShifted = _moved = _isMultitouch = _zoomStarted = false;

				_direction = null;

				_shout('firstTouchStart', startPointsList);

				_equalizePoints(_startPanOffset, _panOffset);

				_currPanDist.x = _currPanDist.y = 0;
				_equalizePoints(_currPoint, startPointsList[0]);
				_equalizePoints(_startPoint, _currPoint);

				//_equalizePoints(_startMainScrollPos, _mainScrollPos);
				_startMainScrollPos.x = _slideSize.x * _currPositionIndex;

				_posPoints = [{
					x: _currPoint.x,
					y: _currPoint.y
				}];

				_gestureCheckSpeedTime = _gestureStartTime = _getCurrentTime();

				//_mainScrollAnimationEnd(true);
				_calculatePanBounds(_currZoomLevel, true);

				// Start rendering
				_stopDragUpdateLoop();
				_dragUpdateLoop();
			}

			// init zoom
			if (!_isZooming && numPoints > 1 && !_mainScrollAnimating && !_mainScrollShifted) {
				_startZoomLevel = _currZoomLevel;
				_zoomStarted = false; // true if zoom changed at least once

				_isZooming = _isMultitouch = true;
				_currPanDist.y = _currPanDist.x = 0;

				_equalizePoints(_startPanOffset, _panOffset);

				_equalizePoints(p, startPointsList[0]);
				_equalizePoints(p2, startPointsList[1]);

				_findCenterOfPoints(p, p2, _currCenterPoint);

				_midZoomPoint.x = Math.abs(_currCenterPoint.x) - _panOffset.x;
				_midZoomPoint.y = Math.abs(_currCenterPoint.y) - _panOffset.y;
				_currPointsDistance = _startPointsDistance = _calculatePointsDistance(p, p2);
			}
		},
		   

		// Pointermove/touchmove/mousemove handler
		_onDragMove = function _onDragMove(e) {

			e.preventDefault();

			if (_pointerEventEnabled) {
				var pointerIndex = framework.arraySearch(_currPointers, e.pointerId, 'id');
				if (pointerIndex > -1) {
					var p = _currPointers[pointerIndex];
					p.x = e.pageX;
					p.y = e.pageY;
				}
			}

			if (_isDragging) {
				var touchesList = _getTouchPoints(e);
				if (!_direction && !_moved && !_isZooming) {

					if (_mainScrollPos.x !== _slideSize.x * _currPositionIndex) {
						// if main scroll position is shifted – direction is always horizontal
						_direction = 'h';
					} else {
						var diff = Math.abs(touchesList[0].x - _currPoint.x) - Math.abs(touchesList[0].y - _currPoint.y);
						// check the direction of movement
						if (Math.abs(diff) >= DIRECTION_CHECK_OFFSET) {
							_direction = diff > 0 ? 'h' : 'v';
							_currentPoints = touchesList;
						}
					}
				} else {
					_currentPoints = touchesList;
				}
			}
		},
		   
		//
		_renderMovement = function _renderMovement() {

			if (!_currentPoints) {
				return;
			}

			var numPoints = _currentPoints.length;

			if (numPoints === 0) {
				return;
			}

			_equalizePoints(p, _currentPoints[0]);

			delta.x = p.x - _currPoint.x;
			delta.y = p.y - _currPoint.y;

			if (_isZooming && numPoints > 1) {
				// Handle behaviour for more than 1 point

				_currPoint.x = p.x;
				_currPoint.y = p.y;

				// check if one of two points changed
				if (!delta.x && !delta.y && _isEqualPoints(_currentPoints[1], p2)) {
					return;
				}

				_equalizePoints(p2, _currentPoints[1]);

				if (!_zoomStarted) {
					_zoomStarted = true;
					_shout('zoomGestureStarted');
				}

				// Distance between two points
				var pointsDistance = _calculatePointsDistance(p, p2);

				var zoomLevel = _calculateZoomLevel(pointsDistance);

				// slightly over the of initial zoom level
				if (zoomLevel > self.currItem.initialZoomLevel + self.currItem.initialZoomLevel / 15) {
					_wasOverInitialZoom = true;
				}

				// Apply the friction if zoom level is out of the bounds
				var zoomFriction = 1,
				    minZoomLevel = _getMinZoomLevel(),
				    maxZoomLevel = _getMaxZoomLevel();

				if (zoomLevel < minZoomLevel) {

					if (_options.pinchToClose && !_wasOverInitialZoom && _startZoomLevel <= self.currItem.initialZoomLevel) {
						// fade out background if zooming out
						var minusDiff = minZoomLevel - zoomLevel;
						var percent = 1 - minusDiff / (minZoomLevel / 1.2);

						_applyBgOpacity(percent);
						_shout('onPinchClose', percent);
						_opacityChanged = true;
					} else {
						zoomFriction = (minZoomLevel - zoomLevel) / minZoomLevel;
						if (zoomFriction > 1) {
							zoomFriction = 1;
						}
						zoomLevel = minZoomLevel - zoomFriction * (minZoomLevel / 3);
					}
				} else if (zoomLevel > maxZoomLevel) {
					// 1.5 - extra zoom level above the max. E.g. if max is x6, real max 6 + 1.5 = 7.5
					zoomFriction = (zoomLevel - maxZoomLevel) / (minZoomLevel * 6);
					if (zoomFriction > 1) {
						zoomFriction = 1;
					}
					zoomLevel = maxZoomLevel + zoomFriction * minZoomLevel;
				}

				if (zoomFriction < 0) {
					zoomFriction = 0;
				}

				// distance between touch points after friction is applied
				_currPointsDistance = pointsDistance;

				// _centerPoint - The point in the middle of two pointers
				_findCenterOfPoints(p, p2, _centerPoint);

				// paning with two pointers pressed
				_currPanDist.x += _centerPoint.x - _currCenterPoint.x;
				_currPanDist.y += _centerPoint.y - _currCenterPoint.y;
				_equalizePoints(_currCenterPoint, _centerPoint);

				_panOffset.x = _calculatePanOffset('x', zoomLevel);
				_panOffset.y = _calculatePanOffset('y', zoomLevel);

				_isZoomingIn = zoomLevel > _currZoomLevel;
				_currZoomLevel = zoomLevel;
				_applyCurrentZoomPan();
			} else {

				// handle behaviour for one point (dragging or panning)

				if (!_direction) {
					return;
				}

				if (_isFirstMove) {
					_isFirstMove = false;

					// subtract drag distance that was used during the detection direction 

					if (Math.abs(delta.x) >= DIRECTION_CHECK_OFFSET) {
						delta.x -= _currentPoints[0].x - _startPoint.x;
					}

					if (Math.abs(delta.y) >= DIRECTION_CHECK_OFFSET) {
						delta.y -= _currentPoints[0].y - _startPoint.y;
					}
				}

				_currPoint.x = p.x;
				_currPoint.y = p.y;

				// do nothing if pointers position hasn't changed
				if (delta.x === 0 && delta.y === 0) {
					return;
				}

				if (_direction === 'v' && _options.closeOnVerticalDrag) {
					if (!_canPan()) {
						_currPanDist.y += delta.y;
						_panOffset.y += delta.y;

						var opacityRatio = _calculateVerticalDragOpacityRatio();

						_verticalDragInitiated = true;
						_shout('onVerticalDrag', opacityRatio);

						_applyBgOpacity(opacityRatio);
						_applyCurrentZoomPan();
						return;
					}
				}

				_pushPosPoint(_getCurrentTime(), p.x, p.y);

				_moved = true;
				_currPanBounds = self.currItem.bounds;

				var mainScrollChanged = _panOrMoveMainScroll('x', delta);
				if (!mainScrollChanged) {
					_panOrMoveMainScroll('y', delta);

					_roundPoint(_panOffset);
					_applyCurrentZoomPan();
				}
			}
		},
		   

		// Pointerup/pointercancel/touchend/touchcancel/mouseup event handler
		_onDragRelease = function _onDragRelease(e) {

			if (_features.isOldAndroid) {

				if (_oldAndroidTouchEndTimeout && e.type === 'mouseup') {
					return;
				}

				// on Android (v4.1, 4.2, 4.3 & possibly older)
				// ghost mousedown/up event isn't preventable via e.preventDefault,
				// which causes fake mousedown event
				// so we block mousedown/up for 600ms
				if (e.type.indexOf('touch') > -1) {
					clearTimeout(_oldAndroidTouchEndTimeout);
					_oldAndroidTouchEndTimeout = setTimeout(function () {
						_oldAndroidTouchEndTimeout = 0;
					}, 600);
				}
			}

			_shout('pointerUp');

			if (_preventDefaultEventBehaviour(e, false)) {
				e.preventDefault();
			}

			var releasePoint;

			if (_pointerEventEnabled) {
				var pointerIndex = framework.arraySearch(_currPointers, e.pointerId, 'id');

				if (pointerIndex > -1) {
					releasePoint = _currPointers.splice(pointerIndex, 1)[0];

					if (navigator.pointerEnabled) {
						releasePoint.type = e.pointerType || 'mouse';
					} else {
						var MSPOINTER_TYPES = {
							4: 'mouse', // event.MSPOINTER_TYPE_MOUSE
							2: 'touch', // event.MSPOINTER_TYPE_TOUCH
							3: 'pen' // event.MSPOINTER_TYPE_PEN
						};
						releasePoint.type = MSPOINTER_TYPES[e.pointerType];

						if (!releasePoint.type) {
							releasePoint.type = e.pointerType || 'mouse';
						}
					}
				}
			}

			var touchList = _getTouchPoints(e),
			    gestureType,
			    numPoints = touchList.length;

			if (e.type === 'mouseup') {
				numPoints = 0;
			}

			// Do nothing if there were 3 touch points or more
			if (numPoints === 2) {
				_currentPoints = null;
				return true;
			}

			// if second pointer released
			if (numPoints === 1) {
				_equalizePoints(_startPoint, touchList[0]);
			}

			// pointer hasn't moved, send "tap release" point
			if (numPoints === 0 && !_direction && !_mainScrollAnimating) {
				if (!releasePoint) {
					if (e.type === 'mouseup') {
						releasePoint = { x: e.pageX, y: e.pageY, type: 'mouse' };
					} else if (e.changedTouches && e.changedTouches[0]) {
						releasePoint = { x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY, type: 'touch' };
					}
				}

				_shout('touchRelease', e, releasePoint);
			}

			// Difference in time between releasing of two last touch points (zoom gesture)
			var releaseTimeDiff = -1;

			// Gesture completed, no pointers left
			if (numPoints === 0) {
				_isDragging = false;
				framework.unbind(window, _upMoveEvents, self);

				_stopDragUpdateLoop();

				if (_isZooming) {
					// Two points released at the same time
					releaseTimeDiff = 0;
				} else if (_lastReleaseTime !== -1) {
					releaseTimeDiff = _getCurrentTime() - _lastReleaseTime;
				}
			}
			_lastReleaseTime = numPoints === 1 ? _getCurrentTime() : -1;

			if (releaseTimeDiff !== -1 && releaseTimeDiff < 150) {
				gestureType = 'zoom';
			} else {
				gestureType = 'swipe';
			}

			if (_isZooming && numPoints < 2) {
				_isZooming = false;

				// Only second point released
				if (numPoints === 1) {
					gestureType = 'zoomPointerUp';
				}
				_shout('zoomGestureEnded');
			}

			_currentPoints = null;
			if (!_moved && !_zoomStarted && !_mainScrollAnimating && !_verticalDragInitiated) {
				// nothing to animate
				return;
			}

			_stopAllAnimations();

			if (!_releaseAnimData) {
				_releaseAnimData = _initDragReleaseAnimationData();
			}

			_releaseAnimData.calculateSwipeSpeed('x');

			if (_verticalDragInitiated) {

				var opacityRatio = _calculateVerticalDragOpacityRatio();

				if (opacityRatio < _options.verticalDragRange) {
					self.close();
				} else {
					var initalPanY = _panOffset.y,
					    initialBgOpacity = _bgOpacity;

					_animateProp('verticalDrag', 0, 1, 300, framework.easing.cubic.out, function (now) {

						_panOffset.y = (self.currItem.initialPosition.y - initalPanY) * now + initalPanY;

						_applyBgOpacity((1 - initialBgOpacity) * now + initialBgOpacity);
						_applyCurrentZoomPan();
					});

					_shout('onVerticalDrag', 1);
				}

				return;
			}

			// main scroll
			if ((_mainScrollShifted || _mainScrollAnimating) && numPoints === 0) {
				var itemChanged = _finishSwipeMainScrollGesture(gestureType, _releaseAnimData);
				if (itemChanged) {
					return;
				}
				gestureType = 'zoomPointerUp';
			}

			// prevent zoom/pan animation when main scroll animation runs
			if (_mainScrollAnimating) {
				return;
			}

			// Complete simple zoom gesture (reset zoom level if it's out of the bounds) 
			if (gestureType !== 'swipe') {
				_completeZoomGesture();
				return;
			}

			// Complete pan gesture if main scroll is not shifted, and it's possible to pan current image
			if (!_mainScrollShifted && _currZoomLevel > self.currItem.fitRatio) {
				_completePanGesture(_releaseAnimData);
			}
		},
		   

		// Returns object with data about gesture
		// It's created only once and then reused
		_initDragReleaseAnimationData = function _initDragReleaseAnimationData() {
			// temp local vars
			var lastFlickDuration, tempReleasePos;

			// s = this
			var s = {
				lastFlickOffset: {},
				lastFlickDist: {},
				lastFlickSpeed: {},
				slowDownRatio: {},
				slowDownRatioReverse: {},
				speedDecelerationRatio: {},
				speedDecelerationRatioAbs: {},
				distanceOffset: {},
				backAnimDestination: {},
				backAnimStarted: {},
				calculateSwipeSpeed: function calculateSwipeSpeed(axis) {

					if (_posPoints.length > 1) {
						lastFlickDuration = _getCurrentTime() - _gestureCheckSpeedTime + 50;
						tempReleasePos = _posPoints[_posPoints.length - 2][axis];
					} else {
						lastFlickDuration = _getCurrentTime() - _gestureStartTime; // total gesture duration
						tempReleasePos = _startPoint[axis];
					}
					s.lastFlickOffset[axis] = _currPoint[axis] - tempReleasePos;
					s.lastFlickDist[axis] = Math.abs(s.lastFlickOffset[axis]);
					if (s.lastFlickDist[axis] > 20) {
						s.lastFlickSpeed[axis] = s.lastFlickOffset[axis] / lastFlickDuration;
					} else {
						s.lastFlickSpeed[axis] = 0;
					}
					if (Math.abs(s.lastFlickSpeed[axis]) < 0.1) {
						s.lastFlickSpeed[axis] = 0;
					}

					s.slowDownRatio[axis] = 0.95;
					s.slowDownRatioReverse[axis] = 1 - s.slowDownRatio[axis];
					s.speedDecelerationRatio[axis] = 1;
				},

				calculateOverBoundsAnimOffset: function calculateOverBoundsAnimOffset(axis, speed) {
					if (!s.backAnimStarted[axis]) {

						if (_panOffset[axis] > _currPanBounds.min[axis]) {
							s.backAnimDestination[axis] = _currPanBounds.min[axis];
						} else if (_panOffset[axis] < _currPanBounds.max[axis]) {
							s.backAnimDestination[axis] = _currPanBounds.max[axis];
						}

						if (s.backAnimDestination[axis] !== undefined) {
							s.slowDownRatio[axis] = 0.7;
							s.slowDownRatioReverse[axis] = 1 - s.slowDownRatio[axis];
							if (s.speedDecelerationRatioAbs[axis] < 0.05) {

								s.lastFlickSpeed[axis] = 0;
								s.backAnimStarted[axis] = true;

								_animateProp('bounceZoomPan' + axis, _panOffset[axis], s.backAnimDestination[axis], speed || 300, framework.easing.sine.out, function (pos) {
									_panOffset[axis] = pos;
									_applyCurrentZoomPan();
								});
							}
						}
					}
				},

				// Reduces the speed by slowDownRatio (per 10ms)
				calculateAnimOffset: function calculateAnimOffset(axis) {
					if (!s.backAnimStarted[axis]) {
						s.speedDecelerationRatio[axis] = s.speedDecelerationRatio[axis] * (s.slowDownRatio[axis] + s.slowDownRatioReverse[axis] - s.slowDownRatioReverse[axis] * s.timeDiff / 10);

						s.speedDecelerationRatioAbs[axis] = Math.abs(s.lastFlickSpeed[axis] * s.speedDecelerationRatio[axis]);
						s.distanceOffset[axis] = s.lastFlickSpeed[axis] * s.speedDecelerationRatio[axis] * s.timeDiff;
						_panOffset[axis] += s.distanceOffset[axis];
					}
				},

				panAnimLoop: function panAnimLoop() {
					if (_animations.zoomPan) {
						_animations.zoomPan.raf = _requestAF(s.panAnimLoop);

						s.now = _getCurrentTime();
						s.timeDiff = s.now - s.lastNow;
						s.lastNow = s.now;

						s.calculateAnimOffset('x');
						s.calculateAnimOffset('y');

						_applyCurrentZoomPan();

						s.calculateOverBoundsAnimOffset('x');
						s.calculateOverBoundsAnimOffset('y');

						if (s.speedDecelerationRatioAbs.x < 0.05 && s.speedDecelerationRatioAbs.y < 0.05) {

							// round pan position
							_panOffset.x = Math.round(_panOffset.x);
							_panOffset.y = Math.round(_panOffset.y);
							_applyCurrentZoomPan();

							_stopAnimation('zoomPan');
							return;
						}
					}
				}
			};
			return s;
		},
		    _completePanGesture = function _completePanGesture(animData) {
			// calculate swipe speed for Y axis (paanning)
			animData.calculateSwipeSpeed('y');

			_currPanBounds = self.currItem.bounds;

			animData.backAnimDestination = {};
			animData.backAnimStarted = {};

			// Avoid acceleration animation if speed is too low
			if (Math.abs(animData.lastFlickSpeed.x) <= 0.05 && Math.abs(animData.lastFlickSpeed.y) <= 0.05) {
				animData.speedDecelerationRatioAbs.x = animData.speedDecelerationRatioAbs.y = 0;

				// Run pan drag release animation. E.g. if you drag image and release finger without momentum.
				animData.calculateOverBoundsAnimOffset('x');
				animData.calculateOverBoundsAnimOffset('y');
				return true;
			}

			// Animation loop that controls the acceleration after pan gesture ends
			_registerStartAnimation('zoomPan');
			animData.lastNow = _getCurrentTime();
			animData.panAnimLoop();
		},
		    _finishSwipeMainScrollGesture = function _finishSwipeMainScrollGesture(gestureType, _releaseAnimData) {
			var itemChanged;
			if (!_mainScrollAnimating) {
				_currZoomedItemIndex = _currentItemIndex;
			}

			var itemsDiff;

			if (gestureType === 'swipe') {
				var totalShiftDist = _currPoint.x - _startPoint.x,
				    isFastLastFlick = _releaseAnimData.lastFlickDist.x < 10;

				// if container is shifted for more than MIN_SWIPE_DISTANCE,
				// and last flick gesture was in right direction
				if (totalShiftDist > MIN_SWIPE_DISTANCE && (isFastLastFlick || _releaseAnimData.lastFlickOffset.x > 20)) {
					// go to prev item
					itemsDiff = -1;
				} else if (totalShiftDist < -MIN_SWIPE_DISTANCE && (isFastLastFlick || _releaseAnimData.lastFlickOffset.x < -20)) {
					// go to next item
					itemsDiff = 1;
				}
			}

			var nextCircle;

			if (itemsDiff) {

				_currentItemIndex += itemsDiff;

				if (_currentItemIndex < 0) {
					_currentItemIndex = _options.loop ? _getNumItems() - 1 : 0;
					nextCircle = true;
				} else if (_currentItemIndex >= _getNumItems()) {
					_currentItemIndex = _options.loop ? 0 : _getNumItems() - 1;
					nextCircle = true;
				}

				if (!nextCircle || _options.loop) {
					_indexDiff += itemsDiff;
					_currPositionIndex -= itemsDiff;
					itemChanged = true;
				}
			}

			var animateToX = _slideSize.x * _currPositionIndex;
			var animateToDist = Math.abs(animateToX - _mainScrollPos.x);
			var finishAnimDuration;

			if (!itemChanged && animateToX > _mainScrollPos.x !== _releaseAnimData.lastFlickSpeed.x > 0) {
				// "return to current" duration, e.g. when dragging from slide 0 to -1
				finishAnimDuration = 333;
			} else {
				finishAnimDuration = Math.abs(_releaseAnimData.lastFlickSpeed.x) > 0 ? animateToDist / Math.abs(_releaseAnimData.lastFlickSpeed.x) : 333;

				finishAnimDuration = Math.min(finishAnimDuration, 400);
				finishAnimDuration = Math.max(finishAnimDuration, 250);
			}

			if (_currZoomedItemIndex === _currentItemIndex) {
				itemChanged = false;
			}

			_mainScrollAnimating = true;

			_shout('mainScrollAnimStart');

			_animateProp('mainScroll', _mainScrollPos.x, animateToX, finishAnimDuration, framework.easing.cubic.out, _moveMainScroll, function () {
				_stopAllAnimations();
				_mainScrollAnimating = false;
				_currZoomedItemIndex = -1;

				if (itemChanged || _currZoomedItemIndex !== _currentItemIndex) {
					self.updateCurrItem();
				}

				_shout('mainScrollAnimComplete');
			});

			if (itemChanged) {
				self.updateCurrItem(true);
			}

			return itemChanged;
		},
		    _calculateZoomLevel = function _calculateZoomLevel(touchesDistance) {
			return 1 / _startPointsDistance * touchesDistance * _startZoomLevel;
		},
		   

		// Resets zoom if it's out of bounds
		_completeZoomGesture = function _completeZoomGesture() {
			var destZoomLevel = _currZoomLevel,
			    minZoomLevel = _getMinZoomLevel(),
			    maxZoomLevel = _getMaxZoomLevel();

			if (_currZoomLevel < minZoomLevel) {
				destZoomLevel = minZoomLevel;
			} else if (_currZoomLevel > maxZoomLevel) {
				destZoomLevel = maxZoomLevel;
			}

			var destOpacity = 1,
			    onUpdate,
			    initialOpacity = _bgOpacity;

			if (_opacityChanged && !_isZoomingIn && !_wasOverInitialZoom && _currZoomLevel < minZoomLevel) {
				//_closedByScroll = true;
				self.close();
				return true;
			}

			if (_opacityChanged) {
				onUpdate = function (now) {
					_applyBgOpacity((destOpacity - initialOpacity) * now + initialOpacity);
				};
			}

			self.zoomTo(destZoomLevel, 0, 200, framework.easing.cubic.out, onUpdate);
			return true;
		};

		_registerModule('Gestures', {
			publicMethods: {

				initGestures: function initGestures() {

					// helper function that builds touch/pointer/mouse events
					var addEventNames = function addEventNames(pref, down, move, up, cancel) {
						_dragStartEvent = pref + down;
						_dragMoveEvent = pref + move;
						_dragEndEvent = pref + up;
						if (cancel) {
							_dragCancelEvent = pref + cancel;
						} else {
							_dragCancelEvent = '';
						}
					};

					_pointerEventEnabled = _features.pointerEvent;
					if (_pointerEventEnabled && _features.touch) {
						// we don't need touch events, if browser supports pointer events
						_features.touch = false;
					}

					if (_pointerEventEnabled) {
						if (navigator.pointerEnabled) {
							addEventNames('pointer', 'down', 'move', 'up', 'cancel');
						} else {
							// IE10 pointer events are case-sensitive
							addEventNames('MSPointer', 'Down', 'Move', 'Up', 'Cancel');
						}
					} else if (_features.touch) {
						addEventNames('touch', 'start', 'move', 'end', 'cancel');
						_likelyTouchDevice = true;
					} else {
						addEventNames('mouse', 'down', 'move', 'up');
					}

					_upMoveEvents = _dragMoveEvent + ' ' + _dragEndEvent + ' ' + _dragCancelEvent;
					_downEvents = _dragStartEvent;

					if (_pointerEventEnabled && !_likelyTouchDevice) {
						_likelyTouchDevice = navigator.maxTouchPoints > 1 || navigator.msMaxTouchPoints > 1;
					}
					// make variable public
					self.likelyTouchDevice = _likelyTouchDevice;

					_globalEventHandlers[_dragStartEvent] = _onDragStart;
					_globalEventHandlers[_dragMoveEvent] = _onDragMove;
					_globalEventHandlers[_dragEndEvent] = _onDragRelease; // the Kraken

					if (_dragCancelEvent) {
						_globalEventHandlers[_dragCancelEvent] = _globalEventHandlers[_dragEndEvent];
					}

					// Bind mouse events on device with detected hardware touch support, in case it supports multiple types of input.
					if (_features.touch) {
						_downEvents += ' mousedown';
						_upMoveEvents += ' mousemove mouseup';
						_globalEventHandlers.mousedown = _globalEventHandlers[_dragStartEvent];
						_globalEventHandlers.mousemove = _globalEventHandlers[_dragMoveEvent];
						_globalEventHandlers.mouseup = _globalEventHandlers[_dragEndEvent];
					}

					if (!_likelyTouchDevice) {
						// don't allow pan to next slide from zoomed state on Desktop
						_options.allowPanToNext = false;
					}
				}

			}
		});

		/*>>gestures*/

		/*>>show-hide-transition*/
		/**
   * show-hide-transition.js:
   *
   * Manages initial opening or closing transition.
   *
   * If you're not planning to use transition for gallery at all,
   * you may set options hideAnimationDuration and showAnimationDuration to 0,
   * and just delete startAnimation function.
   * 
   */

		var _showOrHideTimeout,
		    _showOrHide = function _showOrHide(item, img, out, completeFn) {

			if (_showOrHideTimeout) {
				clearTimeout(_showOrHideTimeout);
			}

			_initialZoomRunning = true;
			_initialContentSet = true;

			// dimensions of small thumbnail {x:,y:,w:}.
			// Height is optional, as calculated based on large image.
			var thumbBounds;
			if (item.initialLayout) {
				thumbBounds = item.initialLayout;
				item.initialLayout = null;
			} else {
				thumbBounds = _options.getThumbBoundsFn && _options.getThumbBoundsFn(_currentItemIndex);
			}

			var duration = out ? _options.hideAnimationDuration : _options.showAnimationDuration;

			var onComplete = function onComplete() {
				_stopAnimation('initialZoom');
				if (!out) {
					_applyBgOpacity(1);
					if (img) {
						img.style.display = 'block';
					}
					framework.addClass(template, 'pswp--animated-in');
					_shout('initialZoom' + (out ? 'OutEnd' : 'InEnd'));
				} else {
					self.template.removeAttribute('style');
					self.bg.removeAttribute('style');
				}

				if (completeFn) {
					completeFn();
				}
				_initialZoomRunning = false;
			};

			// if bounds aren't provided, just open gallery without animation
			if (!duration || !thumbBounds || thumbBounds.x === undefined) {

				var finishWithoutAnimation = function finishWithoutAnimation() {
					_shout('initialZoom' + (out ? 'Out' : 'In'));

					_currZoomLevel = item.initialZoomLevel;
					_equalizePoints(_panOffset, item.initialPosition);
					_applyCurrentZoomPan();

					// no transition
					template.style.opacity = out ? 0 : 1;
					_applyBgOpacity(1);

					onComplete();
				};
				finishWithoutAnimation();

				return;
			}

			var startAnimation = function startAnimation() {
				var closeWithRaf = _closedByScroll,
				    fadeEverything = !self.currItem.src || self.currItem.loadError || _options.showHideOpacity;

				// apply hw-acceleration to image
				if (item.miniImg) {
					item.miniImg.style.webkitBackfaceVisibility = 'hidden';
				}

				if (!out) {
					_currZoomLevel = thumbBounds.w / item.w;
					_panOffset.x = thumbBounds.x;
					_panOffset.y = thumbBounds.y - _initalWindowScrollY;

					self[fadeEverything ? 'template' : 'bg'].style.opacity = 0.001;
					_applyCurrentZoomPan();
				}

				_registerStartAnimation('initialZoom');

				if (out && !closeWithRaf) {
					framework.removeClass(template, 'pswp--animated-in');
				}

				if (fadeEverything) {
					if (out) {
						framework[(closeWithRaf ? 'remove' : 'add') + 'Class'](template, 'pswp--animate_opacity');
					} else {
						setTimeout(function () {
							framework.addClass(template, 'pswp--animate_opacity');
						}, 30);
					}
				}

				_showOrHideTimeout = setTimeout(function () {

					_shout('initialZoom' + (out ? 'Out' : 'In'));

					if (!out) {

						// "in" animation always uses CSS transitions (instead of rAF).
						// CSS transition work faster here,
						// as developer may also want to animate other things,
						// like ui on top of sliding area, which can be animated just via CSS

						_currZoomLevel = item.initialZoomLevel;
						_equalizePoints(_panOffset, item.initialPosition);
						_applyCurrentZoomPan();
						_applyBgOpacity(1);

						if (fadeEverything) {
							template.style.opacity = 1;
						} else {
							_applyBgOpacity(1);
						}

						_showOrHideTimeout = setTimeout(onComplete, duration + 20);
					} else {

						// "out" animation uses rAF only when PhotoSwipe is closed by browser scroll, to recalculate position
						var destZoomLevel = thumbBounds.w / item.w,
						    initialPanOffset = {
							x: _panOffset.x,
							y: _panOffset.y
						},
						    initialZoomLevel = _currZoomLevel,
						    initalBgOpacity = _bgOpacity,
						    onUpdate = function onUpdate(now) {

							if (now === 1) {
								_currZoomLevel = destZoomLevel;
								_panOffset.x = thumbBounds.x;
								_panOffset.y = thumbBounds.y - _currentWindowScrollY;
							} else {
								_currZoomLevel = (destZoomLevel - initialZoomLevel) * now + initialZoomLevel;
								_panOffset.x = (thumbBounds.x - initialPanOffset.x) * now + initialPanOffset.x;
								_panOffset.y = (thumbBounds.y - _currentWindowScrollY - initialPanOffset.y) * now + initialPanOffset.y;
							}

							_applyCurrentZoomPan();
							if (fadeEverything) {
								template.style.opacity = 1 - now;
							} else {
								_applyBgOpacity(initalBgOpacity - now * initalBgOpacity);
							}
						};

						if (closeWithRaf) {
							_animateProp('initialZoom', 0, 1, duration, framework.easing.cubic.out, onUpdate, onComplete);
						} else {
							onUpdate(1);
							_showOrHideTimeout = setTimeout(onComplete, duration + 20);
						}
					}
				}, out ? 25 : 90); // Main purpose of this delay is to give browser time to paint and
				// create composite layers of PhotoSwipe UI parts (background, controls, caption, arrows).
				// Which avoids lag at the beginning of scale transition.
			};
			startAnimation();
		};

		/*>>show-hide-transition*/

		/*>>items-controller*/
		/**
  *
  * Controller manages gallery items, their dimensions, and their content.
  * 
  */

		var _items,
		    _tempPanAreaSize = {},
		    _imagesToAppendPool = [],
		    _initialContentSet,
		    _initialZoomRunning,
		    _controllerDefaultOptions = {
			index: 0,
			errorMsg: '<div class="pswp__error-msg"><a href="%url%" target="_blank">The image</a> could not be loaded.</div>',
			forceProgressiveLoading: false, // TODO
			preload: [1, 1],
			getNumItemsFn: function getNumItemsFn() {
				return _items.length;
			}
		};

		var _getItemAt,
		    _getNumItems,
		    _initialIsLoop,
		    _getZeroBounds = function _getZeroBounds() {
			return {
				center: { x: 0, y: 0 },
				max: { x: 0, y: 0 },
				min: { x: 0, y: 0 }
			};
		},
		    _calculateSingleItemPanBounds = function _calculateSingleItemPanBounds(item, realPanElementW, realPanElementH) {
			var bounds = item.bounds;

			// position of element when it's centered
			bounds.center.x = Math.round((_tempPanAreaSize.x - realPanElementW) / 2);
			bounds.center.y = Math.round((_tempPanAreaSize.y - realPanElementH) / 2) + item.vGap.top;

			// maximum pan position
			bounds.max.x = realPanElementW > _tempPanAreaSize.x ? Math.round(_tempPanAreaSize.x - realPanElementW) : bounds.center.x;

			bounds.max.y = realPanElementH > _tempPanAreaSize.y ? Math.round(_tempPanAreaSize.y - realPanElementH) + item.vGap.top : bounds.center.y;

			// minimum pan position
			bounds.min.x = realPanElementW > _tempPanAreaSize.x ? 0 : bounds.center.x;
			bounds.min.y = realPanElementH > _tempPanAreaSize.y ? item.vGap.top : bounds.center.y;
		},
		    _calculateItemSize = function _calculateItemSize(item, viewportSize, zoomLevel) {

			if (item.src && !item.loadError) {
				var isInitial = !zoomLevel;

				if (isInitial) {
					if (!item.vGap) {
						item.vGap = { top: 0, bottom: 0 };
					}
					// allows overriding vertical margin for individual items
					_shout('parseVerticalMargin', item);
				}

				_tempPanAreaSize.x = viewportSize.x;
				_tempPanAreaSize.y = viewportSize.y - item.vGap.top - item.vGap.bottom;

				if (isInitial) {
					var hRatio = _tempPanAreaSize.x / item.w;
					var vRatio = _tempPanAreaSize.y / item.h;

					item.fitRatio = hRatio < vRatio ? hRatio : vRatio;
					//item.fillRatio = hRatio > vRatio ? hRatio : vRatio;

					var scaleMode = _options.scaleMode;

					if (scaleMode === 'orig') {
						zoomLevel = 1;
					} else if (scaleMode === 'fit') {
						zoomLevel = item.fitRatio;
					}

					if (zoomLevel > 1) {
						zoomLevel = 1;
					}

					item.initialZoomLevel = zoomLevel;

					if (!item.bounds) {
						// reuse bounds object
						item.bounds = _getZeroBounds();
					}
				}

				if (!zoomLevel) {
					return;
				}

				_calculateSingleItemPanBounds(item, item.w * zoomLevel, item.h * zoomLevel);

				if (isInitial && zoomLevel === item.initialZoomLevel) {
					item.initialPosition = item.bounds.center;
				}

				return item.bounds;
			} else {
				item.w = item.h = 0;
				item.initialZoomLevel = item.fitRatio = 1;
				item.bounds = _getZeroBounds();
				item.initialPosition = item.bounds.center;

				// if it's not image, we return zero bounds (content is not zoomable)
				return item.bounds;
			}
			return false;
		},
		    _appendImage = function _appendImage(index, item, baseDiv, img, preventAnimation, keepPlaceholder) {

			if (item.loadError) {
				return;
			}

			if (img) {

				item.imageAppended = true;
				_setImageSize(item, img);

				baseDiv.appendChild(img);

				if (keepPlaceholder) {
					setTimeout(function () {
						if (item && item.loaded && item.placeholder) {
							item.placeholder.style.display = 'none';
							item.placeholder = null;
						}
					}, 500);
				}
			}
		},
		    _preloadImage = function _preloadImage(item) {
			item.loading = true;
			item.loaded = false;
			var img = item.img = framework.createEl('pswp__img', 'img');
			var onComplete = function onComplete() {
				item.loading = false;
				item.loaded = true;

				if (item.loadComplete) {
					item.loadComplete(item);
				} else {
					item.img = null; // no need to store image object
				}
				img.onload = img.onerror = null;
				img = null;
			};
			img.onload = onComplete;
			img.onerror = function () {
				item.loadError = true;
				onComplete();
			};

			img.src = item.src; // + '?a=' + Math.random();

			return img;
		},
		    _checkForError = function _checkForError(item, cleanUp) {
			if (item.src && item.loadError && item.container) {

				if (cleanUp) {
					item.container.innerHTML = '';
				}

				item.container.innerHTML = _options.errorMsg.replace('%url%', item.src);
				return true;
			}
		},
		    _setImageSize = function _setImageSize(item, img, maxRes) {
			if (!item.src) {
				return;
			}

			if (!img) {
				img = item.container.lastChild;
			}

			var w = maxRes ? item.w : Math.round(item.w * item.fitRatio),
			    h = maxRes ? item.h : Math.round(item.h * item.fitRatio);

			if (item.placeholder && !item.loaded) {
				item.placeholder.style.width = w + 'px';
				item.placeholder.style.height = h + 'px';
			}

			img.style.width = w + 'px';
			img.style.height = h + 'px';
		},
		    _appendImagesPool = function _appendImagesPool() {

			if (_imagesToAppendPool.length) {
				var poolItem;

				for (var i = 0; i < _imagesToAppendPool.length; i++) {
					poolItem = _imagesToAppendPool[i];
					if (poolItem.holder.index === poolItem.index) {
						_appendImage(poolItem.index, poolItem.item, poolItem.baseDiv, poolItem.img, false, poolItem.clearPlaceholder);
					}
				}
				_imagesToAppendPool = [];
			}
		};

		_registerModule('Controller', {

			publicMethods: {

				lazyLoadItem: function lazyLoadItem(index) {
					index = _getLoopedId(index);
					var item = _getItemAt(index);

					if (!item || item.loaded || item.loading) {
						return;
					}

					_shout('gettingData', index, item);

					if (!item.src) {
						return;
					}

					_preloadImage(item);
				},
				initController: function initController() {
					framework.extend(_options, _controllerDefaultOptions, true);
					self.items = _items = items;
					_getItemAt = self.getItemAt;
					_getNumItems = _options.getNumItemsFn; //self.getNumItems;

					_initialIsLoop = _options.loop;
					if (_getNumItems() < 3) {
						_options.loop = false; // disable loop if less then 3 items
					}

					_listen('beforeChange', function (diff) {

						var p = _options.preload,
						    isNext = diff === null ? true : diff > 0,
						    preloadBefore = Math.min(p[0], _getNumItems()),
						    preloadAfter = Math.min(p[1], _getNumItems()),
						    i;

						for (i = 1; i <= (isNext ? preloadAfter : preloadBefore); i++) {
							self.lazyLoadItem(_currentItemIndex + i);
						}
						for (i = 1; i <= (isNext ? preloadBefore : preloadAfter); i++) {
							self.lazyLoadItem(_currentItemIndex - i);
						}
					});

					_listen('initialLayout', function () {
						self.currItem.initialLayout = _options.getThumbBoundsFn && _options.getThumbBoundsFn(_currentItemIndex);
					});

					_listen('mainScrollAnimComplete', _appendImagesPool);
					_listen('initialZoomInEnd', _appendImagesPool);

					_listen('destroy', function () {
						var item;
						for (var i = 0; i < _items.length; i++) {
							item = _items[i];
							// remove reference to DOM elements, for GC
							if (item.container) {
								item.container = null;
							}
							if (item.placeholder) {
								item.placeholder = null;
							}
							if (item.img) {
								item.img = null;
							}
							if (item.preloader) {
								item.preloader = null;
							}
							if (item.loadError) {
								item.loaded = item.loadError = false;
							}
						}
						_imagesToAppendPool = null;
					});
				},

				getItemAt: function getItemAt(index) {
					if (index >= 0) {
						return _items[index] !== undefined ? _items[index] : false;
					}
					return false;
				},

				allowProgressiveImg: function allowProgressiveImg() {
					// 1. Progressive image loading isn't working on webkit/blink
					//    when hw-acceleration (e.g. translateZ) is applied to IMG element.
					//    That's why in PhotoSwipe parent element gets zoom transform, not image itself.
					//   
					// 2. Progressive image loading sometimes blinks in webkit/blink when applying animation to parent element.
					//    That's why it's disabled on touch devices (mainly because of swipe transition)
					//   
					// 3. Progressive image loading sometimes doesn't work in IE (up to 11).

					// Don't allow progressive loading on non-large touch devices
					return _options.forceProgressiveLoading || !_likelyTouchDevice || _options.mouseUsed || screen.width > 1200;
					// 1200 - to eliminate touch devices with large screen (like Chromebook Pixel)
				},

				setContent: function setContent(holder, index) {

					if (_options.loop) {
						index = _getLoopedId(index);
					}

					var prevItem = self.getItemAt(holder.index);
					if (prevItem) {
						prevItem.container = null;
					}

					var item = self.getItemAt(index),
					    img;

					if (!item) {
						holder.el.innerHTML = '';
						return;
					}

					// allow to override data
					_shout('gettingData', index, item);

					holder.index = index;
					holder.item = item;

					// base container DIV is created only once for each of 3 holders
					var baseDiv = item.container = framework.createEl('pswp__zoom-wrap');

					if (!item.src && item.html) {
						if (item.html.tagName) {
							baseDiv.appendChild(item.html);
						} else {
							baseDiv.innerHTML = item.html;
						}
					}

					_checkForError(item);

					_calculateItemSize(item, _viewportSize);

					if (item.src && !item.loadError && !item.loaded) {

						item.loadComplete = function (item) {

							// gallery closed before image finished loading
							if (!_isOpen) {
								return;
							}

							// check if holder hasn't changed while image was loading
							if (holder && holder.index === index) {
								if (_checkForError(item, true)) {
									item.loadComplete = item.img = null;
									_calculateItemSize(item, _viewportSize);
									_applyZoomPanToItem(item);

									if (holder.index === _currentItemIndex) {
										// recalculate dimensions
										self.updateCurrZoomItem();
									}
									return;
								}
								if (!item.imageAppended) {
									if (_features.transform && (_mainScrollAnimating || _initialZoomRunning)) {
										_imagesToAppendPool.push({
											item: item,
											baseDiv: baseDiv,
											img: item.img,
											index: index,
											holder: holder,
											clearPlaceholder: true
										});
									} else {
										_appendImage(index, item, baseDiv, item.img, _mainScrollAnimating || _initialZoomRunning, true);
									}
								} else {
									// remove preloader & mini-img
									if (!_initialZoomRunning && item.placeholder) {
										item.placeholder.style.display = 'none';
										item.placeholder = null;
									}
								}
							}

							item.loadComplete = null;
							item.img = null; // no need to store image element after it's added

							_shout('imageLoadComplete', index, item);
						};

						if (framework.features.transform) {

							var placeholderClassName = 'pswp__img pswp__img--placeholder';
							placeholderClassName += item.msrc ? '' : ' pswp__img--placeholder--blank';

							var placeholder = framework.createEl(placeholderClassName, item.msrc ? 'img' : '');
							if (item.msrc) {
								placeholder.src = item.msrc;
							}

							_setImageSize(item, placeholder);

							baseDiv.appendChild(placeholder);
							item.placeholder = placeholder;
						}

						if (!item.loading) {
							_preloadImage(item);
						}

						if (self.allowProgressiveImg()) {
							// just append image
							if (!_initialContentSet && _features.transform) {
								_imagesToAppendPool.push({
									item: item,
									baseDiv: baseDiv,
									img: item.img,
									index: index,
									holder: holder
								});
							} else {
								_appendImage(index, item, baseDiv, item.img, true, true);
							}
						}
					} else if (item.src && !item.loadError) {
						// image object is created every time, due to bugs of image loading & delay when switching images
						img = framework.createEl('pswp__img', 'img');
						img.style.opacity = 1;
						img.src = item.src;
						_setImageSize(item, img);
						_appendImage(index, item, baseDiv, img, true);
					}

					if (!_initialContentSet && index === _currentItemIndex) {
						_currZoomElementStyle = baseDiv.style;
						_showOrHide(item, img || item.img);
					} else {
						_applyZoomPanToItem(item);
					}

					holder.el.innerHTML = '';
					holder.el.appendChild(baseDiv);
				},

				cleanSlide: function cleanSlide(item) {
					if (item.img) {
						item.img.onload = item.img.onerror = null;
					}
					item.loaded = item.loading = item.img = item.imageAppended = false;
				}

			}
		});

		/*>>items-controller*/

		/*>>tap*/
		/**
   * tap.js:
   *
   * Displatches tap and double-tap events.
   * 
   */

		var tapTimer,
		    tapReleasePoint = {},
		    _dispatchTapEvent = function _dispatchTapEvent(origEvent, releasePoint, pointerType) {
			var e = document.createEvent('CustomEvent'),
			    eDetail = {
				origEvent: origEvent,
				target: origEvent.target,
				releasePoint: releasePoint,
				pointerType: pointerType || 'touch'
			};

			e.initCustomEvent('pswpTap', true, true, eDetail);
			origEvent.target.dispatchEvent(e);
		};

		_registerModule('Tap', {
			publicMethods: {
				initTap: function initTap() {
					_listen('firstTouchStart', self.onTapStart);
					_listen('touchRelease', self.onTapRelease);
					_listen('destroy', function () {
						tapReleasePoint = {};
						tapTimer = null;
					});
				},
				onTapStart: function onTapStart(touchList) {
					if (touchList.length > 1) {
						clearTimeout(tapTimer);
						tapTimer = null;
					}
				},
				onTapRelease: function onTapRelease(e, releasePoint) {
					if (!releasePoint) {
						return;
					}

					if (!_moved && !_isMultitouch && !_numAnimations) {
						var p0 = releasePoint;
						if (tapTimer) {
							clearTimeout(tapTimer);
							tapTimer = null;

							// Check if taped on the same place
							if (_isNearbyPoints(p0, tapReleasePoint)) {
								_shout('doubleTap', p0);
								return;
							}
						}

						if (releasePoint.type === 'mouse') {
							_dispatchTapEvent(e, releasePoint, 'mouse');
							return;
						}

						var clickedTagName = e.target.tagName.toUpperCase();
						// avoid double tap delay on buttons and elements that have class pswp__single-tap
						if (clickedTagName === 'BUTTON' || framework.hasClass(e.target, 'pswp__single-tap')) {
							_dispatchTapEvent(e, releasePoint);
							return;
						}

						_equalizePoints(tapReleasePoint, p0);

						tapTimer = setTimeout(function () {
							_dispatchTapEvent(e, releasePoint);
							tapTimer = null;
						}, 300);
					}
				}
			}
		});

		/*>>tap*/

		/*>>desktop-zoom*/
		/**
   *
   * desktop-zoom.js:
   *
   * - Binds mousewheel event for paning zoomed image.
   * - Manages "dragging", "zoomed-in", "zoom-out" classes.
   *   (which are used for cursors and zoom icon)
   * - Adds toggleDesktopZoom function.
   * 
   */

		var _wheelDelta;

		_registerModule('DesktopZoom', {

			publicMethods: {

				initDesktopZoom: function initDesktopZoom() {

					if (_oldIE) {
						// no zoom for old IE (<=8)
						return;
					}

					if (_likelyTouchDevice) {
						// if detected hardware touch support, we wait until mouse is used,
						// and only then apply desktop-zoom features
						_listen('mouseUsed', function () {
							self.setupDesktopZoom();
						});
					} else {
						self.setupDesktopZoom(true);
					}
				},

				setupDesktopZoom: function setupDesktopZoom(onInit) {

					_wheelDelta = {};

					var events = 'wheel mousewheel DOMMouseScroll';

					_listen('bindEvents', function () {
						framework.bind(template, events, self.handleMouseWheel);
					});

					_listen('unbindEvents', function () {
						if (_wheelDelta) {
							framework.unbind(template, events, self.handleMouseWheel);
						}
					});

					self.mouseZoomedIn = false;

					var hasDraggingClass,
					    updateZoomable = function updateZoomable() {
						if (self.mouseZoomedIn) {
							framework.removeClass(template, 'pswp--zoomed-in');
							self.mouseZoomedIn = false;
						}
						if (_currZoomLevel < 1) {
							framework.addClass(template, 'pswp--zoom-allowed');
						} else {
							framework.removeClass(template, 'pswp--zoom-allowed');
						}
						removeDraggingClass();
					},
					    removeDraggingClass = function removeDraggingClass() {
						if (hasDraggingClass) {
							framework.removeClass(template, 'pswp--dragging');
							hasDraggingClass = false;
						}
					};

					_listen('resize', updateZoomable);
					_listen('afterChange', updateZoomable);
					_listen('pointerDown', function () {
						if (self.mouseZoomedIn) {
							hasDraggingClass = true;
							framework.addClass(template, 'pswp--dragging');
						}
					});
					_listen('pointerUp', removeDraggingClass);

					if (!onInit) {
						updateZoomable();
					}
				},

				handleMouseWheel: function handleMouseWheel(e) {

					if (_currZoomLevel <= self.currItem.fitRatio) {
						if (_options.modal) {

							if (!_options.closeOnScroll || _numAnimations || _isDragging) {
								e.preventDefault();
							} else if (_transformKey && Math.abs(e.deltaY) > 2) {
								// close PhotoSwipe
								// if browser supports transforms & scroll changed enough
								_closedByScroll = true;
								self.close();
							}
						}
						return true;
					}

					// allow just one event to fire
					e.stopPropagation();

					// https://developer.mozilla.org/en-US/docs/Web/Events/wheel
					_wheelDelta.x = 0;

					if ('deltaX' in e) {
						if (e.deltaMode === 1 /* DOM_DELTA_LINE */) {
							// 18 - average line height
							_wheelDelta.x = e.deltaX * 18;
							_wheelDelta.y = e.deltaY * 18;
						} else {
							_wheelDelta.x = e.deltaX;
							_wheelDelta.y = e.deltaY;
						}
					} else if ('wheelDelta' in e) {
						if (e.wheelDeltaX) {
							_wheelDelta.x = -0.16 * e.wheelDeltaX;
						}
						if (e.wheelDeltaY) {
							_wheelDelta.y = -0.16 * e.wheelDeltaY;
						} else {
							_wheelDelta.y = -0.16 * e.wheelDelta;
						}
					} else if ('detail' in e) {
						_wheelDelta.y = e.detail;
					} else {
						return;
					}

					_calculatePanBounds(_currZoomLevel, true);

					var newPanX = _panOffset.x - _wheelDelta.x,
					    newPanY = _panOffset.y - _wheelDelta.y;

					// only prevent scrolling in nonmodal mode when not at edges
					if (_options.modal || newPanX <= _currPanBounds.min.x && newPanX >= _currPanBounds.max.x && newPanY <= _currPanBounds.min.y && newPanY >= _currPanBounds.max.y) {
						e.preventDefault();
					}

					// TODO: use rAF instead of mousewheel?
					self.panTo(newPanX, newPanY);
				},

				toggleDesktopZoom: function toggleDesktopZoom(centerPoint) {
					centerPoint = centerPoint || { x: _viewportSize.x / 2 + _offset.x, y: _viewportSize.y / 2 + _offset.y };

					var doubleTapZoomLevel = _options.getDoubleTapZoom(true, self.currItem);
					var zoomOut = _currZoomLevel === doubleTapZoomLevel;

					self.mouseZoomedIn = !zoomOut;

					self.zoomTo(zoomOut ? self.currItem.initialZoomLevel : doubleTapZoomLevel, centerPoint, 333);
					framework[(!zoomOut ? 'add' : 'remove') + 'Class'](template, 'pswp--zoomed-in');
				}

			}
		});

		/*>>desktop-zoom*/
		framework.extend(self, publicMethods);
	};
	return PhotoSwipe;
});
/*! PhotoSwipe - v4.1.0 - 2015-07-11
* http://photoswipe.com
* Copyright (c) 2015 Dmitry Semenov; */
'use strict';

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.PhotoSwipeUI_Default = factory();
	}
})(window, function () {

	'use strict';

	var PhotoSwipeUI_Default = function PhotoSwipeUI_Default(pswp, framework) {

		var ui = this;
		var _overlayUIUpdated = false,
		    _controlsVisible = true,
		    _fullscrenAPI,
		    _controls,
		    _captionContainer,
		    _fakeCaptionContainer,
		    _indexIndicator,
		    _shareButton,
		    _shareModal,
		    _shareModalHidden = true,
		    _initalCloseOnScrollValue,
		    _isIdle,
		    _listen,
		    _loadingIndicator,
		    _loadingIndicatorHidden,
		    _loadingIndicatorTimeout,
		    _galleryHasOneSlide,
		    _options,
		    _defaultUIOptions = {
			barsSize: { top: 44, bottom: 'auto' },
			closeElClasses: ['item', 'caption', 'zoom-wrap', 'ui', 'top-bar'],
			timeToIdle: 4000,
			timeToIdleOutside: 1000,
			loadingIndicatorDelay: 1000, // 2s

			addCaptionHTMLFn: function addCaptionHTMLFn(item, captionEl /*, isFake */) {
				if (!item.title) {
					captionEl.children[0].innerHTML = '';
					return false;
				}
				captionEl.children[0].innerHTML = item.title;
				return true;
			},

			closeEl: true,
			captionEl: true,
			fullscreenEl: true,
			zoomEl: true,
			shareEl: true,
			counterEl: true,
			arrowEl: true,
			preloaderEl: true,

			tapToClose: false,
			tapToToggleControls: true,

			clickToCloseNonZoomable: true,

			shareButtons: [{ id: 'facebook', label: 'Share on Facebook', url: 'https://www.facebook.com/sharer/sharer.php?u={{url}}' }, { id: 'twitter', label: 'Tweet', url: 'https://twitter.com/intent/tweet?text={{text}}&url={{url}}' }, { id: 'pinterest', label: 'Pin it', url: 'http://www.pinterest.com/pin/create/button/' + '?url={{url}}&media={{image_url}}&description={{text}}' }, { id: 'download', label: 'Download image', url: '{{raw_image_url}}', download: true }],
			getImageURLForShare: function getImageURLForShare() /* shareButtonData */{
				return pswp.currItem.src || '';
			},
			getPageURLForShare: function getPageURLForShare() /* shareButtonData */{
				return window.location.href;
			},
			getTextForShare: function getTextForShare() /* shareButtonData */{
				return pswp.currItem.title || '';
			},

			indexIndicatorSep: ' / '

		},
		    _blockControlsTap,
		    _blockControlsTapTimeout;

		var _onControlsTap = function _onControlsTap(e) {
			if (_blockControlsTap) {
				return true;
			}

			e = e || window.event;

			if (_options.timeToIdle && _options.mouseUsed && !_isIdle) {
				// reset idle timer
				_onIdleMouseMove();
			}

			var target = e.target || e.srcElement,
			    uiElement,
			    clickedClass = target.className,
			    found;

			for (var i = 0; i < _uiElements.length; i++) {
				uiElement = _uiElements[i];
				if (uiElement.onTap && clickedClass.indexOf('pswp__' + uiElement.name) > -1) {
					uiElement.onTap();
					found = true;
				}
			}

			if (found) {
				if (e.stopPropagation) {
					e.stopPropagation();
				}
				_blockControlsTap = true;

				// Some versions of Android don't prevent ghost click event
				// when preventDefault() was called on touchstart and/or touchend.
				//
				// This happens on v4.3, 4.2, 4.1,
				// older versions strangely work correctly,
				// but just in case we add delay on all of them)	
				var tapDelay = framework.features.isOldAndroid ? 600 : 30;
				_blockControlsTapTimeout = setTimeout(function () {
					_blockControlsTap = false;
				}, tapDelay);
			}
		},
		    _fitControlsInViewport = function _fitControlsInViewport() {
			return !pswp.likelyTouchDevice || _options.mouseUsed || screen.width > 1200;
		},
		    _togglePswpClass = function _togglePswpClass(el, cName, add) {
			framework[(add ? 'add' : 'remove') + 'Class'](el, 'pswp__' + cName);
		},
		   

		// add class when there is just one item in the gallery
		// (by default it hides left/right arrows and 1ofX counter)
		_countNumItems = function _countNumItems() {
			var hasOneSlide = _options.getNumItemsFn() === 1;

			if (hasOneSlide !== _galleryHasOneSlide) {
				_togglePswpClass(_controls, 'ui--one-slide', hasOneSlide);
				_galleryHasOneSlide = hasOneSlide;
			}
		},
		    _toggleShareModalClass = function _toggleShareModalClass() {
			_togglePswpClass(_shareModal, 'share-modal--hidden', _shareModalHidden);
		},
		    _toggleShareModal = function _toggleShareModal() {

			_shareModalHidden = !_shareModalHidden;

			if (!_shareModalHidden) {
				_toggleShareModalClass();
				setTimeout(function () {
					if (!_shareModalHidden) {
						framework.addClass(_shareModal, 'pswp__share-modal--fade-in');
					}
				}, 30);
			} else {
				framework.removeClass(_shareModal, 'pswp__share-modal--fade-in');
				setTimeout(function () {
					if (_shareModalHidden) {
						_toggleShareModalClass();
					}
				}, 300);
			}

			if (!_shareModalHidden) {
				_updateShareURLs();
			}
			return false;
		},
		    _openWindowPopup = function _openWindowPopup(e) {
			e = e || window.event;
			var target = e.target || e.srcElement;

			pswp.shout('shareLinkClick', e, target);

			if (!target.href) {
				return false;
			}

			if (target.hasAttribute('download')) {
				return true;
			}

			window.open(target.href, 'pswp_share', 'scrollbars=yes,resizable=yes,toolbar=no,' + 'location=yes,width=550,height=420,top=100,left=' + (window.screen ? Math.round(screen.width / 2 - 275) : 100));

			if (!_shareModalHidden) {
				_toggleShareModal();
			}

			return false;
		},
		    _updateShareURLs = function _updateShareURLs() {
			var shareButtonOut = '',
			    shareButtonData,
			    shareURL,
			    image_url,
			    page_url,
			    share_text;

			for (var i = 0; i < _options.shareButtons.length; i++) {
				shareButtonData = _options.shareButtons[i];

				image_url = _options.getImageURLForShare(shareButtonData);
				page_url = _options.getPageURLForShare(shareButtonData);
				share_text = _options.getTextForShare(shareButtonData);

				shareURL = shareButtonData.url.replace('{{url}}', encodeURIComponent(page_url)).replace('{{image_url}}', encodeURIComponent(image_url)).replace('{{raw_image_url}}', image_url).replace('{{text}}', encodeURIComponent(share_text));

				shareButtonOut += '<a href="' + shareURL + '" target="_blank" ' + 'class="pswp__share--' + shareButtonData.id + '"' + (shareButtonData.download ? 'download' : '') + '>' + shareButtonData.label + '</a>';

				if (_options.parseShareButtonOut) {
					shareButtonOut = _options.parseShareButtonOut(shareButtonData, shareButtonOut);
				}
			}
			_shareModal.children[0].innerHTML = shareButtonOut;
			_shareModal.children[0].onclick = _openWindowPopup;
		},
		    _hasCloseClass = function _hasCloseClass(target) {
			for (var i = 0; i < _options.closeElClasses.length; i++) {
				if (framework.hasClass(target, 'pswp__' + _options.closeElClasses[i])) {
					return true;
				}
			}
		},
		    _idleInterval,
		    _idleTimer,
		    _idleIncrement = 0,
		    _onIdleMouseMove = function _onIdleMouseMove() {
			clearTimeout(_idleTimer);
			_idleIncrement = 0;
			if (_isIdle) {
				ui.setIdle(false);
			}
		},
		    _onMouseLeaveWindow = function _onMouseLeaveWindow(e) {
			e = e ? e : window.event;
			var from = e.relatedTarget || e.toElement;
			if (!from || from.nodeName === 'HTML') {
				clearTimeout(_idleTimer);
				_idleTimer = setTimeout(function () {
					ui.setIdle(true);
				}, _options.timeToIdleOutside);
			}
		},
		    _setupFullscreenAPI = function _setupFullscreenAPI() {
			if (_options.fullscreenEl) {
				if (!_fullscrenAPI) {
					_fullscrenAPI = ui.getFullscreenAPI();
				}
				if (_fullscrenAPI) {
					framework.bind(document, _fullscrenAPI.eventK, ui.updateFullscreen);
					ui.updateFullscreen();
					framework.addClass(pswp.template, 'pswp--supports-fs');
				} else {
					framework.removeClass(pswp.template, 'pswp--supports-fs');
				}
			}
		},
		    _setupLoadingIndicator = function _setupLoadingIndicator() {
			// Setup loading indicator
			if (_options.preloaderEl) {

				_toggleLoadingIndicator(true);

				_listen('beforeChange', function () {

					clearTimeout(_loadingIndicatorTimeout);

					// display loading indicator with delay
					_loadingIndicatorTimeout = setTimeout(function () {

						if (pswp.currItem && pswp.currItem.loading) {

							if (!pswp.allowProgressiveImg() || pswp.currItem.img && !pswp.currItem.img.naturalWidth) {
								// show preloader if progressive loading is not enabled,
								// or image width is not defined yet (because of slow connection)
								_toggleLoadingIndicator(false);
								// items-controller.js function allowProgressiveImg
							}
						} else {
								_toggleLoadingIndicator(true); // hide preloader
							}
					}, _options.loadingIndicatorDelay);
				});
				_listen('imageLoadComplete', function (index, item) {
					if (pswp.currItem === item) {
						_toggleLoadingIndicator(true);
					}
				});
			}
		},
		    _toggleLoadingIndicator = function _toggleLoadingIndicator(hide) {
			if (_loadingIndicatorHidden !== hide) {
				_togglePswpClass(_loadingIndicator, 'preloader--active', !hide);
				_loadingIndicatorHidden = hide;
			}
		},
		    _applyNavBarGaps = function _applyNavBarGaps(item) {
			var gap = item.vGap;

			if (_fitControlsInViewport()) {

				var bars = _options.barsSize;
				if (_options.captionEl && bars.bottom === 'auto') {
					if (!_fakeCaptionContainer) {
						_fakeCaptionContainer = framework.createEl('pswp__caption pswp__caption--fake');
						_fakeCaptionContainer.appendChild(framework.createEl('pswp__caption__center'));
						_controls.insertBefore(_fakeCaptionContainer, _captionContainer);
						framework.addClass(_controls, 'pswp__ui--fit');
					}
					if (_options.addCaptionHTMLFn(item, _fakeCaptionContainer, true)) {

						var captionSize = _fakeCaptionContainer.clientHeight;
						gap.bottom = parseInt(captionSize, 10) || 44;
					} else {
						gap.bottom = bars.top; // if no caption, set size of bottom gap to size of top
					}
				} else {
						gap.bottom = bars.bottom === 'auto' ? 0 : bars.bottom;
					}

				// height of top bar is static, no need to calculate it
				gap.top = bars.top;
			} else {
				gap.top = gap.bottom = 0;
			}
		},
		    _setupIdle = function _setupIdle() {
			// Hide controls when mouse is used
			if (_options.timeToIdle) {
				_listen('mouseUsed', function () {

					framework.bind(document, 'mousemove', _onIdleMouseMove);
					framework.bind(document, 'mouseout', _onMouseLeaveWindow);

					_idleInterval = setInterval(function () {
						_idleIncrement++;
						if (_idleIncrement === 2) {
							ui.setIdle(true);
						}
					}, _options.timeToIdle / 2);
				});
			}
		},
		    _setupHidingControlsDuringGestures = function _setupHidingControlsDuringGestures() {

			// Hide controls on vertical drag
			_listen('onVerticalDrag', function (now) {
				if (_controlsVisible && now < 0.95) {
					ui.hideControls();
				} else if (!_controlsVisible && now >= 0.95) {
					ui.showControls();
				}
			});

			// Hide controls when pinching to close
			var pinchControlsHidden;
			_listen('onPinchClose', function (now) {
				if (_controlsVisible && now < 0.9) {
					ui.hideControls();
					pinchControlsHidden = true;
				} else if (pinchControlsHidden && !_controlsVisible && now > 0.9) {
					ui.showControls();
				}
			});

			_listen('zoomGestureEnded', function () {
				pinchControlsHidden = false;
				if (pinchControlsHidden && !_controlsVisible) {
					ui.showControls();
				}
			});
		};

		var _uiElements = [{
			name: 'caption',
			option: 'captionEl',
			onInit: function onInit(el) {
				_captionContainer = el;
			}
		}, {
			name: 'share-modal',
			option: 'shareEl',
			onInit: function onInit(el) {
				_shareModal = el;
			},
			onTap: function onTap() {
				_toggleShareModal();
			}
		}, {
			name: 'button--share',
			option: 'shareEl',
			onInit: function onInit(el) {
				_shareButton = el;
			},
			onTap: function onTap() {
				_toggleShareModal();
			}
		}, {
			name: 'button--zoom',
			option: 'zoomEl',
			onTap: pswp.toggleDesktopZoom
		}, {
			name: 'counter',
			option: 'counterEl',
			onInit: function onInit(el) {
				_indexIndicator = el;
			}
		}, {
			name: 'button--close',
			option: 'closeEl',
			onTap: pswp.close
		}, {
			name: 'button--arrow--left',
			option: 'arrowEl',
			onTap: pswp.prev
		}, {
			name: 'button--arrow--right',
			option: 'arrowEl',
			onTap: pswp.next
		}, {
			name: 'button--fs',
			option: 'fullscreenEl',
			onTap: function onTap() {
				if (_fullscrenAPI.isFullscreen()) {
					_fullscrenAPI.exit();
				} else {
					_fullscrenAPI.enter();
				}
			}
		}, {
			name: 'preloader',
			option: 'preloaderEl',
			onInit: function onInit(el) {
				_loadingIndicator = el;
			}
		}];

		var _setupUIElements = function _setupUIElements() {
			var item, classAttr, uiElement;

			var loopThroughChildElements = function loopThroughChildElements(sChildren) {
				if (!sChildren) {
					return;
				}

				var l = sChildren.length;
				for (var i = 0; i < l; i++) {
					item = sChildren[i];
					classAttr = item.className;

					for (var a = 0; a < _uiElements.length; a++) {
						uiElement = _uiElements[a];

						if (classAttr.indexOf('pswp__' + uiElement.name) > -1) {

							if (_options[uiElement.option]) {
								// if element is not disabled from options

								framework.removeClass(item, 'pswp__element--disabled');
								if (uiElement.onInit) {
									uiElement.onInit(item);
								}

								//item.style.display = 'block';
							} else {
									framework.addClass(item, 'pswp__element--disabled');
									//item.style.display = 'none';
								}
						}
					}
				}
			};
			loopThroughChildElements(_controls.children);

			var topBar = framework.getChildByClass(_controls, 'pswp__top-bar');
			if (topBar) {
				loopThroughChildElements(topBar.children);
			}
		};

		ui.init = function () {

			// extend options
			framework.extend(pswp.options, _defaultUIOptions, true);

			// create local link for fast access
			_options = pswp.options;

			// find pswp__ui element
			_controls = framework.getChildByClass(pswp.scrollWrap, 'pswp__ui');

			// create local link
			_listen = pswp.listen;

			_setupHidingControlsDuringGestures();

			// update controls when slides change
			_listen('beforeChange', ui.update);

			// toggle zoom on double-tap
			_listen('doubleTap', function (point) {
				var initialZoomLevel = pswp.currItem.initialZoomLevel;
				if (pswp.getZoomLevel() !== initialZoomLevel) {
					pswp.zoomTo(initialZoomLevel, point, 333);
				} else {
					pswp.zoomTo(_options.getDoubleTapZoom(false, pswp.currItem), point, 333);
				}
			});

			// Allow text selection in caption
			_listen('preventDragEvent', function (e, isDown, preventObj) {
				var t = e.target || e.srcElement;
				if (t && t.className && e.type.indexOf('mouse') > -1 && (t.className.indexOf('__caption') > 0 || /(SMALL|STRONG|EM)/i.test(t.tagName))) {
					preventObj.prevent = false;
				}
			});

			// bind events for UI
			_listen('bindEvents', function () {
				framework.bind(_controls, 'pswpTap click', _onControlsTap);
				framework.bind(pswp.scrollWrap, 'pswpTap', ui.onGlobalTap);

				if (!pswp.likelyTouchDevice) {
					framework.bind(pswp.scrollWrap, 'mouseover', ui.onMouseOver);
				}
			});

			// unbind events for UI
			_listen('unbindEvents', function () {
				if (!_shareModalHidden) {
					_toggleShareModal();
				}

				if (_idleInterval) {
					clearInterval(_idleInterval);
				}
				framework.unbind(document, 'mouseout', _onMouseLeaveWindow);
				framework.unbind(document, 'mousemove', _onIdleMouseMove);
				framework.unbind(_controls, 'pswpTap click', _onControlsTap);
				framework.unbind(pswp.scrollWrap, 'pswpTap', ui.onGlobalTap);
				framework.unbind(pswp.scrollWrap, 'mouseover', ui.onMouseOver);

				if (_fullscrenAPI) {
					framework.unbind(document, _fullscrenAPI.eventK, ui.updateFullscreen);
					if (_fullscrenAPI.isFullscreen()) {
						_options.hideAnimationDuration = 0;
						_fullscrenAPI.exit();
					}
					_fullscrenAPI = null;
				}
			});

			// clean up things when gallery is destroyed
			_listen('destroy', function () {
				if (_options.captionEl) {
					if (_fakeCaptionContainer) {
						_controls.removeChild(_fakeCaptionContainer);
					}
					framework.removeClass(_captionContainer, 'pswp__caption--empty');
				}

				if (_shareModal) {
					_shareModal.children[0].onclick = null;
				}
				framework.removeClass(_controls, 'pswp__ui--over-close');
				framework.addClass(_controls, 'pswp__ui--hidden');
				ui.setIdle(false);
			});

			if (!_options.showAnimationDuration) {
				framework.removeClass(_controls, 'pswp__ui--hidden');
			}
			_listen('initialZoomIn', function () {
				if (_options.showAnimationDuration) {
					framework.removeClass(_controls, 'pswp__ui--hidden');
				}
			});
			_listen('initialZoomOut', function () {
				framework.addClass(_controls, 'pswp__ui--hidden');
			});

			_listen('parseVerticalMargin', _applyNavBarGaps);

			_setupUIElements();

			if (_options.shareEl && _shareButton && _shareModal) {
				_shareModalHidden = true;
			}

			_countNumItems();

			_setupIdle();

			_setupFullscreenAPI();

			_setupLoadingIndicator();
		};

		ui.setIdle = function (isIdle) {
			_isIdle = isIdle;
			_togglePswpClass(_controls, 'ui--idle', isIdle);
		};

		ui.update = function () {
			// Don't update UI if it's hidden
			if (_controlsVisible && pswp.currItem) {

				ui.updateIndexIndicator();

				if (_options.captionEl) {
					_options.addCaptionHTMLFn(pswp.currItem, _captionContainer);

					_togglePswpClass(_captionContainer, 'caption--empty', !pswp.currItem.title);
				}

				_overlayUIUpdated = true;
			} else {
				_overlayUIUpdated = false;
			}

			if (!_shareModalHidden) {
				_toggleShareModal();
			}

			_countNumItems();
		};

		ui.updateFullscreen = function (e) {

			if (e) {
				// some browsers change window scroll position during the fullscreen
				// so PhotoSwipe updates it just in case
				setTimeout(function () {
					pswp.setScrollOffset(0, framework.getScrollY());
				}, 50);
			}

			// toogle pswp--fs class on root element
			framework[(_fullscrenAPI.isFullscreen() ? 'add' : 'remove') + 'Class'](pswp.template, 'pswp--fs');
		};

		ui.updateIndexIndicator = function () {
			if (_options.counterEl) {
				_indexIndicator.innerHTML = pswp.getCurrentIndex() + 1 + _options.indexIndicatorSep + _options.getNumItemsFn();
			}
		};

		ui.onGlobalTap = function (e) {
			e = e || window.event;
			var target = e.target || e.srcElement;

			if (_blockControlsTap) {
				return;
			}

			if (e.detail && e.detail.pointerType === 'mouse') {

				// close gallery if clicked outside of the image
				if (_hasCloseClass(target)) {
					pswp.close();
					return;
				}

				if (framework.hasClass(target, 'pswp__img')) {
					if (pswp.getZoomLevel() === 1 && pswp.getZoomLevel() <= pswp.currItem.fitRatio) {
						if (_options.clickToCloseNonZoomable) {
							pswp.close();
						}
					} else {
						pswp.toggleDesktopZoom(e.detail.releasePoint);
					}
				}
			} else {

				// tap anywhere (except buttons) to toggle visibility of controls
				if (_options.tapToToggleControls) {
					if (_controlsVisible) {
						ui.hideControls();
					} else {
						ui.showControls();
					}
				}

				// tap to close gallery
				if (_options.tapToClose && (framework.hasClass(target, 'pswp__img') || _hasCloseClass(target))) {
					pswp.close();
					return;
				}
			}
		};
		ui.onMouseOver = function (e) {
			e = e || window.event;
			var target = e.target || e.srcElement;

			// add class when mouse is over an element that should close the gallery
			_togglePswpClass(_controls, 'ui--over-close', _hasCloseClass(target));
		};

		ui.hideControls = function () {
			framework.addClass(_controls, 'pswp__ui--hidden');
			_controlsVisible = false;
		};

		ui.showControls = function () {
			_controlsVisible = true;
			if (!_overlayUIUpdated) {
				ui.update();
			}
			framework.removeClass(_controls, 'pswp__ui--hidden');
		};

		ui.supportsFullscreen = function () {
			var d = document;
			return !!(d.exitFullscreen || d.mozCancelFullScreen || d.webkitExitFullscreen || d.msExitFullscreen);
		};

		ui.getFullscreenAPI = function () {
			var dE = document.documentElement,
			    api,
			    tF = 'fullscreenchange';

			if (dE.requestFullscreen) {
				api = {
					enterK: 'requestFullscreen',
					exitK: 'exitFullscreen',
					elementK: 'fullscreenElement',
					eventK: tF
				};
			} else if (dE.mozRequestFullScreen) {
				api = {
					enterK: 'mozRequestFullScreen',
					exitK: 'mozCancelFullScreen',
					elementK: 'mozFullScreenElement',
					eventK: 'moz' + tF
				};
			} else if (dE.webkitRequestFullscreen) {
				api = {
					enterK: 'webkitRequestFullscreen',
					exitK: 'webkitExitFullscreen',
					elementK: 'webkitFullscreenElement',
					eventK: 'webkit' + tF
				};
			} else if (dE.msRequestFullscreen) {
				api = {
					enterK: 'msRequestFullscreen',
					exitK: 'msExitFullscreen',
					elementK: 'msFullscreenElement',
					eventK: 'MSFullscreenChange'
				};
			}

			if (api) {
				api.enter = function () {
					// disable close-on-scroll in fullscreen
					_initalCloseOnScrollValue = _options.closeOnScroll;
					_options.closeOnScroll = false;

					if (this.enterK === 'webkitRequestFullscreen') {
						pswp.template[this.enterK](Element.ALLOW_KEYBOARD_INPUT);
					} else {
						return pswp.template[this.enterK]();
					}
				};
				api.exit = function () {
					_options.closeOnScroll = _initalCloseOnScrollValue;

					return document[this.exitK]();
				};
				api.isFullscreen = function () {
					return document[this.elementK];
				};
			}

			return api;
		};
	};
	return PhotoSwipeUI_Default;
});
/*! PhotoSwipe Default UI - 4.1.0 - 2015-07-11
* http://photoswipe.com
* Copyright (c) 2015 Dmitry Semenov; */
/**
*
* UI on top of main sliding area (caption, arrows, close button, etc.).
* Built just using public methods/properties of PhotoSwipe.
* 
*/
"use strict";

(function () {
    'use strict';

    function setAttributes(element, attributes) {
        for (var i in attributes) {
            if (attributes.hasOwnProperty(i)) {

                var attributeName = i;
                if (attributeName == "className") {
                    attributeName = "class";
                }

                element.setAttribute(attributeName, attributes[i]);
            }
        }
    }

    function appendChild(element, child) {
        if (typeof child == "string" || typeof child == "number") {
            child = document.createTextNode(child);
        }

        element.appendChild(child);
    }

    function appendChildren(element, children) {

        if (!Array.isArray(children)) {
            return appendChild(element, children);
        }

        for (var i in children) {
            if (children.hasOwnProperty(i)) {
                appendChild(element, children[i]);
            }
        }
    }

    function createElement(node, attributes, children) {
        var element = document.createElement(node);

        if (attributes) {
            setAttributes(element, attributes);
        }

        // Children can be more than one argument.
        var childrenLength = arguments.length - 2;
        if (childrenLength === 1) {
            appendChildren(element, children);
        } else if (childrenLength > 1) {
            var childArray = Array(childrenLength);
            for (var i = 0; i < childrenLength; i++) {
                childArray[i] = arguments[i + 2];
            }
            appendChildren(element, childArray);
        }

        return element;
    }

    self.React = {
        createElement: createElement
    };
})();
'use strict';

var initGallery = (function () {
    var galleryContent;

    // find nearest parent element
    function closest(_x, _x2) {
        var _left;

        var _again = true;

        _function: while (_again) {
            var el = _x,
                fn = _x2;
            _again = false;

            if (!(_left = el)) {
                return _left;
            }

            if (fn(el)) {
                return el;
            } else {
                _x = el.parentNode;
                _x2 = fn;
                _again = true;
                continue _function;
            }
        }
    }

    function onThumbnailsClick(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        var clickedListItem = closest(eTarget, function (el) {
            return el.tagName === 'LI';
        });

        if (!clickedListItem) {
            return;
        }

        var childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if (childNodes[i].nodeType !== 1) {
                continue;
            }

            if (childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }

        if (index >= 0) {
            openPhotoSwipe(index);
        }
        return false;
    }

    function openPhotoSwipe(index) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options;

        options = {
            index: parseInt(index, 10),
            getThumbBoundsFn: function getThumbBoundsFn(index) {
                // See Options->getThumbBoundsFn section of docs for more info
                var thumbnail = galleryContent[index].el.children[0],
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
            }
        };

        // exit if index not found
        if (isNaN(options.index)) {
            return;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, galleryContent, options);
        gallery.init();
    }

    return function (gallery, items) {
        gallery.onclick = onThumbnailsClick;

        galleryContent = items;
    };
})();

// On desktop computers we don't need touch support
"use strict";

window.touchdevice = 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch;

function image(preset, image) {
    if (!image) {
        return "";
    }

    return baseURL + "images/cache/" + preset + "/" + image.replace('#', '%23');
}

function renderHeader(url, data) {
    var head = [];

    var loc = window.location;
    var fullURL = loc.protocol + "//" + loc.host + (loc.port ? ":" + loc.port : "") + baseURL;

    if (url != fullURL) {
        head.push(React.createElement(
            "a",
            { href: baseURL, className: "btn btn-link btn-nav pull-right", "data-transition": "slide-out" },
            React.createElement("span", { className: "icon icon-home" })
        ));

        url = baseURL;
        var title = "Home";

        if (data.parent) {
            url = baseURL + "list/" + data.parent.path;
            title = data.parent.name;
        }

        head.push(React.createElement(
            "a",
            { href: url, className: "btn btn-link btn-nav pull-left", "data-transition": "slide-out" },
            React.createElement("span", { className: "icon icon-left-nav" }),
            title
        ));
    }

    head.push(React.createElement(
        "h1",
        { className: "title" },
        data.title
    ));

    return React.createElement(
        "header",
        { className: "bar bar-nav" },
        head
    );
}

function is_numeric(mixed_var) {
    var whitespace = " \n\r\t\f\u000b            ​\u2028\u2029　";
    return (typeof mixed_var === 'number' || typeof mixed_var === 'string' && whitespace.indexOf(mixed_var.slice(-1)) === -1) && mixed_var !== '' && !isNaN(mixed_var);
}

function renderList(data) {
    var content = [];
    var currentLetter = '',
        firstLetter,
        folder;

    for (var i in data.data) {
        if (data.data.hasOwnProperty(i)) {
            folder = data.data[i];

            firstLetter = folder.name.substring(0, 1).toUpperCase();

            if (is_numeric(firstLetter)) {
                firstLetter = "#";
            }

            if (firstLetter != currentLetter) {
                currentLetter = firstLetter;
                content.push(React.createElement(
                    "li",
                    { className: "table-view-divider" },
                    currentLetter
                ));
            }

            var cell, url;

            if (folder.type == "tome") {
                url = baseURL + "book/" + folder.path;
            } else {
                url = baseURL + "list/" + folder.path;
            }

            cell = React.createElement(
                "a",
                { href: url, className: "navigate-right", "data-transition": "slide-in" },
                React.createElement(
                    "div",
                    { className: "media-body" },
                    React.createElement("img", { className: "media-object pull-left lazy", "data-src": image('small', folder.thumb), width: "60", height: "75" }),
                    folder.name,
                    folder.type != "tome" ? React.createElement(
                        "p",
                        null,
                        folder.count,
                        " Tomes"
                    ) : ""
                )
            );

            content.push(React.createElement(
                "li",
                { className: "table-view-cell media" },
                cell
            ));
        }
    }

    return React.createElement(
        "div",
        { className: "content" },
        React.createElement(
            "ul",
            { className: "table-view" },
            content
        )
    );
}

function renderBook(data) {
    var photoSwipe = [];

    var book = [],
        items = [];
    var element, page;

    for (var i in data.book) {
        if (data.book.hasOwnProperty(i)) {
            page = data.book[i];

            var small = image("small", page.src),
                big = window.isRetina ? toRetina(image("big", page.src)) : image("big", page.src);

            element = React.createElement(
                "li",
                null,
                React.createElement("img", { "data-src": small, className: "lazy" })
            );

            photoSwipe.push({ el: element, w: page.width, h: page.height, src: big, msrc: small });
            book.push(element);
        }
    }

    var gallery = React.createElement(
        "div",
        { className: "content gallery-page" },
        React.createElement(
            "ol",
            { className: "gallery" },
            book
        )
    );

    initGallery(gallery, photoSwipe);

    return gallery;
}

window.addEventListener('load', function () {
    // Lazy load images
    window.resetImageList();

    function parseThumbnailElements(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            childElements,
            size,
            item;

        for (var i = 0; i < numNodes; i++) {
            el = thumbElements[i];

            // include only element nodes
            if (el.nodeType !== 1) {
                continue;
            }

            size = el.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: window.isRetina ? toRetina(el.getAttribute('data-img')) : el.getAttribute('data-img'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };

            item.el = el; // save link to element for getThumbBoundsFn

            childElements = el.children;
            if (childElements.length > 0) {
                item.msrc = childElements[0].getAttribute('src'); // thumbnail url
            }

            items.push(item);
        }

        return items;
    }

    var gallery = document.querySelectorAll('ol.gallery')[0];
    initGallery(gallery, parseThumbnailElements(gallery));
});

window.addEventListener('push', function () {
    // Lazy load images
    window.resetImageList();
});