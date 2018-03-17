(function (window, history) {

    'use strict';
    let env      = new nunjucks.Environment();
    let duration = 300;

    window.loadPage   = loadPage;
    window.setAddress = setAddress;

    document.addEventListener("DOMContentLoaded", function () {
        // Bind event listeners when the DOM is ready
        //addEventHandlers();
        // Add scroll effects
        scrollTo(0, duration);

        animate()
    });

    // get data for the page from the API
    // set the address in the browser history
    // render the page
    function loadPage(path) {
        // fire analytics

        let view = window.views[path];

        view.path = path;

        (typeof ga !== 'undefined') && ga('send', 'pageview', path);

        return Promise.resolve()
               .then(() => render({path: path, body: view.template}, view.template, view))
               .then(view => animate(view))
               .then(title);
               // .then(addEventHandlers);

    }

    function title(view) {

        return new Promise(function (resolve) {

            document.title = `Commuter stats - ${view.title}`;

            resolve(view);
        });
    }

    function animate(view) {

        return new Promise(function (resolve) {

            $('.animated').each(function () {
                let elem      = $(this);
                let animation = elem.data('animation');

                setTimeout(function () {
                    elem.addClass(animation + " visible");
                }, duration);

            });

            resolve(view);
        })
    }

    // apply the template and insert it into the page
    function render(data, template, view) {

        return new Promise(function (resolve) {
            template += ".html";

            document.getElementById('mainContent').innerHTML = env.render(template, data);
            scrollTo(0, duration);

            resolve(view);
        });
    }

    /**
     * manage the browser history
     *
     * @param view {Object<{path: string}>}
     * @returns {Promise<any>}
     */
    function setAddress(view) {

        return new Promise(function (resolve) {
            let stateObject = {
                path: view.path
            };
            history.pushState(stateObject, null, view.path);

            resolve(view);
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

})(window, history);
