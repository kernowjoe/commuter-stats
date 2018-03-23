import * as format from "./libs/format-date";
import {request} from "./libs/request";

export {stats}

class stats {

    constructor(storage) {

        this.storage = storage;

        this.activities = [];
    }

    setup() {

        this.reset();

        this.athlete         = JSON.parse(localStorage.getItem(this.storage.profile));
        this.page            = 1;
        this.beginningOfYear = new Date();

        this.beginningOfYear.setFullYear(this.beginningOfYear.getFullYear(), 0, 1);
        this.beginningOfYear.setHours(0, 0, 0);
    }

    reset() {

        this.costPerLitre = 123.9;
        this.calories     = 0;
        this.co2          = 0;
        this.distance     = 0;

        ['distance', 'co2', 'calories', 'trees', 'cost',].map(id => {
            document.getElementById(id).innerHTML = `<i class="fa fa-spin fa-spinner"></i>`
        })
    }

    profile() {

        //document.getElementById('refresh').innerHTML = `<i class="fa fa-5x fa-cog"></i>`;

        document.getElementById('profile').innerHTML = `
            <img src="${this.athlete.profile}">
            <h2>${this.athlete.firstname} ${this.athlete.lastname} <span>${this.athlete.city}, ${this.athlete.state}</span></h2>
            <p>These stats are for the current year starting ${format.date(this.beginningOfYear)}.</p>
        `;

        return Promise.resolve();
    }

    displayStats() {


        let fuelCost,

            costPerGallon = this.costPerLitre * 4.54609;

        this.distance = this.distance * 0.00062137;
        this.co2      = this.distance * 0.28485;

        fuelCost = (this.distance / 35) * costPerGallon;

        document.getElementById('distance').innerHTML = `${(this.distance).toFixed(2)} miles`;
        document.getElementById('co2').innerHTML      = `${(this.co2).toFixed(2)} kg`;
        document.getElementById('calories').innerHTML = `${(this.calories * 1.11484317115).toFixed(2)} calories`;
        document.getElementById('trees').innerHTML    = `Equivalent to planting <br>${(this.co2 * 0.005511556554622).toFixed(2)} trees`;
        document.getElementById('cost').innerHTML     = `&pound;${(fuelCost / 100).toFixed(2)}`;

    }

    loadActivities() {

        if (window.location.origin.indexOf('localhost') !== -1) {

            let activity = {
                commute: true,
                start_date_local: new Date().toISOString(),
                distance:         222.71 / 0.00062137,
                kilojoules:         28879.56,
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

    refreshStats() {

        this.reset();

        let promises = [];

        this.activities.forEach(activity => promises.push(this.extractActivityData(activity)));

        Promise.all(promises)
               .then(() => this.displayStats());
    }

    extractActivityData(activity) {

        if (!!activity.commute && new Date(activity.start_date_local) >= this.beginningOfYear) {

            this.calories += activity.kilojoules;
            this.distance += activity.distance;
        }

        return Promise.resolve();
    }
}