/**
 *	@package		JavaScript function collection
 * 
 *	@created		06/2005
 *	@copyright		2005 dragon-projects.net <info@dragon-projects.net>
 *	@author			Björn Bartels <bartels@dragon-projects.net>
 *	@version		1.03
 *
 *	@modified		08/2010
 *	@copyright		2010 P.AD. Werbeagentur <info@p-ad.de>
 *	@author			Björn Bartels <bb@p-ad.de>
 *	@version		1.1
 */

/**
 *	enter jQuery noConflict mode
 */
if (typeof jQuery != 'undefined') { jQuery.noConflict(); }

/**
 *	Firebug Console Debugging
 * /
if ( !('console' in window) || !('firebug' in console) ) {	
	var names = ['log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'dirxml', 'group', 'groupEnd', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd'];	
	window.console = {};	
	for (var i = 0; i < names.length; ++i) {
		window.console[names[i]] = function() {}; 
	}
}
*/

/**
 *	load javascript file
 * 
 *	@param		STRING	src
 *	@param		STRING	id
 *	@param		STRING	prefix
 *	@returns	void
 */
var loadScript = function (src, id, prefix) {
	var head = document.getElementsByTagName('head')[0];
	if ( (src.indexOf('http') < 0) || (src.indexOf('/') != 0) ) {
		src = prefix + '' + src ;
	}
	var script = createElement('script', {
		'type'	:	'text/javascript',
		'src'	:	src
	});
	if(id) {
		var old = document.getElementById(id);
		if(old)
			old.parentNode.removeChild(old);
		script.id = id;
	}
	head.appendChild(script);
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
		for(attr in attrs)
			elm.setAttribute(attr, attrs[attr]);
	return elm;
};

/**
 *	creates (domain based) user's browser cookie
 * 
 *	@param		STRING		name
 *	@param		MIXED		value
 *	@param		INTEGER		days	(optional)
 *	@param		STRING		domain	(optional)
 *	@returns	void
 */
function createCookie(name,value,days,domain) {
	if (days) {
		var ablauf = new Date();
		var inXTagen = ablauf.getTime() + ( 30 * 24 * 60 * 60 * 1000);
		ablauf.setTime(inXTagen);
		var expires = "; expires="+ablauf.toGMTString();
	}
	else var expires = "";
	var domain_str = "";
		if (domain) {
		domain_str = "; domain=" + escape (domain);
	}
	document.cookie = name+"="+value + expires + "; path=/"+domain_str;
}

/**
 *	reads information/content from a specific cookie given by its name
 *
 *	@param		STRING		name
 *	@returns	MIXED
 */
function readCookie(name) {
	var nameEquivalent = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEquivalent) == 0) return c.substring(nameEquivalent.length,c.length);
	}
	return null;
}

/**
 *	removes a specific cookie given by its name
 * 
 *	@param		STRING		name
 *	@returns	void
 */
function eraseCookie(name, domain) {
		createCookie(name,"",-1, domain);
}

/**
 *	test if user's browser allows cookies to be set
 * 
 *	@returns	BOOLEAN
 */
function testCookiesEnabled() {
		var cookieEnabled=(navigator.cookieEnabled)? true : false;
		//if not IE4+ nor NS6+
		if (typeof navigator.cookieEnabled=="undefined" && !cookieEnabled) { 
				document.cookie="testcookie";
				cookieEnabled=(document.cookie.indexOf("testcookie")!=-1)? true : false;
		}
		return cookieEnabled;
}

/**
 *	decodes a string encoded in UTF-8 into ISO-8859-1
 * 
 *	@param		STRING		sUTF8text
 *	@returns	STRING
 */
var utf8_decode = function ( sUTF8text ) {
	var string = '';
	var i = 0;
	var c = c1 = c2 = 0;
	
	while ( i < sUTF8text.length ) {
		c = sUTF8text.charCodeAt(i);
		
		if ( c < 128 ) {
			string += String.fromCharCode(c);
			i++;
		} else if ( (c > 191) && (c < 224) ) {
			c2 = sUTF8text.charCodeAt( i+1 );
			string += String.fromCharCode( ((c & 31) << 6) | (c2 & 63) );
			i += 2;
		} else {
			c2 = sUTF8text.charCodeAt( i+1 );
			c3 = sUTF8text.charCodeAt( i+2 );
			string += String.fromCharCode( ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63) );
			i += 3;
		}
	}
	return string;
};

/**
 *	decodes a string encoded in UTF-8 into ISO-8859-1
 * 
 *	@param		STRING		sUTF8text
 *	@returns	STRING
 */
var serializeString = function (text) {
	if (typeof text == 'function') return null;
	var lowerCaseText = String(text).toLowerCase();
	return lowerCaseText
		.replace('ä', 'ae').replace('ö', 'oe').replace('ü', 'ue')
		.replace('Ä', 'Ae').replace('Ö', 'Oe').replace('Ü', 'Ue')
		.replace('ß', 'ss')
		.replace('Ã¤', 'ae').replace('Ã¶', 'oe').replace('Ã¼', 'ue')
		.replace('Ã„', 'Ae').replace('Ã–', 'Oe').replace('Ãœ', 'Ue')
		.replace('ÃŸ', 'ss')
		.replace(String.fromCharCode(228), 'ae').replace(String.fromCharCode(246), 'oe').replace(String.fromCharCode(252), 'ue')
		.replace(String.fromCharCode(196), 'Ae').replace(String.fromCharCode(214), 'Oe').replace(String.fromCharCode(220), 'Ue')
		.replace(String.fromCharCode(223), 'ss')
		.replace('&auml;', 'ae').replace('&ouml;', 'oe').replace('&uuml;', 'ue')
		.replace('&Auml;', 'Ae').replace('&Ouml;', 'Oe').replace('&Uuml;', 'Ue')
		.replace('&szlig;', 'ss')
		.replace(' ', '_').replace('-', '_').replace('/', '_').replace('+', '_')
		.replace('.', '_').replace(',', '_').replace(':', '_').replace(';', '_')
		.replace('(', '_').replace(')', '_').replace('%', '_').replace('&', '_')
		.replace(' ', '_').replace('-', '_').replace('/', '_');
};


/**
 * get current location query string
 * 
 * @returns		STRING|false
 */
var getQueryString = function ( sUrl ) {
	if (!sUrl) {
		var sUrl = parent.document.URL;
	}
	var querystring_position = sUrl.indexOf('?');
	if (querystring_position != -1) {
		return sUrl.substring(querystring_position + 1, sUrl.length);
	}
	return false;
};

/**
 * get current URL's parameters
 * 
 * @uses		getQueryString()
 * @returns		ARRAY|false
 */
