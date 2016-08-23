// code based on histogram sample from http://bl.ocks.org/mbostock/3048450

var libsw = new LibSpaceWalk();

var svg;

var margin = {top: 10, right: 30, bottom: 30, left: 30};
var width = 500 - margin.left - margin.right;
var height = 100 - margin.top - margin.bottom;
var data = {};
var tags = [];



window.onload = function() {

}


libsw.onMessage = function(dataIn) {
	if (dataIn.type == 'com.lostinthegarden.highscore') {

		var payload = dataIn.payload;
		d3.select('#latest').text(payload.time);

		if (!data[payload.tag])
		{
			data[payload.tag] = [];
			tags.push(payload.tag);
		}

		data[payload.tag].push(payload.time);

		var margin = window.margin;
		var width = window.width;
		var height = window.height;

		var body = d3.select('body');
		var div = body.selectAll('div.plot').data(tags);
		div.enter().append('div')
			.attr('id', function(d, i) { return d; })
			.attr('class', 'plot')
			.append('p')
				.text(function(d, i) { return d; });
		div.exit()
			.remove();


		var minTime = tags.reduce(function(previous, current) {
			return Math.min(previous, d3.min(data[current]));
		}, 0)
		var maxTime = tags.reduce(function(previous, current) {
			return Math.max(previous, d3.max(data[current]));
		}, 0)

		var x = d3.scale.linear()
			.domain([minTime -0.1, maxTime + 0.1])
			.range([0, width]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

		// A formatter for counts.
		var formatCount = d3.format(",.0f");


		for (var i = 0; i < tags.length; i++)
		{
			var tag = tags[i];
			values = data[tag];

			// quick fix: start clean
			d3.select('#' + tag + ' svg').remove();
			var svg = d3.select('#' + tag).append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				 .append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


			// Generate a histogram using twenty uniformly-spaced bins.
			var histData = d3.layout.histogram()
				.bins(x.ticks(20))
				(values);

			var y = d3.scale.linear()
				.domain([0, d3.max(histData, function(d) { return d.y; })])
				.range([height, 0]);



			var bar = svg.selectAll(".bar")
			    .data(histData)
			  		.enter().append("g")
			    		.attr("class", "bar")
			    		.attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });


			bar.append("rect")
			    .attr("x", 1)
			    .attr("width", (x(histData[1].x) - x(histData[0].x)) - 1)
			    .attr("height", function(d) { return height - y(d.y); });

			bar.append("text")
			    .attr("dy", ".75em")
			    .attr("y", 6)
			    .attr("x", (x(histData[1].x) - x(histData[0].x)) / 2)
			    .attr("text-anchor", "middle")
			    .text(function(d) { return formatCount(d.y); });

			svg.append("g")
			    .attr("class", "x axis")
			    .attr("transform", "translate(0," + height + ")")
			    .call(xAxis);

		}

		// find current bin
		var i;
		for (i = 0; i < histData.length; i++) {
			if (payload.time < (histData[i].x + histData[i].dx)) {
				break;
			}
		}
		i = Math.min(i, histData.length - 1);

		var bar = d3.select('#' + payload.tag).selectAll('rect')[0][i]
		d3.select(bar).attr('class', 'currentLap');
	}
}
