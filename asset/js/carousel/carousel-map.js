function CarouselMap() {
	var items = {};

	function hash(index) {
		return '__' + index + '__'
	}

	this.all = function() {
		return items;
	};

	this.get = function(key) {
	    var item = items[hash(key)];
	    return item === undefined ? undefined : item.value;
	};

	this.has = function(key) {
		return items[hash(key)] !== undefined;
	};

	this.set = function(key, value) {
	    var h = hash(key);

	    if(this[h] === undefined) {
	        items[h] = { key : key, value : value };
	    }
	    else items[h].value = value;

	    return this;
	};

	this.remove = function(key) {
	    var h = hash(key);
	    var item = items[h];

	    if(item !== undefined) {
	        delete items[h];
	    }

	    return this;
	};

	this.keys = function() {
		var prop, keys = [];
		for(prop in items) {
			if(items.hasOwnProperty(prop)) {
				keys.push(items[prop].key);
			}
		}

		return keys;
	}
}
