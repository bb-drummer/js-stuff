/**
 * socialshareprivacy.js ("2 Klicks fuer mehr Datenschutz")
 *
 * adapted from:
 * http://www.heise.de/extras/socialshareprivacy/
 * http://www.heise.de/ct/artikel/2-Klicks-fuer-mehr-Datenschutz-1333879.html
 *
 * Copyright (c) 2011 Hilko Holweg, Sebastian Hilbig, Nicolas Heiringhoff, Juergen Schmidt,
 * Heise Zeitschriften Verlag GmbH & Co. KG, http://www.heise.de
 * 
 * Copyright (c) 2011 Björn Bartels <bb@p-ad.de>,
 * P.AD. Werbeagentur GmbH, http://p-ad.de
 *
 * is released under the MIT License http://www.opensource.org/licenses/mit-license.php
 *
 * Spread the word, link to us if you can.
 * 
 */
var socialSharePrivacy = function ( target, options ){
	if (typeof target == 'undefined') {
		return (false);
	}
	var oTarget = false;
	if (typeof target == 'string') {
		oTarget = document.getElementById(target);
	} else if (typeof target == 'object') {
		oTarget = target;
	}
    var defaults = {
        'services' : {
            'facebook' : {
                'status'            : 'on',
                'app_id'            : '__FB_APP-ID__',
                'dummy_img'         : 'socialshareprivacy/images/dummy_facebook.png',
                'txt_info'          : '2 Klicks f&uuml;r mehr Datenschutz: Erst wenn Sie hier klicken, wird der Button aktiv und Sie k&ouml;nnen Ihre Empfehlung an Facebook senden. Schon beim Aktivieren werden Daten an Dritte &uuml;bertragen &ndash; siehe <em>i</em>.',
                'txt_fb_off'        : 'nicht mit Facebook verbunden',
                'txt_fb_on'         : 'mit Facebook verbunden',
                'perma_option'      : 'on',
                'display_name'      : 'Facebook',
                'referrer_track'    : '',
                'language'          : 'de_DE'
            }, 
            'twitter' : {
                'status'            : 'on', 
                'dummy_img'         : 'socialshareprivacy/images/dummy_twitter.png',
                'txt_info'          : '2 Klicks f&uuml;r mehr Datenschutz: Erst wenn Sie hier klicken, wird der Button aktiv und Sie k&ouml;nnen Ihre Empfehlung an Twitter senden. Schon beim Aktivieren werden Daten an Dritte &uuml;bertragen &ndash; siehe <em>i</em>.',
                'txt_twitter_off'   : 'nicht mit Twitter verbunden',
                'txt_twitter_on'    : 'mit Twitter verbunden',
                'perma_option'      : 'on',
                'display_name'      : 'Twitter',
                'referrer_track'    : '', 
                'tweet_text'        : getTweetText
            },
            'gplus' : {
                'status'            : 'on',
                'dummy_img'         : 'socialshareprivacy/images/dummy_gplus.png',
                'txt_info'          : '2 Klicks f&uuml;r mehr Datenschutz: Erst wenn Sie hier klicken, wird der Button aktiv und Sie k&ouml;nnen Ihre Empfehlung an Google+ senden. Schon beim Aktivieren werden Daten an Dritte &uuml;bertragen &ndash; siehe <em>i</em>.',
                'txt_gplus_off'     : 'nicht mit Google+ verbunden',
                'txt_plus_on'       : 'mit Google+ verbunden',
                'perma_option'      : 'on',
                'display_name'      : 'Google+',
                'referrer_track'    : '',
                'language'          : 'de'
            }
        },
        'info_link'         : 'http://www.heise.de/ct/artikel/2-Klicks-fuer-mehr-Datenschutz-1333879.html',
        'txt_help'          : 'Wenn Sie diese Felder durch einen Klick aktivieren, werden Informationen an Facebook, Twitter oder Google in die USA &uuml;bertragen und unter Umst&auml;nden auch dort gespeichert. N&auml;heres erfahren Sie durch einen Klick auf das <em>i</em>.',
        'settings_perma'    : 'Dauerhaft aktivieren und Daten&uuml;ber&shy;tragung zustimmen:',
        'cookie_path'       : '/',
        'cookie_domain'     : document.location.host,
        'cookie_expires'    : '365',
        'css_path'          : 'socialshareprivacy/socialshareprivacy.css'
    };

    function hasClass(element,classname) {
    	return element.className.match(new RegExp('(\\s|^)'+classname+'(\\s|$)'));
    }
    function addClass(element,classname) {
    	if (!hasClass(element,classname)) element.className += " "+classname;
    }
    function removeClass(element,classname) {
    	if (hasClass(element,classname)) {
    		var regEx = new RegExp('(\\s|^)'+classname+'(\\s|$)');
    		element.className=element.className.replace(regEx,' ');
    	}
    }
    var extend = function (destination, source) {
    	if ( (typeof destination != "object") || (typeof destination == "undefined") ) {
    		return false;
    	}
    	if (source) {
        	for ( key in source ) {
        		if (typeof source[key] != "object") {
        			destination[key] = source[key];
        		} else {
        			destination[key] = extend(destination[key], source[key]);
        		}
        	}
    	}
    	return destination;
    };
    
    // Standardwerte des Plug-Ings mit den vom User angegebenen Optionen ueberschreiben
    var options = extend(defaults, options);

    if((options.services.facebook.status == 'on' && options.services.facebook.app_id != '__FB_APP-ID__') || options.services.twitter.status == 'on' || options.services.gplusone.status == 'on'){
        /* we do NOT add an additional CSS file on buch.de */
    	/*
    	$('head').append('<link rel="stylesheet" type="text/css" href="'+options.css_path+'" />');
        */
    	
    	var eSocialShareUL = document.createElement('ul');
    	eSocialShareUL.className = "social_share_privacy_area";
    	
    	//$(this).prepend('<ul class="social_share_privacy_area"></ul>');
        var context = eSocialShareUL; // $('.social_share_privacy_area', this);
        oTarget.appendChild(eSocialShareUL);
        
        // als URL wird erstmal die derzeitige Dokument-URL angenommen
        var uri = document.location.href;
        // ist eine kanonische URL hinterlegt wird diese verwendet
        var aeLINKs = document.getElementsByTagName("link");
        var canonical = false;
        for (iLINK in aeLINKs) {
        	if (aeLINKs[iLINK].rel == "canonical") {
        		canonical = aeLINKs[iLINK].rel;
        	}
        }
        //var canonical = $("link[rel=canonical]").attr("href");
        if(canonical){
            if(canonical.indexOf("http") <= 0){
                canonical = document.location.protocol+"//"+document.location.host+document.location.port+canonical;
            }
            uri = canonical;
        }
        
    }

    // Text kuerzen und am Ende mit … versehen, sofern er abgekuerzt werden musste
    function abbreviateText(text, length){
        var abbreviated = decodeURIComponent(text);
        if(abbreviated.length <= length){
            return text;
        }

        var lastWhitespaceIndex = abbreviated.substring(0, length - 1).lastIndexOf(' ');
        abbreviated = encodeURIComponent(abbreviated.substring(0, lastWhitespaceIndex)) + "…";

        return abbreviated;
    }

    // Meta-Wert abfragen
    function getMeta(name){
    	var aeMETAs = document.getElementsByTagName('meta');
    	var metaContent = false;
    	for (iMETA in aeMETAs) {
    		if (aeMETAs[iMETA].name == name) {
    			metaContent = aeMETAs[iMETA].content;
    		}
    	}
        return metaContent ? metaContent : '';
    }
    
    // Tweet-Text
    function getTweetText(){
        // Titel aus <meta name="DC.title"> und <meta name="DC.creator"> wenn vorhanden, sonst <title>
        var title = getMeta('DC.title');
        var creator = getMeta('DC.creator');
        if(title.length > 0){
            if(creator.length > 0){
                title = title+' - '+creator;
            }
        }
        else{
        	title = '';
        	if (document.getElementsByTagName('title')[0]) {
                title = document.getElementsByTagName('title')[0].innerHTML;
        	}
        }
        return encodeURIComponent(title);
    }

    (function(){
        // Facebook
        if(options.services.facebook.status == 'on'){
            // Kontrolle ob Facebook App-ID hinterlegt ist, da diese noetig fuer den Empfehlen-Button ist
            if(options.services.facebook.app_id != '__FB_APP-ID__'){
                var fb_enc_uri = encodeURIComponent(uri+options.services.facebook.referrer_track);
                //var fb_code = '<iframe src="http://www.facebook.com/plugins/like.php?locale='+options.services.facebook.language+'&amp;app_id='+options.services.facebook.app_id+'&amp;href='+fb_enc_uri+'&amp;send=false&amp;layout=button_count&amp;width=120&amp;show_faces=false&amp;action=recommend&amp;colorscheme=light&amp;font&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden;" allowTransparency="true"></iframe>';
                var eFBFrame = document.createElement('iframe');
                eFBFrame.src = 'http://www.facebook.com/plugins/like.php?locale='+options.services.facebook.language+'&amp;app_id='+options.services.facebook.app_id+'&amp;href='+fb_enc_uri+'&amp;send=false&amp;layout=button_count&amp;width=120&amp;show_faces=false&amp;action=recommend&amp;colorscheme=light&amp;font&amp;height=21';
                eFBFrame.scrolling = 'no';
                eFBFrame.frameborder = '20';
                eFBFrame.allowTransparency = 'true';
                eFBFrame.style.border = 'none'; 
                eFBFrame.style.overflow = 'hidden';
                //var fb_dummy_btn = '<img src="'+options.services.facebook.dummy_img+'" alt="Facebook &quot;Like&quot;-Dummy" class="fb_like_privacy_dummy" />';
                var eFBDummyBtn = document.createElement('img');
                eFBFrame.src = options.services.facebook.dummy_img;
                eFBFrame.alt = 'Facebook &quot;Like&quot;-Dummy';
                eFBFrame.className = 'fb_like_privacy_dummy';
                
                context.append('<li class="facebook help_info"><span class="info">'+options.services.facebook.txt_info+'</span><span class="switch off">'+options.services.facebook.txt_fb_off+'</span><div class="fb_like dummy_btn">'+fb_dummy_btn+'</div></li>');

                var $container_fb = $('li.facebook', context);

                $('li.facebook div.fb_like img.fb_like_privacy_dummy,li.facebook span.switch', context).live('click', function(){
                    if($container_fb.find('span.switch').hasClass('off')){
                        $container_fb.addClass('info_off');
                        $container_fb.find('span.switch').addClass('on').removeClass('off').html(options.services.facebook.txt_fb_on);
                        $container_fb.find('img.fb_like_privacy_dummy').replaceWith(fb_code);
                    }
                    else{
                        $container_fb.removeClass('info_off');
                        $container_fb.find('span.switch').addClass('off').removeClass('on').html(options.services.facebook.txt_fb_off);
                        $container_fb.find('.fb_like').html(fb_dummy_btn);
                    }
                });
            }
            else{
                try{
                    console.log('Fehler: Es ist keine Facebook App-ID hinterlegt.');
                }
                catch(e){ }
            }
        }

        // Twitter
        if(options.services.twitter.status == 'on'){
            // 120 = Restzeichen-Anzahl nach automatischem URL-Kuerzen durch Twitter mit t.co
            var text = options.services.twitter.tweet_text;
            if(typeof(text) == 'function'){
                text = text();
            }
            text = abbreviateText(text,'120');
            
            var twitter_enc_uri = encodeURIComponent(uri+options.services.twitter.referrer_track);
            var twitter_count_url = encodeURIComponent(uri);
            var twitter_code = '<iframe allowtransparency="true" frameborder="0" scrolling="no" src="http://platform.twitter.com/widgets/tweet_button.html?url='+twitter_enc_uri+'&amp;counturl='+twitter_count_url+'&amp;text='+text+'&amp;count=horizontal"></iframe>';
            var twitter_dummy_btn = '<img src="'+options.services.twitter.dummy_img+'" alt="&quot;Tweet this&quot;-Dummy" class="tweet_this_dummy" />';
            
            context.append('<li class="twitter help_info"><span class="info">'+options.services.twitter.txt_info+'</span><span class="switch off">'+options.services.twitter.txt_twitter_off+'</span><div class="tweet dummy_btn">'+twitter_dummy_btn+'</div></li>');

            var $container_tw = $('li.twitter', context);
            
            $('li.twitter div.tweet img,li.twitter span.switch', context).live('click', function(){
                if($container_tw.find('span.switch').hasClass('off')){
                    $container_tw.addClass('info_off');
                    $container_tw.find('span.switch').addClass('on').removeClass('off').html(options.services.twitter.txt_twitter_on);
                    $container_tw.find('img.tweet_this_dummy').replaceWith(twitter_code);
                }
                else{
                    $container_tw.removeClass('info_off');
                    $container_tw.find('span.switch').addClass('off').removeClass('on').html(options.services.twitter.txt_twitter_off);
                    $container_tw.find('.tweet').html(twitter_dummy_btn);
                }
            });
        }

        // Google+
        if(options.services.gplus.status == 'on'){
            // fuer G+ wird die URL nicht encoded, da das zu einem Fehler fuehrt
            var gplus_uri = uri+options.services.gplus.referrer_track;
            var gplus_code = '<div class="g-plusone" data-size="medium" data-href="'+gplus_uri+'"></div><script type="text/javascript">window.___gcfg = {lang: "'+options.services.gplus.language+'"}; (function(){ var po = document.createElement("script"); po.type = "text/javascript"; po.async = true; po.src = "https://apis.google.com/js/plusone.js"; var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(po, s); })(); </script>';
            var gplus_dummy_btn = '<img src="'+options.services.gplus.dummy_img+'" alt="&quot;Google+1&quot;-Dummy" class="gplus_one_dummy" />';

            context.append('<li class="gplus help_info"><span class="info">'+options.services.gplus.txt_info+'</span><span class="switch off">'+options.services.gplus.txt_gplus_off+'</span><div class="gplusone dummy_btn">'+gplus_dummy_btn+'</div></li>');

            var $container_gplus = $('li.gplus', context);

            $('li.gplus div.gplusone img,li.gplus span.switch', context).live('click', function(){
                if($container_gplus.find('span.switch').hasClass('off')){
                    $container_gplus.addClass('info_off');
                    $container_gplus.find('span.switch').addClass('on').removeClass('off').html(options.services.gplus.txt_gplus_on);
                    $container_gplus.find('img.gplus_one_dummy').replaceWith(gplus_code);
                }
                else{
                    $container_gplus.removeClass('info_off');
                    $container_gplus.find('span.switch').addClass('off').removeClass('on').html(options.services.gplus.txt_gplus_off);
                    $container_gplus.find('.gplusone').html(gplus_dummy_btn);
                }
            });
        }

        // Der Info/Settings-Bereich wird eingebunden
        context.append('<li class="settings_info"><div class="settings_info_menu off perma_option_off"><a href="'+options.info_link+'" target="_blank"><span class="help_info icon"><span class="info">'+options.txt_help+'</span></span></a></div></li>');

        // Info-Overlays mit leichter Verzoegerung einblenden
        $('.help_info:not(.info_off)', context).live('mouseenter', function(){
            var $info_wrapper = $(this);
            var timeout_id = window.setTimeout(function(){ $($info_wrapper).addClass('display'); }, 500);
            $(this).data('timeout_id',timeout_id);
        });
        $('.help_info', context).live('mouseleave', function(){
            var timeout_id = $(this).data('timeout_id');
            window.clearTimeout(timeout_id);
            if($(this).hasClass('display')){
                $(this).removeClass('display');
            }
        });

        // Menue zum dauerhaften Einblenden der aktiven Dienste via Cookie einbinden
        // Die IE7 wird hier ausgenommen, da er kein JSON kann und die Cookies hier ueber JSON-Struktur abgebildet werden
        if(((options.services.facebook.status == 'on' && options.services.facebook.perma_option == 'on' && options.services.facebook.app_id != '__FB_APP-ID__') || (options.services.twitter.status == 'on' && options.services.twitter.perma_option == 'on') || (options.services.gplus.status == 'on' && options.services.gplus.perma_option == 'on')) && (($.browser.msie && $.browser.version > 7.0) || !$.browser.msie)){
            // Cookies abrufen
            var cookie_list = document.cookie.split(';');
            var cookies = '{';
            for(var i = 0; i < cookie_list.length; i++){
                var foo = cookie_list[i].split('=');
                cookies+='"'+$.trim(foo[0])+'":"'+$.trim(foo[1])+'"';
                if(i < cookie_list.length-1){
                    cookies += ',';
                }
            }
            cookies += '}';
            console.log(cookies);
            console.debug(cookies);
            //try {
                cookies = JSON.parse(cookies);
            /*} catch (e) {
                cookies = eval(cookies);
                console.log('eval');
                console.debug(cookies);
            	
            }*/


            // Cookie setzen
            function cookieSet(name,value,days,path,domain){
                var expires = new Date();
                expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
                document.cookie = name+'='+value+'; expires='+expires.toUTCString()+'; path='+path+'; domain='+domain;
            }

            // Cookie loeschen
            function cookieDel(name,value){
                var expires = new Date();
                expires.setTime(expires.getTime() - 100);
                document.cookie = name+'='+value+'; expires='+expires.toUTCString()+'; path='+options.cookie_path+'; domain='+options.cookie_domain;
            }

            // Container definieren
            var $container_settings_info = $('li.settings_info', context);

            // Klasse entfernen, die das i-Icon alleine formatiert, da Perma-Optionen eingeblendet werden
            $container_settings_info.find('.settings_info_menu').removeClass('perma_option_off');

            // Perma-Optionen-Icon (.settings) und Formular (noch versteckt) einbinden
            $container_settings_info.find('.settings_info_menu').append('<span class="settings">Einstellungen</span><form><fieldset><legend>'+options.settings_perma+'</legend></fieldset></form>');

            // Die Dienste mit <input> und <label>, sowie checked-Status laut Cookie, schreiben
            if(options.services.facebook.status == 'on' && options.services.facebook.perma_option == 'on' && options.services.facebook.app_id != '__FB_APP-ID__'){
                var perma_status_facebook = '';
                cookies.socialSharePrivacy_facebook == 'perma_on' ? perma_status_facebook = ' checked="checked"' : perma_status_facebook = '';
                $container_settings_info.find('form fieldset').append('<input type="checkbox" name="perma_status_facebook" id="perma_status_facebook"'+perma_status_facebook+' /><label for="perma_status_facebook">'+options.services.facebook.display_name+'</label>');
            }
            if(options.services.twitter.status == 'on' && options.services.twitter.perma_option == 'on'){
                var perma_status_twitter = '';
                cookies.socialSharePrivacy_twitter == 'perma_on' ? perma_status_twitter = ' checked="checked"' : perma_status_twitter = '';
                $container_settings_info.find('form fieldset').append('<input type="checkbox" name="perma_status_twitter" id="perma_status_twitter"'+perma_status_twitter+' /><label for="perma_status_twitter">'+options.services.twitter.display_name+'</label>');
            }
            if(options.services.gplus.status == 'on' && options.services.twitter.perma_option == 'on'){
                var perma_status_gplus = '';
                cookies.socialSharePrivacy_gplus == 'perma_on' ? perma_status_gplus = ' checked="checked"' : perma_status_gplus = '';
                $container_settings_info.find('form fieldset').append('<input type="checkbox" name="perma_status_gplus" id="perma_status_gplus"'+perma_status_gplus+' /><label for="perma_status_gplus">'+options.services.gplus.display_name+'</label>');
            }

            // Cursor auf Pointer setzen fuer das Zahnrad
            $container_settings_info.find('span.settings').css('cursor','pointer');

            // Einstellungs-Menue bei mouseover ein-/ausblenden
            $($container_settings_info.find('span.settings'), context).live('mouseenter', function(){
                var timeout_id = window.setTimeout(function(){ $container_settings_info.find('.settings_info_menu').removeClass('off').addClass('on'); }, 500);
                $(this).data('timeout_id',timeout_id);
            }); 
            $($container_settings_info, context).live('mouseleave', function(){
                var timeout_id = $(this).data('timeout_id');
                window.clearTimeout(timeout_id);
                $container_settings_info.find('.settings_info_menu').removeClass('on').addClass('off');
            });

            // Klick-Interaktion auf <input> um Dienste dauerhaft ein- oder auszuschalten (Cookie wird gesetzt oder geloescht)
            $($container_settings_info.find('fieldset input')).live('click', function(event){
                var value;
                var click = event.target.id;
                service = click.substr(click.lastIndexOf('_')+1, click.length);

                $('#'+event.target.id+':checked').length ? value = 'on' : value = 'off';

                var cookie_name = 'socialSharePrivacy_'+service;

                if(value == 'on'){
                    // Cookie setzen
                    cookieSet(cookie_name,'perma_on',options.cookie_expires,options.cookie_path,options.cookie_domain);
                    $('form fieldset label[for='+click+']', context).addClass('checked');
                }
                else{
                    // Cookie loeschen
                    cookieDel(cookie_name,'perma_on');
                    $('form fieldset label[for='+click+']', context).removeClass('checked');
                }
            });

            // Dienste automatisch einbinden, wenn entsprechendes Cookie vorhanden ist
            if(options.services.facebook.status == 'on' && options.services.facebook.perma_option == 'on' && cookies.socialSharePrivacy_facebook == 'perma_on' && options.services.facebook.app_id != '__FB_APP-ID__'){
                $('li.facebook span.switch', context).click();
            }
            if(options.services.twitter.status == 'on' && options.services.twitter.perma_option == 'on' && cookies.socialSharePrivacy_twitter == 'perma_on'){
                $('li.twitter span.switch', context).click();
            }
            if(options.services.gplus.status == 'on' && options.services.gplus.perma_option == 'on' && cookies.socialSharePrivacy_gplus == 'perma_on'){
                $('li.gplus span.switch', context).click();
            }
        }
    })();
    return this;
};
