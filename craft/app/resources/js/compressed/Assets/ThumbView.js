/*!
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2013, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license1.0.html Craft License
 * @link      http://buildwithcraft.com
 */
Assets.ThumbView=Garnish.Base.extend({init:function(a){this.$container=a;this.$ul=$("> ul",this.$container);this._findItems()},_findItems:function(a){this.$items=$("> li",this.$ul)},getItems:function(){return this.$items},addItems:function(a){this.$ul.append(a);this._findItems()},removeItems:function(a){a.remove();this._findItems()},reset:function(){this._findItems()},destroy:function(){delete obj},getContainer:function(){return this.$ul},getDragHelper:function(a){return $('<ul class="assets-tv-drag" />').append(a.removeClass("assets-selected"))},getDragCaboose:function(){return $('<li class="assets-tv-file assets-tv-dragcaboose" />')},getDragInsertion:function(a){return a.first().clone().show().css({"margin-right":0,visibility:"visible"}).addClass("assets-draginsertion")}});