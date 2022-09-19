var matchday = 1;
var moving = false;
var matchdayCsv;
var transitionSpeed = 1000;
var matchdayRange = d3.range(1,39);
var partialMatchdayRange = d3.range(1,matchday+1);
var playButton = d3.select("#play-button");
var timer;
var columns = ["Team","W","D","L","GF","GA","GD","Pts"];
var width;
var hoff = 60;
var blc = 800;
var col_xpos = [blc+25,blc+190,blc+220,blc+250,blc+280,blc+310,blc+340,blc+370];
var extent = [[0,0],[0,0]];

console.log(blc);
// Step
var sliderStep = d3
    .sliderBottom()
    .min(d3.min(matchdayRange))
    .max(d3.max(matchdayRange))
    .width(blc-35)
    .ticks(38)
    .step(1)
    .on('onchange', val => {
	  matchday = val;
	  updateStandings(matchdayCsv);
    });

var gStep = d3
    .select('#slider')
    .attr('transform', 'translate(36,'+(640-hoff)+')');

gStep.call(sliderStep);

	// Set up the scales
    var matchdayScale = d3.scaleLinear()
        .domain([1, 38])
        .range([35, blc]);
		
	var positionScale = d3.scaleLinear()
        .domain([1, 20])
        .range([17.5+20, 592.5+20-hoff]);
		
	var color2 = d3.scaleLinear()
        .domain([1,4,5,6,7,17,18,20])
        .range(["#17C9B7","#17C9B7","#FFE581","#FFE581","#329AFF","#329AFF","#F47C79","#F47C79"])
        .interpolate(d3.interpolateHcl);
		

d3.select("#yaxis")
	.attr("transform", "translate(35," + 0 + ")")
	.call(d3.axisLeft(positionScale)
			.ticks(20));

columns.forEach( function(col,i) {
	var header = d3.select("#Headers");
	header.append("text")
	.attr("x",col_xpos[i])
	.attr("y",20)
	.text(col);
})


d3.select("#brush")
      .call( d3.brush()                 // Add the brush feature using the d3.brush function
        .extent( [ [20,20], [blc+15,630-hoff] ] )
		.on("start brush", updateChart)		// Each time the brush selection changes, trigger the 'updateChart' function
      );
	
  // Function that is triggered when brushing is performed
  function updateChart() {
    extent = d3.event.selection;
	extent[0][0] = Math.round(matchdayScale.invert(extent[0][0]));
	extent[1][0] = (matchdayScale.invert(extent[1][0]));
	extent[0][1] = (positionScale.invert(extent[0][1]));
	extent[1][1] = (positionScale.invert(extent[1][1]));
	var myCircles = d3.select("#circles").selectAll("circle");
    myCircles.classed("selected", function(d){ return isBrushed(extent,d) } )
  }
  
  function updateChart2() {
	var myCircles = d3.select("#circles").selectAll("circle");
	myCircles.classed("selected", function(d){ return isBrushed(extent,d) } )
  }

  // A function that return TRUE or FALSE according if a dot is in the selection or not
  function isBrushed(brush_coords,d) {
		  
		  var pathy = [];
		  	  
		  for (var i = 0; i < d.pathx.length; i++) {
		    if (d.pathx[i] >= brush_coords[0][0] && d.pathx[i] <= brush_coords[1][0]) pathy.push(parseInt(d.pathy[i]));
		  }
		  pathy = pathy.filter(x => x >= brush_coords[0][1]);
		  pathy = pathy.filter(x => x <= brush_coords[1][1]);
		  
		  d3.select("#paths").selectAll("path."+d.ID).classed("selected", pathy.length > 0);
		
		  return pathy.length>0;
  }

changeDataStandings();

