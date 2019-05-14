import * as render from './views';
import {stats} from "./stats";
import * as fontawesome from './font-awesome';
import * as https from './libs/https-forward';
import {request}   from "./libs/request";
import style from '../sass/base.scss'

(() => {

    'use strict';

    const apiUrl  = 'https://1qnaxp9rb8.execute-api.eu-west-2.amazonaws.com/Live',
          storage = {
              auth:    'strava-auth',
              profile: 'strava-profile'
          };

    const Stats = new stats(storage);

    document.addEventListener("DOMContentLoaded", () => hasAuth());

    function hasAuth() {

        fontawesome.load();
        https.forward();

        const auth = localStorage.getItem(storage.auth);

        !!auth && showApp();
        !auth && window.location.pathname === '/auth' ? getCredentials() : welcomePage();

    }

    function welcomePage() {

        let authUrl = 'https://www.strava.com/oauth/authorize?';

        let parts = {
            approval_prompt: 'auto',
            client_id:       '14427',
            redirect_uri:    `${window.location.origin}/auth`,
            response_type:   'code',
            scope:           'view_private',
        };

        Object.keys(parts).forEach(part => authUrl += `${part}=${parts[part]}&`);

        authUrl = encodeURI(authUrl.replace(/\&$/, ''));

        render.load('welcome', {authUrl});

    }

    function getCredentials() {

        let pairs = window.location.search.substring(1).split("&"),
            obj   = {},
            pair;

        for (let i in pairs) {
            if (pairs[i] === "") continue;

            pair = pairs[i].split("=");
            !!pair[1] && (obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]));
        }

        Promise.resolve()
               .then(() => render.setUrl('/'))
               .then(() => request('PUT', apiUrl, {code: obj.code}))
               .then(response => {

                   localStorage.setItem(storage.auth, response.access_token);
                   localStorage.setItem(storage.profile, JSON.stringify(response.athlete));

                   showApp();
               });

    }

    function showApp() {

        Promise.resolve()
               .then(() => render.setUrl('/'))
               .then(() => render.load('app'))
               .then(() => Stats.setup())
               .then(() => Stats.profile())
               .then(() => Stats.loadActivities())
               .then(() => Stats.displayStats())
               .then(() => clickListener())
    }

    function clickListener() {

        const mutationObserver = new MutationObserver(() => {

            const setupButton = document.querySelector('[click="editSettings"]');

            setupButton.localName === 'svg' && setupButton.addEventListener('click', () => Stats.edit());
        });

        mutationObserver.observe(document.documentElement, {attributes: true})

    }

})();
