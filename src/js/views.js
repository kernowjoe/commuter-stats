(function (window, history) {

    'use strict';
    var env = new nunjucks.Environment();
    var duration = 300;

    (function () {
        // Bind event listeners when the DOM is ready
        addEventHandlers();
        // Add scroll effects
        scrollTo(0, duration);

        animate()
    })();

    // create event handlers
    function addEventHandlers() {
        // hijack links which are root relative
        var anchors = document.getElementsByTagName('a');

        for (var i = 0; i < anchors.length; i++) {

            if(anchors[i].className.split(' ').indexOf('external') === -1) {

                anchors[i].removeEventListener('click', clickEvent);
                anchors[i].addEventListener('click', clickEvent);
            }
        }

        // perform client-side content render for browser history navigation
        window.onpopstate = function (e) {

            var path = !!e.state ? e.state.path : document.location.pathname;

            path = path[path.length - 1] === '/' && path.length > 1 ? path.substring(0, path.length - 1) : path;

            loadPage(path);

        };

        closeTheMobileMenu();

    }

    function clickEvent(e) {

        var path = this.getAttribute('href');

        e.preventDefault();
        setAddress({path: path});
        loadPage(path);

    }

	/**
	 * a daft way to close a menu, but I am lazy to rewrite...
	 */
	function closeTheMobileMenu() {

		var toggleButton = $('.navbar-toggle');

		!toggleButton.hasClass('collapsed') && toggleButton.trigger('click');

	}

    // get data for the page from the API
    // set the address in the browser history
    // render the page
    function loadPage(path) {
        // fire analytics

        var view = window.views[path];

        view.path = path;

        (typeof ga !== 'undefined') && ga('send', 'pageview', path);

        Promise.resolve()
            .then(function() { return render({path: path, body: view.template}, view.template, view)} )
            .then(animate)
            .then(description)
            .then(title)
            .then(addEventHandlers);

    }

    function title(view) {

        return new Promise(function (resolve) {

            var title = 'Maintain - ' + view.title

            document.title = title;

            document.getElementsByTagName('h1')[0].innerHTML = title;

            resolve(view);
        });
    }

    function animate(view) {

        return new Promise(function (resolve) {

            $('.animated').each(function () {
                var elem = $(this);
                var animation = elem.data('animation');

                setTimeout(function () {
                    elem.addClass(animation + " visible");
                }, duration);

            });

            var menuItems = document.getElementById('main-nav').getElementsByTagName('a');

            for (var i = 0; i < menuItems.length; ++i) {
                var item = menuItems[i];

                var path = !!view ? view.path : window.location.pathname;

                path !== '/' && path.endsWith('/') && (path = path.slice(0, -1));

                item.getAttribute("href") === path ? item.classList.add('active') : item.classList.remove('active');
            }

            resolve(view);
        })
    }

    function description(view) {

        return new Promise(function (resolve) {

            var meta = document.getElementsByTagName("meta");

            for (var i = 0; i < meta.length; i++) {
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
            var stateObject = {
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
        var difference = to - document.body.scrollTop;
        var perTick = difference / duration * 10;

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