var getUrlParameters = function ( sUrl ) {
	if (!sUrl) {
		var sUrl = parent.document.URL;
	}
	var querystring = getQueryString( sUrl );
	var	names = new Array();
	var querystring_values = new Object();
	var item;
	if (querystring) {
		var contents = querystring.split('&');	
		for (i = 0; i < contents.length; i++) {
			item = contents[i].split('=');
			querystring_values[item[0]] = item[1];
		}
		return querystring_values;
	}
	return false;
};

/**
 *	capitalize first character of a given string, turn all others to lower cased characters
 *		a = capitalize('hello');
 *			-> a == 'Hello'
 *		a = capitalize('HELLO WORLD!');
 *			-> a == 'Hello world!'
 *
 *	@param		STRING		sString
 *	@returns	STRING
 */
var capitalize = function( sString ) {
		return String(sString).charAt(0).toUpperCase() + String(sString).substring(1).toLowerCase();
};

/**
 *	truncates a given sString to a given iLength (default = 30 characters). 
 *	If sTruncation is set it is appended to the string instead of '...'
 *		a = truncate('A random sentence whose length exceeds 30 characters.');
 *			-> a == 'A random sentence whose len...'
 *		a = truncate('Some random text');
 *			-> a == 'Some random text.'
 *		a = truncate('Some random text', 10);
 *			-> a == 'Some ra...'
 *		a = truncate('Some random text', 10, ' [...]');
 *			-> a == 'Some [...]'
 * 
 *	@param		STRING		sString
 *	@param		INTEGER		iLength
 *	@param		STRING		sTruncation
 *	@returns	STRING
 */
var truncate = function (sString , iLength, sTruncation) {
	length = length || 30;
	truncation = truncation === undefined ? '...' : truncation;
	return (
			String(sString).length > length ?
					String(sString).slice(0, length - truncation.length) + truncation : String(sString)
	);
};

/**
 *	converts a string separated by dashes into a camelCase equivalent
 *		a = camelize('background-color');
 *			-> a == 'backgroundColor'
 *		a = camelize('-moz-binding');
 *			-> a == 'MozBinding'
 * 
 *	@param		STRING		sString
 *	@returns	STRING
 */
var camelize = function ( sString ) {
		var parts = String(sString).split('-'), len = parts.length;
		if (len == 1) return parts[0];

		var camelized = String(sString).charAt(0) == '-'
			? parts[0].charAt(0).toUpperCase() + parts[0].substring(1)
			: parts[0];

		for (var i = 1; i < len; i++)
			camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);

		return camelized;
};

/**
 *	converts a camelized string into a series of words separated by an underscore (_)
 *		a = underscore('borderBottomWidth');
 *			-> a == 'border_bottom_width'
 *
 *	@param		STRING		sString
 *	@returns	STRING
 */
var underscore = function( sString ) {
		return String(sString).gsub(/::/, '/').gsub(/([A-Z]+)([A-Z][a-z])/,'#{1}_#{2}').gsub(/([a-z\d])([A-Z])/,'#{1}_#{2}').gsub(/-/,'_').toLowerCase();
};

/**
 *	replaces every instance of the underscore character "_" by a dash "-"
 *		a = dasherize('border_bottom_width');
 *			-> a == 'border-bottom-width'
 *
 *	@param		STRING		sString
 *	@returns	STRING
 */
var dasherize = function ( sString ) {
		return String(sString).gsub(/_/,'-');
};

/**
 *	detects the number of visible items in a collection by an initialization element's classname
 *	E.g.:
 *	if the following element is given...
 *	<code>&lt;div id="myelement" class="bla_5"&gt;...&lt;/div&gt;</code>
 *	... the line...
 *	<code>detectNumberOfCollectionItems('myelement', 'bla_', 2, 10);</code>
 *	... will return the number "5". If 'myelement' does not have a class name 
 *	like 'bla_{N}' it will return the default value ("2"). If 'myelement' does
 *	have a class name which will exceed the maximum value (e.g. 'bla_12') it 
 *	will return the given maximum value ("10"). If no default value, no maximum
 *	value and no matching class name is found, the function will return 'false'. 
 * 
 *	@param		STRING|HTMLElement	oCollectionElement	element (id) which is used to initialize the collection object, respectivly the element which contains the classname to detect
 *	@param		STRING				sIdentificator		classname identificator to detect the amount of items
 *	@param		INTEGER				iDefault			default value
 *	@param		INTEGER				iMaximum			maximum value
 *	@return		INTEGER|BOOLEAN		the number of items detected
 */
var detectNumberOfCollectionItems = function ( oCollectionElement, sIdentificator , iDefault, iMaximum ) {
	if ( (typeof oCollectionElement == 'undefined') || (typeof sIdentificator == 'undefined') ) {
		return (false);
	}
	var iMax = (typeof iMaximum == 'undefined') ? 10 : parseInt(iMaximum) ;
	var sClassname = sIdentificator;
	for ( i = 1; i <= iMax; i++) {
		if ( jQuery(oCollectionElement).hasClass(sClassname+i) ) {
			return (i);
		}
	}
	if (typeof iDefault != 'undefined') {
		return (parseInt(iDefault));
	}
	return (false);
};

/**
 *	typhoon suggestion configuration method
 * 
 *	@param		STRING		tknstr
 *	@param		INTEGER		mndint
 *	@param		STRING		sidstr
 *	@param		STRING		urlstr
 *	@param		STRING		searchurlstr
 *	@param		MIXED		artActv
 *	@param		MIXED		trmActv
 *	@param		MIXED		trmFrst
 *	@param		STRING		searchElementNameP
 *	@returns 	OBJECT
 */
var tyCnf = function ( tknstr, mndint, sidstr, urlstr, searchurlstr, artActv, trmActv, trmFrst, searchElementNameP ) {
		this.tkn				= tknstr;
		this.mnd				= mndint;
		this.sid				= sidstr;
		this.url				= urlstr;
		this.searchurl			= searchurlstr;
		this.artActv			= artActv;
		this.trmActv			= trmActv;
		this.trmFrst			= true;
		this.searchElementName	= "sq";
};

/**
 *	loads a HTML definition list <dl> <dt></dt> <dd></dd>... </dl> into a JSON object
 * 
 *	@param		STRING|HTMLElement	oElement	where oElement represents the <dl> tag
 *	@retrun		OBJECT				the JSON object representing the definition list
 */
var parseDefList = function ( oElement ) {
	var aKeys	=	jQuery(oElement).find('DT');
	var aValues	=	jQuery(oElement).find('DD');	
	var oData	=	{};	
	//jQuery(oElement).find('DT').each(function ( iIndex, oDT ) {
	aKeys.each(function ( iIndex, oDT ) {
		var sKey	=	jQuery( oDT ).html();
		var sValue	=	jQuery(aValues[iIndex]).html();
		oData[jQuery.trim(sKey)] = sValue;
	});	
	return oData;
};

