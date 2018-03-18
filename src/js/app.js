((window) => {

    'use strict';

    const apiUrl  = 'https://1qnaxp9rb8.execute-api.eu-west-2.amazonaws.com/Live',
          storage = {
              auth: 'strava-auth',
              profile: 'strava-profile'
          };

    document.addEventListener("DOMContentLoaded", () => hasAuth());

    function hasAuth() {

        const auth = localStorage.getItem(storage.auth);

        !!auth && showApp();
        !auth && window.location.pathname === '/auth' ? getCredentials() : welcomePage();

    }

    function welcomePage() {

        let authUrl = 'https://www.strava.com/oauth/authorize?';

        let parts = {
            approval_prompt: 'force',
            client_id: '14427',
            redirect_uri: `${window.location.origin}/auth`,
            response_type: 'code',
            scope: 'view_private',
        };

        Object.keys(parts).forEach(part => authUrl += `${part}=${parts[part]}&`);

        authUrl = encodeURI(authUrl.replace(/\&$/, ''));

        window.render.load('welcome', {authUrl});

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
               .then(() => window.render.setUrl('/'))
               .then(() => request('PUT', apiUrl, {code: obj.code}))
               .then(response => {

                   localStorage.setItem(storage.auth, response.access_token);
                   localStorage.setItem(storage.profile, JSON.stringify(response.athlete));

                   showApp();
               });

    }

    function showApp() {

        Promise.resolve()
               .then(() => window.render.setUrl('/'))
               .then(() => window.render.load('app'))
               .then(() => app());
    }


    function app() {

        let athlete = JSON.parse(localStorage.getItem(storage.profile));

        let calories = 0,
            co2      = 0,
            distance = 0;

        let beginningOfYear = new Date();

        beginningOfYear.setFullYear(beginningOfYear.getFullYear(), 0, 1);
        beginningOfYear.setHours(0, 0, 0);

        document.getElementById('profile').innerHTML = `
            <img src="${athlete.profile}">
            <h2>${athlete.firstname} ${athlete.lastname} <span>${athlete.city}, ${athlete.state}</span></h2>
            <p>These stats are for the current year starting ${formatDate(beginningOfYear)}.</p>
        `;

        Promise.resolve()
               .then(() => loadActivities(1))
               .then(() => displayStats());

        function displayStats() {

            let fuelCost,
                costPerLitre  = 123.9,
                costPerGallon = costPerLitre * 4.54609;

            distance = distance * 0.00062137;
            co2      = distance * 0.28485;

            fuelCost = (distance / 35) * costPerGallon;

            document.getElementById('distance').innerHTML = `${(distance).toFixed(2)} miles`;
            document.getElementById('co2').innerHTML      = `${(co2).toFixed(2)} kg`;
            document.getElementById('calories').innerHTML = `${(calories * 1.11484317115).toFixed(2)} calories`;
            document.getElementById('trees').innerHTML    = `${(co2 * 0.005511556554622).toFixed(2)} trees`;
            document.getElementById('cost').innerHTML     = `&pound;${(fuelCost / 100).toFixed(2)}`;

        }

        function loadActivities(page) {

            if (window.location.origin.indexOf('localhost') !== -1) {

                distance = 222.71 / 0.00062137;
                calories = 28879.56;

                return Promise.resolve();
            }


            return request('GET', `https://www.strava.com/api/v3/activities?page=${page}&per_page=100`, {}, {'Authorization': `Bearer ${localStorage.getItem(storage.auth)}`})
                .then(response => {

                    let more = (response.length && new Date(response[response.length - 1].start_date_local) > beginningOfYear);

                    response.forEach(activity => {

                        if (!!activity.commute && new Date(activity.start_date_local) >= beginningOfYear) {

                            calories += activity.kilojoules;
                            distance += activity.distance;
                        }
                    });

                    return !!more ? loadActivities(page + 1) : Promise.resolve();

                });


        }


    }

    function formatDate(date) {
        let monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

        let day        = date.getDate();
        let monthIndex = date.getMonth();
        let year       = date.getFullYear();

        return day + ' ' + monthNames[monthIndex] + ' ' + year;
    }

    function request(method, url, body, headers) {

        body    = !!body ? body : {};
        headers = !!headers ? headers : {};

        return new Promise((resolve, reject) => {

            let xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            Object.keys(headers).forEach(header => xhr.setRequestHeader(header, headers[header]));
            xhr.send(JSON.stringify(body));

            xhr.onreadystatechange = processRequest;

            function processRequest(e) {

                if (xhr.readyState === 4) {
                    let response = JSON.parse(xhr.responseText);

                    xhr.status === 200 ? resolve(response) : reject(xhr.status);

                }
            }
        });
    }


})(window);