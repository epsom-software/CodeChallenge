(function () {

    var stake = 10;
    var interval = 200;
    var profitLossSection = document.querySelector("section.profitLoss");

    var Team = (function() {
        function Team(name) {
            this.name = name;
            this.profit = 0;
            this.status = "";
        }

        Team.prototype.addProfit = function (value) {
            value = utils.roundToNearestPenny(value);
            this.profit += value;

            if(value > 0) {
                this.status = "profit";
            } else if (value < 0) {
                this.status = "loss";
            } else {
                this.status = "";
            } 
        };

        return Team;
    })();

    function getTeams(fixtures) {
        var teams = [];

        function isUnknownTeam(teamName) {
            return teams.every(function (t) {
                return t.name != teamName;
            });
        }

        fixtures.forEach(function (fixture) {

            if (isUnknownTeam(fixture.homeTeam)) {
                teams.push(new Team(fixture.homeTeam));
            }
        });

        return teams;
    };

    function display(date, teams) {

        var tableBody = profitLossSection.querySelector("tbody");
        var dateElement = profitLossSection.querySelector("h1");

        var nextTableBody = document.createElement('tbody');

        teams=teams.sort(function (left, right) {
            if (left.profit != right.profit) {
                return right.profit - left.profit;
            } else {
                return left.name > right.name ? 1 : -1;
            }
        });

        teams.forEach(function (p) {
            var row = nextTableBody.insertRow(-1);
            row.insertCell(0).innerHTML = p.name;
            var profitCell = row.insertCell(1);
            profitCell.innerHTML = "&pound;" + p.profit.toFixed(2);
            profitCell.className = p.status;
        });

        tableBody.parentNode.replaceChild(nextTableBody, tableBody);
        dateElement.innerHTML = utils.toLongDateString(date);
    }

    window.loadGames = function (fixtures) {

        fixtures.forEach(function(fixture){
            fixture.date = utils.parseDate(fixture.date);
        });

        var teams = getTeams(fixtures);
        var currentDate = utils.addDays(fixtures[0].date, -1);
        var finalDate = fixtures[fixtures.length - 1].date;

        display(currentDate, teams);
        profitLossSection.style.display="block";

        var startButton = profitLossSection.querySelector("a");


        startButton.onclick = function () {
            startButton.parentNode.removeChild(startButton);

            var intervalTrigger = setInterval(function () {

                if (currentDate >= finalDate) {
                    clearInterval(intervalTrigger);
                }

                fixtures.forEach(function (fixture) {
                    if (fixture.date - currentDate == 0) {
                        var winner, winningPrice;

                        if (fixture.homeGoals > fixture.awayGoals) {
                            winner = fixture.homeTeam;
                            winningPrice = fixture.homePrice;

                        } else if (fixture.homeGoals < fixture.awayGoals) {
                            winner = fixture.awayTeam;
                            winningPrice = fixture.awayPrice;
                        }

                        teams.forEach(function (t) {
                            if (t.name == fixture.homeTeam || t.name == fixture.awayTeam) {
                                t.addProfit(-stake);
                            }
                            if (t.name == winner) {
                                t.addProfit(winningPrice * stake);
                            }
                        });
                    }
                });
                display(currentDate, teams);
                currentDate = utils.addDays(currentDate, 1);

            }, interval);
        };
    }

})();

