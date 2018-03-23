export {formatDate}

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