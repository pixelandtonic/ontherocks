/*!
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2013, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license1.0.html Craft License
 * @link      http://buildwithcraft.com
 */
(function(a){a(".bucket-select select").change(function(){a(".url-prefix").val(a(".bucket-select select option:selected").attr("data-url-prefix"));a(".bucket-location").val(a(".bucket-select select option:selected").attr("data-location"))});a(".refresh-buckets").click(function(){if(a(this).hasClass("disabled")){return}a(this).addClass("disabled");var b={keyId:a(".s3-key-id").val(),secret:a(".s3-secret-key").val()};a.post(Craft.actionUrl+"/assetSources/getS3Buckets",b,a.proxy(function(c){a(this).removeClass("disabled");if(c.error){alert(c.error);return}if(c.length>0){var e=a(".bucket-select select").prop("disabled",false);var f=e.val();e.empty();for(var d=0;d<c.length;d++){e.append('<option value="'+c[d].bucket+'" data-url-prefix="'+c[d].url_prefix+'" data-location="'+c[d].location+'">'+c[d].bucket+"</option>")}a(".url-prefix").val(a(".bucket-select select option:selected").attr("data-url-prefix"));a(".bucket-location").val(a(".bucket-select select option:selected").attr("data-location"));e.val(f)}},this))})})(jQuery);