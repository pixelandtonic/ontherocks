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
class IncludeResource_Node extends \Twig_Node
{
	/**
	 * Compiles an IncludeResource_Node into PHP.
	 */
	public function compile(\Twig_Compiler $compiler)
	{
		$function = $this->getAttribute('function');
		$path = $this->getNode('path');

		$compiler
			->addDebugInfo($this)
			->write('\Craft\craft()->templates->'.$function.'(')
			->subcompile($path);

		if ($this->getAttribute('first'))
		{
			$compiler->raw(', true');
		}

		$compiler->raw(");\n");
	}
}
