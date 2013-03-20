/*!
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2013, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license1.0.html Craft License
 * @link      http://buildwithcraft.com
 */
(function(d){var c=null;var b={postParameters:{userId:d(".user-photo").attr("data-user")},modalClass:"profile-image-modal",uploadAction:"users/uploadUserPhoto",deleteMessage:Craft.t("Are you sure you want to delete this photo?"),deleteAction:"users/deleteUserPhoto",cropAction:"users/cropUserPhoto",areaToolOptions:{aspectRatio:"1:1",initialRectangle:{mode:"auto"}},onImageSave:function(f){e(f)},onImageDelete:function(f){e(f)}};function e(f){if(typeof f.html!="undefined"){d(".user-photo").replaceWith(f.html);var g=d(".user-photo>.current-photo").css("background-image").replace(/^url\(/,"").replace(/\)$/,"");d("#account-menu").find("img").attr("src",g);a()}}function a(){b.uploadButton=d(".user-photo-controls .upload-photo");b.deleteButton=d(".user-photo-controls .delete-photo");c=new Craft.ImageUpload(b)}a()})(jQuery);