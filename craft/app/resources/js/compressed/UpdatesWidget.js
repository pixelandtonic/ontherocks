/*!
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2013, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license1.0.html Craft License
 * @link      http://buildwithcraft.com
 */
(function(a){Craft.UpdatesWidget=Garnish.Base.extend({$widget:null,init:function(b){this.$widget=a("#widget"+b);this.$widget.addClass("loading");Craft.postActionRequest("dashboard/checkForUpdates",a.proxy(function(c){this.$widget.removeClass("loading");this.$widget.find(".body").html(c)},this))}})})(jQuery);