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
 * Link model class
 *
 * Used for transporting link data throughout the system.
 */
class LinkModel extends BaseModel
{
	/**
	 * @access protected
	 * @return array
	 */
	protected function defineAttributes()
	{
		return array(
			'id'             => AttributeType::Number,
			'criteriaId'     => AttributeType::Number,
			'leftEntryId'    => AttributeType::Number,
			'rightEntryId'   => AttributeType::Number,
			'leftSortOrder'  => AttributeType::Number,
			'rightSortOrder' => AttributeType::Number,
		);
	}
}
