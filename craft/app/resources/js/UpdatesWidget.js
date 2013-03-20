/*!
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2013, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license1.0.html Craft License
 * @link      http://buildwithcraft.com
 */

(function($) {

Craft.UpdatesWidget = Garnish.Base.extend({

	$widget: null,

	init: function(widgetId)
	{
		this.$widget = $('#widget'+widgetId);
		this.$widget.addClass('loading');

		Craft.postActionRequest('dashboard/checkForUpdates', $.proxy(function(response) {

			this.$widget.removeClass('loading');
			this.$widget.find('.body').html(response);

		}, this));
	}
});


})(jQuery);
