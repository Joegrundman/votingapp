class Barchart {
   constructor(poll, scaleFactor, transitioningBars, votable, voteCallback) {
      this.voteAction = voteCallback
      this.poll = poll
      this.scaleFactor = scaleFactor || 1
      this.transition = transitioningBars || false
      this.votable = votable || false
      this.title = cssEnc(this.poll.title)
      this.fields = this.poll.fields
      this.names = this.fields.map(f => f.name)
      this.votes = this.fields.map(f => f.votes)
      this.author = 'unknown'
      if (this.poll.author && this.poll.author.facebook && this.poll.author.facebook.displayName) {
         this.author = this.poll.author.facebook.displayName
      }
      this.margin = { 
            top: 66 * this.scaleFactor, 
            right: 13 * this.scaleFactor, 
            bottom: 40 * this.scaleFactor, 
            left: 160 * this.scaleFactor }
      this.width = (574 * this.scaleFactor) - this.margin.left - this.margin.right;
      this.barThickness = 20 * this.scaleFactor;
      this.barOffset = 10 * this.scaleFactor;
      this.height = ((this.barThickness + this.barOffset) * this.names.length)
      this.leftWidth = 67 * this.scaleFactor

      this.selectedOption;
      this.selectedIndex;

      this.xScale = d3.scale.linear()
         .domain([0, d3.max(this.votes) + 1])
         .range([0, this.width])

      this.yScale = d3.scale.ordinal()
         .domain(this.names)
         .rangeRoundBands([0, this.height])

      this.colors = d3.scale.linear()
         .domain([0, this.names.length])
         .range(['#e85400', '#fed19f'])
   }

   updateChartOnVote(data) {
      var newVotes = JSON.parse(data).fields.map(f => f.votes)

      var newXScale = d3.scale.linear()
         .domain([0, d3.max(this.votes) + 1])
         .range([0, this.width])


      d3.select(".chart")
         .selectAll(".shadowbars")
         .data(newVotes)
         .transition()
         .attr("width", function (data) {
            return newXScale(data)
         })
         .attr("x", function (data) {
            return 4
         })
         .delay(function (data, i) {
            return i * 20
         })
         .duration(1000)
         .ease("quad")

      d3.select(".chart")
         .selectAll(".bars")
         .data(newVotes)
         .transition()
         .attr("width", function (data) {
            return newXScale(data)
         })
         .attr("x", function (data) {
            return 0
         })
         .duration(1000)
         .ease("quad")
   }

   render(poll, scaleFactor, withTransitioningBars, votable) {
      var _this = this
      var chart = d3.select('#barchart_' + this.title).append("svg")
         .attr("class", "chart center-block")
         .attr('width', this.width + this.margin.right + this.margin.left)
         .attr('height', this.height + this.margin.top + this.margin.bottom)
         .append('g')
         .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)

      var xAxis = d3.svg.axis()
         .scale(this.xScale)
         .orient('bottom')
         .ticks(this.votes.size)
         .tickFormat(d3.format("d"))

      var yAxis = d3.svg.axis()
         .scale(this.yScale)
         .orient("left")

      chart.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(0," + this.height + ")")
         .call(xAxis)
         .append("text")
         .attr("x", 170 * this.scaleFactor)
         .attr("dy", 36 * this.scaleFactor)
         .style("color", "#222222")
         .style("font-size", 11 * this.scaleFactor)
         .text("Votes Received")

      chart.append("g")
         .attr("class", "y axis")
         .call(yAxis)

      if (this.votable) {

      var checkboxRows = chart.selectAll('.checkbox-rows').data(this.names)
            .enter().append('rect')
            .attr("class", "checkbox-rows")
            .attr("height", this.barThickness + this.barOffset - 2)
            .attr("width", this.margin.left)
            .attr("x", -this.margin.left)
            .attr("y", function (data, i) {
                  return (i * (_this.barThickness + _this.barOffset))
                  })
      
      var checkboxes = chart.selectAll('.check-box').data(this.names)
            .enter().append('rect')
            .attr("class", "check-box")
            .attr("height", 20)
            .attr("width",20)
            .attr("x", -this.margin.left +10)
            .attr("y", function (data, i) {
               return (i * (_this.barThickness + _this.barOffset)) + 10
            })

      var checkboxCenter= chart.selectAll('.check-box-center').data(this.names)
            .enter().append('rect')
            .attr("class", "check-box-center")
            .attr("height", 14)
            .attr("width", 14)
            .attr("x", -this.margin.left + 13)
            .attr("y", function (data, i) {
                  return (i * (_this.barThickness + _this.barOffset)) + 13
            })
           .on('click', function (d, i) {
               d3.selectAll('.check-box-center')
                  .classed("clicked-check-box", false)

               d3.select(this)
                  .classed("clicked-check-box", true)

               _this.selectedOption = d
               _this.selectedIndex = i
           })
         // vote button
         var svgVoteBtn = chart.append('rect')
            .attr("class", "svg-vote-btn")
            .attr("height", 40)
            .attr("width", 65)
            .attr("x", -200)
            .attr("y", this.height + 5)
            .on("click", function () {
               _this.voteAction(_this.selectedOption)
            })

         chart.append("text")
            .attr("class", "svg-btn-text")
            .attr("x", -168)
            .attr("y", this.height + 29)
            .text("Vote")

         chart.append("text")
            .attr("x", -210)
            .attr("y", -20)
            .text("Select an option")

      }

      var shadowbars = chart.selectAll('.shadowbars').data(this.votes)
         .enter().append('rect')
         .attr("class", "shadowbars")
         .style("fill", "#c3c3c3")
         .attr('height', this.barThickness)
         .attr('width', function (data) {
            return _this.transition ? 0 : _this.xScale(data)
         })
         .attr('x', function (data) {
            return 4
         })
         .attr('y', function (data, i) {
            return (i * (_this.barThickness + _this.barOffset)) + 4;
         })

      var bars = chart.selectAll('.bars').data(this.votes)
         .enter().append('rect')
         .attr("class", "bars")
         .style("fill", function (data, i) { return _this.colors(i) })
         .attr('height', this.barThickness)
         .attr('width', function (data) {
            return _this.transition ? 0 : _this.xScale(data);
         })
         .attr('x', function (data) {
            return 0
         })
         .attr('y', function (data, i) {
            return i * (_this.barThickness + _this.barOffset);
         })

      chart.append("text")
         .attr("class", "heading")
         .style("font-size", 18 * this.scaleFactor)
         .attr("y", -40 * this.scaleFactor)
         .text(this.poll.title)

      chart.append("text")
         .attr("class", "heading")
         .style("font-size", 12 * this.scaleFactor)
         .attr("y", -14 * this.scaleFactor)
         .text(" posted by " + this.author)


      if (this.transition) {

         shadowbars.transition()
            .attr("width", function (data) {
               return _this.xScale(data)
            })
            .attr("x", function (data) {
               return 4
            })
            .delay(function (data, i) {
               return i * 20
            })
            .duration(2000)
            .ease("quad")

         bars.transition()
            .attr("width", function (data) {
               return _this.xScale(data)
            })
            .attr("x", function (data) {
               return 0
            })
            .delay(function (data, i) {
               return i * 20
            })
            .duration(2000)
            .ease("quad")
      }



   }

}