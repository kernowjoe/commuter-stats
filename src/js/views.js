import {templates} from './templates';

export {
    load,
    setUrl
};

'use strict';
const duration = 300;


// get data for the page from the API
// set the address in the browser history
// render the page
function load(path, data) {
    // fire analytics

    (typeof gtag !== 'undefined') && gtag('send', 'pageview', path);

    return Promise.resolve()
                  .then(() => render(path, data))
                  .then(view => animate(view));

}

function animate(view) {

    return new Promise(function (resolve) {

        document.querySelectorAll('.animated').forEach(element => {

            setTimeout(() => {
                           element.classList.add(`visible`);
                           element.classList.add(`fadeInRight`);
                       }, duration
            );
        });

        resolve(view);
    })
}

// apply the template and insert it into the page
function render(path, data) {

    return new Promise(function (resolve) {

        document.getElementById('mainContent').innerHTML = templates[path](data);
        scrollTo(0, duration);

        resolve();
    });
}

/**
 * manage the browser history
 *
 * @param path string
 * @returns {Promise<any>}
 */
function setUrl(path) {

    return new Promise(function (resolve) {
        let stateObject = {
            path: path
        };
        history.pushState(stateObject, null, path);

        resolve();
    })
}

function scrollTo(to, duration) {

    if (duration <= 0) {
        return;
    }
    let difference = to - document.body.scrollTop;
    let perTick    = difference / duration * 10;

    setTimeout(
        function () {
            document.body.scrollTop += perTick;
            if (document.body.scrollTop === to) {
                return;
            }
            scrollTo(to, duration - 10);
        }, 10
    );
}

