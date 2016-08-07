

function drawBarchart(poll, scale){
    var scaleFactor = scale || 1
    var title = cssEnc(poll.title)
    var fields = poll.fields
    var names = fields.map(function(f){return f.name})
    var votes = fields.map(function(f){return f.votes})
    var author = 'unknown'
    if(poll.author && poll.author.facebook && poll.author.facebook.displayName) {
        author = poll.author.facebook.displayName
    }
    var margin = { top: 100, right: 20, bottom: 60, left: 240 }
    var width = 860 - margin.left - margin.right;
    var barThickness = 20 * scaleFactor;
    var barOffset = 10 * scaleFactor;
    var height = ((barThickness + barOffset) * names.length)
    var leftWidth = 100

    var xScale = d3.scale.linear()
        .domain([0, d3.max(votes) + 1])
        .range([0, width])

    var yScale = d3.scale.ordinal()
        .domain(names)
        .rangeRoundBands([0, height])
   
    var colors = d3.scale.linear()
        .domain([0, names.length])
        .range(['#e85400', '#fed19f'])

    var chart = d3.select('#barchart_' + title).append("svg")
        .attr("class", "chart center-block")
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        
    var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .ticks(votes.size)
            .tickFormat(d3.format("d"))

    var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")

   chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("x", 260)
        .attr("dy", "2.5em")
        .style("color", "#222222")
        .style("font-size", 16)
        .text("Votes Received")

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)

    var shadowbars = chart.selectAll('.shadowbars').data(votes)
        .enter().append('rect')
        .attr("class", "shadowbars")
        .style("fill", "#c3c3c3")
        .attr('height', barThickness)
        .attr('width', function (data) {
            return xScale(data);
        })
        .attr('x', function (data) {
            return 4
        })
        .attr('y', function (data, i) {
            return (i * (barThickness + barOffset)) + 4;
        })

    var bars = chart.selectAll('.bars').data(votes)
        .enter().append('rect')
        .attr("class", "bars")
        .style("fill", function (data, i) { return colors(i) })
        .attr('height', barThickness)
        .attr('width', function (data) {
            return xScale(data);
        })
        .attr('x', function (data) {
            return 0
        })
        .attr('y', function (data, i) {
            return i * (barThickness + barOffset);
        })

        chart.append("text")
            .attr("class", "heading")
            .style("font-size", "26px")
            .attr("y", -60)
            .text(poll.title)
            
        chart.append("text")
            .attr("class", "heading")
            .style("font-size", "16px")
            .attr("y", -20)
            .text(" posted by " + author)

}