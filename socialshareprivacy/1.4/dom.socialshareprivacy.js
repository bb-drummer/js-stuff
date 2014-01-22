/**
 * add '_getElementsByXPath' method to base element object for XPath compatiblity
 * 
 * @param		STRING	expression
 * @param		HTMLElement|Element	parentElement
 * @returns		ARRAY
 */
if ( (!!document.evaluate) ) {
	if ( typeof document._getElementsByXPath != 'function' ) {
		document._getElementsByXPath = function (expression, parentElement) {
			var results = [];
			var query = document.evaluate(expression, parentElement || document,
				null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			for (var i = 0, length = query.snapshotLength; i < length; i++)
				results.push(query.snapshotItem(i));
			return results;
		};
	}
}


if (typeof Element != 'undefined') {
	
	/**
	 * add 'hasClass', 'addClass' and 'removeClass' methods to base element object
	 * 
	 * @param		STRING	className
	 * @returns		HTMLElement|Element
	 */
	if ( typeof Element.hasClass != 'function' ) {
		Element.prototype.hasClass = function (className) {
			return ((String(this.className).indexOf(className) != -1));
		};
	}
	if ( typeof Element.addClass != 'function' ) {
		Element.prototype.addClass = function (className) {
			if (String(this.className).indexOf(className) == -1) {
				var aClasses = String(this.className).split(' ');
				aClasses.push(className);
				this.className = aClasses.join(' ');
			}
			return this;
		};
	}
	if ( typeof Element.removeClass != 'function' ) {
		Element.prototype.removeClass = function (className) {
			if (String(this.className).indexOf(className) != -1) {
				this.className = String(this.className).replace(className, '').replace('  ', ' ');
			}
			return this;
		};
	}

	/**
	 * add 'getElementsByTagAttr' methods to base element object
	 * 
	 * @param		MIXED	tags
	 * @param		STRING	attribute
	 * @param		MIXED	value
	 * @returns		ARRAY
	 */
	if ( (typeof Element.getElementsByTagAttr != 'function') ) {
		Element.prototype.getElementsByTagAttr = function ( tags, attribute, value ) {
			var aTags = tags;
			var result = [];
			if (typeof tags == 'string') {
				aTags = tags.split(',');
			} else if (!tags.length || tags.length == 0) {
				return result;
			}
			for (var i=0;i<aTags.length;i++) {
				var elements = this.getElementsByTagName(aTags[i]);
				for (var j=0;j<elements.length;j++) {
					if ((typeof elements[j][attribute] != 'undefined') && (elements[j][attribute] == value)) {
						result.push(elements[j]);
					}
				}
			}
			return result;
		};
	}
	
	/**
	 * add 'getElementsByClassName' methods to base element object
	 * 
	 * @param		STRING	className
	 * @uses		_getElementsByXPath
	 * @returns		ARRAY
	 */
	if ( (typeof Element.getElementsByClassName != 'function') ) {
		Element.prototype.getElementsByClassName = function (className) {
			if ( (!!document.evaluate) ) { // check for XPath compatiblity
				var q = ".//*[contains(concat(' ', @class, ' '), ' " + className + " ')]";
				return document._getElementsByXPath( q, (this || document.body) );
			} else {
				var children = (this || document.body).getElementsByTagName('*');
				var elements = [], child;
				for (var i = 0, length = children.length; i < length; i++) {
					child = children[i];
					var elementClassName = child.className;
					if (elementClassName == className ||
							elementClassName.match(new RegExp("(^|\\s)" + className + "(\\s|$)")))
						elements.push( (child) );
				}
				return elements;
			}
		};
	}

} // else {
	
	/**
	 * add 'hasClass', 'addClass' and 'removeClass' methods to base element object
	 * 
	 * @param		STRING	className
	 * @returns		HTMLElement|Element
	 */
	if ( typeof document.hasClass != 'function' ) {
		document.hasClass = function (className) {
			return ((String(this.className).indexOf(className) != -1));
		};
	}
	if ( typeof document.addClass != 'function' ) {
		document.addClass = function (className) {
			if (String(this.className).indexOf(className) == -1) {
				var aClasses = String(this.className).split(' ');
				aClasses.push(className);
				this.className = aClasses.join(' ');
			}
			return this;
		};
	}
	if ( typeof document.removeClass != 'function' ) {
		document.removeClass = function (className) {
			if (String(this.className).indexOf(className) != -1) {
				this.className = String(this.className).replace(className, '').replace('  ', ' ');
			}
			return this;
		};
	}

	/**
	 * add 'getElementsByTagAttr' methods to base element object
	 * 
	 * @param		MIXED	tags
	 * @param		STRING	attribute
	 * @param		MIXED	value
	 * @returns		ARRAY
	 */
	if ( typeof document.getElementsByTagAttr != 'function' ) {
		document.getElementsByTagAttr = function ( tags, attribute, value ) {
			var aTags = tags;
			var result = [];
			if (typeof tags == 'string') {
				aTags = tags.split(',');
			} else if (!tags.length || tags.length == 0) {
				return result;
			}
			for (var i=0;i<aTags.length;i++) {
				var elements = this.getElementsByTagName(aTags[i]);
				for (var j=0;j<elements.length;j++) {
					if ((typeof elements[j][attribute] != 'undefined') && (elements[j][attribute] == value)) {
						result.push(elements[j]);
					}
				}
			}
			return result;
		};
	}

	/**
	 * add 'getElementsByClassName' methods to base element object
	 * 
	 * @param		STRING	className
	 * @uses		_getElementsByXPath
	 * @returns		ARRAY
	 */
	if ( typeof document.getElementsByClassName != 'function' ) {
		document.getElementsByClassName = function (className) {
			if ( (!!document.evaluate) ) { // check for XPath compatiblity
				var q = ".//*[contains(concat(' ', @class, ' '), ' " + className + " ')]";
				return document._getElementsByXPath( q, (this || document.body) );
			} else {
				var children = (this || document.body).getElementsByTagName('*');
				var elements = [], child;
				for (var i = 0, length = children.length; i < length; i++) {
					child = children[i];
					var elementClassName = child.className;
					if (elementClassName == className ||
							elementClassName.match(new RegExp("(^|\\s)" + className + "(\\s|$)")))
						elements.push( (child) );
				}
				return elements;
			}
		};
	}

//}










/**
 * dom.socialshareprivacy.js | 2 Klicks fuer mehr Datenschutz
 *
 * adapted from
 *	jQuery Plug-In socialshareprivacy (v1.4)
 *	http://www.heise.de/extras/socialshareprivacy/
 *	http://www.heise.de/ct/artikel/2-Klicks-fuer-mehr-Datenschutz-1333879.html
 *
 *	Copyright (c) 2011 Hilko Holweg, Sebastian Hilbig, Nicolas Heiringhoff, Juergen Schmidt,
 *	Heise Zeitschriften Verlag GmbH & Co. KG, http://www.heise.de
 *
 *	is released under the MIT License http://www.opensource.org/licenses/mit-license.php
 *
 *	Spread the word, link to us if you can.
 * 
 * 
 * @package	socialSharePrivacy
 * @author	Björn Bartels, [dragon-projects.net] <bartels@dragon-projects.net>
 * 
 **/
var socialSharePrivacy = function () {};
//if (document) ( function () {

//	"use strict";
	
	//if (!document.prototype) { document.prototype = {}; }

	/*
	 * helper functions
	 */ 

	/**
	 *	extend a target object with the (deep) content of (a) source object(s)
	 * 
	 *	@param	BOOLEAN	deep		perfomm a deep extension of the objects
	 *	@param	OBJECT	target		the object to extend to
	 *	@param	OBJECT	sources		the object to copy from
	 *	@return	OBJECT				
	 */
	var extend = function () {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;
		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		}
		// Handle case when target is a string or something (possible in deep copy)
		if ( (typeof target !== "object") && (typeof target !== "function") ) {
			target = {};
		}
		// extend object itself if only one argument is passed
		if ( length === i ) {
			target = {}; // this;
			--i;
		}
		for ( ; i < length; i++ ) {
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) {
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];
					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}
					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( (typeof copy === "object") || ( copyIsArray = ((typeof copy === "object") && (copy.push)) ) ) ) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && ((typeof src === "object") && (src.push)) ? src : [];
						} else {
							clone = src && (typeof src === "object") ? src : {};
						}
						target[ name ] = Object.extend( deep, clone, copy );
					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}
		return target;
	};

	/**
	 *	create new DOM element
	 * 
	 *	@param		STRING	name
	 *	@param		STRING	attrs
	 *	@param		STRING	doc
	 *	@param		STRING	xmlns
	 *	@returns	HTMLElement
	 */
	var createElement = function (name, attrs, doc, xmlns) {
		var doc = doc ? doc : document;
		var elm;
		if(doc.createElementNS)
			elm = doc.createElementNS(xmlns ? xmlns : "http://www.w3.org/1999/xhtml", name);
		else
			elm = doc.createElement(name);
		if(attrs)
			for(var attr in attrs)
				elm.setAttribute(attr, attrs[attr]);
		return elm;
	};


	/**
	 * add an event to a given element
	 * 
	 * @param		HTMLElement|Element	elm
	 * @param		STRING evType
	 * @param		FUNCTION|OBJECT	fn
	 * @param		BOOLEAN	useCapture
	 * @returns		MIXED|BOOLEAN
	 */
	if ( typeof addEvent != 'function' ) var addEvent = function (elm, evType, fn, useCapture)
		//addEvent and removeEvent
		//cross-browser event handling for IE5+,  NS6 and Mozilla
		//By Scott Andrew
		{
		if (elm.addEventListener){
			elm.addEventListener(evType, fn, useCapture);
			return true;
		} else if (elm.attachEvent){
			var r = elm.attachEvent("on"+evType, fn);
			return r;
		} else {
			// wer auch immer die untere Zeile hat einkommentiert gelassen, sollte darueber nochmal nachdenken...
			// alert("Handler could not be removed");
		}
	};

	/**
	 * remove event from a given element
	 * 
	 * @param		HTMLElement|Element	elm
	 * @param		STRING evType
	 * @param		FUNCTION|OBJECT	fn
	 * @param		BOOLEAN	useCapture
	 * @returns		MIXED|BOOLEAN
	 */
	if ( typeof removeEvent != 'function' ) var removeEvent = function (elm, evType, fn, useCapture)
		//addEvent and removeEvent
		//cross-browser event handling for IE5+,  NS6 and Mozilla
		//By Scott Andrew
		{
		if (elm.removeEventListener){
			elm.removeEventListener(evType, fn, useCapture);
			return true;
		} else if (elm.detachEvent){
			var r = elm.detachEvent("on"+evType, fn);
			return r;
		} else {
			// wer auch immer die untere Zeile hat einkommentiert gelassen, sollte darueber nochmal nachdenken...
			// alert("Handler could not be removed");
		}
	};

	/**
	 * trigger an event on a given element
	 * 
	 * @param		HTMLElement|Element	evElement
	 * @param		STRING evObj
	 * @returns		MIXED|BOOLEAN
	 */
	if ( typeof triggerEvent != 'function' ) var triggerEvent = function (evElement, evObj)
		{
		if (!evElement || !evObj) return;
		if (!evElement.dispatchEvent) {
			return evElement.fireEvent(evObj);
		} else {
			return evElement.dispatchEvent(evObj);
		}
	};

	/**
	 * strips leading and trailing whitespce from string
	 * 
	 * @param		STRING		sString
	 * @returns		STRING
	 */
	function trim( sText ) {
		return String(sText).replace(/^\s+/, '').replace(/\s+$/, '');
	}

	// abbreviate at last blank before length and add "\u2026" (horizontal ellipsis)
	function abbreviateText(text, length) {
		var abbreviated = decodeURIComponent(text);
		if (abbreviated.length <= length) {
			return text;
		}

		var lastWhitespaceIndex = abbreviated.substring(0, length - 1).lastIndexOf(' ');
		abbreviated = encodeURIComponent(abbreviated.substring(0, lastWhitespaceIndex)) + "\u2026";

		return abbreviated;
	}

	// returns content of <meta name="" content=""> tags or '' if empty/non existant
	function getMeta(name) {
		var aMetas = document.getElementsByTagAttr('meta', 'name', name);
		var metaContent = ((aMetas.length > 0) && (aMetas[length-1].content)) ? aMetas[length-1].content : false;
		return metaContent || '';
	}
	
	// create tweet text from content of <meta name="DC.title"> and <meta name="DC.creator">
	// fallback to content of <title> tag
	function getTweetText() {
		var title = getMeta('DC.title');
		var creator = getMeta('DC.creator');

		if (title.length > 0 && creator.length > 0) {
			title += ' - ' + creator;
		} else {
			var eTitle = document.getElementsByTagName('title')[0];
			title = (eTitle) ? eTitle.innerHTML : '';
		}

		return encodeURIComponent(title);
	}

	// build URI from rel="canonical" or document.location
	function getURI() {
		var uri = document.location.href;
		var eCanonical = document.getElementsByTagAttr('link', 'rel', 'canonical')[0];
		var canonical = (eCanonical && eCanonical.href) ? eCanonical.href : '';

		if (canonical && canonical.length > 0) {
			if (canonical.indexOf("http") < 0) {
				canonical = document.location.protocol + "//" + document.location.host + canonical;
			}
			uri = canonical;
		}

		return uri;
	}

	function cookieSet(name, value, days, path, domain) {
		var expires = new Date();
		expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
		if (domain == 'localhost') { domain = '127.0.0.1'; }
		document.cookie = name + '=' + value + '; expires=' + expires.toUTCString() + '; path=' + path + '; domain=' + domain;
	}
	function cookieDel(name, value, path, domain) {
		var expires = new Date();
		expires.setTime(expires.getTime() - 100);
		if (domain == 'localhost') { domain = '127.0.0.1'; }
		document.cookie = name + '=' + value + '; expires=' + expires.toUTCString() + '; path=' + path + '; domain=' + domain;
	}

	// extend jquery with our plugin function
	socialSharePrivacy = function (target, settings) {
		var defaults = {
			'services' : {
				'facebook' : {
					'status'			: 'on',
					'dummy_img'		 : 'socialshareprivacy/images/dummy_facebook.png',
					'txt_info'		  : '2 Klicks f&uuml;r mehr Datenschutz: Erst wenn Sie hier klicken, wird der Button aktiv und Sie k&ouml;nnen Ihre Empfehlung an Facebook senden. Schon beim Aktivieren werden Daten an Dritte &uuml;bertragen &ndash; siehe <em>i</em>.',
					'txt_fb_off'		: 'nicht mit Facebook verbunden',
					'txt_fb_on'		 : 'mit Facebook verbunden',
					'perma_option'	  : 'on',
					'display_name'	  : 'Facebook',
					'referrer_track'	: '',
					'language'		  : 'de_DE',
					'action'			: 'recommend'
				}, 
				'twitter' : {
					'status'			: 'on', 
					'dummy_img'		 : 'socialshareprivacy/images/dummy_twitter.png',
					'txt_info'		  : '2 Klicks f&uuml;r mehr Datenschutz: Erst wenn Sie hier klicken, wird der Button aktiv und Sie k&ouml;nnen Ihre Empfehlung an Twitter senden. Schon beim Aktivieren werden Daten an Dritte &uuml;bertragen &ndash; siehe <em>i</em>.',
					'txt_twitter_off'   : 'nicht mit Twitter verbunden',
					'txt_twitter_on'	: 'mit Twitter verbunden',
					'perma_option'	  : 'on',
					'display_name'	  : 'Twitter',
					'referrer_track'	: '', 
					'tweet_text'		: getTweetText,
					'language'		  : 'en'
				},
				'gplus' : {
					'status'			: 'on',
					'dummy_img'		 : 'socialshareprivacy/images/dummy_gplus.png',
					'txt_info'		  : '2 Klicks f&uuml;r mehr Datenschutz: Erst wenn Sie hier klicken, wird der Button aktiv und Sie k&ouml;nnen Ihre Empfehlung an Google+ senden. Schon beim Aktivieren werden Daten an Dritte &uuml;bertragen &ndash; siehe <em>i</em>.',
					'txt_gplus_off'	 : 'nicht mit Google+ verbunden',
					'txt_gplus_on'	  : 'mit Google+ verbunden',
					'perma_option'	  : 'on',
					'display_name'	  : 'Google+',
					'referrer_track'	: '',
					'language'		  : 'de'
				}
			},
			'info_link'		 : 'http://www.heise.de/ct/artikel/2-Klicks-fuer-mehr-Datenschutz-1333879.html',
			'txt_help'		  : 'Wenn Sie diese Felder durch einen Klick aktivieren, werden Informationen an Facebook, Twitter oder Google in die USA &uuml;bertragen und unter Umst&auml;nden auch dort gespeichert. N&auml;heres erfahren Sie durch einen Klick auf das <em>i</em>.',
			'settings_perma'	: 'Dauerhaft aktivieren und Daten&uuml;ber&shy;tragung zustimmen:',
			'cookie_path'	   : '/',
			'cookie_domain'	 : document.location.host,
			'cookie_expires'	: '365',
			'css_path'		  : 'socialshareprivacy/socialshareprivacy.css',
			'uri'			   : getURI
		};

		// Standardwerte des Plug-Ings mit den vom User angegebenen Optionen ueberschreiben
		var options = extend(true, defaults, settings);

		var facebook_on = (options.services.facebook.status === 'on');
		var twitter_on  = (options.services.twitter.status  === 'on');
		var gplus_on	= (options.services.gplus.status	=== 'on');

		// check if at least one service is "on"
		if (!facebook_on && !twitter_on && !gplus_on) {
			return;
		}

		// insert stylesheet into document and prepend target element
		if ((options.css_path.length > 0) && !document.getElementById('socialSharePrivacy_css')) {
			// IE fix (noetig fuer IE < 9 - wird hier aber fuer alle IE gemacht)
			if (document.createStyleSheet) {
				document.createStyleSheet(options.css_path);
			} else {
				var eCssLink = createElement('link', {
					'id' : 'socialSharePrivacy_css', 'rel' : 'stylesheet', 'type' : 'text/css', 'href' : ('' + options.css_path + '')
				});
				document.getElementsByTagName('head')[0].appendChild(eCssLink);
			}
		}
		
		var sSP_objects = [];
		var sSP_targets = [];
		if ( (typeof target == 'string') ) {
			var targets = target.split(',');
			for (var i=0;i<targets.length;i++) {
				if (document.getElementById(targets[i])) {
					sSP_targets.push(document.getElementById(targets[i]));
				} else if (document.getElementsByClassName(targets[i]).length > 0) {
					var classtargets = document.getElementsByClassName(targets[i]);
					for (var j=0;j<classtargets.length;j++) { sSP_targets.push(classtargets[j]); }
				}
			}
		}

		for (i=0;i<sSP_targets.length;i++) {
			var sSP_target = sSP_targets[i];
			
			var sSP_UL = createElement('ul', { 'class' : 'social_share_privacy_area'});
			var context = sSP_UL;

			// canonical uri that will be shared
			var uri = options.uri;
			if (typeof uri === 'function') {
				uri = uri(context);
			}
			
			var toggleSwitch = function ( $container, dummy, share, txtON, txtOFF ) {
				var $switch = $container.getElementsByClassName('switch')[0];
				var $button = $container.getElementsByClassName('dummy_btn')[0];
				if ( $switch.hasClass('off') ) {
					$container.addClass('info_off');
					$switch.addClass('on'); $switch.removeClass('off');
					$switch.innerHTML = txtON;
					$button.removeChild($button.childNodes[0]);
					//$button.innerHTML = '';
					$button.appendChild(share);
				} else {
					$container.removeClass('info_off');
					$switch.addClass('off'); $switch.removeClass('on');
					$switch.innerHTML = txtOFF;
					$button.removeChild($button.childNodes[0]);
					$button.appendChild(dummy);
				}
			};
			
			//
			// Facebook
			//
			if (facebook_on) {
				var fb_enc_uri = encodeURIComponent(uri + options.services.facebook.referrer_track);
				var fb_code = function() { return createElement('iframe', {
					'src' 				: 'http://www.facebook.com/plugins/like.php?locale=' + options.services.facebook.language + '&amp;href=' + fb_enc_uri + '&amp;send=false&amp;layout=button_count&amp;width=80&amp;show_faces=false&amp;action=' + options.services.facebook.action + '&amp;colorscheme=light&amp;font&amp;height=21', 
					'scrolling'			: "no",
					'frameborder'		: "0",
					'style'				: "border:none; overflow:hidden; width:105px; height:25px;", 
			   		'allowTransparency'	: "true"
				}); };
				var _fb_dummy_btn_ = function() { 
					var btn = createElement('img', { 
						'src'	: options.services.facebook.dummy_img,
						'alt'	: "Facebook &quot;Like&quot;-Dummy",
						'class'	: "fb_like_privacy_dummy"
					}); 
					addEvent(btn, 'click', function ( oEvent ) {
						alert(this);
						toggleSwitch(
							this.parentNode.parentNode, _fb_dummy_btn_(), fb_code(), options.services.facebook.txt_fb_on, options.services.facebook.txt_fb_off
						);
						if ( oEvent.preventDefault ) { oEvent.preventDefault(); }
						if ( oEvent.stopPropagation ) { oEvent.stopPropagation(); }
						return (false);
					});
				return btn; };
				var sSP_LI = createElement('li', { 
					'class' : "facebook help_info"
				});
				sSP_LI.innerHTML = ['<span class="info">', options.services.facebook.txt_info, '</span>',
									'<span class="switch off">', options.services.facebook.txt_fb_off, '</span>',
									'<div class="fb_like dummy_btn">', '</div>'].join('');
				context.appendChild(sSP_LI);
				var $container_fb = context.getElementsByClassName('facebook')[0];
				var fb_dummy_btn = _fb_dummy_btn_();
				$container_fb.getElementsByClassName('dummy_btn')[0].appendChild( fb_dummy_btn );
				addEvent($container_fb.getElementsByClassName('switch')[0], 'click', function ( oEvent ) {
					toggleSwitch(
							this.parentNode, _fb_dummy_btn_(), fb_code(), options.services.facebook.txt_fb_on, options.services.facebook.txt_fb_off
					); 
					if ( oEvent.preventDefault ) { oEvent.preventDefault(); }
					if ( oEvent.stopPropagation ) { oEvent.stopPropagation(); }
					return (false);
				});
			}

			//
			// Twitter
			//
			if (twitter_on) {
				var text = options.services.twitter.tweet_text;
				if (typeof text === 'function') {
					text = text();
				}
				// 120 is the max character count left after twitters automatic url shortening with t.co
				text = abbreviateText(text, '120');

				var twitter_enc_uri = encodeURIComponent(uri + options.services.twitter.referrer_track);
				var twitter_count_url = encodeURIComponent(uri);
				//	--------------
				var twitter_code = function () { return createElement('iframe', {
					'src' 				: 'http://platform.twitter.com/widgets/tweet_button.html?url=' + twitter_enc_uri + '&amp;counturl=' + twitter_count_url + '&amp;text=' + text + '&amp;count=horizontal&amp;lang=' + options.services.twitter.language + '', 
					'scrolling'			: "no",
					'frameborder'		: "0",
					'style'				: "border:none; overflow:hidden; width:145px; height:21px;", 
			   		'allowTransparency'	: "true"
				}); };
				var _twitter_dummy_btn_ = function () { 
					var btn = createElement('img', { 
						'src'	: options.services.twitter.dummy_img,
						'alt'	: "&quot;Tweet this&quot;-Dummy",
						'class'	: "tweet_this_dummy"
					}); 
					addEvent(btn, 'click', function ( oEvent ) {
						toggleSwitch(
							this.parentNode.parentNode, _twitter_dummy_btn_(), twitter_code(), options.services.twitter.txt_twitter_on, options.services.twitter.txt_twitter_off
						);
						if ( oEvent.preventDefault ) { oEvent.preventDefault(); }
						if ( oEvent.stopPropagation ) { oEvent.stopPropagation(); }
						return (false);
					}); 
				return btn;};
				var sSP_LI = createElement('li', { 
					'class' : "twitter help_info"
				});
				sSP_LI.innerHTML = ['<span class="info">', options.services.twitter.txt_info, '</span>',
									'<span class="switch off">', options.services.twitter.txt_twitter_off, '</span>',
									'<div class="tweet dummy_btn">', '</div>'].join('');
				context.appendChild(sSP_LI);
				var $container_tw = context.getElementsByClassName('twitter')[0];
				var twitter_dummy_btn = _twitter_dummy_btn_();
				$container_tw.getElementsByClassName('dummy_btn')[0].appendChild(twitter_dummy_btn);
				addEvent($container_tw.getElementsByClassName('switch')[0], 'click', function ( oEvent ) {
					toggleSwitch(
							this.parentNode, _twitter_dummy_btn_(), twitter_code(), options.services.twitter.txt_twitter_on, options.services.twitter.txt_twitter_off
					); 
					if ( oEvent.preventDefault ) { oEvent.preventDefault(); }
					if ( oEvent.stopPropagation ) { oEvent.stopPropagation(); }
					return (false);
				});
				//	--------------
			}

			//
			// Google+
			//
			if (gplus_on) {
				// fuer G+ wird die URL nicht encoded, da das zu einem Fehler fuehrt
				var gplus_uri = uri + options.services.gplus.referrer_track;
				//	--------------
				var gplus_code = function () { 
					var eGPlus1			= createElement('div', { 'style': 'height: inherit; width: inherit;'});
					var gplus_div		= createElement('div', { 'class': 'g-plusone', 'data-size': 'medium', 'data-href': (''+gplus_uri+'') });
					var gplus_script	= createElement('script', { 'type': 'text/javascript' });
					var gplus_script_JS	= document.createTextNode([
						'window.___gcfg = {lang: "' + options.services.gplus.language + '"};',
						'(function() {',
							'var po = document.createElement("script");',
							'po.type = "text/javascript";',
							// we use the Google+ "asynchronous" code, standard code is flaky if inserted into dom after load
							'po.async = true;',
							'po.src = "https://apis.google.com/js/plusone.js";',
							'var s = document.getElementsByTagName("script")[0];',
							's.parentNode.insertBefore(po, s);',
							'})();'
					].join(' '));
					gplus_script.appendChild(gplus_script_JS);
					eGPlus1.appendChild(gplus_div);
					eGPlus1.appendChild(gplus_script);
					return eGPlus1;
				};
				var _gplus_dummy_btn_ = function () { 
					var btn = createElement('img', { 
						'src'	: options.services.gplus.dummy_img,
						'alt'	: "&quot;Google+1&quot;-Dummy",
						'class'	: "gplus_one_dummy"
					}); 
					addEvent(btn, 'click', function ( oEvent ) {
						toggleSwitch(
							this.parentNode.parentNode, _gplus_dummy_btn_(), gplus_code(), options.services.gplus.txt_gplus_on, options.services.gplus.txt_gplus_off
						);
						if ( oEvent.preventDefault ) { oEvent.preventDefault(); }
						if ( oEvent.stopPropagation ) { oEvent.stopPropagation(); }
						return (false);
					});
				return btn; };
				var sSP_LI = createElement('li', { 
					'class' : "gplus help_info"
				});
				sSP_LI.innerHTML = ['<span class="info">', options.services.gplus.txt_info, '</span>',
									'<span class="switch off">', options.services.gplus.txt_gplus_off, '</span>',
									'<div class="gplusone dummy_btn">', '</div>'].join('');
				context.appendChild(sSP_LI);
				var $container_gplus = context.getElementsByClassName('gplus')[0];
				var gplus_dummy_btn = _gplus_dummy_btn_();
				$container_gplus.getElementsByClassName('dummy_btn')[0].appendChild(gplus_dummy_btn);
				addEvent($container_gplus.getElementsByClassName('switch')[0], 'click', function ( oEvent ) {
					toggleSwitch(
							this.parentNode, _gplus_dummy_btn_(), gplus_code(), options.services.gplus.txt_gplus_on, options.services.gplus.txt_gplus_off
					); 
					if ( oEvent.preventDefault ) { oEvent.preventDefault(); }
					if ( oEvent.stopPropagation ) { oEvent.stopPropagation(); }
					return (false);
				});
				//	--------------
			}

			//
			// Der Info/Settings-Bereich wird eingebunden
			//
			var sSP_infoLI			= createElement('li',	{ 'class': 'settings_info' });
			var gplus_div			= createElement('div',	{ 'class': 'settings_info_menu off perma_option_off' });
			var gplus_a				= createElement('a',	{ 'href' : ('' + options.info_link + '') });
			var gplus_span1			= createElement('span',	{ 'class': 'help_info icon' });
			var gplus_span2			= createElement('span',	{ 'class': 'info' });
			gplus_span2.innerHTML	= ['', options.txt_help, ''].join('');
			gplus_span1.appendChild(gplus_span2);
			gplus_a.appendChild(gplus_span1);
			gplus_div.appendChild(gplus_a);
			sSP_infoLI.appendChild(gplus_div);
			context.appendChild(sSP_infoLI);

			var aLIs = context.getElementsByClassName('help_info');
			for (var k=0;k<aLIs.length;k++) {
				addEvent(aLIs[k], 'mouseover', function ( oEvent ) {
					if (!this.hasClass('info_off')) {
						var $info_wrapper = this;
						var timeout_id = window.setTimeout(function () { $info_wrapper.addClass('display'); }, 500);
						this.timeout_id = timeout_id;
					}
				});
				addEvent(aLIs[k], 'mouseout', function ( oEvent ) {
					var timeout_id = this.timeout_id;
					window.clearTimeout(timeout_id);
					if (this.hasClass('display') ) {
						this.removeClass('display');
					}
				});
			}
			
			var facebook_perma = (options.services.facebook.perma_option === 'on');
			var twitter_perma  = (options.services.twitter.perma_option  === 'on');
			var gplus_perma	= (options.services.gplus.perma_option	=== 'on');

			// Menue zum dauerhaften Einblenden der aktiven Dienste via Cookie einbinden
			// Die IE7 wird hier ausgenommen, da er kein JSON kann und die Cookies hier ueber JSON-Struktur abgebildet werden
			var isIE = (/MSIE (\d+\.\d+);/.test(navigator.userAgent)), IEver = new Number(RegExp.$1);
			if ( ( (facebook_on && facebook_perma)
				 || (twitter_on && twitter_perma)
				 || (gplus_on && gplus_perma) )
					&& ( !(isIE) || ((isIE) && (IEver > 7)) ) ) {

				// Cookies abrufen
				var cookie_list = document.cookie.split(';');
				var cookies = '{';
				var ci = 0;
				for (; ci < cookie_list.length; ci += 1) {
					var foo = cookie_list[ci].split('=');
					cookies += '"' + trim(foo[0]) + '":"' + trim(foo[1]) + '"';
					if (ci < cookie_list.length - 1) {
						cookies += ',';
					}
				}
				cookies += '}';
				cookies = JSON.parse(cookies);

				// Container definieren
				var $container_settings_info = context.getElementsByClassName('settings_info')[0];
				var $container_settings_info_menu = $container_settings_info.getElementsByClassName('settings_info_menu')[0];

				// Klasse entfernen, die das i-Icon alleine formatiert, da Perma-Optionen eingeblendet werden
				$container_settings_info_menu.removeClass('perma_option_off');

				// Perma-Optionen-Icon (.settings) und Formular (noch versteckt) einbinden
				var settings_span = createElement('span',		{ 'class': 'settings', 'style': "cursor: pointer;" });
				settings_span.innerHTML = 'Einstellungen';
				var settings_form = createElement('form',		{});
				var settings_fset = createElement('fieldset',	{});
				var settings_legd = createElement('legend',		{});
				settings_legd.innerHTML = '' + options.settings_perma + '';
				settings_fset.appendChild(settings_legd);
				settings_form.appendChild(settings_fset);
				$container_settings_info_menu.appendChild(settings_span);
				$container_settings_info_menu.appendChild(settings_form);
				
				//$container_settings_info.getElementsByClassName('settings_info_menu')[0].append('<span class="settings">Einstellungen</span><form><fieldset><legend>' + options.settings_perma + '</legend></fieldset></form>');


				// Die Dienste mit <input> und <label>, sowie checked-Status laut Cookie, schreiben
				var checked = ' checked="checked"';
				var fieldset = $container_settings_info.getElementsByTagName('fieldset')[0];
				if (facebook_on && facebook_perma) {
					var input = createElement('input', {
						'type': "checkbox", 'name': "perma_status_facebook", 'id': "perma_status_facebook"+i
					});
					input.checked = (cookies.socialSharePrivacy_facebook === 'perma_on') ? 'checked' : false;
					var label = createElement('label', {
						'for': "perma_status_facebook"+i
					});
					label.innerHTML = options.services.facebook.display_name;
					fieldset.appendChild(input);
					fieldset.appendChild(label);
				}

				if (twitter_on && twitter_perma) {
					var input = createElement('input', {
						'type': "checkbox", 'name': "perma_status_twitter", 'id': "perma_status_twitter"+i
					});
					input.checked = (cookies.socialSharePrivacy_twitter === 'perma_on') ? 'checked' : false;
					var label = createElement('label', {
						'for': "perma_status_twitter"+i
					});
					label.innerHTML = options.services.twitter.display_name;
					fieldset.appendChild(input);
					fieldset.appendChild(label);
				}

				if (gplus_on && gplus_perma) {
					var input = createElement('input', {
						'type': "checkbox", 'name': "perma_status_gplus", 'id': "perma_status_gplus"+i
					});
					input.checked = (cookies.socialSharePrivacy_gplus === 'perma_on') ? 'checked' : false;
					var label = createElement('label', {
						'for': "perma_status_gplus"+i
					});
					label.innerHTML = options.services.gplus.display_name;
					fieldset.appendChild(input);
					fieldset.appendChild(label);
				}

				// Einstellungs-Menue bei mouseover ein-/ausblenden
				var settingsSpan = $container_settings_info.getElementsByClassName('settings')[0];
				addEvent(settingsSpan, 'mouseover', function () {
					var parent = this.parentNode;
					var timeout_id = window.setTimeout(function () { 
						parent.removeClass('off'); parent.addClass('on');
					}, 500);
					this.parentNode.timeout_open = timeout_id;
				});
				addEvent($container_settings_info, 'mouseout', function () {
					var settings = this.getElementsByClassName('settings_info_menu')[0];
					if (settings.timeout_close) { window.clearTimeout(settings.timeout_close); }
					if (settings.timeout_open) { window.clearTimeout(settings.timeout_open); }
					var timeout_id = window.setTimeout(function () {
							settings.removeClass('on');
							settings.addClass('off');
					}, 3000);
					settings.timeout_close = timeout_id;
				});

				// Klick-Interaktion auf <input> um Dienste dauerhaft ein- oder auszuschalten (Cookie wird gesetzt oder geloescht)
				var inputs = $container_settings_info.getElementsByTagName('input');
				for (var m=0;m<inputs.length;m++) {
					addEvent(inputs[m], 'change', function (event) {
						var click = this.id;
						this.triggered = true;
						var service = ( (click.indexOf('facebook') != -1 ) ? 'facebook' : 
							( (click.indexOf('twitter') != -1 ) ? 'twitter' : 
								( (click.indexOf('gplus') != -1 ) ? 'gplus' : false 
						)));
						if (!service) return;
						var cookie_name = 'socialSharePrivacy_' + service;

						if (this.checked) {
							cookieSet(cookie_name, 'perma_on', options.cookie_expires, options.cookie_path, options.cookie_domain);
							this.nextSibling.addClass('checked');
							
							for (var n=0;n<sSP_targets.length;n++) { //...
								var context = sSP_targets[n]; // this.parentNode.parentNode.parentNode.parentNode.parentNode;
								if (facebook_on && service === 'facebook') {
									var fb_btns = context.getElementsByClassName('facebook');
									for (var fi=0;fi<fb_btns.length;fi++) {
										var evObj = document.createEvent('MouseEvents');
										evObj.initEvent( 'click', true, true );
										var evElement = fb_btns[fi].getElementsByClassName('switch')[0];
										if (evElement.hasClass('off')) { triggerEvent(evElement, evObj); }
										var chkBxs = document.getElementsByTagAttr('input', 'name', 'perma_status_facebook'); // .getElementsByName('perma_status_facebook')[0];
										for (var p=0;p<chkBxs.length;p++) { var chkBx=chkBxs[p]; if (!chkBx.checked && !chkBx.triggered) chkBx.checked=true; chkBx.nextSibling.addClass('checked'); }
									}
								}
								if (twitter_on && service === 'twitter') {
									var tw_btns = context.getElementsByClassName('twitter');
									for (var ti=0;ti<tw_btns.length;ti++) {
										var evObj = document.createEvent('MouseEvents');
										evObj.initEvent( 'click', true, true );
										var evElement = tw_btns[ti].getElementsByClassName('switch')[0];
										if (evElement.hasClass('off')) { triggerEvent(evElement, evObj); }
										var chkBxs = document.getElementsByTagAttr('input', 'name', 'perma_status_twitter'); // .getElementsByName('perma_status_twitter')[0];
										for (var p=0;p<chkBxs.length;p++) { var chkBx=chkBxs[p]; if (!chkBx.checked && !chkBx.triggered) chkBx.checked=true; chkBx.nextSibling.addClass('checked'); }
									}
								}
								if (gplus_on && service === 'gplus') {
									var gp_btns = context.getElementsByClassName('gplus');
									for (var gi=0;gi<gp_btns.length;gi++) {
										var evObj = document.createEvent('MouseEvents');
										evObj.initEvent( 'click', true, true );
										var evElement = gp_btns[gi].getElementsByClassName('switch')[0];
										if (evElement.hasClass('off')) { triggerEvent(evElement, evObj); }
										var chkBxs = document.getElementsByTagAttr('input', 'name', 'perma_status_gplus'); // .getElementsByName('perma_status_gplus')[0];
										for (var p=0;p<chkBxs.length;p++) { var chkBx=chkBxs[p]; if (!chkBx.checked && !chkBx.triggered) chkBx.checked=true; chkBx.nextSibling.addClass('checked'); }
									}
								}
							} //...
						} else {
							cookieDel(cookie_name, 'perma_on', options.cookie_path, options.cookie_domain);
							this.nextSibling.removeClass('checked');

							for (var n=0;n<sSP_targets.length;n++) { //...
								var context = sSP_targets[n]; // this.parentNode.parentNode.parentNode.parentNode.parentNode;
								if (facebook_on && service === 'facebook') {
									var fb_btns = context.getElementsByClassName('facebook');
									for (var fi=0;fi<fb_btns.length;fi++) {
										var evObj = document.createEvent('MouseEvents');
										evObj.initEvent( 'click', true, true );
										var evElement = fb_btns[fi].getElementsByClassName('switch')[0];
										if (evElement.hasClass('on')) { triggerEvent(evElement, evObj); }
										var chkBxs = document.getElementsByTagAttr('input', 'name', 'perma_status_facebook'); // .getElementsByName('perma_status_facebook')[0];
										for (var p=0;p<chkBxs.length;p++) { var chkBx=chkBxs[p]; if (chkBx.checked && !chkBx.triggered) chkBx.checked=false; chkBx.nextSibling.removeClass('checked'); }
									}
								}
								if (twitter_on && service === 'twitter') {
									var tw_btns = context.getElementsByClassName('twitter');
									for (var ti=0;ti<tw_btns.length;ti++) {
										var evObj = document.createEvent('MouseEvents');
										evObj.initEvent( 'click', true, true );
										var evElement = tw_btns[ti].getElementsByClassName('switch')[0];
										if (evElement.hasClass('on')) { triggerEvent(evElement, evObj); }
										var chkBxs = document.getElementsByTagAttr('input', 'name', 'perma_status_twitter'); // .getElementsByName('perma_status_twitter')[0];
										for (var p=0;p<chkBxs.length;p++) { var chkBx=chkBxs[p]; if (chkBx.checked && !chkBx.triggered) chkBx.checked=false; chkBx.nextSibling.removeClass('checked'); }
									}
								}
								if (gplus_on && service === 'gplus') {
									var gp_btns = context.getElementsByClassName('gplus');
									for (var gi=0;gi<gp_btns.length;gi++) {
										var evObj = document.createEvent('MouseEvents');
										evObj.initEvent( 'click', true, true );
										var evElement = gp_btns[gi].getElementsByClassName('switch')[0];
										if (evElement.hasClass('on')) { triggerEvent(evElement, evObj); }
										var chkBxs = document.getElementsByTagAttr('input', 'name', 'perma_status_gplus'); // .getElementsByName('perma_status_gplus')[0];
										for (var p=0;p<chkBxs.length;p++) { var chkBx=chkBxs[p]; if (chkBx.checked && !chkBx.triggered) chkBx.checked=false; chkBx.nextSibling.removeClass('checked'); }
									}
								}
							} //...
						}

						this.triggered = false;
						
					});
				}

				// Dienste automatisch einbinden, wenn entsprechendes Cookie vorhanden ist
				if (facebook_on && facebook_perma && cookies.socialSharePrivacy_facebook === 'perma_on') {
					var fb_btns = context.getElementsByClassName('facebook');
					for (var fi=0;fi<fb_btns.length;fi++) {
						var evElement = fb_btns[fi].getElementsByClassName('switch')[0];
						if (document.createEvent) {
							var evObj = document.createEvent('MouseEvents');
							evObj.initEvent( 'click', true, true );
							triggerEvent(evElement, evObj);
						} else if( document.createEventObject ) {
							var evObj = document.createEventObject();
							evElement.fireEvent( 'onclick', evObj );
						}
					}
				}
				if (twitter_on && twitter_perma && cookies.socialSharePrivacy_twitter === 'perma_on') {
					var tw_btns = context.getElementsByClassName('twitter');
					for (var ti=0;ti<tw_btns.length;ti++) {
						var evElement = tw_btns[ti].getElementsByClassName('switch')[0];
						if (document.createEvent) {
							var evObj = document.createEvent('MouseEvents');
							evObj.initEvent( 'click', true, true );
							triggerEvent(evElement, evObj);
						} else if( document.createEventObject ) {
							var evObj = document.createEventObject();
							evElement.fireEvent( 'onclick', evObj );
						}
					}
				}
				if (gplus_on && gplus_perma && cookies.socialSharePrivacy_gplus === 'perma_on') {
					var gp_btns = context.getElementsByClassName('gplus');
					for (var gi=0;gi<gp_btns.length;gi++) {
						var evElement = gp_btns[gi].getElementsByClassName('switch')[0];
						if (document.createEvent) {
							var evObj = document.createEvent('MouseEvents');
							evObj.initEvent( 'click', true, true );
							triggerEvent(evElement, evObj);
						} else if( document.createEventObject ) {
							var evObj = document.createEventObject();
							evElement.fireEvent( 'onclick', evObj );
						}
					}
				}
			}
			

			sSP_target.appendChild(context);
			
			
			sSP_objects.push(sSP_target);
			
		}

		return (sSP_objects);
		/* return this.each(function () {

			$(this).prepend('<ul class="social_share_privacy_area"></ul>');
			var context = $('.social_share_privacy_area', this);

			// canonical uri that will be shared
			var uri = options.uri;
			if (typeof uri === 'function') {
				uri = uri(context);
			}

		}); */ // this.each(function ()
	};	  // $.fn.socialSharePrivacy = function (settings) {
	
// } () );

