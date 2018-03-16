/**
 * @module development
 */

let gulp      = require('gulp'),
    sequence  = require('gulp-sequence'),
    webserver = require('gulp-webserver'),
    helpers   = require('./lib/helpers');

const runSequence = require('run-sequence').use(gulp);


const { PATHS } = helpers.loadConfigs();

/**
 * ### Overview
 *
 * Tasks used for development purposes
 *
 * @namespace tasks
 */
let tasks = {

    /**
     * @task development
     * @namespace tasks
     */
    'development': (callback) => {

    return runSequence(
        'build',
        [
            'development-watch',
            'development-server'
        ],
        callback
    );

},

'development-watch' : () => {

    /**
     * Will watch and execute tasks when files changed in these folders
     */
    gulp.watch( PATHS.html,     ['build-compile', 'build-templates']);
    gulp.watch( PATHS.js,       ['build-scripts']);
    gulp.watch( PATHS.sass.src, ['development-rebuild-style']);
    gulp.watch( PATHS.assets,   ['build-assets']);

},

'development-rebuild-style': (done) => {

    runSequence(
        'build-stylesheets',
        'build-compile',
        done
    );
},
'development-server': () => {

    return gulp
        .src( PATHS.dist )
        .pipe(
            webserver(
                {
                    livereload: true,
                    open:       false,
                    fallback:  'index.html'
                }
            )
        );
}

};

//
// Registering Tasks
//
helpers.importTasks(tasks);
