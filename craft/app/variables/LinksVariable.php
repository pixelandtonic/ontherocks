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
 * Link functions
 */
class LinksVariable
{
	/**
	 * Returns all linkable element types.
	 *
	 * @return array
	 */
	public function getAllLinkableElementTypes()
	{
		$elementTypes = craft()->links->getAllLinkableElementTypes();
		return ElementTypeVariable::populateVariables($elementTypes);
	}

	/**
	 * Returns a linkable element type.
	 *
	 * @param string $class
	 * @return ElementTypeVariable|null
	 */
	public function getLinkableElementType($class)
	{
		$elementType = craft()->links->getLinkableElementType($class);

		if ($elementType)
		{
			return new ElementTypeVariable($elementType);
		}
	}
}
