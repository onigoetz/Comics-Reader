function CarouselPane(src, $li) {
	var shown = false;
	
	//var image = new Image();
	//image.src = src;
		
	function fit() {
		//here comes the code to fit the image
	}
	
	this.offset = function() {
		return $li.position().left;
	}
	
	this.show = function() {
		if(shown) return;
		
        $li.css({
			'background-image': 'url("' + encodeURI(src) + '")',
            'background-size': 'contain',
            'background-position': 'center center',
            'background-repeat': 'no-repeat'
		});
		
		//$(window).on('resize', fit);
		//fit();
		shown = true;
	}
	
	/*
	 * Some mobile browser have a glitch that the memory isn't really
	 * freed on content deletion, but a replacement works, so we replace
	 * the content of the image by a null image and delete it
	 */
	this.remove = function() {
		$li.css({'background-image': 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='});
		$li.remove();
		
        /*if (image === null || typeof image === "undefined"){
            return;
        }
        
        if (image.src.indexOf(this.src) > -1){
            image.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
            if (!(image.parentNode === null || typeof image.parentNode === "undefined")){
				$(image).empty().remove();
            }
        }*/
	}
	
	this.show();
}
