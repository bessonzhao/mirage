jQuery( function( $ ) {
  'use strict';

  var replaceFloatingBall = function( selector, type, animate ) {

    // If the animate parameter is not provided, set the default value
    if ( 'undefined' === animate ) {
        animate = false;
    }

    $( selector ).each( function() {
      var wrapper = document.createElement( 'div' ),
          defaultClasses = 'mirage-build-progress ' + type,
          dimension;

      if ( true === animate ) {
        defaultClasses = defaultClasses + ' mirage-build-progress-animated';
      }

      wrapper.style.display = 'inline-block';

      if ( '48px' === this.style.width ) {
        dimension = 48;
        wrapper.style.marginRight = '16px';
        wrapper.style.verticalAlign = 'middle';
        wrapper.className = defaultClasses + ' lg';
      } else if ( this.classList.contains( 'icon-lg' ) ) {
        dimension = 32;
        wrapper.style.marginTop = '4px';
        wrapper.style.marginLeft = '4px';
        wrapper.className = defaultClasses + ' md';
      } else {
        dimension = this.style.width || 24;
        wrapper.className = defaultClasses + ' sm';
      }

      $( wrapper ).css( 'width', dimension );
      $( wrapper ).css( 'height', dimension );

      $( this ).after( wrapper ).remove();
    } );
  };

  setInterval( function() {
    replaceFloatingBall( 'img[src*="/aborted.png"]', 'aborted' );
    replaceFloatingBall( 'img[src*="/grey.png"]', 'aborted' );
    replaceFloatingBall( 'img[src*="/blue.png"]', 'success' );
    replaceFloatingBall( 'img[src*="/red.png"]', 'failure' );
    replaceFloatingBall( 'img[src*="/yellow.png"]', 'warning' );
    replaceFloatingBall( 'img[src*="/nobuilt.png"]', 'not-built' );
    replaceFloatingBall( 'img[src*="/disabled.png"]', 'not-built' );
    replaceFloatingBall( 'img[src*="red_anime.gif"]', 'failure', true );
    replaceFloatingBall( 'img[src*="blue_anime.gif"]', 'success', true );
    replaceFloatingBall( 'img[src*="grey_anime.gif"]', 'aborted', true );
    replaceFloatingBall( 'img[src*="aborted_anime.gif"]', 'aborted', true );
    replaceFloatingBall( 'img[src*="yellow_anime.gif"]', 'warning', true );
    replaceFloatingBall( 'img[src*="nobuilt_anime.gif"]', 'not-built', true );
  }, 5 );
} );
