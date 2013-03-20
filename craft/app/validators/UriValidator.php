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
 * Will validate that the given attribute is a valid URI.
 */
class UriValidator extends \CValidator
{
	public $pattern = '/^[^\s]+$/';

	/**
	 * @param $object
	 * @param $attribute
	 */
	protected function validateAttribute($object, $attribute)
	{
		$uri = $object->$attribute;

		if ($uri && !preg_match($this->pattern, $uri))
		{
			$message = Craft::t('{attribute} is not a valid URI');
			$this->addError($object, $attribute, $message);
		}
	}
}
