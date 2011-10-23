<?php
include('config.php');

$data = cache_get('GALLERY_FILES');
if(!$data){
    $data = gal_prepare_list(GALLERY_ROOT);
    cache_set('GALLERY_FILES', $data, 0);
}

?>
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="<?php echo BASE ?>css/jquery.mobile-1.0rc2.min.css" />
        <link rel="stylesheet" href="<?php echo BASE ?>css/photoswipe.css" />
        <script type="text/javascript" src="<?php echo BASE ?>js/jquery-1.6.4.min.js"></script>
        <script type="text/javascript" src="<?php echo BASE ?>js/jquery.mobile-1.0rc2.min.js"></script>
        <script type="text/javascript" src="<?php echo BASE ?>js/klass.min.js"></script>
        <script type="text/javascript" src="<?php echo BASE ?>js/code.photoswipe.jquery-2.1.6.min.js"></script>
        
	<script type="text/javascript">
		
		/*
		 * IMPORTANT!!!
		 * REMEMBER TO ADD  rel="external"  to your anchor tags. 
		 * If you don't this will mess with how jQuery Mobile works
		 */
		
		(function(window, $, PhotoSwipe){
			
			$(document).ready(function(){
				
				$('div.gallery-page')
					.live('pageshow', function(e){
						
						var 
							currentPage = $(e.target),
							options = {},
							photoSwipeInstance = $("ul.gallery a", e.target).photoSwipe(options,  currentPage.attr('id'));
							
						return true;
						
					})
					
					.live('pagehide', function(e){
						
						var 
							currentPage = $(e.target),
							photoSwipeInstance = PhotoSwipe.getInstance(currentPage.attr('id'));

						if (typeof photoSwipeInstance != "undefined" && photoSwipeInstance != null) {
							PhotoSwipe.detatch(photoSwipeInstance);
						}
						
						return true;
						
					});
				
			});
		
		}(window, window.jQuery, window.Code.PhotoSwipe));
		
	</script>
        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>
    <body>
        <div data-role="page" id="home">
            <div data-role="header"><h1>Comics Reader</h1></div>
            <div data-role="content"><?php gal_render_list($data); ?></div>
        </div>
    </body>
</html>