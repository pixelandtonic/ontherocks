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
 * Fieldtype interface
 */
interface IFieldType extends ISavableComponentType
{
	/**
	 * @return mixed
	 */
	public function defineContentAttribute();

	/**
	 * @param string $name
	 * @param mixed  $value
	 * @return string
	 */
	public function getInputHtml($name, $value);

	/**
	 * @return mixed
	 */
	public function getPostData();

	/**
	 */
	public function onBeforeSave();

	/**
	 */
	public function onAfterSave();

	/**
	 */
	public function onAfterElementSave();

	/**
	 * @param mixed $value
	 * @return mixed
	 */
	public function prepValue($value);
}
