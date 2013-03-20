<?php
namespace Craft;

/**
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2013, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license1.0.html Craft License
 * @link      http://buildwithcraft.com
 */

/**
 * Get Help widget
 */
class GetHelpWidget extends BaseWidget
{
	/**
	 * Returns the type of widget this is.
	 *
	 * @return string
	 */
	public function getName()
	{
		return Craft::t('Get Help');
	}

	/**
	 * Gets the widget's title.
	 *
	 * @return string
	 */
	public function getTitle()
	{
		return Craft::t('Send a message to Craft Support');
	}

	/**
	 * Gets the widget's body HTML.
	 *
	 * @return string
	 */
	public function getBodyHtml()
	{
		$id = $this->model->id;
		$js = "new Craft.GetHelpWidget({$id});";
		craft()->templates->includeJs($js);

		craft()->templates->includeJsResource('js/GetHelpWidget.js');
		craft()->templates->includeTranslations('Message sent successfully.');


		$message = "Enter your message here.\n\n" .
			"------------------------------\n\n" .
			'Craft version: ' .
			Craft::t('{version} build {build}', array(
				'version' => Craft::getVersion(),
				'build'   => Craft::getBuild()
			))."\n" .
			'Packages: '.implode(', ', Craft::getPackages());

		$plugins = craft()->plugins->getPlugins();

		if ($plugins)
		{
			$pluginNames = array();

			foreach ($plugins as $plugin)
			{
				$pluginNames[] = $plugin->getName().' ('.$plugin->getDeveloper().')';
			}

			$message .= "\nPlugins: ".implode(', ', $pluginNames);
		}

		return craft()->templates->render('_components/widgets/GetHelp/body', array(
			'message' => $message
		));
	}
}
