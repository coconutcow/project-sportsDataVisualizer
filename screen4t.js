var teamInfoCsv;
var formation = "d433"
var offset = 0;

d3.select("#tioutline").append("circle").attr("cx",150).attr("cy",150).attr("r",145).style("stroke-width","5px").style("stroke","#FFE066").style("stroke-opacity",1).style("fill","white").style("fill-opacity",0.3);

changeDataTeamStats();

function updateTeamStats(dataset) {
	d3.select("#teamlogo")
	.attr("xlink:href", "assets/" + tf + ".png")
	.attr("y",50+offset);
	
	currTeamDetails = dataset.filter(function(d) { return (d.Team == tf) })[0];
	
	d3.select("#coachpic")
	.attr("xlink:href", "assets/" + currTeamDetails.Coach + ".jpg");
	
	formation = "d" + currTeamDetails.Formation;
	formationChange();
	
	var date = new Date(currTeamDetails.Founded.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"))
	date = date.toString().split(" ").slice(1,4).join(" ");
	
	d3.select("#founded").text("est. " + date);
	d3.select("#coach").text(currTeamDetails.Coach);
	d3.select("#ground").text(currTeamDetails.Ground);
	d3.select("#marketvalue").text(currTeamDetails.MarketValue + " Million");
	
	d3.select("#formation").text(currTeamDetails.Formation);
	d3.select("#apps").text(currTeamDetails.Apps);
	d3.select("#wins").text(currTeamDetails.W);
	d3.select("#draws").text(currTeamDetails.D);
	d3.select("#loses").text(currTeamDetails.L);	
	d3.select("#scored").text(currTeamDetails.Scored);
	d3.select("#conceded").text(currTeamDetails.Conceded);
	
}

function teamStatsChange() {
	updateTeamStats(teamInfoCsv);
}

function changeDataTeamStats() {
    // Load the file indicated by the select menu

    d3.csv('data/TeamInfoDataset.csv').then(function(data) {
		teamInfoCsv = data;
		teamInfoCsv.forEach( function(d) {
			d.Founded = d.Founded.replace("/","-");
			d.Founded = d.Founded.replace("/","-");
			d.MarketValue = +d.MarketValue;
			d.Apps = +d.Apps;
			d.Scored = +d.Scored;
			d.Conceded = +d.Conceded;
			d.W = +d.W;
			d.L = +d.L;
			d.D = +d.D;
		});
		updateTeamStats(teamInfoCsv);
	})
	.catch(function(error){
	// handle error
		alert("Couldn't load the dataset!");		 
	});
	
	
}