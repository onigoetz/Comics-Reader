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
		$data = array_merge($this->data->all(), (array) $data);

		if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == "XMLHttpRequest") {
			\Slim\Slim::getInstance()->response()->header('Content-Type', 'application/json');
			return json_encode($this->toArray($data));
		}

		$data['content'] = parent::render($template, $data);

		return parent::render($this->over_template, $data);
    }

	protected function toArray($data) {
		foreach ($data as $key => $value) {
			if (is_array($value)) {
				$data[$key] = $this->toArray($value);
			} elseif ($value instanceof Node) {
				$data[$key] = $value->toArray();
			}
		}

		return $data;
	}
}
