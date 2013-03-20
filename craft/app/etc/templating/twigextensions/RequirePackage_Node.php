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
class RequirePackage_Node extends \Twig_Node
{
	/**
	 * Compiles a RequirePackage_Node into PHP.
	 */
	public function compile(\Twig_Compiler $compiler)
	{
		$compiler
			->addDebugInfo($this)
			->write('if (!\Craft\Craft::hasPackage(')
			->subcompile($this->getNode('packageName'))
			->raw("))\n")
			->write("{\n")
			->write("\tthrow new \Craft\HttpException(404);\n")
			->write("}\n");
	}
}
