# commuter stats front end

The front end to a simple strava app to measure commuter stats.

View the site [commuter-stats.netlify.com](https://commuter-stats.netlify.com)

# Tooling

This site is built on JAMStack, and features no routing just pure simple js

The site is hosted with [www.netlify.com](https://www.netlify.com) on their free service, making use of their amazing build pipelines that make a site like this so simple to build/deploy.

# Development

This has a fairly full build chain in place, standard `npm i` instal all the packages and gulp commands to run needed dev tools.

`npm run development` run all watchers (html, js, scss, static assets) and web server with live reload

`npm run build`       run a build, clean directory and build into `dist` copy all static netlify files (redirects etc)
