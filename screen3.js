var matchhistoryCsv;
var selectedTeams = ["RMA","BAR"];
var blc3 = window.screen.availWidth - 700;
var barwidth = (blc3/40)-1;
var t1h = 70;
var t2h = 350;
var totalGoals;
var winOpa = 1;
var losOpa = 0.5;

var t1819 = ["Alaves", "Ath Bilbao", "Ath Madrid", "Barcelona", "Betis", 
             "Celta", "Eibar", "Espanol", "Leganes", "Real Madrid", 
             "Sevilla", "Sociedad", "Valencia", "Villarreal",
             "Getafe","Girona","Levante","Huesca","Valladolid", "Vallecano"];
var t1718 = ["Alaves", "Ath Bilbao", "Ath Madrid", "Barcelona", "Betis", 
             "Celta", "Eibar", "Espanol", "Leganes", "Real Madrid", 
             "Sevilla", "Sociedad", "Valencia", "Villarreal",
             "Getafe","Girona","Levante","Las Palmas","La Coruna","Malaga"];
var t1617 = ["Alaves", "Ath Bilbao", "Ath Madrid", "Barcelona", "Betis", 
             "Celta", "Eibar", "Espanol", "Leganes", "Real Madrid", 
             "Sevilla", "Sociedad", "Valencia", "Villarreal",
             "Sp Gijon","Osasuna","Granada","Las Palmas","La Coruna","Malaga"];
var teams = {"1617":t1617,"1718":t1718,"1819":t1819};
var teamIDs = {"Alaves":"ALA","Ath Bilbao":"ATH","Ath Madrid":"ATM","Barcelona":"BAR","Betis":"BET", 
               "Celta":"CEL", "Eibar":"EIB", "Espanol":"ESP", "Leganes":"LEG", "Real Madrid":"RMA", 
               "Sevilla":"SEV", "Sociedad":"RSO", "Valencia":"VAL", "Villarreal":"VIL",
               "Getafe":"GET","Girona":"GIR","Levante":"LEV","Huesca":"HUE","Valladolid":"VLD", "Vallecano":"RAY",
               "Sp Gijon":"SPO","Osasuna":"OSA","Granada":"GRA","Las Palmas":"PAL","La Coruna":"COR","Malaga":"MAL"};

var t1color = "#FFE066";
var t2color = "#00CBA4";
var otcolor = "#F58A88";
var hicolor = "#fff";

d3.select("#bordert1").append("circle").attr("cx",170).attr("cy",t1h+100).attr("class","logo-border").style("stroke",t1color).style("fill","white").style("fill-opacity",0.2);
d3.select("#bordert2").append("circle").attr("cx",170).attr("cy",t2h+100).attr("class","logo-border").style("stroke",t2color).style("fill","white").style("fill-opacity",0.2);

changeDataMatchHistory();

