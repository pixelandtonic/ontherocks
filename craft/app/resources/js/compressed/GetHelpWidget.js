/*!
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2013, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license1.0.html Craft License
 * @link      http://buildwithcraft.com
 */
(function(a){Craft.GetHelpWidget=Garnish.Base.extend({$widget:null,$message:null,$sendBtn:null,$spinner:null,$error:null,originalBodyVal:null,loading:false,init:function(b){this.$widget=a("#widget"+b);this.$message=this.$widget.find(".message:first");this.$sendBtn=this.$widget.find(".submit:first");this.$spinner=this.$widget.find(".spinner:first");this.$error=this.$widget.find(".error:first");this.originalBodyVal=this.$message.val();this.addListener(this.$sendBtn,"activate","sendMessage")},sendMessage:function(){if(this.loading){return}this.loading=true;this.$sendBtn.addClass("active");this.$spinner.removeClass("hidden");var b={message:this.$message.val()};Craft.postActionRequest("dashboard/sendSupportRequest",b,a.proxy(function(c){this.loading=false;this.$sendBtn.removeClass("active");this.$spinner.addClass("hidden");if(c.success){this.$message.val(this.originalBodyVal);Craft.cp.displayNotice(Craft.t("Message sent successfully."))}else{this.$error.show()}},this))}})})(jQuery);