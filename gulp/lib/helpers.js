/**
 * @module lib:helpers
 * @private
 */

let gulp     = require("gulp"),
    fs       = require('fs'),
    yaml     = require('js-yaml'),
    nunjucks = require('nunjucks');

module.exports = {

    /**
     * Import tasks provided as an object into gulp
     *
     * @param tasks {object}
     */
    importTasks: function (tasks) {
        for (let task in tasks) {
            if (tasks.hasOwnProperty(task)) {
                gulp.task(task, tasks[task]);
            }
        }
    },

    loadConfigs: function () {

        // Load settings from settings.yml
        let ymlFile = fs.readFileSync('./gulp/config.yml', 'utf8');
        return yaml.load(ymlFile);

    },

    getEnvironment: function (path) {

        let development = process.argv.indexOf('--env=production') === -1;

        nunjucks.configure(path, {watch: development, noCache: development});
        return new nunjucks.Environment(new nunjucks.FileSystemLoader(path));
    }

};
