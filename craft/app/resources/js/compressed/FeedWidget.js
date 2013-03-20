/*!
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2013, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license1.0.html Craft License
 * @link      http://buildwithcraft.com
 */
Craft.FeedWidget=Garnish.Base.extend({$widget:null,init:function(c,b,a){this.$widget=$("#widget"+c);this.$widget.addClass("loading");var d={url:b,limit:a};Craft.postActionRequest("dashboard/getFeedItems",d,$.proxy(function(e){var j=this.$widget.find("td");for(var f=0;f<e.items.length;f++){var g=e.items[f],k=$(j[f]);var h='<a href="'+g.permalink+'" target="_blank">'+g.title+"</a> ";if(g.date){h+='<span class="light nowrap">'+g.date+"</span>"}k.html(h)}this.$widget.removeClass("loading")},this))}});