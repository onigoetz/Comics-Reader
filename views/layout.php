<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="<?php echo BASE; ?>asset/css/jquery.mobile-1.1.0.min.css" />
        <link rel="stylesheet" href="<?php echo BASE; ?>asset/css/photoswipe.css" />
        <link rel="stylesheet" href="<?php echo BASE; ?>asset/css/specific.css" />
        <script type="text/javascript" src="<?php echo BASE; ?>asset/js/jquery-1.7.1.js"></script>
        <script type="text/javascript" src="<?php echo BASE; ?>asset/js/jquery.mobile-1.1.0.min.js"></script>
        <script type="text/javascript" src="<?php echo BASE; ?>asset/js/klass.min.js"></script>
        <script type="text/javascript" src="<?php echo BASE; ?>asset/js/code.photoswipe.jquery-3.0.4.min.js"></script>

        <script type="text/javascript">
		
            /*
             * IMPORTANT!!!
             * REMEMBER TO ADD  rel="external"  to your anchor tags. 
             * If you dont this will mess with how jQuery Mobile works
             */
		
            (function(window, $, PhotoSwipe){
			
                $(document).ready(function(){
				
                    $("div.gallery-page")
                    .live("pageshow", function(e){
						
                        var 
                        currentPage = $(e.target),
                        options = {},
                        photoSwipeInstance = $("ul.gallery a", e.target).photoSwipe(options,  currentPage.attr("id"));
							
                        return true;
						
                    })
					
                    .live("pagehide", function(e){
                        var photoSwipeInstance = PhotoSwipe.instances[0];
                                                
                        if (typeof photoSwipeInstance != "undefined" && photoSwipeInstance != null) {
                            if(photoSwipeInstance.documentOverlay){
                                photoSwipeInstance.hide();
                            }
                            PhotoSwipe.detatch(photoSwipeInstance);
                        }
						
                        return true;
						
                    });
                                       
                    //if its on the first page
                    if($("div.gallery-page ul.gallery a").size()){
                        $("div.gallery-page ul.gallery a").photoSwipe({});
                    }
				
                });
		
            }(window, window.jQuery, window.Code.PhotoSwipe));
		
        </script>

        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';
    </head>
    <body>
        <?php echo $content; ?>
    </body>
</html>