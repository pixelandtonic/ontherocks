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
class BaseApplicationComponent extends \CApplicationComponent
{
	// For consistency!
	/**
	 * @return bool
	 */
	public function isInitialized()
	{
		return $this->getIsInitialized();
	}
}
