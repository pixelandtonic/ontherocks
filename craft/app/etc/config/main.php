<?php

/**
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2013, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license1.0.html Craft License
 * @link      http://buildwithcraft.com
 */

$common = require_once(CRAFT_APP_PATH.'etc/config/common.php');

return CMap::mergeArray(
	$common,

	array(
		'basePath'    => CRAFT_APP_PATH,
		'runtimePath' => CRAFT_STORAGE_PATH.'runtime/',
		'name'        => 'Craft',

		// autoloading model and component classes
		'import' => array(
			'application.lib.*',
			'application.lib.PhpMailer.*',
			'application.lib.Requests.*',
			'application.lib.Requests.Auth.*',
			'application.lib.Requests.Response.*',
			'application.lib.Requests.Transport.*',
			'application.lib.qqFileUploader.*',
		),

		'params' => array(
			'generalConfig'        => $generalConfig,
			'requiredPhpVersion'   => '5.3.0',
			'requiredMysqlVersion' => '5.1.0'
		),
	)
);
