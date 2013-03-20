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
class RequirePackage_TokenParser extends \Twig_TokenParser
{
	/**
	 * Parses {% requirePackage %} tags.
	 *
	 * @param \Twig_Token $token
	 * @return RequirePackage_Node
	 */
	public function parse(\Twig_Token $token)
	{
		$lineno = $token->getLine();
		$packageName = $this->parser->getExpressionParser()->parseExpression();
		$this->parser->getStream()->expect(\Twig_Token::BLOCK_END_TYPE);

		return new RequirePackage_Node(array('packageName' => $packageName), array(), $lineno, $this->getTag());
	}

	/**
	 * Defines the tag name.
	 *
	 * @return string
	 */
	public function getTag()
	{
		return 'requirePackage';
	}
}
