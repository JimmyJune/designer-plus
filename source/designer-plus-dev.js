/*!
 * Waves Designer+ 3.2
 * http://Wavesdesign.ca/projects/fontfriend
 *
 * Copyright (c) 2012 Danny Casady
 * Licensed under the MIT license
 * http://www.opensource.org/licenses/mit-license.php
*
 * Copyright (c) 2009-12 Matt Wiebe
 * Licensed under the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Uses some code (c) 2009-10 Ryan Seddon from
 * http://labs.thecssninja.com/font_dragr/
 * Licensed under the MIT license
 *
*/

// closurfy it
(function(window, document){
	
	// moving along
	var $, body, jqInterval,
	undef = 'undefined',
	fontFriend = {
		version: "%version%",
		// style info
		css: "%css%",
		// inserted html. see designer-plus.html for understandable version
		html: '%html%',
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
		$("head").append('<style id="designer-plus-stylesheet" type="text/css" media="screen">'+fontFriend.css+'</style>');
		body.append("<div id='designer-plus'></div>");
		$("#designer-plus").html(fontFriend.html).addClass("open");
		$("#ff-credit").append("<span> "+fontFriend.version+"</span>");

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
					if ( $.inArray(value.family, fontFriend.existingGoogleFamilies) !== -1 ) {
						value.family = '✓ '+value.family;
					}
					else {
						fontFriend.googleFamilies[value.family] = value.variants;
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

			if ( val === '0' || ! fontFriend.googleFamilies[val] ) {
				return;
			}

			suffix = ':' + fontFriend.googleFamilies[val].join(',');
			url = base + apiName + suffix;

			$('<link rel="stylesheet" type="text/css" href="'+url+'" >').appendTo("head");
			addCustomFontList([val], 'www.google.com');
			self.find(":selected").text('✓ '+val);
			$("#ff-font-family-custom").find("li:last").click();
			
			// so we don't add it again later
			delete fontFriend.googleFamilies[val];
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
		 * We can define a custom family list with the fontFriendFamilies JS array/object
		 * or with the data-ff-families attribute on the <body> element (comma separated).
		 *
		 */
		if ( typeof(fontFriendFamilies) !== undef ) {
			fontFriend.customFamilies = fontFriendFamilies;
			// not an array. It must be an object
			if ( ! $.isArray(fontFriend.customFamilies)) {
				var fffTemp = [];
				$.each( fontFriend.customFamilies, function(index, value) {
					fffTemp.push(index);
				});
				fontFriend.customFamilies = fffTemp;
				fontFriend.customFamilyMap = fontFriendFamilies;
			}
		}
		else if ( body.attr("data-ff-families") ) {
			fontFriend.customFamilies = body.attr("data-ff-families").split(',');
		}
	}

	function webfontSpecimenCheck() {
		// on Web Font Specimen?
		fontFriend.wfs = ( window.location.href == "http://webfontspecimen.com/demo/" );
		fontFriend.wfsName = ( fontFriend.wfs ) ? $("h1, .bodysize tr:first-child th:first-child") : false;
		// or, on Waves Web Font Specimen?
		if ( ! fontFriend.wfs && $("body").attr("id") == 'Waves-web-font-specimen' ) {
			fontFriend.wfs = true;
			fontFriend.wfsName = $("h1, .bodysize tr:first-child th.base");
		}
		if ( fontFriend.wfs ) {
			fontFriend.wfsOriginalName = $("h1").text();
			fontFriend.wfsTitle = $("title").text();
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
			fontFriend.existingGoogleFamilies = families;
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
				fontFriend.customFamilyMap[family.name] = family.css_names.join(',');
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
	if ( fontFriend.customFamilies ) {
		addCustomFontList(fontFriend.customFamilies);
	}

	function changeFontName(name) {
		// not webfont specimen? leave.
		if ( ! fontFriend.wfs )
			return false;

		// empty call = reset
		if ( ! name ) {
			fontFriend.wfsName.text(fontFriend.wfsOriginalName);
			$("title").text(fontFriend.wfsTitle);
		}
		else {
			fontFriend.wfsName.text(name);
			$("title").text( fontFriend.wfsTitle.replace('Font name', name) );
		}
	}


	function maybeFontStack(fontFamily) {
		// is it in our map?
		if ( typeof(fontFriend.customFamilyMap[fontFamily]) !== undef ) {
			fontFamily = fontFriend.customFamilyMap[fontFamily];
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

		fontFriend.width = ff.outerWidth();
		fontFriend.height = ff.outerHeight();

		// open and close animations
		$("#ff-toggle").toggle(function() {
			ff.removeClass("open").animate({height:16, width:16},100);
		}, function() {
			ff.addClass("open").animate({height:fontFriend.height, width:fontFriend.width},100);
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
	
	//Begin color picker code
	
	function eye() {
		var EYE = window.EYE = function() {

			var _registered = {
				init: []
			};
			return {
				init: function() {
					console.log($);
					$.each(_registered.init, function(nr, fn){
						fn.call();
					});
				},
				extend: function(prop) {
					for (var i in prop) {
						if (prop[i] != undefined) {
							this[i] = prop[i];
						}
					}
				},
				register: function(fn, type) {
					if (!_registered[type]) {
						_registered[type] = [];
					}
					_registered[type].push(fn);
				}
			};
		}();
		$(EYE.init);
	}
	
	function colorPickerInit() {
		var initColorPlus = function() {

			$('.colorSelector').ColorPicker({
				color: '#0000ff',
				onShow: function (colpkr) {
					$(colpkr).fadeIn(500);
					return false;
				},
				onHide: function (colpkr) {
					$(colpkr).fadeOut(500);
					return false;
				},
				onChange: function (hsb, hex, rgb) {
					$('body').css('backgroundColor', '#' + hex);
				}
			});
		};
		EYE.register(initColorPlus, 'init');
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
					cal.data('colorpicker').onChange.apply(cal, [col, HSBToHex(col), HSBToRGB(col)]);
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
			return {
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
							alert(cal);
							
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
		console.log(ColorPicker);
		$.fn.extend({
			ColorPicker: ColorPicker.init,
			ColorPickerHide: ColorPicker.hidePicker,
			ColorPickerShow: ColorPicker.showPicker,
			ColorPickerSetColor: ColorPicker.setColor
		});
		
		eye();
		colorPickerInit();
	}

}(this, this.document));