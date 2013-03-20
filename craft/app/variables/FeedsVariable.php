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
class FeedsVariable
{
	/**
	 * @return array
	 */
	public function getFeedItems($url, $limit = 0, $offset = 0)
	{
		$items = craft()->feeds->getFeedItems($url, $limit, $offset);

		// Prevent everyone from having to use the |raw filter when outputting the title and content
		$rawProperties = array('title', 'content', 'summary');
		$charset = craft()->templates->getTwig()->getCharset();

		foreach ($items as &$item)
		{
			foreach ($rawProperties as $prop)
			{
				$item[$prop] = new \Twig_Markup($item[$prop], $charset);
			}
		}

		return $items;
	}
}
