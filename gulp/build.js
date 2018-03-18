/**
 * @module build
 */

let gulp        = require('gulp'),
    runSequence = require('run-sequence').use(gulp),
    data        = require('gulp-data'),
    nunjucks    = require('gulp-nunjucks'),
    clean       = require('gulp-clean'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify-es').default,
    sass        = require('gulp-sass'),
    prettyUrl   = require("gulp-pretty-url"),
    inject      = require('gulp-inject'),
    fs          = require('fs'),
    fm          = require('front-matter'),
    helpers     = require('./lib/helpers'); // will be needed for the page by page compile

const imagemin = require('gulp-imagemin');
const {PATHS}  = helpers.loadConfigs();
const env      = helpers.getEnvironment(PATHS.views);
const confs    = {
    views: {}
};

/**
 * ### Overview
 *
 * Tasks used for building the NodeJS application
 *
 * @namespace tasks
 */
let tasks = {

    /**
     * @task build
     * @namespace tasks
     */
    'build': (done) => {

        /**
         * It is a composite task that runs the following tasks in sequence
         *
         * 1. `build-clean`
         * 2. `build-compile`
         * 3. `build-scripts`
         * 4. `build-stylesheets`
         * 5. `build-assets`
         *
         * The different tasks are found below :
         *
         * @namespace tasks:build
         */
        runSequence(
            'build-local',
            'build-configs',
            done
        );
    },

    'build-local': (done) => {

        /**
         * It is a composite task that runs the following tasks in sequence
         *
         * 1. `build-clean`
         * 2. `build-compile`
         * 3. `build-scripts`
         * 4. `build-stylesheets`
         * 5. `build-assets`
         *
         * The different tasks are found below :
         *
         * @namespace tasks:build
         */
        runSequence(
            'build-scripts',
            'build-stylesheets',
            'build-assets',
            'build-compile',
            done
        );

    },

    /**
     * #### Cleans the build target folder
     *
     * Cleans the folder, which is the root of the compiled app ( `./.build` )
     *
     * @task build-clean
     * @namespace tasks
     */
    'build-clean': () => {

        return gulp
            .src(PATHS.dist, {read: false})
            .pipe(clean());
    },

    /**
     * #### Compiles the app
     *
     * Compiles the source application directory to the build directory
     *
     * @task build-compile
     * @namespace tasks
     */
    'build-compile': () => {

        // var api = require('../api/api.json');
        let api = {};

        return gulp.src(['src/views/*.html'])
                   .pipe(
                       data(
                           function (file) {

                               let content = fm(String(file.contents));
                               let name    = "/" + file.path.replace(file.base, "").replace(".html", "");

                               (name === "/index") && (name = '/');

                               content.attributes.baseTemplate = "./layouts/base.html";
                               content.attributes.url          = name;

                               return content.attributes;
                           }
                       )
                   )
                   .pipe(nunjucks.compile(env))
                   .pipe(prettyUrl())
                   .pipe(
                       inject(
                           gulp.src(['./dist/style/base.css']), {
                               starttag:   '<!-- inject:css -->',
                               removeTags: true,
                               transform:  function (filePath, file) {
                                   return file.contents.toString('utf8');
                               }
                           }
                       )
                   )
                   .pipe(gulp.dest('dist'));
    },

    /**
     * #### Compiles front-end scripts
     *
     * Compiles all front-end scripts into bundles using ...
     *
     * @task build-scripts
     * @namespace tasks
     */
    'build-scripts': () => {

        return gulp
            .src(
                PATHS.js
            )
            .pipe(concat('commuter-stats.js'))
            .pipe(uglify())
            .pipe(gulp.dest('dist/assets/js'));
    },

    /**
     * #### Compiles stylesheets
     *
     * Compiles source stylesheets via [Sass](http://sass-lang.com/) with
     * SCSS syntax
     *
     * @task build-stylesheets
     * @namespace tasks
     */
    'build-stylesheets': () => {

        return gulp.src(PATHS.sass.src)
                   .pipe(
                       sass(
                           {
                               outputStyle:  'compressed',
                               includePaths: PATHS.sass.includes
                           }
                       ).on('error', sass.logError)
                   )
                   .pipe(gulp.dest(PATHS.dist + '/style'));
    },

    /**
     * #### Copy assets
     *
     * Copies the static assets that will be used by the server :
     *
     * - templates
     * - images
     * - fonts
     *
     * @task build-assets
     * @namespace tasks
     */
    'build-assets': () => {
        return gulp.src(PATHS.assets)
                   .pipe(imagemin())
                   .pipe(gulp.dest(PATHS.dist + '/assets'));
    },

    /**
     * ##### Copy configs
     *
     * Copies the configs for netlify redirects and mobile configs
     * - _redirects
     * - manifest.json
     * - browserconfig.xml
     */
    'build-configs': () => {

        return gulp
            .src(PATHS.configs)
            .pipe(gulp.dest(PATHS.dist));
    }

};

//
// Registering Tasks
//

helpers.importTasks(tasks);
