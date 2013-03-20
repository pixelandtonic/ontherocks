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
 * Validates the required User attributes for the installer.
 */
class AccountSettingsModel extends BaseModel
{
	/**
	 * @access protected
	 * @return array
	 */
	protected function defineAttributes()
	{
		return array(
			'username' => array(AttributeType::String, 'maxLength' => 100, 'required' => true),
			'email'    => array(AttributeType::Email, 'required' => true),
			'password' => array(AttributeType::String, 'minLength' => 6, 'required' => true)
		);
	}
}
