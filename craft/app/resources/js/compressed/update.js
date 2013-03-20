/*!
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2013, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license1.0.html Craft License
 * @link      http://buildwithcraft.com
 */
(function(a){Craft.Updater=Garnish.Base.extend({$graphic:null,$status:null,data:null,init:function(c,b){this.$graphic=a("#graphic");this.$status=a("#status");if(!c){this.showError(Craft.t("Unable to determine what to update."));return}this.data={handle:c,manualUpdate:b};this.postActionRequest("update/prepare")},updateStatus:function(b){this.$status.html(b)},showError:function(b){this.updateStatus(b);this.$graphic.addClass("error")},postActionRequest:function(c){var b={data:this.data};Craft.postActionRequest(c,b,a.proxy(this,"onSuccessResponse"),a.proxy(this,"onErrorResponse"))},onSuccessResponse:function(b){if(!b.success&&!b.error){this.onErrorResponse();return}if(b.data){this.data=b.data}if(b.nextStatus){this.updateStatus(b.nextStatus)}if(b.nextAction){this.postActionRequest(b.nextAction)}if(b.error){this.$graphic.addClass("error");this.updateStatus(b.error)}else{if(b.finished){this.onFinish(b.returnUrl)}}},onErrorResponse:function(){this.showError(Craft.t("An unknown error occurred. Rolling back…"));this.postActionRequest("update/rollback")},onFinish:function(b){this.updateStatus(Craft.t("All done!"));this.$graphic.addClass("success");setTimeout(function(){if(b){window.location=Craft.getUrl(b)}else{window.location=Craft.getUrl("dashboard")}},500)}})})(jQuery);