var div = d3.select("body").append("div")	
.attr("class", "tooltip")				
.style("opacity", 0);

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function updateMatchHistory(dataset) {

    var t1offset = 0;
    if(selectedTeams[0] == "BAR") {t1offset = 15;};
    if(selectedTeams[0] == "ATH") {t1offset = 20;};
    if(selectedTeams[0] == "SEV") {t1offset = 10;};
    if(selectedTeams[0] == "COR") {t1offset = -15;};
    if(selectedTeams[0] == "MAL") {t1offset = 15;};
    if(selectedTeams[0] == "RAY") {t1offset = 10;};
    var t2offset = 0;
    if(selectedTeams[1] == "BAR") {t2offset = 15;};
    if(selectedTeams[1] == "ATH") {t2offset = 20;};
    if(selectedTeams[1] == "SEV") {t2offset = 10;};
    if(selectedTeams[1] == "COR") {t2offset = -15;};
    if(selectedTeams[1] == "MAL") {t2offset = 15;};
    if(selectedTeams[1] == "RAY") {t2offset = 10;};

    d3.select("#team1logo")
        .attr("xlink:href", "assets/" + selectedTeams[0] + ".png")
        .attr("y",t1h + t1offset);

    d3.select("#team2logo")
        .attr("xlink:href", "assets/" + selectedTeams[1] + ".png")
        .attr("y",t2h + t2offset);

    var xScale = d3.scaleLinear()
    .domain([0, 39])
    .range([0, blc3]);

    var yScale = d3.scaleLinear()
    .domain([0, 10])
    .range([5, 150]);


    team1matches = dataset.filter(function(d){ return  (d.HomeTeam == getKeyByValue(teamIDs,selectedTeams[0]) || d.AwayTeam == getKeyByValue(teamIDs,selectedTeams[0])) });
    team2matches = dataset.filter(function(d){ return  (d.HomeTeam == getKeyByValue(teamIDs,selectedTeams[1]) || d.AwayTeam == getKeyByValue(teamIDs,selectedTeams[1])) });

    var bars1home = d3.select("#bars1home").selectAll("rect").data(team1matches);

    bars1home.enter()
        .append("rect")
        .attr("rx",6)
        .attr("ry",6)
        .attr("x", function(d,n) { return 340 + xScale(n) })
        .attr("width", barwidth)
        .attr("y", function(d) { return t1h+98 - yScale(d.FTHG);})
        .attr("height", function(d) { return yScale(d.FTHG);})
        .attr("class", function(d) { return teamIDs[d.HomeTeam]; })
        .style("opacity", function(d) {
        if(d.FTHG > d.FTAG) return winOpa;
        return losOpa;
    })
        .style("fill", function(d) {
        if(d.HomeTeam == getKeyByValue(teamIDs,selectedTeams[0])){
            return t1color;
        }
        else if(d.HomeTeam == getKeyByValue(teamIDs,selectedTeams[1])){
            return t2color;
        }
        else {
            return otcolor;
        }
    })
        .on("mouseover", function(d) {		
        div.transition()		
            .duration(200)		
            .style("opacity", .9);		
        div	.html(d.Date + "<br/>" + d.HomeTeam + " - " + d.FTHG + "<br/>"  + d.AwayTeam + " - " + d.FTAG)	
            .style("left", (d3.select(this).attr("x") - 50 + barwidth/2) + "px")		
            .style("top", (t1h + 120 - d3.select(this).attr("height")) + "px");
        d3.select(this).style("opacity",1.0);
        var currTeam = d3.select(this).attr("class");
        if(!selectedTeams.includes(currTeam)){
            d3.selectAll("rect."+currTeam.replace(" ",".")).style("fill",hicolor).style("opacity",1.0);
        }
    })					
        .on("mouseout", function(d) {		
        div.transition()		
            .duration(500)		
            .style("opacity", 0);
        d3.select(this).style("opacity", function(d) {
            if(d.FTHG > d.FTAG) return winOpa;
            return losOpa;
        })
        var currTeam = d3.select(this).attr("class")
        if(!selectedTeams.includes(currTeam)){
            d3.selectAll("rect."+currTeam.replace(" ",".")).style("fill",otcolor);
        }
    });

    bars1home.transition()
        .duration(1000)
        .attr("y", function(d) { return t1h+98 - yScale(d.FTHG);})
        .attr("height", function(d) { return yScale(d.FTHG);})
        .attr("class", function(d) { return teamIDs[d.HomeTeam];})
        .style("opacity", function(d) {
        if(d.FTHG > d.FTAG) return winOpa;
        return losOpa;
    })
        .style("fill", function(d) {
        if(d.HomeTeam == getKeyByValue(teamIDs,selectedTeams[0])){
            return t1color;
        }
        else if(d.HomeTeam == getKeyByValue(teamIDs,selectedTeams[1])){
            return t2color;
        }
        else {
            return otcolor;
        }
    });

    bars1home.exit().remove();

    var bars1away = d3.select("#bars1away").selectAll("rect").data(team1matches);

    bars1away.enter()
        .append("rect")
        .attr("rx",6)
        .attr("ry",6)
        .attr("x", function(d,n) { return 340 + xScale(n) })
        .attr("width", barwidth)
        .attr("y", function(d) { return t1h+102;})
        .attr("height", function(d) { return yScale(d.FTAG);
                                    })
        .attr("class", function(d) { return teamIDs[d.AwayTeam];})
        .style("opacity", function(d) {
        if(d.FTHG < d.FTAG) return winOpa;
        return losOpa;
    })
        .style("fill", function(d) {
        if(d.AwayTeam == getKeyByValue(teamIDs,selectedTeams[0])){
            return t1color;
        }
        else if(d.AwayTeam == getKeyByValue(teamIDs,selectedTeams[1])){
            return t2color;
        }
        else {
            return otcolor;
        }
    })
        .on("mouseover", function(d) {		
        div.transition()		
            .duration(200)		
            .style("opacity", .9);		
        div	.html(d.Date + "<br/>" + d.HomeTeam + " - " + d.FTHG + "<br/>"  + d.AwayTeam + " - " + d.FTAG)	
            .style("left", (d3.select(this).attr("x") - 50 + barwidth/2) + "px")		
            .style("top", (t1h+184+1*d3.select(this).attr("height")) + "px");
        d3.select(this).style("opacity",1.0);
        var currTeam = d3.select(this).attr("class")
        if(!selectedTeams.includes(currTeam)){
            d3.selectAll("rect."+currTeam.replace(" ",".")).style("fill",hicolor).style("opacity",1.0);
        }
    })					
        .on("mouseout", function(d) {		
        div.transition()		
            .duration(500)		
            .style("opacity", 0);
        d3.select(this).style("opacity", function(d) {
            if(d.FTHG < d.FTAG) return winOpa;
            return losOpa;
        })
        var currTeam = d3.select(this).attr("class")
        if(!selectedTeams.includes(currTeam)){
            d3.selectAll("rect."+currTeam.replace(" ",".")).style("fill",otcolor);
        }	
    });

    bars1away.transition()
        .duration(1000)
        .attr("y", function(d) { return 102+t1h;})
        .attr("height", function(d) { return yScale(d.FTAG);})
        .attr("class", function(d) { return teamIDs[d.AwayTeam];})
        .style("opacity", function(d) {
        if(d.FTHG < d.FTAG) return winOpa;
        return losOpa;
    })
        .style("fill", function(d) {
        if(d.AwayTeam == getKeyByValue(teamIDs,selectedTeams[0])){
            return t1color;
        }
        else if(d.AwayTeam == getKeyByValue(teamIDs,selectedTeams[1])){
            return t2color;
        }
        else {
            return otcolor;
        }
    });

    bars1away.exit().remove();

    var bars2home = d3.select("#bars2home").selectAll("rect").data(team2matches);

    bars2home.enter()
        .append("rect")
    .attr("rx",6)
        .attr("ry",6)
        .attr("x", function(d,n) { return 340 + xScale(n) })
        .attr("width", barwidth)
        .attr("y", function(d) { return t2h+98 - yScale(d.FTHG);})
        .attr("height", function(d) { return yScale(d.FTHG);})
        .attr("class", function(d) { return teamIDs[d.HomeTeam];})
        .style("opacity", function(d) {
        if(d.FTHG > d.FTAG) return winOpa;
        return losOpa;
    })
        .style("fill", function(d) {
        if(d.HomeTeam == getKeyByValue(teamIDs,selectedTeams[1])){
            return t2color;
        }
        else if(d.HomeTeam == getKeyByValue(teamIDs,selectedTeams[0])){
            return t1color;
        }
        else {
            return otcolor;
        }
    })
        .on("mouseover", function(d) {		
        div.transition()		
            .duration(200)		
            .style("opacity", .9);		
        div	.html(d.Date + "<br/>" + d.HomeTeam + " - " + d.FTHG + "<br/>"  + d.AwayTeam + " - " + d.FTAG)	
            .style("left", (d3.select(this).attr("x") - 50 + barwidth/2) + "px")		
            .style("top", (t2h+120 - d3.select(this).attr("height")) + "px");
        d3.select(this).style("opacity",1.0);
        var currTeam = d3.select(this).attr("class")
        if(!selectedTeams.includes(currTeam)){
            d3.selectAll("rect."+currTeam.replace(" ",".")).style("fill",hicolor).style("opacity",1.0);
        }	
    })					
        .on("mouseout", function(d) {		
        div.transition()		
            .duration(500)		
            .style("opacity", 0);
        d3.select(this).style("opacity", function(d) {
            if(d.FTHG > d.FTAG) return winOpa;
            return losOpa;
        })
        var currTeam = d3.select(this).attr("class")
        if(!selectedTeams.includes(currTeam)){
            d3.selectAll("rect."+currTeam.replace(" ",".")).style("fill",otcolor);
        }
    });

    bars2home.transition()
        .duration(1000)
        .attr("y", function(d) { return t2h+98 - yScale(d.FTHG);})
        .attr("height", function(d) { return yScale(d.FTHG);})
        .attr("class", function(d) { return teamIDs[d.HomeTeam];})
        .style("opacity", function(d) {
        if(d.FTHG > d.FTAG) return winOpa;
        return losOpa;
    })
        .style("fill", function(d) {
        if(d.HomeTeam == getKeyByValue(teamIDs,selectedTeams[1])){
            return t2color;
        }
        else if(d.HomeTeam == getKeyByValue(teamIDs,selectedTeams[0])){
            return t1color;
        }
        else {
            return otcolor;
        }
    });

    bars2home.exit().remove();

    var bars2away = d3.select("#bars2away").selectAll("rect").data(team2matches);

    bars2away.enter()
        .append("rect")
    .attr("rx",6)
        .attr("ry",6)
        .attr("x", function(d,n) { return 340 + xScale(n) })
        .attr("width", barwidth)
        .attr("y", function(d) { return t2h+102;})
        .attr("height", function(d) { return yScale(d.FTAG);})
        .attr("class", function(d) { return teamIDs[d.AwayTeam];})
        .style("opacity", function(d) {
        if(d.FTHG < d.FTAG) return winOpa;
        return losOpa;;
    })
        .style("fill", function(d) {
        if(d.AwayTeam == getKeyByValue(teamIDs,selectedTeams[1])){
            return t2color;
        }
        else if(d.AwayTeam == getKeyByValue(teamIDs,selectedTeams[0])){
            return t1color;
        }
        else {
            return otcolor;
        }
    })
        .on("mouseover", function(d) {		
        div.transition()		
            .duration(200)		
            .style("opacity", .9);		
        div	.html(d.Date + "<br/>"  + d.HomeTeam + " - " + d.FTHG + "<br/>"  + d.AwayTeam + " - " + d.FTAG)	
            .style("left", (d3.select(this).attr("x") - 50 + barwidth/2) + "px")		
            .style("top", (t2h+182+1*d3.select(this).attr("height")) + "px");
        d3.select(this).style("opacity",1.0);
        var currTeam = d3.select(this).attr("class")
        if(!selectedTeams.includes(currTeam)){
            d3.selectAll("rect."+currTeam.replace(" ",".")).style("fill",hicolor).style("opacity",1.0);
        }
    })					
        .on("mouseout", function(d) {		
        div.transition()		
            .duration(500)		
            .style("opacity", 0);
        d3.select(this).style("opacity", function(d) {
            if(d.FTHG < d.FTAG) return winOpa;
            return losOpa;
        })
        var currTeam = d3.select(this).attr("class")
        if(!selectedTeams.includes(currTeam)){
            d3.selectAll("rect."+currTeam.replace(" ",".")).style("fill",otcolor);
        }
    });

    bars2away.transition()
        .duration(1000)
        .attr("y", function(d) { return t2h+102;})
        .attr("height", function(d) { return yScale(d.FTAG);})
        .attr("class", function(d) { return teamIDs[d.AwayTeam];})
        .style("opacity", function(d) {
        if(d.FTHG < d.FTAG) return winOpa;
        return losOpa;
    })
        .style("fill", function(d) {
        if(d.AwayTeam == getKeyByValue(teamIDs,selectedTeams[1])){
            return t2color;
        }
        else if(d.AwayTeam == getKeyByValue(teamIDs,selectedTeams[0])){
            return t1color;
        }
        else {
            return otcolor;
        }
    });

    bars2away.exit().remove();

}

