/*!
 * Waves Designer+ 0.1
 *
 * Copyright (c) 2012 Danny Casady
 * Licensed under the MIT license
 *
 * Uses some code from Stefan Petre's color picker
 * Dual licensed under the MIT and GPL licenses
 *
 * Uses some code from (c) 2009-12 Matt Wiebe's font-friend
 * Licensed under the MIT license
 *
 * Uses some code from (c) 2009-10 Ryan Seddon's font dragr
 * Licensed under the MIT license
 *
*/

(function(window, document) {
	
	var $, body, jQueryAddedInterval,
	undef = 'undefined',
	designerPlus = {
		version: "0.1",
		// style info
		css: "#designer-plus{overflow:hidden;position:fixed;bottom:0;left:30px;background-color:#fff;background-color:rgba(255,255,255,0.93);width:740px;color:#222;-webkit-box-shadow:1px 1px 5px rgba(0,0,0,.3);-moz-box-shadow:1px 1px 5px rgba(0,0,0,.3);box-shadow:1px 1px 5px rgba(0,0,0,.3);z-index:10000;text-align:left;height:400px}#designer-plus,#ff-drop h6,#ff-drop li{line-height:1.5!important}#ff-drop{padding:12px 12px 12px 36px}#ff-toggle{background-color:#222;color:#eee;display:block;width:12px;height:16px;padding:0 1px 0 3px;position:absolute;top:0;left:0;font-size:16px;line-height:1!important;cursor:pointer;z-index:10001;-moz-transition:.25s all ease-in-out;-webkit-transition:.25s all ease-in-out;-o-transition:.25s all ease-in-out;transition:.25s all ease-in-out}#ff-toggle sup{font-size:13px;line-height:1!important;vertical-align:super;display:none}.open #ff-toggle sup{display:inline}#ff-toggle:hover{color:#fff;background-color:#555}.open #ff-toggle{width:auto;height:32px;font-size:32px;padding:0 3px}#ff-drop form{background:0;color:inherit;float:none}#ff-drop h6{font-size:13px;border-bottom:1px solid #aaa;margin:0 0 6px!important;padding:0!important;text-indent:0!important;float:none!important;height:1.5em!important;white-space:nowrap}#ff-drop>div{float:left;width:120px;padding-right:20px;margin:0!important;position:relative}#ff-drop>div.wrap>div{margin-bottom:12px;font-size:11px!important;position:relative}#ff-drop div#ff-selector{width:130px}#ff-drop div#ff-font-family{width:240px}#ff-selector p{font-size:9px!important;line-height:1.2!important;margin:1em 0 0!important;padding:0!important}#ff-controls{position:absolute!important;bottom:60px;left:65px;width:55px!important;height:60px;margin:0!important;padding:0!important}#ff-controls div{position:absolute;font-size:20px;width:1em;height:1em;color:#555;min-width:inherit!important;min-height:inherit!important;padding:0;margin:0;float:none;text-align:center}#ff-controls>div,.ff-toggler>span,#family-custom-add{font-family:sans-serif!important;font-weight:normal!important;-webkit-user-select:none;-moz-user-select:none;user-select:none;cursor:pointer}#ff-controls div:hover{color:#000}#ff-controls .up{left:1em;top:0}#ff-controls .down{left:1em;bottom:0}#ff-controls .left{left:0;top:1em}#ff-controls .right{right:-.25em;top:1em}#ff-drop #ff-font-family ul{float:left;width:110px;padding-right:5px}#ff-drop #ff-font-family ul#ff-font-family-sans{padding-right:10px;width:115px}#ff-drop ol li{list-style:none outside}#ff-drop ol,#ff-drop ul{margin:0;padding:0}#ff-drop li{font-size:11px!important;\ margin:0!important;padding:0!important;list-style:none outside none!important;text-indent:0!important;height:auto!important}#ff-drop li.core{margin-bottom:4px!important;padding:0!important}#ff-drop ul li:hover{cursor:pointer;background-color:#e6e6e6!important}#ff-drop ul li.family-custom{margin:12px 0 0!important}#ff-drop ul li.family-custom:hover{cursor:default;background:none!important}#family-custom-add{display:inline-block;color:#aaa;line-height:1!important;font-size:15px!important;color:#666!important;vertical-align:top;padding:1px 3px 3px}#family-custom-add:hover,#family-custom-add:focus{background-color:#555!important;color:#fff!important}#family-custom{width:85px}#ff-drop ol input[type=radio]{margin-left:-5px;width:auto!important}#ff-blah{width:100px;margin-left:5px}#ff-drop ol label{margin-left:5px;display:inline!important}#ff-drop>#ff-credit{position:absolute;bottom:21px;left:32px;font-size:9px;margin:0!important}#designer-plus a{color:#4c0003!important;text-decoration:underline!important;border:0!important}#designer-plus a:hover{color:#a60007!important}#ff-drop>#ff-clear{position:absolute;bottom:0;right:0;padding:5px 5px 0!important;text-decoration:line-through;opacity:.1;font-size:21px;margin:0!important;width:auto!important}#ff-clear:hover{opacity:1;cursor:pointer}#ff-font-drop{font-size:11px!important;background-color:#e6e6e6;padding:15px 0;text-align:center;border:1px solid #aaa;margin-bottom:6px}#ff-font-drop.dropzone{background-color:#fff;border-color:#111}#ff-drop select{width:105px!important;margin-left:15px!important}#ff-google-webfonts select{width:99%!important;margin:0!important}#ff-drop select option{font-size:10px!important}#ff-drop .ff-hidden{display:none}#ff-drop .ff-clickable{cursor:pointer;position:relative;z-index:2}#ff-font-family h6 span{text-transform:uppercase!important;font-size:75%;font-weight:normal!important;color:#111!important;letter-spacing:.02em;line-height:1;display:inline-block}#ff-font-family h6 .ff-active{color:#aaa!important}#ff-font-family .ff-custom{padding:0 6px;border-right:1px solid #bbb;margin-right:6px}#ff-badges{position:absolute;right:14px;top:0;z-index:14px}#ff-badges>img{padding:0 4px 0 0!important;margin:0!important;border:0!important;width:16px!important;height:16px!important}#ff-drop #ff-font-family #ff-font-family-custom{width:100%;-webkit-column-count:2;-moz-column-count:2;column-count:2;-webkit-column-gap:12px;-moz-column-gap:12px;column-gap:12px}.ff-toggler{position:absolute;height:20px;top:27px;left:-4px}.ff-toggler span{position:absolute;display:block;left:0;top:0;height:8px;width:8px;line-height:1!important;font-size:8px!important;text-align:center;color:#aaa!important;padding:2px 4px!important}.ff-toggler span:hover{color:#333!important}.ff-toggler span.ff-down{top:auto;bottom:0}#ff-drop [data-ff=fontFamily] li{height:1.5em!important;overflow:hidden;text-overflow:ellipsis}.colorpicker{width:356px;height:176px;overflow:hidden;position:absolute;background:url(https://raw.github.com/dpcasady/designer-plus/master/images/colorpicker_background.png);font-family:Arial,Helvetica,sans-serif;display:none;z-index:11000}.colorpicker_color{width:150px;height:150px;left:14px;top:13px;position:absolute;background:#f00;overflow:hidden;cursor:crosshair}.colorpicker_color div{position:absolute;top:0;left:0;width:150px;height:150px;background:url(https://raw.github.com/dpcasady/designer-plus/master/images/colorpicker_overlay.png)}.colorpicker_color div div{position:absolute;top:0;left:0;width:11px;height:11px;overflow:hidden;background:url(https://raw.github.com/dpcasady/designer-plus/master/images/colorpicker_select.gif);margin:-5px 0 0 -5px}.colorpicker_hue{position:absolute;top:13px;left:171px;width:35px;height:150px;cursor:n-resize}.colorpicker_hue div{position:absolute;width:35px;height:9px;overflow:hidden;background:url(https://raw.github.com/dpcasady/designer-plus/master/images/colorpicker_indic.gif) left top;margin:-4px 0 0 0;left:0}.colorpicker_new_color{position:absolute;width:60px;height:30px;left:213px;top:13px;background:#f00}.colorpicker_current_color{position:absolute;width:60px;height:30px;left:283px;top:13px;background:#f00}.colorpicker input{background-color:transparent;border:1px solid transparent;position:absolute;font-size:10px;font-family:Arial,Helvetica,sans-serif;color:#898989;top:4px;right:11px;text-align:right;margin:0;padding:0;height:11px}.colorpicker_hex{position:absolute;width:72px;height:22px;background:url(https://raw.github.com/dpcasady/designer-plus/master/images/colorpicker_hex.png) top;left:212px;top:142px}.colorpicker_hex input{right:6px}.colorpicker_field{height:22px;width:62px;background-position:top;position:absolute}.colorpicker_field span{position:absolute;width:12px;height:22px;overflow:hidden;top:0;right:0;cursor:n-resize}.colorpicker_rgb_r{background-image:url(https://raw.github.com/dpcasady/designer-plus/master/images/colorpicker_rgb_r.png);top:52px;left:212px}.colorpicker_rgb_g{background-image:url(https://raw.github.com/dpcasady/designer-plus/master/images/colorpicker_rgb_g.png);top:82px;left:212px}.colorpicker_rgb_b{background-image:url(https://raw.github.com/dpcasady/designer-plus/master/images/colorpicker_rgb_b.png);top:112px;left:212px}.colorpicker_hsb_h{background-image:url(https://raw.github.com/dpcasady/designer-plus/master/images/colorpicker_hsb_h.png);top:52px;left:282px}.colorpicker_hsb_s{background-image:url(https://raw.github.com/dpcasady/designer-plus/master/images/colorpicker_hsb_s.png);top:82px;left:282px}.colorpicker_hsb_b{background-image:url(https://raw.github.com/dpcasady/designer-plus/master/images/colorpicker_hsb_b.png);top:112px;left:282px}.colorpicker_submit{position:absolute;width:22px;height:22px;background:url(https://raw.github.com/dpcasady/designer-plus/master/images/colorpicker_submit.png) top;left:322px;top:142px;overflow:hidden}.colorpicker_focus{background-position:center}.colorpicker_hex.colorpicker_focus{background-position:bottom}.colorpicker_submit.colorpicker_focus{background-position:bottom}.colorpicker_slider{background-position:bottom}.colorSelector{position:relative;width:36px;height:36px;background:url(https://raw.github.com/dpcasady/designer-plus/master/images/select.png)}.colorSelector div{position:absolute;top:3px;left:3px;width:30px;height:30px;background:url(https://raw.github.com/dpcasady/designer-plus/master/images/select.png) center}",
		// inserted html. see designer-plus.html for understandable version
		html: '<div id="ff-drop"><span id="ff-toggle">D<sup>+</sup></span><div id="ff-selector"><h6>Selector</h6><form action="" method="get"><ol><li><input type="radio" name="jq-select" checked="checked" id="jq1"><label for="jq1">body</label></li><li><input type="radio" name="jq-select" id="jq2"><label for="jq2">h1,h2,h3,h4,h5,h6</label></li><li><input type="radio" name="jq-select" id="jq3"><label for="jq3">p</label></li><li><input type="radio" name="jq-select" id="jq4"><input type="text" name="ff-blah" value="roll your own" id="ff-blah"></li></ol></form><p>Roll your own selector using <a href="http://api.jquery.com/category/selectors/">jQuery selectors</a>.</p><p></p><h6>Font Color</h6><p></p><h6>Background Color</h6><p><input type="text" maxlength="6" size="6" class="colorSelector background" value="00ff00"></p><div class="colorSelector background"><div style="background-color: #0000ff"></div></div></div><div id="ff-font-family"><h6>Font Family</h6><div id="ff-badges"></div><ul id="ff-font-family-sans" data-ff="fontFamily"><li>Arial</li><li>Verdana</li><li>Tahoma</li><li class="core">Trebuchet MS</li><li>Helvetica</li><li>Helvetica Neue</li><li>Gill Sans</li><li>Century Gothic</li><li>Lucida Grande</li><li>Lucida Sans Unicode</li><li>Calibri</li><li>Corbel</li><li>Candara</li></ul><ul id="ff-font-family-serif" data-ff="fontFamily"><li>Times New Roman</li><li class="core">Georgia</li><li>Times</li><li>Palatino</li><li>Palatino Linotype</li><li>Baskerville</li><li>Hoefler Text</li><li>Garamond</li><li>Constantia</li><li>Cambria</li><li class="family-custom"><input type="text" name="family-custom" value="your font family" id="family-custom"><span id="family-custom-add">+</span></li></ul></div><div class="wrap"><div id="ff-google-webfonts"><h6>Google Web Fonts</h6><div>Loading…</div></div><div id="ff-font-size"><h6>Font Size</h6><select data-ff="fontSize"><option>10</option><option>11</option><option>12</option><option>14</option><option>16</option><option>18</option><option>21</option><option>24</option><option>36</option><option>48</option><option>60</option><option>72</option></select></div><div id="ff-font-weight"><h6>Font Weight</h6><select data-ff="fontWeight"><option>100</option><option>200</option><option>300</option><option value="400" selected>400 (normal)</option><option>500</option><option>600</option><option value="700">700 (bold)</option><option>800</option><option>900</option></select></div><div id="ff-line-height"><h6>Line Height</h6><select data-ff="lineHeight"><option>1</option><option>1.1</option><option>1.2</option><option>1.3</option><option>1.4</option><option selected>1.5</option><option>1.6</option><option>1.75</option><option>2</option><option>2.5</option><option>3</option></select></div><div id="ff-font-style"><h6>Font Style</h6><ul data-ff="fontStyle"><li>italic</li><li>normal</li></ul></div></div><div class="wrap"><div id="ff-font-face"><h6>@font-face</h6><div id="ff-font-drop">Drag a font here.</div><ul data-ff="fontFamily"></ul></div><div id="ff-text-transform"><h6>Text Transform</h6><ul data-ff="textTransform"><li>uppercase</li><li>lowercase</li><li>capitalize</li><li>none</li></ul></div><div id="ff-font-variant"><h6>Font Variant</h6><ul data-ff="fontVariant"><li>small-caps</li><li>normal</li></ul></div></div><div id="ff-controls"><div class="left">&larr;</div><div class="right">&rarr;</div><div class="up">&uarr;</div><div class="down">&darr;</div></div><div id="ff-credit">Waves Designer+</div><div id="ff-clear" title="clear all styles">D<sup>+</sup></div></div>',
		// do we have custom families?
		// used for Typekit-style font stacks
		customFamiles: false,
		// custom family map for above's case
		customFamilyMap: [],
		// map of imported Google Web Fonts.
		googleFamilies: {},
		// store Google Web Fonts already existing on page
		existingGoogleFamilies: []
	};

	function maybeInit() {

		if ( typeof(window.jQuery) === undef ) {
			var jQueryAdded = document.createElement("script");
			jQueryAdded.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js';
			document.getElementsByTagName('head')[0].appendChild(jQueryAdded);
			jQueryAddedInterval = setInterval(jQueryAddedCheck, 100);
		}
		else {
			init();
		}
	}
	maybeInit();

	function jQueryAddedCheck() {		
		if ( typeof(window.jQuery) !== undef ) {
			clearInterval(jQueryAddedInterval);
			init();
		}
	}

	function init() {
		
		$ = window.jQuery;

		// check if it's already been added. saves against weirdness if clicked again.
		if ( $('#designer-plus').size() !== 0 ) {
			return false;
		}

		body = $("body");
		$("head").append('<style id="designer-plus-stylesheet" type="text/css" media="screen">'+designerPlus.css+'</style>');
		body.append("<div id='designer-plus'></div>");
		$("#designer-plus").html(designerPlus.html).addClass("open");
		$("#ff-credit").append("<span> "+designerPlus.version+"</span>");

		addBehaviours();
		customFamilyDefinitionsCheck();
		addIncrementors();
		buildFamilies();
		webfontSpecimenCheck();
		maybeAddEmbeddedFonts();
		getGoogleFonts();
		colorPicker();
	}

	function getGoogleFonts() {
		var api = 'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBUK3PeqSEzwPNIyg94dBQpziFOPvm7-aA',
		gFontList = [],
		success = function(data){
			if ( data.kind === "webfonts#webfontList") {
				$.each(data.items, function(index, value) {
					if ( $.inArray(value.family, designerPlus.existingGoogleFamilies) !== -1 ) {
						value.family = '✓ '+value.family;
					}
					else {
						designerPlus.googleFamilies[value.family] = value.variants;
					}
					gFontList.push(value.family);
				});
				makeGFontDrop(gFontList);
			}
			else {
				onError()
			}
		},
		onError = function() {
			$("#ff-google-webfonts > div").html("Error loading webfonts. :(");
			setTimeout(function(){
				$("#ff-google-webfonts").fadeOut();
			}, 3500);
		};
		$.ajax({
			url: api,
			type: "GET",
			dataType: "jsonp",
			success: success,
			error: onError
		});
	}

	function makeGFontDrop(list) {
		var listy = ['<option value="0">Choose:</option>'],
		list;
		$.each(list, function(i,v){
			listy.push("<option>"+v+"</option>");
		});
		list = $("<select>" + listy.join('') + "</select>");
		list.change(addGoogleFont);
		$("#ff-google-webfonts > div").html(list);
	}

	function addGoogleFont() {
		var self = $(this),
			val = self.val(),
			apiName = val.replace(/ /g, '+'),
			base = "http://fonts.googleapis.com/css?family=",
			suffix, url;

			if ( val === '0' || ! designerPlus.googleFamilies[val] ) {
				return;
			}

			suffix = ':' + designerPlus.googleFamilies[val].join(',');
			url = base + apiName + suffix;

			$('<link rel="stylesheet" type="text/css" href="'+url+'" >').appendTo("head");
			addCustomFontList([val], 'www.google.com');
			self.find(":selected").text('✓ '+val);
			$("#ff-font-family-custom").find("li:last").click();
			
			// so we don't add it again later
			delete designerPlus.googleFamilies[val];
	}

	function maybeAddEmbeddedFonts() {
		populateDeclaredFontFaceRules();
		maybeAddTypekit();
		maybeAddGoogle();
		maybeAddTypotheque();
	}

	function populateDeclaredFontFaceRules() {
		var css = document.styleSheets || [],
		fontFamilies = [];

		$.each( css, function(i,val){
			// try/catch because xdomain security prevents me from reading external stylesheets
			try {
				$.each( val.cssRules, function(index,value) {
					if ( value.type === CSSRule.FONT_FACE_RULE ) {
						var fontFamily = value.style.getPropertyValue('font-family');
						if ( fontFamily ) {
							// Firefox sometimes adds quotes to font name;
							fontFamily = fontFamily.replace(/^"|'/, "").replace(/"|'$/, "");
							if ( fontFamily !== "testfont" ) // Modernizr uses testfont
								fontFamilies.push(fontFamily);
						}
					}
				} );
			}
			catch(e) {
				// security prevents us from accessing other-domain stylesheets
			}
		} );

		if ( fontFamilies.length > 0 ) {
			addCustomFontList(arrayUnique(fontFamilies));
		}
	}

	function customFamilyDefinitionsCheck() {
		/**
		 * We can define a custom family list with the designerPlusFamilies JS array/object
		 * or with the data-ff-families attribute on the <body> element (comma separated).
		 *
		 */
		if ( typeof(designerPlusFamilies) !== undef ) {
			designerPlus.customFamilies = designerPlusFamilies;
			// not an array. It must be an object
			if ( ! $.isArray(designerPlus.customFamilies)) {
				var fffTemp = [];
				$.each( designerPlus.customFamilies, function(index, value) {
					fffTemp.push(index);
				});
				designerPlus.customFamilies = fffTemp;
				designerPlus.customFamilyMap = designerPlusFamilies;
			}
		}
		else if ( body.attr("data-ff-families") ) {
			designerPlus.customFamilies = body.attr("data-ff-families").split(',');
		}
	}

	function webfontSpecimenCheck() {
		// on Web Font Specimen?
		designerPlus.wfs = ( window.location.href == "http://webfontspecimen.com/demo/" );
		designerPlus.wfsName = ( designerPlus.wfs ) ? $("h1, .bodysize tr:first-child th:first-child") : false;
		// or, on Waves Web Font Specimen?
		if ( ! designerPlus.wfs && $("body").attr("id") == 'Waves-web-font-specimen' ) {
			designerPlus.wfs = true;
			designerPlus.wfsName = $("h1, .bodysize tr:first-child th.base");
		}
		if ( designerPlus.wfs ) {
			designerPlus.wfsOriginalName = $("h1").text();
			designerPlus.wfsTitle = $("title").text();
		}
	}

	function addIncrementors() {
		$("#designer-plus").find("select").each(function(index) {
			var html = $('<span class="ff-toggler"><span class="ff-up" title="Increase">&#9650;</span><span class="ff-down" title="Decrease">&#9660;</span></span>');
			html.insertBefore(this);
		});
		$(".ff-toggler span").click(incrementDropdown);
	}

	function incrementDropdown(event) {
		var self = $(this),
		increase = event.target.className == 'ff-up',
		dropdown = self.parent().next(),
		current = dropdown.find(":selected"),
		changeTo;

		changeTo = ( increase ) ? current.next() : current.prev();
		if ( changeTo.size() == 0 ) {
			changeTo = ( increase ) ? dropdown.find(":first") : dropdown.find(":last");
		}
		changeTo.attr("selected", "selected");
		dropdown.trigger("change");
	}

	function maybeAddTypotheque() {
		var key = findTypothequeLink(), data;
		if ( ! key ) return;

		$.getJSON("http://www.typotheque.com/ajax/webfont_api.php?key=" + key, function(data) {
			console.log(data);
		});
	}

	function findTypothequeLink() {
		var link = false;
		$('link[href*="wf.typotheque.com"]').each(function() {
			link = $(this).attr("href").split("/").pop();
			return false;
		});
		return link;
	}

	function maybeAddGoogle() {
		var gApi = findGoogleLink(),
			queryString,
			families = [];
		if ( ! gApi ) return;

		queryString = gApi.split("family=").pop();
		$.each(queryString.split("|"), function(i,v) {
			families.push( v.split(":")[0].replace("+"," ") );
		});
		if ( families.length > 0 ) {
			addCustomFontList(families, 'www.google.com');
			designerPlus.existingGoogleFamilies = families;
		}
	}

	function findGoogleLink() {
		var link = false;
		$('link[href*="fonts.googleapis.com"]').each(function() {
			link = $(this).attr("href");
			return false;
		});
		return link;
	}

	// Searches the html page for a script loaded from use.typekit.
	// Returns the kit ID as a string.
	function findKitId(){
		var kitId = null;
		$('script').each(function(index){
			var m = this.src.match(/use\.typekit\.com\/(.+)\.js/);
			if (m) {
				kitId = m[1];
				return false;
			}
		});
		return kitId;
	}

	function maybeAddTypekit() {
		var kitId = findKitId();
		if ( ! kitId ) {
			return false;
		}

		$.getJSON("https://typekit.com/api/v1/json/kits/" + kitId + "/published?callback=?", function(data){

		if( ! data.errors ) {
			var fontList = [];
			$.each(data.kit.families, function(i,family){
				designerPlus.customFamilyMap[family.name] = family.css_names.join(',');
				fontList.push(family.name);
			});
			addCustomFontList(fontList, "typekit.com");
		}
	});
	}

	function doBadge(badge) {
		var src = "http://"+badge+"/favicon.ico",
			badges = $("#ff-badges"),
			exist = badges.find("[src='"+src+"']");
		if ( ! exist.length ) {
			$("<img />", {src:src}).appendTo(badges);
		}
	}

	function addCustomFontList(list, badge){
		var existingUl = $("#ff-font-family-custom"),
		ul = $('<ul id="ff-font-family-custom" data-ff="fontFamily" class="ff-hidden"></ul>'),
		html = "",
		h6Title = 'Click to toggle between custom & stock font families',
		toggler = ': <span class="ff-custom ff-active">Custom</span><span class="ff-stock">Stock</span>';

		$.each(list, function(index, value){
			html += "<li>" + value + "</li>";
		});

		if ( typeof(badge) !== undef ) {
			doBadge(badge);
		}

		// exit early if we already have a list
		if ( existingUl.size() === 1 ) {
			existingUl.append(html);
			return buildFamilies();
		}

		html = ul.append(html);

		$("#ff-font-family").append(html);
		$("#ff-font-family > h6")
			.addClass('ff-clickable').attr("title", h6Title)
			.append(toggler)
			// click handlers for the custom/stock toggler
			.click(function() {
				var self = $(this),
				isCustom = self.hasClass("ff-custom") ? true : false,
				customList = $("#ff-font-family-custom"),
				stockList = $("#ff-font-family-sans, #ff-font-family-serif"),
				isCustom = ! customList.is(":visible"),
				togglers = self.children(),
				speed = 100,
				toHide, toShow;

				if ( isCustom ) {
					toHide = stockList;
					toShow = customList;
				}
				else {
					toHide = customList;
					toShow = stockList;
				}

				togglers.toggleClass('ff-active');

				toHide.fadeOut(speed, function() {
					toShow.fadeIn(speed);
				});

			});
		buildFamilies();
		$("#ff-font-family > h6").click();
	}

	// Do we have a custom family list?
	if ( designerPlus.customFamilies ) {
		addCustomFontList(designerPlus.customFamilies);
	}

	function changeFontName(name) {
		// not webfont specimen? leave.
		if ( ! designerPlus.wfs )
			return false;

		// empty call = reset
		if ( ! name ) {
			designerPlus.wfsName.text(designerPlus.wfsOriginalName);
			$("title").text(designerPlus.wfsTitle);
		}
		else {
			designerPlus.wfsName.text(name);
			$("title").text( designerPlus.wfsTitle.replace('Font name', name) );
		}
	}


	function maybeFontStack(fontFamily) {
		// is it in our map?
		if ( typeof(designerPlus.customFamilyMap[fontFamily]) !== undef ) {
			fontFamily = designerPlus.customFamilyMap[fontFamily];
		}
		// add monospace as a fallback in the stack
		return fontFamily + ",monospace";
	}

	// add inline font-family styles
	function buildFamilies() {
		$("#ff-font-family li, #ff-font-face li").each(function() {
			var self = $(this);
			self.css('fontFamily', maybeFontStack(self.text()));
		});
		$("#ff-font-style li, #ff-text-transform li, #ff-font-variant li").each(function() {
			var self = $(this),
				attr = self.parent().data("ff"),
				val = self.text();
			self.css(attr, val);
		});
	}

	function processData(file, name) {
		var reader = new FileReader();
			reader.name = name;

		reader.onloadend = function(event) {
			buildFontList(event);
		};

		reader.readAsDataURL(file);
	}

	function fontNameCleaner(name) {
		name = name
			.replace(/\..+$/,"") // Removes file extension from name
			.replace(/\W+/, "-").replace(/-|_/, " ") // Replace any non alpha numeric characters with a space.
			.replace(/^([a-z])|\s+([a-z])/g, function (word) {
				return word.toUpperCase();
			}); // uppercase it
		return unCamelCase(name);
	}
	
	function unCamelCase (str){
		return str
			// insert a space between lower & upper
			.replace(/([a-z])([A-Z])/g, '$1 $2')
			// space before last upper in a sequence followed by lower
			.replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
			// uppercase the first character
			.replace(/^./, function(str){ return str.toUpperCase(); })
	}

	// drop functions
	function handleDrop(event) {

		var dt = event.originalEvent.dataTransfer,
			files = dt.files,
			count = files.length,
			acceptedFileExtensions = /^.*\.(ttf|otf|woff)$/i;

		preventActions(event);

		for (var i = 0; i < count; i++) {
			var file = files[i],
				droppedFullFileName = file.name,
				droppedFileName;

			if(droppedFullFileName.match(acceptedFileExtensions)) {
				droppedFileName = fontNameCleaner(droppedFullFileName);
				processData(file, droppedFileName);

			} else {
				alert("Invalid file extension. Will only accept ttf, otf, or woff font files");
			}
		} // end for

	};

	function buildFontList(event) {
		var name = event.target.name,
			data = event.target.result;

		// Dodgy fork because Chrome 6 dev doesn't add media type to base64 string when a dropped file(s) type isn't known
		// http://code.google.com/p/chromium/issues/detail?id=48368
		var dataURL = data.split("base64");
		if(dataURL[0].indexOf("application/octet-stream") == -1) {
			dataURL[0] = "data:application/octet-stream;base64";
			data = dataURL[0] + dataURL[1];
		}

		// Get font file and prepend it to stylsheet using @font-face rule
		$("<style type='text/css'>@font-face{font-family: "+name+"; src:url("+data+");}</style> ").appendTo("head");
		addCustomFontList([name]);
		$("#ff-font-family-custom").find("li:last").click();
	};

	function preventActions(event) {
		event.stopPropagation();
		event.preventDefault();
	}

	// http://www.shamasis.net/2009/09/fast-algorithm-to-find-unique-items-in-javascript-array/
	function arrayUnique(array) {
		var l = array.length,
			o = {}, r = [], i;
		for (i=0; i<l; i+=1) o[array[i]] = array[i];
		for (i in o) r.push(o[i]);
		return r;
	}

	function addBehaviours() {
		// reuse later
		var ff = $("#designer-plus");

		designerPlus.width = ff.outerWidth();
		designerPlus.height = ff.outerHeight();

		// open and close animations
		$("#ff-toggle").toggle(function() {
			ff.removeClass("open").animate({height:16, width:16},100);
		}, function() {
			ff.addClass("open").animate({height:designerPlus.height, width:designerPlus.width},100);
		});

		// the main attraction: change that font
		$("#ff-drop ul > li").live("click", function() {
			// don't do anything if we clicked on an input inside an li
			if ( $(this).children("input").length ) {
				return false;
			}

			// set variables
			var self = $(this),
			theAttribute = self.parent().attr("data-ff"),
			theValue = self.text(),
			theSelector = getTheSelector();

			// font-family-specific
			if ( theAttribute == 'fontFamily' ) {
				changeFontFamily(theValue, theSelector);
			}
			else {
				// apply that css
				$(theSelector).css(theAttribute, theValue);
			}
		});
		
		function getTheSelector() {
			var target = $("#ff-drop ol input:checked").next(),
				selector = target.text() || target.val();
			return selector;
		}
		
		function changeFontFamily(theValue, theSelector) {
			theSelector = theSelector || getTheSelector();
			changeFontName(theValue);
			theValue = maybeFontStack(theValue);
			$(theSelector).css('fontFamily', theValue);
		}
		
		$("#ff-drop select").change(function() {
			// set variables
			var theAttribute = $(this).attr("data-ff"),
			theValue = parseFloat( $(this).find("option:selected").val() ),
			theSelector = getTheSelector();
			
			// apply that css
			$(theSelector).css(theAttribute, theValue);
		});

		// unbind the click on the custom font family input (it's in a <li> element)
		$("#ff-drop li.family-custom").unbind();

		// just type and change that custom font
		$("#family-custom").keyup(function(event) {

			// variables
			var theValue = $("#family-custom").attr("value"),
				theSelector = getTheSelector();

			if ( event.keyCode == 13 ) { // did we hit enter?
				$("#family-custom-add").click();
			}
			else {
				// apply that custom font
				changeFontFamily(theValue, theSelector);
			}

			preventActions(event);
		});

		//move the box around
		$("#ff-controls div").click(function() {
			if ($(this).hasClass("left") ) {
				$("#designer-plus").css({left:30, right:"auto"});
			}
			if ($(this).hasClass("right") ) {
					$("#designer-plus").css({right:30, left:"auto"});
			}
			if ($(this).hasClass("up") ) {
				$("#designer-plus").css({top:0, bottom:"auto"});
			}
			if ($(this).hasClass("down") ) {
				$("#designer-plus").css({bottom:0, top:"auto"});
			}
		});

		//clearout the text input onclick
		$("#ff-blah, #family-custom").each(function(index) {
			$(this).attr('data-ff', $(this).attr("value") );
		}).click(function() {

			$(this).prev().attr("checked", "checked");

			if ($(this).attr("value") == $(this).attr("data-ff") ) {
				$(this).removeAttr("value");
			} else {
				$(this).select();
			}

		});

		// clear all inline styles -> might crash large pages!
		$("#ff-clear").click(function() {
			$("*").not("[data-ff=fontFamily]").removeAttr("style");
			buildFamilies();
			changeFontName(); //empty call resets
		});

		$("#family-custom-add").click(function() {
			var input = $(this).prev(),
			fontName = input.val();
			if (fontName !== "your font family" && fontName !== "") {
				addCustomFontList([fontName]);
				input.val("").select();
			}
		});

		// add event listeners for dropper
		$("#ff-font-drop")
			.bind("dragover", preventActions)
			.bind("dragenter dragleave", function(event){$(this).toggleClass("dropzone"); preventActions(event); })
			.bind("drop", handleDrop);
	}
	
	function colorPickerInit() {		

		var initColorPlusFont = function() {
				$('.colorSelector.font').ColorPicker({
				color: '#0000ff',
				onShow: function (colpkr) {
					$(colpkr).fadeIn(500);
					return false;
				},
				onHide: function (colpkr) {
					$(colpkr).fadeOut(500);
					return false;
				},
				onChange: function (hsb, hex, rgb, selector) {
					$(selector).css('color', '#' + hex);
				}
			});
		};
		EYE.register(initColorPlusFont, 'init');

		var initColorPlusBackground = function() {
			$('.colorSelector.background').ColorPicker({
				color: '#0000ff',
				onShow: function (colpkr) {
					$(colpkr).fadeIn(500);
					return false;
				},
				onHide: function (colpkr) {
					$(colpkr).fadeOut(500);
					return false;
				},
				onSubmit: function(hsb, hex, rgb, el) {
					$(el).val(hex);
					$(el).ColorPickerHide();
				},
				onBeforeShow: function () {
					//this is called when the color picker is clicked
					$(this).ColorPickerSetColor(this.value);
				},
				onChange: function (hsb, hex, rgb, selector) {
					$('.test').val(hex);
					$(selector).css('backgroundColor', '#' + hex);
				}
			})
			.bind('keyup', function(selector) {
				//this is called when entering a value using the form
				console.log(selector);
				$(this).ColorPickerSetColor(this.value);
				$('body').css('backgroundColor', '#' + this.value);
			});
		};
		EYE.register(initColorPlusBackground, 'init');		
		
	}


	function eye() {

		var EYE = window.EYE = function() {
			//create an empty array to hold all color picker initializations
			var _registered = {
				initialize: []
			};
			return {
				initialize: function() {
					//call the initialization function for each type of registered initialization
					if ( _registered.init == undefined ) {
						colorPickerInit();
					}
					//with bookmarklet we have registered the function
					if (_registered.init != undefined) {
						$.each(_registered.init, function(numberRegistered, initColorPlusFunction) {
							initColorPlusFunction.call();
						});
					}
				},
				extend: function(prop) {
					for (var i in prop) {
						if (prop[i] != undefined) {
							this[i] = prop[i];
						}
					}
				},
				register: function(functionName, typeOfFunction) {
					//add colorPicker initialization function to registered array

					if (!_registered[typeOfFunction]) {
						_registered[typeOfFunction] = [];
					}
					_registered[typeOfFunction].push(functionName);

				}
			};
		}();
		//initialize the color picker
		colorPickerInit();
		//run the EYE.initialize funtion 
		$(EYE.initialize);
	}

	function colorPicker() {

		var ColorPicker = function () {	
			var
				ids = {},
				inAction,
				charMin = 65,
				visible,
				tpl = '<div class="colorpicker"><div class="colorpicker_color"><div><div></div></div></div><div class="colorpicker_hue"><div></div></div><div class="colorpicker_new_color"></div><div class="colorpicker_current_color"></div><div class="colorpicker_hex"><input type="text" maxlength="6" size="6" /></div><div class="colorpicker_rgb_r colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_g colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_h colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_s colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_submit"></div></div>',
				defaults = {
					eventName: 'click',
					onShow: function () {},
					onBeforeShow: function(){},
					onHide: function () {},
					onChange: function () {},
					onSubmit: function () {},
					color: 'ff0000',
					livePreview: true,
					flat: false
				},
				fillRGBFields = function  (hsb, cal) {
					var rgb = HSBToRGB(hsb);
					$(cal).data('colorpicker').fields
						.eq(1).val(rgb.r).end()
						.eq(2).val(rgb.g).end()
						.eq(3).val(rgb.b).end();
				},
				fillHSBFields = function  (hsb, cal) {
					$(cal).data('colorpicker').fields
						.eq(4).val(hsb.h).end()
						.eq(5).val(hsb.s).end()
						.eq(6).val(hsb.b).end();
				},
				fillHexFields = function (hsb, cal) {
					$(cal).data('colorpicker').fields
						.eq(0).val(HSBToHex(hsb)).end();
				},
				setSelector = function (hsb, cal) {
					$(cal).data('colorpicker').selector.css('backgroundColor', '#' + HSBToHex({h: hsb.h, s: 100, b: 100}));
					$(cal).data('colorpicker').selectorIndic.css({
						left: parseInt(150 * hsb.s/100, 10),
						top: parseInt(150 * (100-hsb.b)/100, 10)
					});
				},
				setHue = function (hsb, cal) {
					$(cal).data('colorpicker').hue.css('top', parseInt(150 - 150 * hsb.h/360, 10));
				},
				setCurrentColor = function (hsb, cal) {
					$(cal).data('colorpicker').currentColor.css('backgroundColor', '#' + HSBToHex(hsb));
				},
				setNewColor = function (hsb, cal) {
					$(cal).data('colorpicker').newColor.css('backgroundColor', '#' + HSBToHex(hsb));
				},
				keyDown = function (ev) {
					var pressedKey = ev.charCode || ev.keyCode || -1;
					if ((pressedKey > charMin && pressedKey <= 90) || pressedKey == 32) {
						return false;
					}
					var cal = $(this).parent().parent();
					if (cal.data('colorpicker').livePreview === true) {
						change.apply(this);
					}
				},
				change = function (ev) {
					var cal = $(this).parent().parent(), col;
					if (this.parentNode.className.indexOf('_hex') > 0) {
						cal.data('colorpicker').color = col = HexToHSB(fixHex(this.value));
					} else if (this.parentNode.className.indexOf('_hsb') > 0) {
						cal.data('colorpicker').color = col = fixHSB({
							h: parseInt(cal.data('colorpicker').fields.eq(4).val(), 10),
							s: parseInt(cal.data('colorpicker').fields.eq(5).val(), 10),
							b: parseInt(cal.data('colorpicker').fields.eq(6).val(), 10)
						});
					} else {
						cal.data('colorpicker').color = col = RGBToHSB(fixRGB({
							r: parseInt(cal.data('colorpicker').fields.eq(1).val(), 10),
							g: parseInt(cal.data('colorpicker').fields.eq(2).val(), 10),
							b: parseInt(cal.data('colorpicker').fields.eq(3).val(), 10)
						}));
					}
					if (ev) {
						fillRGBFields(col, cal.get(0));
						fillHexFields(col, cal.get(0));
						fillHSBFields(col, cal.get(0));
					}
					setSelector(col, cal.get(0));
					setHue(col, cal.get(0));
					setNewColor(col, cal.get(0));
					cal.data('colorpicker').onChange.apply(cal, [col, HSBToHex(col), HSBToRGB(col), currentSelector()]);
				},
				blur = function (ev) {
					var cal = $(this).parent().parent();
					cal.data('colorpicker').fields.parent().removeClass('colorpicker_focus');
				},
				focus = function () {
					charMin = this.parentNode.className.indexOf('_hex') > 0 ? 70 : 65;
					$(this).parent().parent().data('colorpicker').fields.parent().removeClass('colorpicker_focus');
					$(this).parent().addClass('colorpicker_focus');
				},
				downIncrement = function (ev) {
					var field = $(this).parent().find('input').focus();
					var current = {
						el: $(this).parent().addClass('colorpicker_slider'),
						max: this.parentNode.className.indexOf('_hsb_h') > 0 ? 360 : (this.parentNode.className.indexOf('_hsb') > 0 ? 100 : 255),
						y: ev.pageY,
						field: field,
						val: parseInt(field.val(), 10),
						preview: $(this).parent().parent().data('colorpicker').livePreview					
					};
					$(document).bind('mouseup', current, upIncrement);
					$(document).bind('mousemove', current, moveIncrement);
				},
				moveIncrement = function (ev) {
					ev.data.field.val(Math.max(0, Math.min(ev.data.max, parseInt(ev.data.val + ev.pageY - ev.data.y, 10))));
					if (ev.data.preview) {
						change.apply(ev.data.field.get(0), [true]);
					}
					return false;
				},
				upIncrement = function (ev) {
					change.apply(ev.data.field.get(0), [true]);
					ev.data.el.removeClass('colorpicker_slider').find('input').focus();
					$(document).unbind('mouseup', upIncrement);
					$(document).unbind('mousemove', moveIncrement);
					return false;
				},
				downHue = function (ev) {
					var current = {
						cal: $(this).parent(),
						y: $(this).offset().top
					};
					current.preview = current.cal.data('colorpicker').livePreview;
					$(document).bind('mouseup', current, upHue);
					$(document).bind('mousemove', current, moveHue);
				},
				moveHue = function (ev) {
					change.apply(
						ev.data.cal.data('colorpicker')
							.fields
							.eq(4)
							.val(parseInt(360*(150 - Math.max(0,Math.min(150,(ev.pageY - ev.data.y))))/150, 10))
							.get(0),
						[ev.data.preview]
					);
					return false;
				},
				upHue = function (ev) {
					fillRGBFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
					fillHexFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
					$(document).unbind('mouseup', upHue);
					$(document).unbind('mousemove', moveHue);
					return false;
				},
				downSelector = function (ev) {
					var current = {
						cal: $(this).parent(),
						pos: $(this).offset()
					};
					current.preview = current.cal.data('colorpicker').livePreview;
					$(document).bind('mouseup', current, upSelector);
					$(document).bind('mousemove', current, moveSelector);
				},
				moveSelector = function (ev) {
					change.apply(
						ev.data.cal.data('colorpicker')
							.fields
							.eq(6)
							.val(parseInt(100*(150 - Math.max(0,Math.min(150,(ev.pageY - ev.data.pos.top))))/150, 10))
							.end()
							.eq(5)
							.val(parseInt(100*(Math.max(0,Math.min(150,(ev.pageX - ev.data.pos.left))))/150, 10))
							.get(0),
						[ev.data.preview]
					);
					return false;
				},
				upSelector = function (ev) {
					fillRGBFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
					fillHexFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
					$(document).unbind('mouseup', upSelector);
					$(document).unbind('mousemove', moveSelector);
					return false;
				},
				enterSubmit = function (ev) {
					$(this).addClass('colorpicker_focus');
				},
				leaveSubmit = function (ev) {
					$(this).removeClass('colorpicker_focus');
				},
				clickSubmit = function (ev) {
					var cal = $(this).parent();
					var col = cal.data('colorpicker').color;
					cal.data('colorpicker').origColor = col;
					setCurrentColor(col, cal.get(0));
					cal.data('colorpicker').onSubmit(col, HSBToHex(col), HSBToRGB(col), cal.data('colorpicker').el);
				},
				show = function (ev) {
					var cal = $('#' + $(this).data('colorpickerId'));
					cal.data('colorpicker').onBeforeShow.apply(this, [cal.get(0)]);
					var pos = $(this).offset();
					var viewPort = getViewport();
					var top = pos.top + this.offsetHeight;
					var left = pos.left;
					if (top + 176 > viewPort.t + viewPort.h) {
						top -= this.offsetHeight + 176;
					}
					if (left + 356 > viewPort.l + viewPort.w) {
						left -= 356;
					}
					cal.css({left: left + 'px', top: top + 'px'});
					if (cal.data('colorpicker').onShow.apply(this, [cal.get(0)]) != false) {
						cal.show();
					}
					$(document).bind('mousedown', {cal: cal}, hide);
					return false;
				},
				hide = function (ev) {
					if (!isChildOf(ev.data.cal.get(0), ev.target, ev.data.cal.get(0))) {
						if (ev.data.cal.data('colorpicker').onHide.apply(this, [ev.data.cal.get(0)]) != false) {
							ev.data.cal.hide();
						}
						$(document).unbind('mousedown', hide);
					}
				},
				isChildOf = function(parentEl, el, container) {
					if (parentEl == el) {
						return true;
					}
					if (parentEl.contains) {
						return parentEl.contains(el);
					}
					if ( parentEl.compareDocumentPosition ) {
						return !!(parentEl.compareDocumentPosition(el) & 16);
					}
					var prEl = el.parentNode;
					while(prEl && prEl != container) {
						if (prEl == parentEl)
							return true;
						prEl = prEl.parentNode;
					}
					return false;
				},
				getViewport = function () {
					var m = document.compatMode == 'CSS1Compat';
					return {
						l : window.pageXOffset || (m ? document.documentElement.scrollLeft : document.body.scrollLeft),
						t : window.pageYOffset || (m ? document.documentElement.scrollTop : document.body.scrollTop),
						w : window.innerWidth || (m ? document.documentElement.clientWidth : document.body.clientWidth),
						h : window.innerHeight || (m ? document.documentElement.clientHeight : document.body.clientHeight)
					};
				},
				fixHSB = function (hsb) {
					return {
						h: Math.min(360, Math.max(0, hsb.h)),
						s: Math.min(100, Math.max(0, hsb.s)),
						b: Math.min(100, Math.max(0, hsb.b))
					};
				}, 
				fixRGB = function (rgb) {
					return {
						r: Math.min(255, Math.max(0, rgb.r)),
						g: Math.min(255, Math.max(0, rgb.g)),
						b: Math.min(255, Math.max(0, rgb.b))
					};
				},
				fixHex = function (hex) {
					var len = 6 - hex.length;
					if (len > 0) {
						var o = [];
						for (var i=0; i<len; i++) {
							o.push('0');
						}
						o.push(hex);
						hex = o.join('');
					}
					return hex;
				}, 
				HexToRGB = function (hex) {
					var hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
					return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
				},
				HexToHSB = function (hex) {
					return RGBToHSB(HexToRGB(hex));
				},
				RGBToHSB = function (rgb) {
					var hsb = {
						h: 0,
						s: 0,
						b: 0
					};
					var min = Math.min(rgb.r, rgb.g, rgb.b);
					var max = Math.max(rgb.r, rgb.g, rgb.b);
					var delta = max - min;
					hsb.b = max;
					hsb.s = max != 0 ? 255 * delta / max : 0;
					if (hsb.s != 0) {
						if (rgb.r == max) {
							hsb.h = (rgb.g - rgb.b) / delta;
						} else if (rgb.g == max) {
							hsb.h = 2 + (rgb.b - rgb.r) / delta;
						} else {
							hsb.h = 4 + (rgb.r - rgb.g) / delta;
						}
					} else {
						hsb.h = -1;
					}
					hsb.h *= 60;
					if (hsb.h < 0) {
						hsb.h += 360;
					}
					hsb.s *= 100/255;
					hsb.b *= 100/255;
					return hsb;
				},
				HSBToRGB = function (hsb) {
					var rgb = {};
					var h = Math.round(hsb.h);
					var s = Math.round(hsb.s*255/100);
					var v = Math.round(hsb.b*255/100);
					if(s == 0) {
						rgb.r = rgb.g = rgb.b = v;
					} else {
						var t1 = v;
						var t2 = (255-s)*v/255;
						var t3 = (t1-t2)*(h%60)/60;
						if(h==360) h = 0;
						if(h<60) {rgb.r=t1;	rgb.b=t2; rgb.g=t2+t3}
						else if(h<120) {rgb.g=t1; rgb.b=t2;	rgb.r=t1-t3}
						else if(h<180) {rgb.g=t1; rgb.r=t2;	rgb.b=t2+t3}
						else if(h<240) {rgb.b=t1; rgb.r=t2;	rgb.g=t1-t3}
						else if(h<300) {rgb.b=t1; rgb.g=t2;	rgb.r=t2+t3}
						else if(h<360) {rgb.r=t1; rgb.g=t2;	rgb.b=t1-t3}
						else {rgb.r=0; rgb.g=0;	rgb.b=0}
					}
					return {r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b)};
				},
				RGBToHex = function (rgb) {
					var hex = [
						rgb.r.toString(16),
						rgb.g.toString(16),
						rgb.b.toString(16)
					];
					$.each(hex, function (nr, val) {
						if (val.length == 1) {
							hex[nr] = '0' + val;
						}
					});
					return hex.join('');
				},
				HSBToHex = function (hsb) {
					return RGBToHex(HSBToRGB(hsb));
				},
				currentSelector = function () {
					var target = $("#ff-drop ol input:checked").next(),
						selector = target.text() || target.val();
					return selector;
				},
				restoreOriginal = function () {
					var cal = $(this).parent();
					var col = cal.data('colorpicker').origColor;
					cal.data('colorpicker').color = col;
					fillRGBFields(col, cal.get(0));
					fillHexFields(col, cal.get(0));
					fillHSBFields(col, cal.get(0));
					setSelector(col, cal.get(0));
					setHue(col, cal.get(0));
					setNewColor(col, cal.get(0));
				};
			//gets here
			return {				
				//not getting into return with existing $
				init: function (opt) {	
					opt = $.extend({}, defaults, opt||{});
					if (typeof opt.color == 'string') {
						opt.color = HexToHSB(opt.color);
					} else if (opt.color.r != undefined && opt.color.g != undefined && opt.color.b != undefined) {
						opt.color = RGBToHSB(opt.color);
					} else if (opt.color.h != undefined && opt.color.s != undefined && opt.color.b != undefined) {
						opt.color = fixHSB(opt.color);
					} else {
						return this;
					}
					return this.each(function () {
						if (!$(this).data('colorpickerId')) {	
							var options = $.extend({}, opt);
							options.origColor = opt.color;
							var id = 'collorpicker_' + parseInt(Math.random() * 1000);
							$(this).data('colorpickerId', id);
							var cal = $(tpl).attr('id', id);
							if (cal) { 
							}
							if (options.flat) {
								cal.appendTo(this).show();
							} else {
								cal.appendTo(document.body);
							}
							options.fields = cal
												.find('input')
													.bind('keyup', keyDown)
													.bind('change', change)
													.bind('blur', blur)
													.bind('focus', focus);
							cal
								.find('span').bind('mousedown', downIncrement).end()
								.find('>div.colorpicker_current_color').bind('click', restoreOriginal);
							options.selector = cal.find('div.colorpicker_color').bind('mousedown', downSelector);
							options.selectorIndic = options.selector.find('div div');
							options.el = this;
							options.hue = cal.find('div.colorpicker_hue div');
							cal.find('div.colorpicker_hue').bind('mousedown', downHue);
							options.newColor = cal.find('div.colorpicker_new_color');
							options.currentColor = cal.find('div.colorpicker_current_color');
							cal.data('colorpicker', options);
							cal.find('div.colorpicker_submit')
								.bind('mouseenter', enterSubmit)
								.bind('mouseleave', leaveSubmit)
								.bind('click', clickSubmit);
							fillRGBFields(options.color, cal.get(0));
							fillHSBFields(options.color, cal.get(0));
							fillHexFields(options.color, cal.get(0));
							setHue(options.color, cal.get(0));
							setSelector(options.color, cal.get(0));
							setCurrentColor(options.color, cal.get(0));
							setNewColor(options.color, cal.get(0));
							if (options.flat) {
								cal.css({
									position: 'relative',
									display: 'block'
								});
							} else {
								$(this).bind(options.eventName, show);
							}
						}
					});
				},
				showPicker: function() {
					return this.each( function () {
						if ($(this).data('colorpickerId')) {
							show.apply(this);
						}
					});
				},
				hidePicker: function() {
					return this.each( function () {
						if ($(this).data('colorpickerId')) {
							$('#' + $(this).data('colorpickerId')).hide();
						}
					});
				},
				setColor: function(col) {
					if (typeof col == 'string') {
						col = HexToHSB(col);
					} else if (col.r != undefined && col.g != undefined && col.b != undefined) {
						col = RGBToHSB(col);
					} else if (col.h != undefined && col.s != undefined && col.b != undefined) {
						col = fixHSB(col);
					} else {
						return this;
					}
					return this.each(function(){
						if ($(this).data('colorpickerId')) {
							var cal = $('#' + $(this).data('colorpickerId'));
							cal.data('colorpicker').color = col;
							cal.data('colorpicker').origColor = col;
							fillRGBFields(col, cal.get(0));
							fillHSBFields(col, cal.get(0));
							fillHexFields(col, cal.get(0));
							setHue(col, cal.get(0));
							setSelector(col, cal.get(0));
							setCurrentColor(col, cal.get(0));
							setNewColor(col, cal.get(0));
						}
					});
				}
			};
		}();

		$.fn.extend({
			ColorPicker: ColorPicker.init,
			ColorPickerHide: ColorPicker.hidePicker,
			ColorPickerShow: ColorPicker.showPicker,
			ColorPickerSetColor: ColorPicker.setColor
		});
		eye();
	}
	
	
}(this, this.document));