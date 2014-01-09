<?php
class CustomView extends \Slim\View
{
	public function __construct($over_template)
	{
		$this->over_template = $over_template;
		
		parent::__construct();
	}
	
    /**
     * Render a template file
     *
     * NOTE: This method should be overridden by custom view subclasses
     *
     * @param  string $template     The template pathname, relative to the template base directory
     * @param  array  $data         Any additonal data to be passed to the template.
     * @return string               The rendered template
     * @throws \RuntimeException    If resolved template pathname is not a valid file
     */
    protected function render($template, $data = null)
    {
		$content = parent::render($template, $data);
		
		if(is_ajax()) {
			return $content;
		}
		
		$data['content'] = $content;
		
		return parent::render($this->over_template, $data);		
    }
}