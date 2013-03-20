/*!
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2013, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license1.0.html Craft License
 * @link      http://buildwithcraft.com
 */
function AjaxQueueManager(a,c,b){this._workers=a;this._queue=[];this._callback=c;this._context=b;this._busyWorkers=0}AjaxQueueManager.prototype.addItem=function(b,a,c){this._queue.push({target:b,parameters:a,callback:c})};AjaxQueueManager.prototype.processItem=function(){if(this._queue.length==0){if(this._busyWorkers==0){this._callback()}return}this._busyWorkers++;var a=this._queue.shift();var b=this;$.post(a.target,a.parameters,function(c){if(typeof a.callback=="function"){a.callback(c)}b._busyWorkers--;if(b._busyWorkers==0&&b._queue.length==0&&typeof b._callback=="function"){if(typeof b._context=="undefined"){b._callback()}else{b._callback.call(b._context)}}else{if(b._queue.length>0&&b._busyWorkers<b._workers){while(b._busyWorkers<b._workers&&b._queue.length>0){b.processItem()}}}})};AjaxQueueManager.prototype.startQueue=function(){while(this._busyWorkers<this._workers&&this._queue.length>0){this.processItem()}};