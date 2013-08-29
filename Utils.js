
//Some helper functions, which are not really related directly to the busness logic.
//In real life these would likely be from a third party library.

(function () {
    window.utils = window.utils || {}

    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    utils.toLongDateString = function(date) {
        return monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
    };

    utils.parseDate = function(date) {
        var dateParts = date.split("/").map(function (d) {
            return parseInt(d, 10);
        });

        if (dateParts[2] < 2000) {
            dateParts[2] += 2000;
        }

        var date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
        return date;
    };

    utils.addDays = function(date, days) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
    };
    
    utils.roundToNearestPenny = function(number) {
        //Note, I would like to check if there are any requirements on exactly how to round.
        return Math.round(number * 100) / 100;
    };
    
})();