/**
 *	loads a HTML list containing definition lists <ul> <li> <dl> <dt></dt> <dd></dd>... </dl> </li>... </ul> into a JSON object
 * 
 *	@param	STRING|HTMLElement	oElement	where oElement represents the <ul>/<ol> tag
 *	@retrun	ARRAY				the JSON object representing the whole list of definition lists
 */
var parseParamList = function ( oElement ) {
	var aItems	=	jQuery(oElement).find('LI');
	var aData	=	[];
	jQuery(oElement).find('LI').each(function ( iIndex, oLI ) {
		if ( jQuery( oLI ).find('DL').size() > 0 ) {
			aData[iIndex] = parseDefList( jQuery( oLI ).find('DL').first() );
		}
	});
	return aData;
};


/**
 *	extends the original 'Object' class to extend itself (or a target object) 
 *	with the (deep) content of (a) source object(s)
 * 
 *	@param	BOOLEAN	deep		perfomm a deep extension of the objects
 *	@param	OBJECT	target		the object to extend to
 *	@param	OBJECT	sources		the object to copy from
 *	@return	OBJECT				
 */
/*Object.extend = function(destination, source) {
	for (var property in source) {
		destination[property] = source[property];
	}
	return destination;
};*/

Object.extend = function () {
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
		target = this;
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
				if ( deep && copy && ( (typeof copy === "object") || ( copyIsArray = ((typeof copy === "object") && (copy.push))) ) ) {
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
 *	extend itself a target object with the (deep) content of (a) source object(s)
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
 *	extends the original 'Object' class to let you create a new class object inheriting 
 *	the properties and methods of a given abtract oBaseObject
 * 
 *	@param	OBJECT	oBaseObject		the abstract class object to inherit from
 *	@return	OBJECT					return extendable and constructable ('new myClass()') class object
 */
Object.createClass = function ( oBaseObject ) {
	
	var oClassObject = function ( oOptions ) {
		
		if (typeof oOptions == 'undefined') { 
			oOptions	=	{};
		}
		this.oOptions	=	{};
		for ( oOption in oOptions ) {
			this.oOptions[oOption]	=	oOptions[oOption];
		}
		
		for ( oOption in this.oOptions ) {
			if (oOption != 'oOptions') {
				this[oOption] = this.oOptions[oOption];
			}
			
		}
		
		if (typeof this['__super'] != 'function') { 
			this['__super'] = function () {
				var oThis = this;
				for ( oProperty in this.prototype ) {
					oThis[oProperty] = this[oProperty];
				}
				return (oThis);
			};
		}
		
		if (typeof this['__destroy'] != 'function') { 
			this['__destroy'] = function () {
				for ( oProperty in this ) {
					this[oProperty] = NULL;
				}
			};
		}
		
		if (typeof this['__extend'] != 'function') { 
			this['__extend'] = function ( oObject ) {
				if (typeof oObject != 'undefined') {
					for ( oProperty in oObject ) {
						this[oProperty] = oObject[oProperty];
					}
				}
				return (this);
			};
		}

		if (typeof this['__construct'] == 'function') { 
			this['__construct'].apply(this, [this.oOptions]);
		} else {
			this['__construct'] = function () {
				return (this);
			};
		}

		return ((this));
	};
	
	if ( (typeof oBaseObject == 'undefined') ) { 
		oBaseObject = {};
	}
	if ( (typeof oBaseObject == 'object') ) { //	|| (typeof oBaseObject == 'function') ) {
		oClassObject.$super		=	oClassObject.prototype.$super		=	oBaseObject;
	} else if ( (typeof oBaseObject == 'function') && (typeof (oBaseObject().__super) == 'function') ) {
		oClassObject.$super		=	oClassObject.prototype.$super		=	oBaseObject().__super.apply(oBaseObject);
	} else {
		oClassObject.$super		=	oClassObject.prototype.$super		=	{};
	}
	
	//oClassObject.$super	=	oClassObject.prototype.$super	=	{};
	for ( oProperty in oBaseObject ) {
		if ( (oProperty != '$super') && (oProperty != 'prototype') ) {
			oClassObject[oProperty]			=	oClassObject.prototype[oProperty]			=	oBaseObject[oProperty];
			oClassObject.$super[oProperty]	=	oClassObject.prototype.$super[oProperty]	=	oBaseObject[oProperty];
		}
		
	}
	
	return (oClassObject);
};

/**
 *	shortcut method for Object.createClass
 * 
 *	@param		OBJECT	oBaseObject		the abstract class object to inherit from
 *	@return		OBJECT					return extendable and constructable ('new myClass()') class object
 *	@see		Object.createClass
 */
var $Class = function ( oBaseClass ) {
	this.create = Object.createClass;
	if (typeof Object.createClass == 'function') {
		return ( ( Object.createClass(oBaseClass) ) );
	} else {
		return (null);
	}
};

/**
 *	shortcut method for Object.createClass
 * 
 *	@param		OBJECT	oBaseObject		the abstract class object to inherit from
 *	@return		OBJECT					return extendable and constructable ('new myClass()') class object
 *	@see		Object.createClass
 */
var _$detectAPIs = function ( ) {
	var oAPIs = {
		jquery			:	(typeof jQuery != 'undefined'),
		prototype		:	(typeof Prototype != 'undefined'),
		scriptacolus	:	(typeof Scriptaculous != 'undefined'),
		dom				:	false
	};
	if ( !oAPIs.jquery && !oAPIs.prototype && !oAPIs.scriptacolus ) {
		oAPIs.dom = true;
	}
	return (oAPIs);
	
};

/**
 *	shortcut method for Object.createClass
 * 
 *	@param		OBJECT	oBaseObject		the abstract class object to inherit from
 *	@return		OBJECT					return extendable and constructable ('new myClass()') class object
 *	@see		Object.createClass
 */
/*var _$SETTINGavailableAPIs = {
	jquery			:	true,
	prototype		:	false,
	scriptacolus	:	false,
	dom				:	true		// at least this one should be true, set to false to explictly skip DOM element lookup
};
var _$SETTINGpreferedEngine = "jQuery"; // "jQuery" | "Prototype" | "DOM"(default) | ""(get ALL available) | {unset}(set to "DOM")
var _$ = function ( mSelector, sPreferedEngine ) {
	if (typeof mSelector == 'undefined') {
		return ( null );
	}
	if (typeof sPreferedEngine == 'undefined') {
		var sPreferedEngine = 'DOM';
		if (typeof sSETTINGpreferedEngine != 'undefined') {
			sPreferedEngine = sSETTINGpreferedEngine;
		}
	}
	var oAvailableAPIs = false;
	if (typeof _$SETTINGavailableAPIs != 'undefined') {
		oAvailableAPIs = _$SETTINGavailableAPIs;
	} else {
		_$SETTINGavailableAPIs = _$detectAPIs();
		oAvailableAPIs = _$SETTINGavailableAPIs;
	}	
	var oObjects = {
		jquery			:	false,
		prototype		:	false,
		dom				:	false
	};
	var oAPIs = oAvailableAPIs;
	function isPrefered() {
		return ( (String(sPreferedEngine) != "") && (typeof oAPIs[String(sPreferedEngine).toLowerCase()] == true) );
	}
	var fObjectCaller = function () {return(false);};
	if (oAPIs.jquery) {
		if ( isPrefered() ) {
			return jQuery(mSelector);
		}
		oObjects.jquery = jQuery(mSelector);
	}
	
	if (oAPIs.prototype) {
		fObjectCaller = $;
		if ( !fObjectCaller(mSelector) ) {
			fObjectCaller = $$;
		}
		if ( isPrefered() ) {
			return fObjectCaller(mSelector);
		}
		oObjects.prototype = fObjectCaller(mSelector);
	}
	
	if (oAPIs.dom) {
		var aSelectors = String(mSelector).split(",");
		var fObjectCaller = document.getElementById;
		if (aSelectors.length > 0) {
			for (iSelector in aSelectors) {
				var sSelector = aSelectors[iSelector];
				var result = false;
				if ( !document.getElementById(sSelector) ) {
					fObjectCaller = document.getElementsByTagName;
					if ( (typeof document.getElementsByClassname == "function") ) {
						fObjectCaller = document.getElementsByClassname;
					} else if ( (typeof document.getElementsByClassName == "function") ) {
						fObjectCaller = document.getElementsByClassName;
					}
					result = fObjectCaller(sSelector);
				} else {
					result = document.getElementById(sSelector);
				}
				if ( (aSelectors.length == 1) ) {
					return ( result );
				} else if ( !oObjects.dom && result ) {
					oObjects.dom = [];
					oObjects.dom.push( result );
				} else if ( result ) {
					oObjects.dom.push( result );
				}
			}
		}
		if ( isPrefered() ) {
			return oObjects.dom;
		}
	}
	return oObjects;
};
*/

/**
 *	resize element to its scrolling height
 *
 *	@param		HTMLElement|STRING	e
 *	@param		INTEGER				maxHeight
 *	@returns	void
 */
var resizeHeight = function ( oTarget, maxHeight ) {
	var oElement	=	jQuery(oTarget);
	if (oElement.size() > 0) {
		var adjustedHeight	=	oElement.attr("clientHeight");
		if ( !maxHeight || (maxHeight > adjustedHeight) ) {
			adjustedHeight	=	Math.max( oElement.attr("scrollHeight"), adjustedHeight );
			if (maxHeight) {
				adjustedHeight	=	Math.min( maxHeight, adjustedHeight );
			}
			if ( adjustedHeight > oElement.attr("clientHeight") ) {
				adjustedHeight	+=	25;
			}
			oElement.css( "height", adjustedHeight+"px" );
		}
	}
};

/**
 *	count words in a text field and update its info display (remaining/too many words)
 *	@param		HTMLElement|STRING	e
 *	@param		HTMLElement|STRING	cntfieldId
 *	@param		INTEGER				maxWords
 *	@returns	void
 */
var wordCounter = function ( oTarget, cntfieldId, maxWords ) {
	var oElement	=	jQuery(oTarget);
	var res	=	oElement.attr("value").match(/\s+/g);
	var t	=	jQuery(cntfieldId);
	if ( res && (t.size() > 0) ) {
		if ( res.length > maxWords ) {
			oElement.addClass("tooManyWords");
			t.html(	0	);
		}else{
			oElement.removeClass("tooManyWords");
			t.html(	( parseInt(maxWords) - parseInt(res.length) )	);
		}
	}
};

/**
 *	creates new browser window and loads given URL
 * 
 *	@param		STRING				url
 *	@param		STRING				name
 *	@param		STRING				features
 *	@param		INTEGER				myWidth
 *	@param		INTEGER				myHeight
 *	@param		BOOLEAN				isCenter
 *	@returns	OBJECT|window
 */
var openFlexWindow = function (url, name, features, myWidth, myHeight, isCenter) {

	if (name == '') {
		name		=		'yetanotherwindow';
	}

	// Replace evtl. spaces with underscores
	name = name.replace(/ /g, "_");

	if ( (myHeight == '') || (myHeight == 0) )		 myHeight		=		500;
	if ( (myWidth == '') || (myWidth == 0) )		 myWidth		=		500;

	if ( (features == "none") || (features == '') ) {
		features = "toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=yes,resizable=yes";
	} else {
		if (features == "all") {
			features = "toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes";
		}
	}

	if (window.screen) {
		if ((isCenter != '') && (isCenter != 'false')) {
			var offset			=	30;
			var bottom_offset	=	70;
			switch (isCenter) {
				case 'top-left':
						var myLeft	=	offset;
						var myTop	=	offset;
				break;
				case 'top-right':
						var myLeft	=	screen.availWidth - myWidth - offset;
						var myTop	=	offset;
				break;
				case 'top-middle':
						var myLeft	=	(screen.availWidth - myWidth) / 2;
						var myTop	=	offset;
				break;
				case 'mid-left':
						var myLeft	=	offset;
						var myTop	=	( (screen.availHeight - myHeight) / 2) - offset;
				break;
				case 'mid-right':
						var myLeft	=	(screen.availWidth - myWidth) - offset;
						var myTop	=	( (screen.availHeight - myHeight) / 2) - offset;
				break;
				case 'bottom-left':
						var myLeft	=	offset;
						var myTop	=	screen.availHeight - myHeight - bottom_offset;
				break;
				case 'bottom-middle':
						var myLeft	=	(screen.availWidth - myWidth) / 2;
						var myTop	=	screen.availHeight - myHeight - bottom_offset;
				break;
				case 'bottom-right':
							var myLeft	=	screen.availWidth - myWidth - offset;
							var myTop	=	screen.availHeight - myHeight - bottom_offset;
					break;
				default:
						var myLeft	=	(screen.availWidth - myWidth) / 2;
						var myTop	=	( (screen.availHeight - myHeight) / 2) - offset;
				break;
			}
			features	+=	(features != '') ? ',' : '';
			features	+=	'left=' + myLeft + ',top=' + myTop;
		}
	}

	features		=	(features != '') ? features + ',width=' + myWidth + ',height=' + myHeight : 'width=' + myWidth + ',height=' + myHeight;
	var popupWin	=	window.open (url, name, features);
	if (popupWin) {
		popupWin.focus();
	}
	return (popupWin);
};

/**
 *	[deprecated] 'openFlexWindow' wrapper for compatiblity reasons
 * 
 *	@deprecated
 *	@param		STRING				url
 *	@param		STRING				name
 *	@param		STRING				features
 *	@param		INTEGER				myWidth
 *	@param		INTEGER				myHeight
 *	@param		BOOLEAN				isCenter
 *	@returns	OBJECT|window
 */
var openWindow = function (url, name, features, myWidth, myHeight, isCenter) {
	return ( openFlexWindow (url, name, features, myWidth, myHeight, isCenter) );
};

/**
 *	opens new browser window for several pre-defined presets
 *
 *	@param		STRING		url
 *	@param		STRING		preset
 *	@returns	OBJECT|window
 */
var openPreSetWindow = function (url, preset) {
		switch (preset) {
				case 'help':
						return openFlexWindow(url,'help','none','550','500','top-right');
				break;

				case 'info':
					return openFlexWindow(url,'info','none','880','550','true');
						//openFlexWindow(url,'info','none','750','550','true');
				break;

				case 'blickinsbuch':
					return openFlexWindow(url,'blickinsbuch','none','850','550','true');
				break;

				case 'offlink':
					return openFlexWindow(url,'offsite','all','800','600','top-right');
				break;

				case 'eflyer':
					return openFlexWindow(url,'eflyer','none','1036','710','true');
				break;

				case 'gewinnspiel':
					return openFlexWindow(url,'gewinnspiel','none','530','530','true');
				break;
				
				case 'newsletter':
					return openFlexWindow(url,'newsletter','none','700','2100','true');
				break;

				default:
					return openFlexWindow(url,'flexwindow','all','800','600','true');
				break;
		}
		return false;
};

/**
 *	[deprecated] writes given embed-tag string to document
 *
 *	@deprecated
 *	@param		STRING		embedstring
 *	@returns	void
 */
function activateFlashEmbedding(embedstring) {
		document.writeln(embedstring);
}

/**
 *	[deprecated] auto-focuses page's quick-search element
 *
 *	@deprecated
 *	@returns	void
 */
function autoFocus() {
		if (document.getElementById("quicksearch") ) {
				document.getElementById("quicksearch").sq.focus();
		}
}

/**
 *	turns XML DOM object into JSON string/object
 *	
 *	@param		DOMDocument		xml			XML to turn into JSON
 *	@param		STRING			tab			string to indent JSON string output
 *	@param		STRING			bToString	return JSON object as a string (true) or as an object (false, default)
 *	@returns	OBJECT|STRING 
 */
function xml2json( xml, tab, bToString ) {
	var X = {
		toObj: function(xml) {
			var o = {};
			if (xml.nodeType==1) {	// element node ..
				if (xml.attributes.length)	// element with attributes	..
					for (var i=0; i<xml.attributes.length; i++)
						o["@"+xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
				if (xml.firstChild) { // element has child nodes ..
					var textChild=0, cdataChild=0, hasElementChild=false;
					for (var n=xml.firstChild; n; n=n.nextSibling) {
						if (n.nodeType==1) hasElementChild = true;
						else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
						else if (n.nodeType==4) cdataChild++; // cdata section node
					}
					if (hasElementChild) {
						if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
							X.removeWhite(xml);
							for (var n=xml.firstChild; n; n=n.nextSibling) {
								if (n.nodeType == 3)	// text node
									o["#text"] = X.escape(n.nodeValue);
								else if (n.nodeType == 4)	// cdata node
									o["#cdata"] = X.escape(n.nodeValue);
								else if (o[n.nodeName]) {	// multiple occurence of element ..
									if (o[n.nodeName] instanceof Array)
										o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
									else
										o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
								}
								else	// first occurence of element..
									o[n.nodeName] = X.toObj(n);
							}
						}
						else { // mixed content
							if (!xml.attributes.length)
								o = X.escape(X.innerXml(xml));
							else
								o["#text"] = X.escape(X.innerXml(xml));
						}
					}
					else if (textChild) { // pure text
						if (!xml.attributes.length)
							o = X.escape(X.innerXml(xml));
						else
							o["#text"] = X.escape(X.innerXml(xml));
					}
					else if (cdataChild) { // cdata
						if (cdataChild > 1)
							o = X.escape(X.innerXml(xml));
						else
							for (var n=xml.firstChild; n; n=n.nextSibling)
								o["#cdata"] = X.escape(n.nodeValue);
					}
				}
				if (!xml.attributes.length && !xml.firstChild) o = null;
			}
			else if (xml.nodeType==9) { // document.node
				o = X.toObj(xml.documentElement);
			}
			else
				alert("unhandled node type: " + xml.nodeType);
			return o;
		},
		toJson: function(o, name, ind) {
			var json = name ? ("\""+name+"\"") : "";
			if (o instanceof Array) {
				for (var i=0,n=o.length; i<n; i++)
					o[i] = X.toJson(o[i], "", ind+"\t");
				json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
			}
			else if (o == null)
				json += (name&&":") + "null";
			else if (typeof(o) == "object") {
				var arr = [];
				for (var m in o)
					arr[arr.length] = X.toJson(o[m], m, ind+"\t");
				json += (name?":{":"{") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "}";
			}
			else if (typeof(o) == "string")
				json += (name&&":") + "\"" + o.toString() + "\"";
			else
				json += (name&&":") + o.toString();
			return json;
		},
		innerXml: function(node) {
			var s = "";
			if ("innerHTML" in node)
				s = node.innerHTML;
			else {
				var asXml = function(n) {
					var s = "";
					if (n.nodeType == 1) {
						s += "<" + n.nodeName;
						for (var i=0; i<n.attributes.length;i++)
							s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
						if (n.firstChild) {
							s += ">";
							for (var c=n.firstChild; c; c=c.nextSibling)
								s += asXml(c);
							s += "</"+n.nodeName+">";
						}
						else
							s += "/>";
					}
					else if (n.nodeType == 3)
						s += n.nodeValue;
					else if (n.nodeType == 4)
						s += "<![CDATA[" + n.nodeValue + "]]>";
					return s;
				};
				for (var c=node.firstChild; c; c=c.nextSibling)
					s += asXml(c);
			}
			return s;
		},
		escape: function(txt) {
			return txt.replace(/[\\]/g, "\\\\")
						 .replace(/[\"]/g, '\\"')
						 .replace(/[\n]/g, '\\n')
						 .replace(/[\r]/g, '\\r');
		},
		removeWhite: function(e) {
			e.normalize();
			for (var n = e.firstChild; n; ) {
				if (n.nodeType == 3) {	// text node
					if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
						var nxt = n.nextSibling;
						e.removeChild(n);
						n = nxt;
					}
					else
						n = n.nextSibling;
				}
				else if (n.nodeType == 1) {	// element node
					X.removeWhite(n);
					n = n.nextSibling;
				}
				else							 // any other node
					n = n.nextSibling;
			}
			return e;
		}
	};
	if (xml.nodeType == 9) // document node
		xml = xml.documentElement;
	var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
	var result = "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
	if (bToString) {
		return (result);
	} else {
		return (eval(result));
	}
	//return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
}

/**
 *	turns JSON object into XML string/DOM object
 *	
 *	@param		OBJECT			o			JSON to turn into XML
 *	@param		STRING			tab			string to indent XML string output
 *	@param		STRING			bToString	return XML as a string (true) or as a DOM object (false, default)
 *	@returns	DOMDocument|STRING 
 */
function json2xml( o, tab, bToString ) {
	var toXml = function(v, name, ind) {
		var xml = "";
		if (v instanceof Array) {
			for (var i=0, n=v.length; i<n; i++)
				xml += ind + toXml(v[i], name, ind+"\t") + "\n";
		}
		else if (typeof(v) == "object") {
			var hasChild = false;
			xml += ind + "<" + name;
			for (var m in v) {
				if (m.charAt(0) == "@")
					xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
				else
					hasChild = true;
			}
			xml += hasChild ? ">" : "/>";
			if (hasChild) {
				for (var m in v) {
					if (m == "#text")
						xml += v[m];
					else if (m == "#cdata")
						xml += "<![CDATA[" + v[m] + "]]>";
					else if (m.charAt(0) != "@")
						xml += toXml(v[m], m, ind+"\t");
				}
				xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";
			}
		}
		else {
			xml += ind + "<" + name + ">" + v.toString() +	"</" + name + ">";
		}
		return xml;
	}, xml="";
	for (var m in o)
		xml += toXml(o[m], m, "");
	
	var result = tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
	if (bToString) {
		return (result);
	} else {
		return (parseXml(result));
	}
	//return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
}

/**
 *	parses a XML string into a XML DOM object, by using browser's native XML parsing method
 *	
 *	@param		STRING		xml			XML to turn into DOM object
 *	@returns	DOMDocument 
 */
function parseXml( xml ) {
	var dom = null;
	if (window.DOMParser) {
		try { 
			dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
		} 
		catch (e) { dom = null; }
	}
	else if (window.ActiveXObject) {
		try {
			dom = new ActiveXObject('Microsoft.XMLDOM');
			dom.async = false;
			if (!dom.loadXML(xml)) // parse error ..

				window.alert(dom.parseError.reason + dom.parseError.srcText);
		} 
		catch (e) { dom = null; }
	}
	else
		alert("cannot parse xml string!");
	return dom;
}

/**
 * strips leading and trailing whitespce from string
 * 
 * @param		STRING		sString
 * @returns		STRING
 */
function trim( sText ) {
    return String(sText).replace(/^\s+/, '').replace(/\s+$/, '');
}

/**
 * strips (escaping) back-slahes from string
 * 
 * @param		STRING		sString
 * @returns		STRING
 */
var stripSlashes = function (sString) {
	sString=sString.replace(/\\'/g,'\'');
	sString=sString.replace(/\\"/g,'"');
	sString=sString.replace(/\\\\/g,'\\');
	sString=sString.replace(/\\0/g,'\0');
	return sString;
};

/**
 * count number of some characters occurencies
 * 
 * @param		STRING		text
 * @param		STRING		character to count
 * @returns		INTEGER
 */
var countChar = function ( text, char ) { 
	var cC = String(text).split(String(char)).length; 
	return ( (cC > 1) ? cC-1 : 0 ); 
};

/**
 * count all characters in a text string and update display(input)
 * edit: count "\n" as "\n\r" (2 characters) !!!
 * 
 * @param		STRING		field
 * @param		STRING		cntfield
 * @param		STRING		maxlimit
 * @returns		INTEGER
 */
var textCounter = function(	field, cntfield, maxlimit) {
	var oField = jQuery(field);
	var newLines = countChar( String(oField.val()), "\n");
	var caretReturns = countChar( String(oField.val()), "\r");
	if ((String(oField.val()).length + newLines) > maxlimit) {
		// field.value = field.value.substring(0, maxlimit);
		oField.val( String(oField.val()).substring(0, maxlimit-newLines) );
		jQuery([field, cntfield]).addClass('error');
		setCaretPosition(field, String(oField.val()).length);
	} else {
		//cntfield.value = maxlimit - String(jQuery(field).val()).length;
		jQuery(cntfield).val( maxlimit - String(oField.val()).length - newLines + caretReturns );
		jQuery([field, cntfield]).removeClass('error');
	}
};

/**
 * count all characters in a text string and update display(input)
 * this one also checks for a maximum number of lines allowed
 * 
 * @param		STRING		field
 * @param		STRING		cntfield
 * @param		STRING		maxlimit
 * @param		STRING		rowlimit
 * @param		STRING		maxrowlength
 * @returns		void
 */
var textRowsCounter = function(	field, cntfieldtxt, maxlimit, cntfieldrow, rowlimit, maxrowlength) {
	var oField = jQuery(field);
	var sText = String(oField.val());
	var newLines = countChar( sText, "\n");
	var caretReturns = countChar( sText, "\r");
	jQuery([field, cntfieldtxt, cntfieldrow]).removeClass('error');
	if ((sText.length+newLines) > maxlimit) {
		/** maximum text length exceeded **/
		// field.value = field.value.substring(0, maxlimit);
		oField.val( sText.substring(0, maxlimit-newLines) );
		jQuery([field, cntfieldtxt]).addClass('error');
		setCaretPosition(field, sText.length);
	} else {
		/** within maximum text length **/
		var aRows = sText.split("\n");
		var numRows = aRows.length;
		var numEffRows = 0;
		for (i=0;i<numRows;i++) {
			var sRow	=	String(aRows[i]);
			if ((sRow.length / maxrowlength) > 1.0 ) {
				numEffRows += parseInt(sRow.length / maxrowlength);
				if ((sRow.length % maxrowlength) > 0) {
					numEffRows++;
				}
			} else {
				numEffRows++;
			}
		}
		if (numEffRows > rowlimit) {
			/** maximum row (with line-breaks) limit exceeded **/
			for (i=0;i<(numEffRows-rowlimit);i++) {
				if (aRows.length > 1) { aRows.pop(); }
			}
			oField.val( aRows.join("\n") );
			jQuery([field, cntfieldrow]).addClass('error');
			setCaretPosition(field, sText.length);
		} else {
			/** within maximum row limit **/
			if ( sText.length == 0 ) {
				jQuery(cntfieldrow).val( rowlimit );
			} else {
				jQuery(cntfieldrow).val( rowlimit - numEffRows );
			}
			var countedChars = maxlimit;
			if (aRows.length > 1) {
				var lastRow = String(aRows[aRows.length-1]);
				countedChars = ( maxlimit - (newLines * maxrowlength) - lastRow.length ); // - newLines + caretReturns ); 
			} else {
				countedChars = ( maxlimit - sText.length - newLines + caretReturns ); 
			}
			jQuery(cntfieldtxt).val( countedChars );
		}
	}
};

/**
 * do NOTHING for a period of 'iTime' milliseconds
 * 
 * @param		INTEGER		iTime
 * @returns		void
 */
var pause = function (iTime) {
	var Dauer = new Date();
	Dauer = Dauer.getTime() + parseInt(iTime);
	do {
		var Dauer2 = new Date();
		Dauer2 = Dauer2.getTime()
		
	}
	while(Dauer2 <= Dauer);
};

/**
 * converting 'n Sekunden/Minuten' (seconds/minutes) to 'mm:ss' string, optionally with a given delimiter other than ':' and/or leading zero digits
 * 
 * @param		INTEGER		iTime
 * @param		STRING		sDelimiter
 * @returns		STRING
 */
var seconds2minutes = function (iTime, sDelimiter, bPadZeros) {
	var sResult = '';
	if ( (typeof iTime == 'undefined') ) {
		iTime = 0;
	}
	iTime = (String(iTime).toLowerCase().indexOf('minute') > -1) ? parseInt(iTime) * 60 : parseInt(iTime);
	var iMinutes = parseInt( iTime / 60 );
	var iSeconds = iTime % 60;
	sResult = 	( ( (iMinutes < 10) && bPadZeros ) ? '0' : '' ) + iMinutes + '' + 
					( ( (typeof sDelimiter != 'undefined') && (String(sDelimiter) != '') && (sDelimiter != null) ) ? String(sDelimiter) : ':' ) + '' + 
				( (iSeconds < 10) ? '0' : '' ) + iSeconds;
	
	return (sResult);
};

/**
 * (should) valiate a given string against (RFC2822) email format definition 
 * see inline comments for different validation options
 *
 * @param	STRING		sInput
 * @returns	BOOLEAN
 */
function checkEmail ( sInput ) {	
		// very simple format check	
	//var emailPattern = new RegExp( /([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+/ );
	// very simple format check plus some minimum character requirements
	//var emailPattern = new RegExp( /([a-zA-Z0-9]{3,})(((\.|\-|\_)[a-zA-Z0-9]{2,})+)?@([a-z]{3,})(\-[a-z0-9]{3,})?(\.[a-z]{2,})+/ );
	var emailPattern = new RegExp( /([a-zA-Z0-9]{1,})(((\.|\-|\_)?[a-zA-Z0-9]{1,})+)?@([a-z0-9]{1,})((\-)?[a-z]{1,})+(\.[a-z]{2,})+/ );
	// the official standard, known as RFC 2822
	//var emailPattern = new RegExp( /(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/ );
	// a more practical implementation of RFC 2822 omitting the syntax using double quotes and square brackets, will still match 99.99% of all email addresses in actual use today
	//var emailPattern = new RegExp( /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ );
	// allows any two-letter country code top level domain, and only specific generic top level domains, needs to update it as new top-level domains are added
	//var emailPattern = new RegExp( /[a-zA-Z0-9!#$%&'*+\/=?\^_`{|}~-]+(?:\.[a-zA-Z0-9_-!#$%&'*+\/=?\^_`{|}~-]+)*@(?:[a-zA-Z0-9_-](?:[a-zA-Z0-9_-]*[a-zA-Z0-9_-])?\.)+(?:[a-zA-Z]{2}|aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|xxx)\b/ );
	if ( emailPattern.test( sInput ) ) {
		return ( String(sInput).indexOf("*") < 0 );
	} else {
		return false;
	}
}

/**
 * will allow you to insert the caret/textcursor at any position of a textbox or textarea
 * 
 * @param	STRING|HTMLElement	elemId
 * @param	INTEGER	caretPos
 * @return	void
 */
var setCaretPosition = function ( elemId, caretPos ) {
    var elem = null;
    if ((typeof elemId == 'object')) { // an element object was given, not an ID-string
    	elem = elemId;
    } else {
        elem = document.getElementById(elemId);
    }

    if (elem != null) {
        if (elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        } else {
            if (elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            } else {
                elem.focus();
            }
        }
    }
};

/**
 * detect current browser and its (simplified) version number
 */
var detectBrowserVersion = function () {
	var userAgent = navigator.userAgent.toLowerCase();
	jQuery.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());
	var version = 0;

	// Is this a version of IE?
	if (jQuery.browser.msie) {
		userAgent = jQuery.browser.version;
		userAgent = userAgent.substring(0,userAgent.indexOf('.')); 
		version = userAgent;
	}

	// Is this a version of Chrome?
	if (jQuery.browser.chrome) {
		userAgent = userAgent.substring(userAgent.indexOf('chrome/') +7);
		userAgent = userAgent.substring(0,userAgent.indexOf('.')); 
		version = userAgent;
		// If it is chrome then jQuery thinks it's safari so we have to tell it it isn't
		jQuery.browser.safari = false;
	}

	// Is this a version of Safari?
	if (jQuery.browser.safari) {
		userAgent = userAgent.substring(userAgent.indexOf('safari/') +7); 
		// safari appends its minor version number directly to it major verson number
		// so let's hope the minor never exceeds '99'
		userAgent = userAgent.substring(0, userAgent.indexOf('.')-2);
		version = userAgent; 
	}
	
	// Is this a version of Mozilla?
	jQuery.browser.firefox = false;
	if (jQuery.browser.mozilla) {
		//Is it Firefox?
		if(navigator.userAgent.toLowerCase().indexOf('firefox') != -1){
			userAgent = userAgent.substring(userAgent.indexOf('firefox/') +8);
			// some minor versions of FF behave differently from its successors 
			// and/or its predecessor so we keep its minor version number
			userAgent = userAgent.substring(0,userAgent.indexOf('.')+2);
			version = userAgent;
			jQuery.browser.firefox = true;
		}
		// If not then it must be another Mozilla
		else{
		}
	}

	// Is this a version of Opera?
	if (jQuery.browser.opera) {
		userAgent = userAgent.substring(userAgent.indexOf('version/') +8);
		userAgent = userAgent.substring(0,userAgent.indexOf('.'));
		version = userAgent;
	}
	
	version = String(version).replace(/\./, '_');
	jQuery.browser._version = version;
	return version;
};

/**
 * extend the native array object with "indexOf(searchElement)" mehtod if neccessary
 */
if ( !Array.prototype.indexOf && !Array.indexOf ) {
	Array.prototype.indexOf = function(searchElement /*, fromIndex */)
	{
		"use strict";

		if (this === void 0 || this === null)
			throw new TypeError();

		var t = Object(this);
		var len = t.length >>> 0;
		if (len === 0)
			return -1;

		var n = 0;
		if (arguments.length > 0)
		{
			n = Number(arguments[1]);
			if (n !== n) // shortcut for verifying if it's NaN
				n = 0;
			else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0))
				n = (n > 0 || -1) * Math.floor(Math.abs(n));
		}

		if (n >= len)
			return -1;

		var k = n >= 0
					? n
					: Math.max(len - Math.abs(n), 0);

		for (; k < len; k++)
		{
			if (k in t && t[k] === searchElement)
				return k;
		}
		return -1;
	};
}

/**
 * extend the native array object with "remove(from,to)" mehtod if neccessary
 *  - By John Resig (MIT Licensed)
 */
if ( !Array.prototype.remove && !Array.remove ) {
	Array.prototype.remove = function(from, to) {
		var rest = this.slice((to || from) + 1 || this.length);
		this.length = from < 0 ? this.length + from : from;
		return this.push.apply(this, rest);
	};
}


function stripTags( sHTML, bStripContent ) {
	if ( bStripContent === false ) {
	    return String(sHTML).replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
	}
    return String(sHTML).replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>(\w+)*<\/\w+>/gi, '');
}

