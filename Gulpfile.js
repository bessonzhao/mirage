/* jslint node: true, esversion: 6 */
'use strict';

const $          = require( 'gulp-load-plugins' )(),
    ARGV         = require( 'yargs' ).argv,
    GULP         = require( 'gulp' ),
    BROWSER_SYNC = require( 'browser-sync' ).create(),
    SEQUENCE     = require( 'run-sequence' ),
    DELETE       = require( 'del' ),
    IMAGEMIN     = require( 'gulp-imagemin' );

/**
 * Enter the URL of the local server
 * e.g. http://ocean-quest.docker
 *
 * @var {string}
 */
const PROJECT_URL = 'http://mirage.docker:8080';

/**
 * Check if we're building a release
 * This will cause assets to be minified, sourcemaps to be removed, etc
 *
 * @var {boolean}
 */
const IS_RELEASE = !! ( ARGV.release );

/**
 * Which browser versions do we want to support, and have autoprefixer
 * modify the CSS with required prefixes
 *
 * @var {array}
 */
const COMPATIBILITY = [
    'last 2 versions',
    'ie >= 9',
    'Android >= 2.3'
];

// Output to the dist directory if this is a release
const OUTPUT_DIR = ( true === IS_RELEASE ) ? './dest' : './build';

/**
 * Paths an Globs of the various files the project users
 * If you add an asset and it is not being compliled, you may need to include it
 * in this object
 *
 * @var {Object}
 */
const PATHS = {
    sass: [
        'src/sass/mirage'
    ],
    js: [
        'src/javascripts/**/*.js'
    ],
    images: [
        'src/images/**/*.{png,jpg,jpeg,gif}'
    ],

    // Files to include when packaging the release
    pkg: [
        'src/**/*',
        '!**/sass/**'
    ],
    jsLint: [
        'Gulpfile.js',
        'src/javascripts/**/*.js',
        '!src/javascripts/**/*.min.js',
        '!src/javascripts/vendor/**'
    ],
    browserSync: [
        '**/*.php',
        'src/images/**/*.{png,jpg,gif}'
    ]
};

/**
 * Compile the Sass assets into CSS
 *
 * If the release flag is set, we'll minify the output CSS too
 */
GULP.task( 'sass', function() {

    // Should we minify our CSS, if --release flag has been set, yes
    var minifyCss = $.if( IS_RELEASE, $.minifyCss() );

    return GULP.src( 'src/sass/mirage.scss' )
        .pipe( $.sourcemaps.init() )
        .pipe( $.sass({
            includePaths: PATHS.sass,
            sourceComments: true,
            outputStyle: 'expanded'
        }) )
        .on( 'error', $.notify.onError( {
            message: '<%= error.message %>',
            title: 'Sass Compile Error'
        }) )
        .pipe( $.autoprefixer( {
            browsers: COMPATIBILITY
        }) )
        .pipe( minifyCss )
        .pipe( $.if( ! IS_RELEASE, $.sourcemaps.write( '.' ) ) )
        .pipe( GULP.dest( OUTPUT_DIR ) )
        .pipe( BROWSER_SYNC.stream( {
            match: 'build/**/*.css'
        }) );
});

/**
 * Compile the JavaScript files into a single file.
 *
 * If the release flag is set, we'll also minify the script
 */
GULP.task( 'javascript', function() {

    // Should we minify the script? If the release flag is set, then yes
    var minifyJs = $.if( IS_RELEASE, $.uglify()
        .on( 'error', $.notify.onError({
            message: '<%= error.message %>',
            title: 'Error concatenating JavaScript'
        }) )
    );

    return GULP.src( PATHS.js )
        .pipe( $.sourcemaps.init() )
        .pipe( $.babel() )
        .pipe( $.concat( 'mirage.js', {
            newLine: '\n'
        }) )
        .pipe( minifyJs )
        .pipe( $.if( ! IS_RELEASE, $.sourcemaps.write() ) )
        .pipe( GULP.dest( OUTPUT_DIR ) )
        .pipe( BROWSER_SYNC.stream() );
});

GULP.task( 'images', function() {
    return GULP.src( PATHS.images )
        .pipe( IMAGEMIN() )
        .pipe( GULP.dest( OUTPUT_DIR ) );
});

/**
 * Run JSHint over the files
 */
GULP.task( 'jshint', function() {
    return GULP.src( PATHS.jsLint )
        .pipe( $.jshint() )
        .pipe( $.jshint.reporter( 'jshint-stylish' ) );
});

/**
 * Run JSCS over the JavaScript files
 */
GULP.task( 'jscs', function() {
    return GULP.src( PATHS.jsLint )
        .pipe( $.jscs() )
        .pipe( $.jscs.reporter() );
});

/**
 * Runs our code style / linting checks across the code base
 */
GULP.task( 'lint', function( done ) {
    SEQUENCE(['jscs', 'jshint'], done );
});

/**
 * Reload the site in the browser using BrowserSync
 */
GULP.task( 'browser-sync', ['build'], function() {
    BROWSER_SYNC.init( PATHS.browserSync, {
            proxy: PROJECT_URL
    });
});

/**
 * Compile our assets (both JavaScript and CSS)
 */
GULP.task( 'build', ['clean'], function( done ) {
    SEQUENCE( 'lint', ['sass', 'javascript', 'images'], done );
});

/**
 * Delete our compiled assets
 */
GULP.task( 'clean', function( done ) {
    SEQUENCE( ['clean:javascript', 'clean:css', 'clean:images'], done );
});

/**
 * Delete our compiled JavaScript
 */
GULP.task( 'clean:javascript', function() {
    return DELETE([
        'build/**/*.js',
        'dist/**/*.js',
        'build/**/*.map',
        'dist/**/*.map'
    ] );
});

/**
 * Delete our compiled css
 */
GULP.task( 'clean:css', function() {
    return DELETE([
        'build/**/*.css',
        'dist/**/*.css',
        'build/**/*.map',
        'dist/**/*.map'
    ]);
});

GULP.task( 'clean:images', function() {
    return DELETE([
        'build/**/*.{png,jpg,gif}',
        'dist/**/*.{png.jpg,gif}'
    ]);
});

/**
 * This is the default task if Gulp is run without a task name being
 * provided
 */
GULP.task( 'default', ['build', 'browser-sync'], function() {
    /**
     * Log the file change into the console
     *
     * @param {object}
     */
    function logFileChange( event )
    {
        var fileName = require( 'path' ).relative( __dirname, event.path );
        console.log( '[' + 'WATCH'.green + '] ' + fileName.magenta + ' was ' + event.type + ', running tasks...' );
    }

    GULP.watch( ['src/sass/**/*.scss'], ['sass'] )
        .on( 'change', function( event ) {
            logFileChange( event );
        });

    GULP.watch( ['src/javascripts/**/*.js'], ['javascript', 'lint'] )
        .on( 'change', function( event ) {
            logFileChange( event );
        });
});
