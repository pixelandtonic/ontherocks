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
 * Folders parameters
 */
class FolderCriteriaModel extends BaseModel
{

	/**
	 * Has no parent folders.
	 */
	const AssetsNoParent = -1;

	/**
	 * @access protected
	 * @return array
	 */
	protected function defineAttributes()
	{
		return array(
			'id'       => AttributeType::Number,
			'parentId' => array(AttributeType::Number, 'default' => false),
			'sourceId' => AttributeType::Number,
			'name'     => AttributeType::String,
			'fullPath' => AttributeType::String,
			'order'    => array(AttributeType::String, 'default' => 'name asc'),
			'offset'   => AttributeType::Number,
			'limit'    => AttributeType::Number,
		);
	}
}
