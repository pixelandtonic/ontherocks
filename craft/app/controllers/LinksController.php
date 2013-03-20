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
 *
 */
class LinksController extends BaseController
{
	/**
	 * Returns the modal body HTML.
	 */
	public function actionGetModalBody()
	{
		$type        = craft()->request->getRequiredPost('type');
		$name        = craft()->request->getRequiredPost('name');
		$settings    = JsonHelper::decode(craft()->request->getPost('settings'));
		$selectedIds = JsonHelper::decode(craft()->request->getPost('selectedIds'));

		$elementCriteria = craft()->elements->getCriteria($type, $settings);
		$elements = craft()->elements->findElements($elementCriteria);

		$this->renderTemplate('_components/fieldtypes/Links/modalbody', array(
			'name'        => $name,
			'elements'    => $elements,
			'selectedIds' => $selectedIds,
		));
	}
}
