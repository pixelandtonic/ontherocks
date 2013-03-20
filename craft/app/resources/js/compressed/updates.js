/*!
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2013, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license1.0.html Craft License
 * @link      http://buildwithcraft.com
 */
(function(c){var a=Garnish.Base.extend({$table:null,$tbody:null,init:function(j,e,g){this.$table=c("<table/>").appendTo(j);this.$tbody=c("<tbody/>").appendTo(this.$table);this.addNoteRows(e[0].notes);for(var f=1;f<e.length;f++){var d=e[f],h=g+" "+d.version;if(d.build){h+=' <span class="light">'+Craft.t("build {build}",{build:d.build})+"</span>"}c('<tr><th colspan="2">'+h+"</th></tr>").appendTo(this.$tbody);this.addNoteRows(d.notes)}},addNoteRows:function(f){f=f.split(/[\r\n]+/);for(var e=0;e<f.length;e++){var g=f[e],h=c("<tr/>").appendTo(this.$tbody),d=g.match(/\[(\w+)\]\s*(.+)/);if(d){c('<td class="thin"><span class="category '+d[1].toLowerCase()+'">'+Craft.t(d[1])+"</span></td>").appendTo(h);c("<td>"+d[2]+"</td>").appendTo(h)}else{c('<td colspan="2">'+g+"</td>").appendTo(h)}}}});var b=function(d){for(var e in d){var f=d[e];if(f.releases&&f.releases.length>0){return true}}return false};Craft.postActionRequest("update/getAvailableUpdates",function(d){c("#loading").fadeOut("fast",function(){if(!d.errors&&d.error){d.errors=[d.error]}if(d.errors&&d.errors.length>0){var u=c("#update-error");u.html(d.errors[0]);u.show()}else{if((d.app&&d.app.releases&&d.app.releases.length)){var o=c("#system-updates"),q=o.children("tbody");o.show();if(d.app.releases){var w=c("<tr/>").appendTo(q),f=c("<th/>").appendTo(w),j=c('<td class="thin rightalign"/>').appendTo(w);f.html("Craft "+d.app.releases[0].version+' <span class="light">'+Craft.t("build {build}",{build:d.app.releases[0].build})+"</span>"+(d.app.criticalUpdateAvailable?'<span class="critical">'+Craft.t("Critical")+"</span>":""));var v=function(i){i.on("click",function(){var x=d.app.manualDownloadEndpoint;c("<iframe/>",{src:x}).appendTo(Garnish.$bod).hide()})};if(d.app.manualUpdateRequired){var r=c('<div class="btn submit">'+Craft.t("Download")+"</div>").appendTo(j);v(r)}else{var m=c('<div class="btngroup"/>').appendTo(j),e=c('<a class="btn submit" href="'+Craft.getUrl("updates/go/craft")+'">'+Craft.t("Update")+"</a>").appendTo(m),h=c('<div class="btn submit menubtn"/>').appendTo(m),k=c('<div class="menu" data-align="right"/>').appendTo(m),p=c("<ul/>").appendTo(k),t=c("<li/>").appendTo(p),n=c("<a>"+Craft.t("Download")+"</a>").appendTo(t);new Garnish.MenuBtn(h);v(n)}var w=c("<tr/>").appendTo(q),j=c('<td class="notes" colspan="2"/>').appendTo(w);new a(j,d.app.releases,"Craft")}}else{c("#no-system-updates").show()}if(d.plugins&&b(d.plugins)){var o=c("#plugin-updates"),q=o.children("tbody");o.show();for(var s in d.plugins){var g=d.plugins[s];if(g.releases&&g.releases.length>0){var w=c("<tr/>").appendTo(q),f=c("<th/>").appendTo(w),j=c('<td class="thin rightalign"/>').appendTo(w);f.html(g.displayName+" "+g.releases[0].version);j.html('<a class="btn" href="'+Craft.getUrl("updates/"+g["class"].toLowerCase())+'">'+Craft.t("Update")+"</a>");var w=c("<tr/>").appendTo(q),j=c('<td class="notes" colspan="2"/>').appendTo(w);new a(j,g.releases,g.displayName)}}}else{c("#no-plugin-updates").show()}c("#updates").fadeIn("fast");var l=0;if(d.app&&d.app.releases){l++}if(b(d.plugins)){l++}if(l>=2){c("#update-all").fadeIn("fast")}}})})})(jQuery);