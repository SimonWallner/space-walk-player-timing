// code based on histogram sample from http://bl.ocks.org/mbostock/3048450

var libsw = new LibSpaceWalk();

var svg;

var margin = {top: 10, right: 30, bottom: 30, left: 30};
var width = 500 - margin.left - margin.right;
var height = 300 - margin.top - margin.bottom;
var data = {};
var tags = [];



window.onload = function() {

}


libsw.onMessage = function(dataIn) {
	if (dataIn.type == 'com.lostinthegarden.playerTiming.times') {

		var payload = dataIn.payload;

		var body = d3.select('body');
		var div = body.append('div')
			.attr('id', function(d, i) { return d; })
			.attr('class', 'plot')

		var times = payload.times.sort(function(a, b) { return a - b; });

		var x = d3.scale.linear()
			.domain([0, times.length])
			.range([0, width]);

		var y = d3.scale.linear()
			.domain([0, d3.max(times)])
			.range([0, height])

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient('left')


		d3.select('svg').remove();

		var svg = div.append('svg')
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


		var bars = svg.selectAll('.bar')
			.data(times)
				.enter().append('rect')
					.attr('width', (x(1) - x(0)) - 1)
					.attr("height", function(d) { return y(d); })
					.attr('x', function(d, i) { return x(i);})
					.attr('y', function(d) { return height - y(d); });

		var labels = svg.selectAll('.text')
			.data(times)
				.enter().append('text')
					.attr('x', function(d, i) { return x(i);})
					.attr('y', function(d) { return height - y(d); })
					.text(function(d) { return d; })
	}
}
