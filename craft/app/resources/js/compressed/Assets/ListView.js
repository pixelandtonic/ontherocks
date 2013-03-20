/*!
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2013, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license1.0.html Craft License
 * @link      http://buildwithcraft.com
 */
Assets.ListView=Garnish.Base.extend({init:function(b,a){this.$container=b;this.settings=(a||{});this.$table=$("> table",this.$container);this.$ths=$("> thead > tr > th",this.$table);this.$tbody=$("> tbody",this.$table);this.$tds=$("> tbody > tr:first > td",this.$table);this.$items;this.scrollbarWidth;this.scrollLeft=0;this.orderby=this.settings.orderby;this.sort=this.settings.sort;this._findItems();if(typeof this.settings.onSortChange=="function"){this.addListener(this.$ths,"click",function(c){var d=$(c.currentTarget).attr("data-orderby");if(d!=this.orderby){this.orderby=d;this.sort="asc"}else{this.sort=(this.sort=="asc"?"desc":"asc")}this.settings.onSortChange(this.orderby,this.sort)})}},_findItems:function(a){this.$items=$("> tr",this.$tbody)},getItems:function(){return this.$items},addItems:function(a){this.$tbody.append(a);this._findItems()},removeItems:function(a){a.remove();this._findItems()},reset:function(){this._findItems()},getContainer:function(){return this.$tbody},getDragHelper:function(b){var d=$('<div class="assets-listview assets-lv-drag" />'),c=$('<table cellpadding="0" cellspacing="0" border="0" />').appendTo(d),a=$("<tbody />").appendTo(c);c.width(this.$table.width());a.append(b);return d},getDragCaboose:function(){return $('<tr class="assets-lv-file assets-lv-dragcaboose" />')},getDragInsertion:function(){return $('<tr class="assts-lv-file assets-lv-draginsertion"><td colspan="'+this.$ths.length+'">&nbsp;</td></tr>')}});