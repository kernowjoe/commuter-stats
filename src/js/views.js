(function (window, history) {

    'use strict';
    let env      = new nunjucks.Environment();
    let duration = 300;

    window.loadPage = loadPage;
    document.addEventListener("DOMContentLoaded", function () {
        // Bind event listeners when the DOM is ready
        //addEventHandlers();
        // Add scroll effects
        scrollTo(0, duration);

        animate()
    });

    // create event handlers
    function addEventHandlers() {
        // hijack links which are root relative
        let anchors = document.getElementsByTagName('a');

        for (let i = 0; i < anchors.length; i++) {

            if (anchors[i].className.split(' ').indexOf('external') === -1) {

                anchors[i].removeEventListener('click', clickEvent);
                anchors[i].addEventListener('click', clickEvent);
            }
        }

        // perform client-side content render for browser history navigation
        window.onpopstate = function (e) {

            let path = !!e.state ? e.state.path : document.location.pathname;

            path = path[path.length - 1] === '/' && path.length > 1 ? path.substring(0, path.length - 1) : path;

            new Promise.resolve()
                .then(() => setAddress({path: path}))
                .then(() => loadPage(path))
            ;

        };

        closeTheMobileMenu();

        console.log('aadd event handlers')

        return Promise.resolve();

    }

    function clickEvent(e) {

        let path = this.getAttribute('href');

        e.preventDefault();
        loadPage(path);

    }

    /**
     * a daft way to close a menu, but I am lazy to rewrite...
     */
    function closeTheMobileMenu() {

        let toggleButton = $('.navbar-toggle');

        !toggleButton.hasClass('collapsed') && toggleButton.trigger('click');

    }

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
               .then(animate)
               .then(description)
               .then(title);
               // .then(addEventHandlers);

    }

    function title(view) {

        return new Promise(function (resolve) {

            let title = 'CarbonStrava - ' + view.title

            document.title = title;

            //document.getElementsByTagName('h1')[0].innerHTML = title;

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
            //
            // let menuItems = document.getElementById('main-nav').getElementsByTagName('a');
            //
            // for (let i = 0; i < menuItems.length; ++i) {
            //     let item = menuItems[i];
            //
            //     let path = !!view ? view.path : window.location.pathname;
            //
            //     path !== '/' && path.endsWith('/') && (path = path.slice(0, -1));
            //
            //     item.getAttribute("href") === path ? item.classList.add('active') : item.classList.remove('active');
            // }

            resolve(view);
        })
    }

    function description(view) {

        return new Promise(function (resolve) {

            let meta = document.getElementsByTagName("meta");

            for (let i = 0; i < meta.length; i++) {
                if (meta[i].name.toLowerCase() == "description") {
                    meta[i].content = view.description;
                }
            }

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

    // manage the browser history
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
