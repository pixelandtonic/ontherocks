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
 * Route functions
 */
class RoutesVariable
{
	/**
	 * Returns all routes.
	 */
	public function getAllRoutes()
	{
		$return = array();

		$routes = RouteRecord::model()->ordered()->findAll();

		foreach ($routes as $route)
		{
			$urlDisplayHtml = '';
			$urlParts = JsonHelper::decode($route->urlParts);

			foreach ($urlParts as $part)
			{
				if (is_string($part))
				{
					$urlDisplayHtml .= $part;
				}
				else
				{
					$urlDisplayHtml .= '<span class="token" data-name="'.$part[0].'" data-value="'.$part[1].'">'.$part[0].'</span>';
				}
			}

			$return[] = array(
				'id' => $route->id,
				'urlDisplayHtml' => $urlDisplayHtml,
				'template' => $route->template
			);
		}

		return $return;
	}
}
