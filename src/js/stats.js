import * as format from "./libs/format-date";
import {request}   from "./libs/request";

export {stats}

class stats {

    constructor(storage) {

        this.storage    = storage;
        this.activities = [];

    }

    setup() {

        this.reset();
        const settings = JSON.parse(localStorage.getItem('settings'));

        !!settings ? this.settings(settings) : this.settings({costPerLitre: 123.9, mpg: 35});

        this.athlete         = JSON.parse(localStorage.getItem(this.storage.profile));
        this.page            = 1;
        this.beginningOfYear = new Date();

        this.beginningOfYear.setFullYear(this.beginningOfYear.getFullYear(), 0, 1);
        this.beginningOfYear.setHours(0, 0, 0);
    }

    /**
     * Ability to set the mpg of a car
     * Ability to set fuel type of car
     *      Work out cost/co2/trees equivalent
     *
     * Ability to set start and end dates to track
     * Ability to set cost per litre of fuel
     *
     * @param costPerLitre
     * @param carSize
     * @param mpg
     */
    settings({costPerLitre, mpg}) {

        this.costPerLitre  = costPerLitre;
        this.mpg           = mpg;

        localStorage.setItem('settings', JSON.stringify({costPerLitre, mpg}));
    }

    reset() {

        this.calories = 0;
        this.co2      = 0;
        this.distance = 0;

        ['distance', 'co2', 'calories', 'trees', 'cost',].map(id => {
            document.getElementById(id).innerHTML = `<i class="fa fa-spin fa-spinner"></i>`
        })
    }

    profile() {

        let i = document.createElement('i');

        i.classList.add('fa', 'fa-fw', 'fa-cog');
        i.setAttribute('click', 'editSettings');

        document.getElementById('title').appendChild(i);

        document.getElementById('profile').innerHTML = `
            <img src="${this.athlete.profile}">
            <h2>${this.athlete.firstname} ${this.athlete.lastname} <span>${this.athlete.city}, ${this.athlete.state}</span></h2>
            <p>These stats are for the current year starting ${format.date(this.beginningOfYear)}.</p>
        `;

        return Promise.resolve();
    }

    displayStats() {

        let fuelCost,
            litresInGallon = 4.54609,
            costPerGallon  = this.costPerLitre * litresInGallon;

        let distance = this.distance * 0.00062137;

        this.co2 = ((distance / this.mpg) * litresInGallon) * 2.57842605805682;

        //console.log('co2 based on mpg', thing.toFixed(2));

        fuelCost = (distance / this.mpg) * costPerGallon;

        document.getElementById('distance').innerHTML = `${(distance).toFixed(2)} miles`;
        document.getElementById('co2').innerHTML      = `${(this.co2).toFixed(2)} kg`;
        document.getElementById('calories').innerHTML = `${(this.calories * 1.11484317115).toFixed(2)} calories`;
        document.getElementById('trees').innerHTML    = `Equivalent to planting <br>${(this.co2 * 0.005511556554622).toFixed(2)} trees`;
        document.getElementById('cost').innerHTML     = `&pound;${(fuelCost / 100).toFixed(2)}`;

    }

    loadActivities() {

        if (window.location.origin.indexOf('localhost') !== -1) {

            let activity = {
                commute:          true,
                start_date_local: new Date().toISOString(),
                distance:         222.71 / 0.00062137,
                kilojoules:       28879.56,
            };

            this.activities.push(activity);

            this.extractActivityData(activity);

            return Promise.resolve();
        }

        return request('GET', `https://www.strava.com/api/v3/activities?page=${this.page}&per_page=100`, {}, {'Authorization': `Bearer ${localStorage.getItem(this.storage.auth)}`})
            .then(response => {

                let more = (response.length && new Date(response[response.length - 1].start_date_local) > this.beginningOfYear);

                response.forEach(activity => {

                    this.activities.push(activity);

                    this.extractActivityData(activity);
                });

                this.page++;

                return more ? this.loadActivities() : Promise.resolve();

            });
    }

    edit() {

        let modal = `
<section class="body">

    <h2>Edit your data from here.</h2>
    
    <form>
        <div>
            <label for="mpg">Miles per Gallon:</label>
            <input name="mpg" type="number" value="${this.mpg}">
        </div>
        <div>
            <label for="mpg">Cost per litre:</label>
            <input name="costPerLitre" value="${this.costPerLitre}">
        </div>
        <button id="save">Update</button>
    </form>
</section>`

        document.querySelector('.modal').innerHTML = modal;
        document.querySelector('.modal').classList.add('open');

        document.addEventListener('click', event => {

            if (!event.target.matches('button#save')) return;

            event.preventDefault();

            const mpg          = document.querySelector('input[name="mpg"]').value,
                  costPerLitre = document.querySelector('input[name="costPerLitre"]').value;

            this.settings({costPerLitre, mpg});
            this.refreshStats();
            document.querySelector('.modal').classList.remove('open');
        })
    }

    refreshStats() {

        this.reset();

        let promises = [];

        this.activities.forEach(activity => promises.push(this.extractActivityData(activity)));

        Promise.all(promises)
               .then(() => this.displayStats());
    }

    extractActivityData(activity) {

        if (activity.commute && new Date(activity.start_date_local) >= this.beginningOfYear) {

            this.calories += activity.kilojoules;
            this.distance += activity.distance;
        }

        return Promise.resolve();
    }
}