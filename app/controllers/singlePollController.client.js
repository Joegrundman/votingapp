var selectedOption = ''

function updateVoteOnPoll(data) {
    data = JSON.parse(data)
    var votes = document.querySelector('#votes_' + data.id)
    votes.textContent = data.votes;
    updateBarChart(data)
}

function upVote(e) {
    var urlParts = e.id.split('/')
    var poll = encodeURIComponent(cssDec(urlParts[0]))
    var url = `/vote/${poll}/${urlParts[1]}`
    ajaxFunctions.ajaxRequest('GET', url,
        function success(doc) {
            var docObj = JSON.parse(doc);
            updateVoteOnPoll(docObj)
        },
        function error(err) {
            err = JSON.parse(err)
            document.querySelector("#errorMessage").innerHTML = err.msg
        });
}

function voteFromSVG () {
    if(selectedOption == '') { return }
    var poll = encodeURIComponent(document.querySelector('#pollTitle').textContent)
    var url = `/vote/${poll}/${encodeURIComponent(selectedOption)}`
    console.log(url)
    ajaxFunctions.ajaxRequest('GET', url,
        function success(doc) {
            var docObj = JSON.parse(doc);
            updateVoteOnPoll(docObj)
        },
        function error(err) {
            err = JSON.parse(err)
            document.querySelector("#errorMessage").innerHTML = err.msg
        });

}

function addField(e) {
    closeAnyNewField();
    var title = e.id.replace("addField_", "")
    var btn = document.querySelector("#" + cssEnc(e.id))
    var tpl = `
    <div id="newFormFieldInput" class="form-group">
        <input id="newFieldOption" name="newOption" type="text" class="form-control" placeholder="New option">
        <button type="button" id="ajaxNewField_${title}" class="btn btn-info" onclick="ajaxNewField(this)">Submit</button>
    </div>
    `
    btn.insertAdjacentHTML('afterend', tpl)
}

function ajaxNewField(e) {
    var title = cssDec(e.id.replace("ajaxNewField_", ""))
    var newField = document.querySelector('#newFieldOption').value;
    ajaxFunctions.ajaxRequest('post', `/addField/${encodeURIComponent(title)}/${encodeURIComponent(newField)}`, function (data) {
        data = JSON.parse(data)
        appendNewField(data)
    })
}

function appendNewField(data) {
    data = JSON.parse(data)
    var title = cssEnc(data.title)
    var field = data.newField
    var thisPollUrl = title + "/" + field._id
    var nfTemplate = (`
           <div>
               <h4>${field.name}: <span id="votes_${field._id}">${field.votes} </span>
               </h4> <button id="${thisPollUrl}" class="btn-vote" onclick="upVote(this)">Vote</button>
           </div>
         `)
    var fieldsDiv = document.querySelector('.fieldContainer')
    fieldsDiv.insertAdjacentHTML('beforeend', nfTemplate)
    // remove newfield input
    closeAnyNewField();
}

// closes open newField inputs
function closeAnyNewField() {
    if (document.querySelector('#newFormFieldInput')) {
        document.querySelector('#newFormFieldInput').outerHTML = ''
    }
}

function updateBarChart (field, vote) {
// TODO: updateBarChart
}

var title = document.querySelector('#pollTitle').textContent;
var getPollUrl = '/polldata/' + title

var polldata = ajaxFunctions.ajaxRequest('get', getPollUrl, function (data) {
    var fields = JSON.parse(data).fields
    var names = fields.map(f => f.name)
    var votes = fields.map(f => f.votes)

    var margin = { top: 30, right: 20, bottom: 60, left: 240 }
    var width = 860 - margin.left - margin.right;
    var barThickness = 30;
    var barOffset = 15;
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

    var chart = d3.select('#bar-chart').append("svg")
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

    var sideButtons = chart.selectAll('.side-buttons').data(names)
        .enter().append('rect')
        .attr("class", "side-buttons")
        .attr("height", barThickness + barOffset -2)
        .attr("width", margin.left)
        .attr("x", -margin.left)
        .attr("y", function (data, i) {
            return (i * (barThickness + barOffset))
        })
        .on('click', function (d, i){
            d3.selectAll('.side-buttons')
                .classed( "clicked-side-button", false)

            d3.select(this)
                .classed("clicked-side-button", true)

            selectedOption = d
        })


    var shadowbars = chart.selectAll('.shadowbars').data(votes)
        .enter().append('rect')
        .attr("class", "shadowbars")
        .style("fill", "#c3c3c3")
        .attr('height', barThickness)
        .attr('width', function (data) {
            return 0;
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
            return 0;
        })
        .attr('x', function (data) {
            return 0
        })
        .attr('y', function (data, i) {
            return i * (barThickness + barOffset);
        })

 // transitions

shadowbars.transition()
        .attr("width", function (data) {
            return xScale(data)
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
            return xScale(data)
        })
        .attr("x", function (data) {
            return 0
        })
        .delay(function (data, i) {
            return i * 20
        })
        .duration(2000)
       .ease("quad")

    // vote button
var svgVoteBtn = chart.append('rect')
        .attr("class", "svg-vote-btn")
        .attr("height", 40)
        .attr("width", 65)
        .attr("x", -200)
        .attr("y", height + 5)
        .on("click", voteFromSVG)

  chart.append("text")
        .attr("class", "svg-btn-text")
        .attr("x", -168)
        .attr("y", height + 29)
        .text("Vote")
 


})