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
class HttpException extends \CHttpException
{
	/**
	 * @param      $status
	 * @param null $message
	 * @param int  $code
	 */
	function __construct($status = '', $message = null, $code = 0)
	{
		$status = $status ? $status : '';
		Craft::log(($status ? $status.' - ' : '').$message, \CLogger::LEVEL_ERROR);
		parent::__construct($status, $message, $code);
	}
}
