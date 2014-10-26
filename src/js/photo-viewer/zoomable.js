// Zoomable lets you make things zoom!
// Give it a viewport - used to listen for touch events,
// and an element to zoom, and it will do the rest.
//
// You can also give it a parent widget if you want to have them
// contend for touch events and not conflict (at least, not too
// badly). Photoviewer uses this to mediate touches
// between zoomable and slideviewer.
PhotoViewer._Zoomable = function Zoomable(viewport, element, parent) {
	if (viewport === undefined) {
		throw new TypeError("Zoomable requires a viewport element as it's first argument!");
	}
	if (element === undefined) {
		throw new TypeError("Zoomable requires a element to zoom as it's second argument!");
	}
	if (parent === undefined) {
		parent = {
			enable: function () {},
			disable: function () {},
			moving: function () {
				return false;
			}
		};
	}

	var self = this;
	var prevTouchEnd = 0;
	var x, y, scale;

	self.reset = function () {
		x = 0;
		y = 0;
		scale = 1;
		prevTouchEnd = 0;
		setTransform(0);
		return self;
	};

	self.destroy = function () {
		touchy.stop();
		return self;
	};

	var touchy = PhotoViewer._Touchy(viewport, {
		one: one,
		two: two
	});

	self.reset();

	function one(hand, finger) {
		var prevX = finger.lastPoint.x;
		var prevY = finger.lastPoint.y;

		var maxX = findMaxX();
		if (Math.abs(x) >= maxX) {
			parent.enable();
		}
		boundXandY();

		finger.on('move', function (point) {
			prevTouchEnd = 0;
			if (scale <= 1) return;

			var dx = (point.x - prevX) / scale;
			var dy = (point.y - prevY) / scale;
			x += dx;
			y += dy;

			prevX = point.x;
			prevY = point.y;

			var maxX = findMaxX();
			if (Math.abs(x) <= maxX) {
				parent.disable();
			} else if (parent.moving()) {
				return;
			}

			setTransform(0);
		});

		finger.on('end', function (point) {
			if (parent.moving()) {
				boundXandY();
				setTransform(300);
				return;
			}

			var t = Date.now();
			var diff = t - prevTouchEnd;
			if (diff > 200) {
				prevTouchEnd = t;

				boundXandY();
				setTransform(500);
				return;
			}

			// Tap to zoom behaviour
			if (scale <= 1) {
				scale = 2;
				var ic = sc2ic(finger.lastPoint);
				x = ic.x;
				y = ic.y;
				boundXandY();
				setTransform(500);
			} else {
				scale = 1;
				x = 0;
				y = 0;
				setTransform(500);
			}
			prevTouchEnd = 0;
		});
	}

	function two(hand, finger1, finger2) {
		prevTouchEnd = 0;
		if (parent.moving()) return;
		parent.disable();

		var p1 = finger1.lastPoint;
		var p2 = finger2.lastPoint;

		var prevDist = dist(p1, p2);
		var startCenter = sc2ic(center(p1, p2));

		hand.on('move', function (points) {
			var p1 = finger1.lastPoint;
			var p2 = finger2.lastPoint;
			var newDist = dist(p1, p2);
			scale *= newDist / prevDist;
			prevDist = newDist;

			// We try and keep the same center, in
			// image coordinates, for the pinch
			// as the user had when they started.
			// This allows two finger panning, and a
			// pleasent "zooms to your fingers"
			// feeling.
			var newCenter = sc2ic(center(p1, p2));
			x += startCenter.x - newCenter.x;
			y += startCenter.y - newCenter.y;

			setTransform(0);
		});

		hand.on('end', function () {
			var minZoom = 1;
			var maxZoom = 4;
			if (scale <= 1) {
				parent.enable();
			}
			if (scale < minZoom) {
				scale = minZoom;
				x = 0;
				y = 0;
			}
			if (scale > maxZoom) {
				scale = maxZoom;
			}
			boundXandY();
			setTransform(300);
		});
	}

	function dist(p1, p2) {
		return Math.sqrt(
			Math.pow(p1.x - p2.x, 2) +
			Math.pow(p1.y - p2.y, 2)
		);
	}
	function center(p1, p2) {
		return {
			x: (p1.x + p2.x) / 2,
			y: (p1.y + p2.y) / 2
		};
	}
	function setTransform(t) {
		var r = function (num, places) {
			var multiplier = Math.pow(10, places);
			return Math.round(num * multiplier) / multiplier;
		};
		var tx = r(x * scale, 2);
		var ty = r(y * scale, 2);
		var ts = r(scale, 2);

		var tr = 'translateX(' + tx + 'px) ' +
		'translateY(' + ty + 'px) ' +
		'scale(' + ts + ',' + ts + ')';
		var tp = t === 0 ? 'none' : 'all';
		var td = r(t, 0) + 'ms';

		var s = element.style;
		s.webkitTransitionProperty = tp;
		s.webkitTransitionDuration = td;
		s.webkitTransform = tr;
	}
	function viewHalfX() {
		return viewport.offsetWidth / 2;
	}
	function viewHalfY() {
		return viewport.offsetHeight / 2;
	}
	function findMaxX() {
		var maxX = element.offsetWidth / 2 - viewHalfX() / scale;
		if (maxX < 0) return 0;
		else return maxX;
	}
	function findMaxY() {
		var maxY = element.offsetHeight / 2 - viewHalfY() / scale;
		if (maxY < 0) return 0;
		else return maxY;
	}
	function boundXandY() {
		var maxX = findMaxX();
		if (Math.abs(x) > maxX) {
			x = x > 0 ? maxX : -maxX;
		}
		var maxY = findMaxY();
		if (Math.abs(y) > maxY) {
			y = y > 0 ? maxY : -maxY;
		}
	}
	// Converts an abitrary point in screen
	// coordinates to the corresponding point
	// in image coordinates, given the transforms
	// and scaling currently in place.
	//
	//    screen coordinates        image coordinates
	//      +--------(+viewW)            (+maxY)
	//      |                               |
	//      |                   (+maxX)-----+------(-maxX)
	//      |                               |
	//    (+viewH)                       (-maxY)
	//
	// Notice X and Y are flipped, and the origin
	// has moved from the top-left corner to the
	// center.
	function sc2ic(sc) {
		return {
			x: x + (viewHalfX() - sc.x) / scale,
			y: y + (viewHalfY() - sc.y) / scale
		}
	}
};

PhotoViewer._Zoomable.deviceSupported = (function () {
	var match = /\bAndroid (\d+(\.\d+)?)/.exec(navigator.userAgent);
	if (!match) return true;

	var version = parseFloat(match[1]);
	return version > 3.0;
}());