function updateStandings(dataset) {
	
	var lineGenerator = d3.line()
		.curve(d3.curveCardinal.tension(0.7))
		.x(function (d) {
            return matchdayScale(d.x);
        })
        .y(function (d) {
            return positionScale(d.y);
        });
	
	dataset.forEach( function(d) {
		d.pathx = d3.range(1,matchday+1);
		d.pathy = d.totalY.slice(0,matchday);
		d.test = [];
		for(i = 0; i < 38 ; i++){
			if( i < d.pathx.length ){
				d.test.push({x:d.pathx[i],y:parseFloat(d.pathy[i])});
			}
			else{
				d.test.push({x:d.pathx[d.pathx.length -1],y:parseFloat(d.pathy[d.pathx.length -1])});
			}
		}
	});
			
	var paths = d3.select("#paths").selectAll("path").data(dataset);
	paths.exit().remove();
	paths.enter()
	.append("path")
	.attr("class",function(d){return d.ID + " standingPath"})
	.attr("d",function(d){return lineGenerator(d.test);})
    .attr("transform", null)
	.style("stroke", function(d) { return color2(d["M"+matchday]);})
	.on("mouseover", function(d) {
		//d3.select("#standings").selectAll("."+d3.select(this).attr("class").slice(0,3)).classed("selected",true);
	})
	.on("mouseout", function(d) {
		//d3.select("#standings").selectAll("."+d3.select(this).attr("class").slice(0,3)).classed("selected",false);
	});
	paths.transition()
	.duration(transitionSpeed)
	.style("stroke", function(d) {	return color2(d["M"+matchday]);})
	//.attr("class",function(d){return d.ID + " standingPath"})
	.attr("d",function(d){return lineGenerator(d.test);});
	
	var circles = d3.select("#circles").selectAll("circle").data(dataset);
	circles.exit().remove();
	circles.enter()
	.append("circle")
	.attr("class", function (d) { return d.ID;})
	.attr("cx", matchdayScale(matchday))
	.attr("cy", function (d) { return positionScale(d.M1);})
	.attr("r", 13)
	.style("stroke", "#fff"/*function(d) { return color2(d["M"+matchday]);}*/);
	circles.transition()
	.duration(transitionSpeed)
	//.attr("class", function (d) { return d.ID;})
	.attr("cx",matchdayScale(matchday))
	.attr("cy", function (d) { return positionScale(d["M"+matchday]);})
	.style("stroke", "#fff"/*function(d) { return color2(d["M"+matchday]);}*/);
	
	var imgs = d3.select("#imgs").selectAll("image").data(dataset);
	imgs.exit().remove();
	imgs.enter()
	.append("image")
	.attr("class", function (d) { return d.ID;})
	.attr("x", matchdayScale(matchday)-10)
	.attr("y", function (d) { return positionScale(d.M1)-10;})
	.attr("height",20)
	.attr("width", 20)
	.attr("xlink:href",function(d) { return "assets/" + d.ID + ".png"})
	.on("mouseover", function(d) {
		//d3.select("#standings").selectAll("."+d3.select(this).attr("class")).classed("selected",true);
	})
	.on("mouseout", function(d) {
		//d3.select("#standings").selectAll("."+d3.select(this).attr("class").replace(" ",".")).classed("selected",false);
	});
	imgs.transition()
	.duration(transitionSpeed)
	.attr("class", function (d) { return d.ID;})
	.attr("x",matchdayScale(matchday)-10)
	.attr("y", function (d) { return positionScale(d["M"+matchday])-10;})
	.attr("xlink:href",function(d) { return "assets/" + d.ID + ".png"});
	
	columns.forEach( function(col,i) {
		var column = d3.select("#"+col).selectAll("text").data(dataset);
		column.enter()
		.append("text")
		.attr("x",col_xpos[i])
		.attr("y",function (d) { return positionScale(d.M38)+5;})
		.text(function (d) { return d[col];});
		column.transition()
		.duration(500)
		.attr("y",function (d) { return positionScale(d.M38)+5;})
		.text(function (d) { return d[col];});
		column.exit().remove();
	});
	
	updateChart2();
}

function changeDataStandings() {
    // // Load the file indicated by the select menu
	
	moving = false;
	playButton.text("Play");
	if(timer){clearInterval(timer);};
	
    var dataFile = document.getElementById('season_s').value;

    d3.csv('data/s' + dataFile + '.csv').then(function(data) {
		matchdayCsv = data;
		matchdayCsv.forEach( function(d) {
			var standing = []
			for(i = 1; i < 39; i++){
				standing.push(d["M"+i]);
			}
			d.totalY = [...standing];
		});
		
		d3.select("#paths").selectAll("path").data(matchdayCsv).transition().duration(0).attr("class",function(d) { return d.ID + " standingPath"});
		d3.select("#circles").selectAll("circle").data(matchdayCsv).transition().duration(0).attr("class",function(d) { return d.ID});
		
		updateStandings(matchdayCsv);
		playButton.on("click", function() {
			var button = d3.select(this);
			 if (button.text() == "Pause") {
				 moving = false;
				 button.text("Play");
				 clearInterval(timer);
			 }
			 else {
				 moving = true;
				 timer = setInterval(step, transitionSpeed);
				 button.text("Pause");
			 }
		})

	})
	.catch(function(error){
	// handle error
		alert("Couldn't load the dataset!");		 
	});
}

function step() {
  var current = sliderStep.value();
  if (current > 37){
	  moving = false;
	  playButton.text("Play");
      clearInterval(timer);
  }
  else{
	  sliderStep.value(current+1);
	  updateStandings(matchdayCsv);
  }
}

function reset() {
	  moving = false;
	  playButton.text("Play");
      clearInterval(timer);
	  sliderStep.value(1);
}