function changeDataMatchHistory() {
    // Load the file indicated by the select menu

    var dataFile = document.getElementById('season_m').value;

    d3.csv('data/m' + dataFile + '.csv').then(function(data) {
        matchhistoryCsv = data;
        matchhistoryCsv.forEach( function(d) {
            d.FTHG = +d.FTHG;
            d.FTAG = +d.FTAG;
        });

        updateSelects(teams[dataFile]);
        updateMatchHistory(matchhistoryCsv);
    })
        .catch(function(error){
        // handle error
        alert("Couldn't load the dataset!");		 
    });


}

function updateSelects(teams) {
    var selector1 = d3.select("#team1")
    .selectAll("option")
    .data(teams);
    selector1.enter().append("option")
        .text(function(d) { return d; })
        .attr("value", function (d) {
        return teamIDs[d];
    });
    selector1.transition()
        .text(function(d) { return d; })
        .attr("value", function (d) {
        return teamIDs[d];
    });
    selector1.exit().remove();


    var selector2 = d3.select("#team2")
    .selectAll("option")
    .data(teams);
    selector2.enter().append("option")
        .text(function(d) { return d; })
        .attr("value", function (d) {
        return teamIDs[d];
    });
    selector2.transition()
        .text(function(d) { return d; })
        .attr("value", function (d) {
        return teamIDs[d];
    });
    selector2.exit().remove();

    element = document.getElementById("team1");
    element.value = selectedTeams[0];
    element = document.getElementById("team2");
    element.value = selectedTeams[1];
}

function teamChange(n) {
    selectedTeams[n-1] = document.getElementById("team"+n).value;
    updateMatchHistory(matchhistoryCsv);
}


