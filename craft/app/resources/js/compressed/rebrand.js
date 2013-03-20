/*!
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2013, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license1.0.html Craft License
 * @link      http://buildwithcraft.com
 */
(function(d){var c=null;var b={modalClass:"logo-modal",uploadAction:"rebrand/uploadLogo",deleteMessage:Craft.t("Are you sure you want to delete the logo?"),deleteAction:"rebrand/deleteLogo",cropAction:"rebrand/cropLogo",areaToolOptions:{aspectRatio:"",initialRectangle:{mode:"auto"}},onImageSave:function(f){e(f)},onImageDelete:function(f){e(f)}};function e(f){if(typeof f.html!="undefined"){d(".cp-logo").replaceWith(f.html);a()}}function a(){b.uploadButton=d(".logo-controls .upload-logo");b.deleteButton=d(".logo-controls .delete-logo");c=new Craft.ImageUpload(b)}a()})(jQuery);