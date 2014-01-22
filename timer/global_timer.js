/**
 * global timer queue object
 *
 * This source file defines a global timer queue object.
 *
 * The class is documented in the file itself. If you find any bugs help me out and report them. 
 * Reporting can be done by sending an email to bb@p-ad.de.
 * If you report a bug, make sure you give me enough information (include your code).
 *
 * License
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * 3. The name of the author may not be used to endorse or promote products derived from this software without specific prior written permission.
 *
 * This software is provided by the author "as is" and any express or implied warranties, including, but not limited to, the implied warranties of merchantability and fitness for a particular purpose are disclaimed. In no event shall the author be liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, procurement of substitute goods or services; loss of use, data, or profits; or business interruption) however caused and on any theory of liability, whether in contract, strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this software, even if advised of the possibility of such damage.
 *
 *	@package	global timer queue
 *	@author		Björn Bartels <bb@p-ad.de>, P.AD. Werbeagentur GmbH
 *	
 *	@copyright	Copyright (c) 2013, P.AD. Werbeagentur GmbH <info@p-ad.de>. All rights reserved.
 *	@license	BSD License
 *
 *	@modified	10/2013
 *	@version	1.0.0
 */
 
var GlobalTimerQueue = [],
	oTimer,
	TimerUrlParameter = 'testtime',

	GlobalTimer = function ( options ) {
	
		var // configuration/defaults
			_DEBUG_				= false,
			autoStart			= true,
			interval			= 5000,
			TimerQueue			= [],
			
		    emptyTimer			= {
				start		: Date.now(),
				stop		: Date.now() + (24 * 60 * 60 * 1000),
				repeat		: false,
				classnames	: '',
				callback	: function () {},
				context		: false
			},
	
			_NOW_				= false,
			_DOC_				= document.getElementsByTagName('body')[0],
			_nowUrlParameter_	= 'testtime',
			genericCallback		= function () {},
			
			// private methods
	
			getQueryString = function ( sUrl ) {
				if (!sUrl) {
					var sUrl = parent.document.URL;
				}
				var querystring_position = sUrl.indexOf('?');
				if (querystring_position != -1) {
					return sUrl.substring(querystring_position + 1, sUrl.length);
				}
				return false;
			}, // getQueryString
	
			getUrlParameters = function ( sUrl ) {
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
			}, // getUrlParameters
			
			setUrlParameter = function ( param ) {
				if (param) {
					_nowURLParameter_ = String(param);
				}
				return ($this);
			}, // setUrlParameter
			
			getUrlParameter = function () {
				return String(_nowURLParameter_);
			}, // getUrlParameter
			
			setClassnames = function ( elem, classnames ) {
				if (_DEBUG_) { console.log('GlobalTimer: set class names...'); console.debug(elem); console.debug(classnames); }
				if ( (typeof elem == 'object') && (typeof elem.className != 'undefined') ) {
					if ( (typeof classnames != 'undefined') && (classnames != '') ) {
						var aClasses = String(elem.className).split(' ');
						var classes = String(classnames).split(' ');
						for (j=0;j<classes.length;j++) {
							if ( String(elem.className).indexOf(classes[j]) == -1 ) {
								aClasses.push(classes[j]);
							}
						}
						elem.className = aClasses.join(' ');
					}
				}
				return ($this);
			}, // setClassnames
		
			setCallback = function ( func, timer ) {
				if (typeof func == 'function') {
					if (timer) { 
						timer.callback = func;
						if (_DEBUG_) { console.log('GlobalTimer: timer callback set'); }
					} else {
						genericCallback = func;
						if (_DEBUG_) { console.log('GlobalTimer: generic callback set'); }
					}
				}
				return ($this);
			}, // setCallback
		
			getCallback = function ( timer ) {
				if ( timer && (typeof timer.callback == 'function') ) {
					return timer.callback;
				}
				return (genericCallback);
			}, // getCallback
		
			getTimerQueue = function ( ) {
				return (TimerQueue);
			}, // getTimerQueue
		
			clearTimerQueue = function ( stop ) {
				if (stop) { destroy(); }
				TimerQueue = [];
				return ($this);
			}, // clearTimerQueue
		
			getTime = function ( ) {
				var params = getUrlParameters(location.href);
				if (params && (typeof params[_nowUrlParameter_] != 'undefined') && !isNaN(params[_nowUrlParameter_])) {
					if (_DEBUG_) { console.log('GlobalTimer: timestamp parsed: '+params[_nowUrlParameter_]); }
					var parsed = parseInt(params[_nowUrlParameter_], 10);
					if (!isNaN(parsed) && (parsed > 0)) { return parsed; }
				}
				return ((!_NOW_) ? Date.now() : _NOW_ );
			}, // getTime
	
			addToTimerQueue = function ( timer ) {
				if ( 
					(typeof timer != 'object') || 
					(typeof timer.start == 'undefined') || (typeof timer.stop == 'undefined')  || 
					isNaN(timer.start) || isNaN(timer.stop) 
				) {
					throw ("GlobalTimer: invalid timer to add");
				}
				if (timer.start > timer.stop) {
					var h = timer.start; 
					timer.start = timer.stop; 
					timer.stop = h;
				}
				TimerQueue.push(timer);
				if (_DEBUG_) { console.log('GlobalTimer: timer added'); }
				return ($this);
			}, // addToTimerQueue
	
			execute = function () {
				if (_DEBUG_) { console.log('GlobalTimer: executed'); }
				var _now = getTime(),
					_table = getTimerQueue()
				;
				_DOC_ = (!_DOC_) ? document.getElementsByTagName('body')[0] : _DOC_;
				for (i=0; i < _table.length; i++) {
					var timer = _table[i];
					if (_DEBUG_) { console.log('GlobalTimer: compare (now, start, stop): '+ (_now) +', '+ (timer.start) +', '+ (timer.stop) ); }
					if ( 
						(timer.start <= _now) && (timer.stop >= _now) && 
						(timer.repeat || (!timer.repeat && !timer.applied)) 
					) {
						
						if ( (typeof timer.context == 'object') ) {
							if ( (typeof timer.classnames != 'undefined') && (timer.classnames != '') ) {
								setClassnames( timer.context, timer.classnames );
							}
							(getCallback(timer)).apply(timer.context, [i, timer]);
							
						} else {
							if ( _DOC_ && (typeof timer.classnames != 'undefined') && (timer.classnames != '') ) {
								console.debug(_DOC_); setClassnames( _DOC_, timer.classnames );
							}
							(getCallback(timer)).apply($this, [i, timer]);
							
						}
	
						_table[i].applied = _now;
					}
				}
				if (!$this.timerIntervalID) {
					$this.timerIntervalID = window.setInterval(execute, interval);
					if (_DEBUG_) { console.log('GlobalTimer: interval timer initialized'); }
				}
				return ($this);
			}, // execute
	
			destroy = function () {
				if ($this.timerIntervalID) {
					window.clearInterval($this.timerIntervalID);
					$this.timerIntervalID = false;
				}
				if (_DEBUG_) { console.log('GlobalTimer: stopped'); }
				return ($this);
			}, // destroy
	
			init = function (options) {
				if (typeof options == 'object') {
					if (typeof options.debug != 'undefined')		{ _DEBUG_			= !!options.debug; }
					if (typeof options.now != 'undefined')			{ _NOW_				= parseInt(options.now,10); }
					if (typeof options.urlParameter != 'undefined')	{ _nowUrlParameter_	= options.urlParameter; }
					if (typeof options.autoStart != 'undefined')	{ autoStart			= !!options.autoStart; }
					if (typeof options.interval != 'undefined')		{ interval			= parseInt(options.interval,10); }
					if (typeof options.callback == 'function')		{ genericCallback	= options.callback; }
					if ( (typeof options.table != 'undefined') && (typeof options.table.length != 'undefined') )	{ 
						for (i=0; i < options.table.length; i++) {
							addToTimerQueue(options.table[i]);
						}
					}
				}
				if (_DEBUG_) { console.log('GlobalTimer: initialized'); console.debug(options); }
				if (autoStart) {
					execute();
				}
			} // init
		; // var
	
		// public methods
		
		this.run			= execute;
		this.stop			= destroy;
		this.add			= addToTimerQueue;
		this.time			= getTime;
		this.clear			= clearTimerQueue;
		this.getTimerQueue	= getTimerQueue;
		
		this.timerIntervalID = false;
	
		// initialize
		
		var $this = this;
		
		init( (options) ? options : {} );
		
		return (this);
	}, // GlobalTimer object
	
	addTimer = function ( timer ) {
		if ( 
			(typeof timer != 'object') || 
			(typeof timer.start == 'undefined') || (typeof timer.stop == 'undefined')  || 
			isNaN(timer.start) || isNaN(timer.stop) 
		) {
			throw ("GlobalTimer: invalid timer to add");
		}
		if (timer.start > timer.stop) {
			var h = timer.start; 
			timer.start = timer.stop; 
			timer.stop = h;
		}
		GlobalTimerQueue.push(timer);
	}, // addTimer
	
	initTimer = function ( shopTimestamp ) {
		if ( (typeof shopTimestamp != 'undefined') && !isNaN(shopTimestamp) ) {
			oTimer = new GlobalTimer({
				debug			: false, 
				autoStart		: true, 
				interval		: 10000, 
				now				: shopTimestamp,
				urlParameter	: TimerUrlParameter,
				table			: GlobalTimerQueue 
			});
		} else if ( (typeof shopTimestamp == 'object') ) {
			oTimer = new GlobalTimer(shopTimestamp);
		} else {
			oTimer = new GlobalTimer({
				debug			: false, 
				autoStart		: true, 
				interval		: 10000, 
				urlParameter	: TimerUrlParameter,
				table			: GlobalTimerQueue 
			});
		}
	}, // initTimer,
	
	setTimerUrlParam = function ( param ) {
		if ( param && isNaN(param) && (String(param) != '') ) {
			TimerUrlParameter = String(param);
		}
	} // setTimerUrlParam
;
