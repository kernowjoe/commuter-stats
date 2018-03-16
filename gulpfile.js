/**
 *
 * ### Overview
 *
 * We are using [gulp](http://gulpjs.com/) as a build system. Gulp in
 * is responsible for a couple of things :
 *
 * 1. Compiles the project to static html ;
 * 2. compiles the styles ( written in scss ) to css
 * 3. Concats the js files
 * 4. precompiles the templates into js
 * 2. Helps during the development by watching for changes and
 *    compiles automatically.
 *
 * ### Structure
 *
 * Our gulp configuration starts in the root `./Gulpfile.js`, which
 * loads all tasks in the directory `./gulp`.
 *
 * The gulp-task files itself are written according to JSDoc specs
 * to make generating the future documentation flawless.
 *
 * There is another special directory, called `./gulp/lib`, which
 * purpose is to store all non-gulptask files that have helpers
 * for the tasks ( e.g. configuration options )
 *
 * ### External Configuration
 *
 * Gulp uses configuration variables stored in `./config.yaml`
 *
 * @name gulp
 * @module
 *
 */

require( "./gulp/development" );
require( "./gulp/build" );
// ... more, such as "./gulp/package", "./gulp/deploy", etc.
