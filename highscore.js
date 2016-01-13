// code based on histogram sample from http://bl.ocks.org/mbostock/3048450

var libsw = new LibSpaceWalk();

var svg;

var margin = {top: 10, right: 30, bottom: 30, left: 30};
var width = 500 - margin.left - margin.right;
var height = 200 - margin.top - margin.bottom;


window.onload = function() {

	svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		 .append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}


libsw.onMessage = function(dataIn) {
	if (dataIn.type == 'com.lostinthegarden.highscore') {

		var margin = window.margin;
		var width = window.width;
		var height = window.height;

		// quick fix: start clean
		d3.select('svg').remove();
		svg = d3.select("body").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			 .append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Generate a Bates distribution of 10 random variables.
		var values = dataIn.payload.bestTimes.map(function(element) {
			return element / 1000.0; // convert to seconds
		});

		var currentLap = dataIn.payload.time;

		var x = d3.scale.linear()
			.domain([d3.min(values), d3.max(values)])
			.range([0, width]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

		// A formatter for counts.
		var formatCount = d3.format(",.0f");

		// Generate a histogram using twenty uniformly-spaced bins.
		var data = d3.layout.histogram()
			.bins(x.ticks(20))
			(values);

		var y = d3.scale.linear()
			.domain([0, d3.max(data, function(d) { return d.y; })])
			.range([height, 0]);


		var bar = svg.selectAll(".bar")
		    .data(data)
		  .enter().append("g")
		    .attr("class", "bar")
		    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

		bar.append("rect")
		    .attr("x", 1)
		    .attr("width", (x(data[1].x) - x(data[0].x)) - 1)
		    .attr("height", function(d) { return height - y(d.y); });

		bar.append("text")
		    .attr("dy", ".75em")
		    .attr("y", 6)
		    .attr("x", (x(data[1].x) - x(data[0].x)) / 2)
		    .attr("text-anchor", "middle")
		    .text(function(d) { return formatCount(d.y); });

		svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + height + ")")
		    .call(xAxis);

		// find current bin
		var i;
		for (i = 0; i < data.length; i++) {
			if (currentLap < (data[i].x + data[i].dx)) {
				break;
			}
		}
		i = Math.min(i, data.length - 1);

		var bar = d3.selectAll('rect')[0][i]
		d3.select(bar).attr('class', 'currentLap');
	}
}
