((window) => {

    'use strict';

    window.templates = {
        welcome: welcome,
        app: app
    }

    function welcome(data) {

        return `<div class="animated">
    <section id="profile">

        <img class="tree" src="/assets/tree.png">
        <h2 class="section-title">Commuter stats</h2>
    </section>
    <section>
        <p>Powered by Strava to track your commutes and carbon offset</p>
        <a href="${data.authUrl}" id="register" class=""><img src="/assets/connect-with-strava.png"></a>
    </section>

</div>`;
    }

    function app(data) {

        return `<div class="container animated">

    <div id="profile">

    </div>

    <section class="definitions">
        <article>
            <i class="fa fa-5x fa-bicycle"></i>
            <h2>Total distance commuting</h2>
            <h3 id="distance"><i class="fa fa-spin fa-spinner"></i></h3>
        </article>
        <article>
            <i class="fa fa-5x fa-tree"></i>
            <h2>Total CO2 saved from commuting</h2>
            <h3 id="co2"><i class="fa fa-spin fa-spinner"></i></h3>
        </article>
        <article>
            <i class="fa fa-5x fa-cutlery"></i>
            <h2>Total calories burnt commuting</h2>
            <h3 id="calories"><i class="fa fa-spin fa-spinner"></i></h3>
        </article>
        <article>
            <i class="fa fa-5x fa-money"></i>
            <h2>Total cost of fuel saved</h2>
            <h3 id="cost"><i class="fa fa-spin fa-spinner"></i></h3>
        </article>
    </section>

</div>
<section class="tree">
    <div id="trees"></div>
    <img src="/assets/tree.png">
</section>`;
    }
})(window);