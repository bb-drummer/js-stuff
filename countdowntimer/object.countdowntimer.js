/**
 *	countdownTimer
 *
 *	simple countdown timer javascript object, recieving a set of options to initialise
 *
 *	usage:
 *	<code> 
 *		var myCountdown = new countdownTimer({
 *			time		:	3600,									// [required] in seconds
 *			interval	:	250,									// [optional] in milliseconds
 *			autostart	:	true,									// [optional] defaults to true, set to false do disable, you can trigger the countdown with countdownTimer::startcount()
 *			update		:	function ( iTime, sTime, oTime ) {},	// [optional] callback to execute every 'interval' milliseconds
 *			liftoff 	:	function () {},							// [optional] callback to execute when countdown finishes
 *			lang		:	{										// [optional] text i18n
 *				hours		:	'Stunde(n)',
 *				minutes		:	'Minute(n)',
 *				seconds		:	'Sekunde(n)',
 *				delimiter	:	':'
 *			}
 *		});
 *	</code>
 *
 *	@package		countdownTimer
 *	@copyright		(c) 2007 Bjoern Bartels [http://dragon-projects.net, info@dragon-projects.net]
 *	@author			Bjoern Bartels [http://dragon-projects.net, info@dragon-projects.net]
 *	@created		09/2007
 *	@version		1.0
 *
 *	@param		OBJECT				options
 *	@returns	countdownTimer|OBJECT
 */
var countdownTimer = function ( options ) {
	 
	if ( !options || !options.time ) return (false);
	var iStart	=	new Date();
	var iTime	=	parseInt( options.time ); // Math.ceil( parseInt( String(oCountdownDisplay._node.id).replace(/time_/, '') ) / 1000 );
	var $this	=	this;
	
	var countdown = function () {
		if ( !options.lang ) options.lang = {};
		var now		=	new Date();
		var diff	=	iTime - Math.ceil( (now.getTime() - iStart.getTime()) / 1000 );
		if ( diff > 0) {
			var hh		=	Math.floor( diff / (60 * 60) );
			var mm		=	Math.floor( (diff-(hh*60*60)) / 60 );
			var ss		=	( (diff-(hh*60*60)-(mm*60)) );
			var aTime	=	[];
			if ( hh == 0 ) {
				if ( mm == 0 ) {
					aTime	=	[ 
		 			    ((ss < 10 ) ? '0' : ''), ss 
		 			];
				} else {
					aTime	=	[ 
		 			    ((mm < 10 ) ? '0' : ''), mm, 
		 			    (options.lang.delimiter || ':'), 
		 			    ((ss < 10 ) ? '0' : ''), ss 
		 			];
				}
			} else {
				aTime	=	[ 
	 			    ((hh < 10 ) ? '0' : ''), hh, 
	 			    (options.lang.delimiter || ':'), 
	 			    ((mm < 10 ) ? '0' : ''), mm, 
	 			    (options.lang.delimiter || ':'), 
	 			    ((ss < 10 ) ? '0' : ''), ss 
	 			];
			}
			
			if (typeof options.update == 'function') {
				options.update( 
					diff, 
					aTime.join(''), 
					{
						h		:	hh,
						m		:	mm,
						s		:	ss,
						label	:	(hh == 0) ? ((mm == 0) ? (options.lang.seconds || 'Sekunde(n)') : (options.lang.minutes || 'Minute(n)')) : (options.lang.hours || 'Stunde(n)')
					} 
				);
			}
		} else {
			liftoff();
		}
	};
	
	var liftoff = function () {
		if ($this.task) {
			window.clearInterval($this.task);
			if (typeof options.liftoff == 'function') {
				options.liftoff();
			}
		}
	};
	
	var startcount = function () {
		if (!$this.task) {
			$this.task = window.setInterval( countdown, (options.interval || 250) );
		}
	};

	this.options	=	options;
	this.startcount	=	startcount;
	this.liftoff	=	liftoff;
		
	if (options.autostart !== false) {
		startcount();
	}
	
	return (this);
};
