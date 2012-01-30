/*
 * redenLabel jQuery Plugin
 * http://reden87.info/
 *
 * Copyright (c) 2012 Gergő Németh
 * http://docs.jquery.com/License
 *
 * version 1.0
 */
(function( $ ){
	$.fn.redenLabel = function( options ) {
		
		// default settings
		var settings = {
			'fadeOpacity': 0.5,
			'fadeDuration': 300
		};
		
		if( options ) { 
			$.extend( settings, options );
		}
		
		
		return $(this).each(function() {
			
			
			// a label-hez tartozó input/textarea mezőknek van-e tartalma (és az alapján opacity állítás)
			var id = $(this).attr('for');
			var opacity = 1;
			var display = 'block';
			if( $('input#' + id).height() != null && $('input#' + id).val() != '' ||
				 $('textarea#' + id).height() != null && $('textarea#' + id).val() != '' ) {
				var opacity = 0;
				var display = 'none';
			}
			
			
			$(this).parent('p').css( 'position', 'relative' );
			$(this).css({
				opacity: opacity, // ha eleve van valami a mezőben, akkor alapból láthatatlan a label
				display: display, // ha eleve van valami a mezőben, akkor ne zavarjon be ha egérrel ki akarom jelölni a szöveget
				cursor: 'text', // css cursor beállítás
				position: 'absolute'
			});
			
			
			// ha focus-ba kerül, és üres, akkor halványítás
			$('input[id=' + $(this).attr('for') + '], textarea[id=' + $(this).attr('for') + ']').bind( 'focus', function() {
				if( empty($(this).val()) ) {
					set_opacity( $('label[for=' + $(this).attr('id') + ']'), settings.fadeOpacity );
				}
			});
			
			
			// ha kimegy belőle a focus, és üres, akkor sötétítés
			$('input[id=' + $(this).attr('for') + '], textarea[id=' + $(this).attr('for') + ']').live( 'focusout', function() {
				if( empty($(this).val()) ) {
					set_opacity( $('label[for=' + $(this).attr('id') + ']'), 1 );
				}
			});
			
			
			// ha lenyomunk egy billentyűt, és üres akkor közepesen halványra (akár sötét volt előtte, akár láthatatlan), különben láthatatlanítás
			$('input[id=' + $(this).attr('for') + '], textarea[id=' + $(this).attr('for') + ']').live( 'keydown', function(e) {
				var opacity = $('label[for=' + $(this).attr('id') + ']').css('opacity');
				var key = e.keyCode;
				if( opacity != 0 &&
					( key != 8 && // backspace
					key != 9 && // tab
					key != 13 && // enter
					key != 16 && // shift
					key != 17 && // ctrl
					key != 18 && // alt
					key != 20 && // caps lock
					key != 37 && // left arrow
					key != 38 && // up arrow
					key != 39 && // right arrow
					key != 40 && // down arrow
					key != 91 && // left window key
					key != 92 && // right window key
					key != 93 // right cmd key
					) )
					set_opacity( $('label[for=' + $(this).attr('id') + ']'), 0 );
			});
			
			
			// ha lenyomunk egy billentyűt, és üres akkor közepesen halványra (akár sötét volt előtte, akár láthatatlan), különben láthatatlanítás
			$('input[id=' + $(this).attr('for') + '], textarea[id=' + $(this).attr('for') + ']').live( 'keyup', function() {
				if( empty($(this).val()) ) {
					set_opacity( $('label[for=' + $(this).attr('id') + ']'), settings.fadeOpacity );
				}
				else {
					set_opacity( $('label[for=' + $(this).attr('id') + ']'), 0 );
				}
			});
			
			
			// paste event
			$('input[id=' + $(this).attr('for') + '], textarea[id=' + $(this).attr('for') + ']').live( 'paste', function() {
				// mivel üres sztringet nem tudunk paste-elni, ezért feltételezzük hogy szöveg került a mezőbe, és láthatatlanná tesszük a labelt
				set_opacity( $('label[for=' + $(this).attr('id') + ']'), 0 );
			});
			
			// lementjük az eredeti értékét a mezőknek, hogy reset gomb nyomásakor tudjunk ellenőrízni, hogy kell-e mutatni az input mezőt vagy sem
			var base = $('input[id=' + $(this).attr('for') + '], textarea[id=' + $(this).attr('for') + ']');
			var base_val = $('input[id=' + $(this).attr('for') + '], textarea[id=' + $(this).attr('for') + ']').val();
			
			
			// ha reset gombra kattintunk, akkor mindet sötétítjük
			$('input[type=reset]').live( 'click', function() {
				if( empty(base_val) ) {
					set_opacity( $('label[for=' + base.attr('id') + ']'), 1 );
				}
				else {
					set_opacity( $('label[for=' + base.attr('id') + ']'), 0 );
				}
			});
			
			
		});
		
		
		// a label áttetszőségét állítja
		function set_opacity( base, opacity ) {
			// ha 1-re állítottuk az opacity-t, akkormegjelenítjük a labelt
			if( opacity != 0 )
				base.css('display', 'block');
			
			duration = (opacity == settings.fadeOpacity || opacity == 1) ? settings.fadeDuration : 0;
			base.animate({
				opacity: opacity
			}, duration, function() {
				// ha 0-ra csökkentettük az opacity-t, akkor eltűntetjük az útból a labelt, hogy egérrel nyugodtan ki lehessen jelölni a szöveget
				if( opacity == 0 )
					$(this).css('display', 'none');
			});
		}
		
		
		// ellenőrzi, hogy egy string üres-e
		function empty( val ) {
			if( val == '' || val == null || val == undefined )
				return true;
			return false;
		}
		
		
	};
})( jQuery );
