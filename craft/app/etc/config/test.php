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

$main = require_once(CRAFT_APP_PATH.'etc/config/main.php');

$dbConfig['database'] = $dbConfig['database'].'_test';

return CMap::mergeArray(
	$main,

	array(
		'components' => array(
			'fixture' => array(
				'class' => 'system.test.CDbFixtureManager',
			),
			'request'
		),
	)
);