/**
 * helper functions to convert floating point numbers from dot to comma string presentation and vise versa...
 * 
 * @param		STRING	value
 * @returns		STRING
 */
var dot2comma = function (value) { return String(value).replace('.',','); };
var comma2dot = function (value) { return String(value).replace(',','.'); };

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
			var query = document.evaluate(expression, $(parentElement) || document,
				null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			for (var i = 0, length = query.snapshotLength; i < length; i++)
				results.push(query.snapshotItem(i));
			return results;
		};
	}
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

/**
 * add 'getElementsByTagAttr' methods to base element object
 * 
 * @param		MIXED	tags
 * @param		STRING	attribute
 * @param		MIXED	value
 * @returns		ARRAY
 */
// get elements by tag and attribute
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
			var elements = document.getElementsByTagName(aTags[i]);
			for (var j=0;j<elements.length;j++) {
				if ((typeof elements[j][attribute] != 'undefined') && (elements[j][attribute] == value)) {
					result.push(elements[i]);
				}
			}
		}
		return result;
	};
}

/**
 * add 'hasClass', 'addClass' and 'removeClass' methods to base element object
 * 
 * @param		STRING	className
 * @returns		HTMLElement|Element
 */
if (typeof HTMLElement != 'undefined') {
	if ( typeof HTMLElement.hasClass != 'function' ) {
		HTMLElement.prototype.hasClass = function (className) {
			return ((String(this.className).indexOf(className) != -1));
		};
	}
	if ( typeof HTMLElement.addClass != 'function' ) {
		HTMLElement.prototype.addClass = function (className) {
			if (String(this.className).indexOf(className) == -1) {
				var aClasses = String(this.className).split(' ');
				aClasses.push(className);
				this.className = aClasses.join(' ');
			}
			return this;
		};
	}
	if ( typeof HTMLElement.removeClass != 'function' ) {
		HTMLElement.prototype.removeClass = function (className) {
			if (String(this.className).indexOf(className) != -1) {
				this.className = String(this.className).replace(className, '').replace('  ', ' ');
			}
			return this;
		};
	}
} else {
	if ( typeof document.hasClass != 'function' ) {
		document.prototype.hasClass = function (className) {
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
}

/**
 * add an event to give, element
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
 * remove event from give element
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
 * build a query string from object data
 * 
 * @param		OBJECT	sURL
 * @returns		STRING|BOOLEAN
 */
var buildQueryString = function ( urlParameters, params ) {
	var queryString = [];
	if (typeof params == 'undefined') var params = '';
	if (typeof flag == 'undefined') var flag = false;
	if (typeof urlParameters == 'string') return (urlParameters);
	if (typeof urlParameters == 'object') {
		for (iP in urlParameters) {
			if ((typeof urlParameters[iP] != 'function') && (typeof urlParameters[iP] != 'object')) {
				queryString.push(
					((params == '')) ? 
						iP+'='+urlParameters[iP] : 
						params+'['+iP+']='+urlParameters[iP]
				);
			} else if ( (typeof urlParameters[iP] != 'function') ) {
				buildQueryString (
					urlParameters[iP], 
					((params == '')) ? (''+iP+'') : (''+params+'['+iP+']')  
				);
			}
		}
	}
	return (queryString.join('&'));
};

/**
 * outputs basic variable/object information and content to debug console or
 * opens an alert with that information if ther ain't no console available 
 * 
 * @param		MIXED	args
 * @returns		void
 */
var _debug				= function ( args ) {
	var _maxLevel = 999,
		_alerts = [];
		_parse = function (arg, level) {
			if (level > _maxLevel) { return ""; }
			var indent	= "    ",
				level	= (!level)	?	1		: level,
				_repeat	= function ( str, n ) { var strn=""; for (var i=0;i<n;i++) { strn += str; } return (strn); },
				_return	= (function (arg) {
					if (arg == null) { return "NULL"; }
					var _output	= (typeof arg.join == 'function') ? "[" : "{";
					var aOut = [];
					var n = 0;
					for (var prop in arg) {
						if (n==0) { _output += "\n"}
						if ( (typeof arg[prop] == 'array') || (typeof arg[prop] == 'object') ) {
							aOut.push( _repeat(indent, level) + prop + ' : ' + _parse( arg[prop], (level+1) ) );
						} else if (typeof arg[prop] != 'function') {
							if (isNaN(arg[prop])) {
								aOut.push( _repeat(indent, level) + prop + ' : "' + String(arg[prop]) + '"' );
							} else {
								aOut.push( _repeat(indent, level) + prop + ' : ' + String(arg[prop]) + '' );
							}
						} else if (typeof arg[prop] == 'function') {
							aOut.push( _repeat(indent, level) + prop + ' : ' + String(arg[prop]).split("{")[0] + "{ [native or function code] }" + "" );
						}
						n++;
					}
					_output += ( (n>0) ? aOut.join(",\n") + "\n" + _repeat(indent, level-1) : "" )  + ( (typeof arg.join == 'function') ? "]" : "}" );
					return ( String(_output).replace("\n\n", "\n") );
				})(arg)
			;
			return (_return);
		}
	;
	if (!arguments && _debug.arguments) { arguments = _debug.arguments; }
	for (var i = 0; i < arguments.length; i++) {
		var arg = arguments[i];
		if (!console || !console.debug) {
			_alerts.push ( (typeof arg) + ' = ' + ( (typeof arg == 'object') ? _parse(arg) : (arg) ) );
		} else {
			console.debug(arg);
		}
	}
	if (!console || !console.debug) { 
		document.body.innerHTML += '<pre style="border 1px dashed">' + _alert + '</pre>';
		if (window.name == "right_bottom") { alert( _alerts.join("\n\n") ); }
	}
};
