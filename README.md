# Maintain Bikes

The front end to a simple strava app to measure users bike parts.

View the site [www.maintain.com](https://www.maintain.com)

# Tooling

This site is built on JAMStack, using node packages to pre build static served hmtl/js content

* gulp
* nunjucks (pre compile templates for fast loading)

The site is hosted with [www.netlify.com](https://www.netlify.com) on their free service, making use of their amazing build pipelines that make a site like this so simple to build/deploy.

# Development

This has a fairly full build chain in place, standard `npm i` instal all the packages and gulp commands to run needed dev tools.

`npm run development` run all watchers (html, js, scss, static assets) and web server with live reload

`npm run build`       run a build, clean directory and build into `dist` copy all static netlify files (redirects etc)
