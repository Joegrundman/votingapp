var selectedOption = ''
var selectedIndex = null;
var thisPoll;

//variables defined for clarity in ajaxRequest

var title = document.querySelector('#pollTitle').textContent;
var getPollUrl = '/polldata/' + encodeURIComponent(title)
var scaleFactor = 1.5
var transitioningBars = true
var votable = true

ajaxFunctions.ajaxRequest('get', getPollUrl, function(poll) {
    poll = JSON.parse(poll)
    thisPoll = new Barchart(poll, scaleFactor, transitioningBars, votable, voteFromSVG)
    thisPoll.render(); 
})

function addField(e) {
    closeAnyNewField();
    var title = e.id.replace("addField_", "")
    var target = document.querySelector("#barchart_" + title)
    var tpl = `
    <br>
    <div id="newFormFieldInput" class="panel pnl-newpoll">
    <div class="form-group form-newpoll">
        <input id="newFieldOption" name="newOption" type="text" class="form-control" placeholder="New option">
        <br>
        <button type="button" id="ajaxNewField_${title}" class="btn btn-success" onclick="ajaxNewField(this)">Submit <i class="ion-checkmark-round"></i></button>
        <button type="button" class="btn btn-warning" onclick="closeAnyNewField()">Cancel <i class="ion-close-round"></i></button>
    </div>
    </div>
    `
    target.insertAdjacentHTML('afterend', tpl)
}

function ajaxNewField(e) {
    var title = cssDec(e.id.replace("ajaxNewField_", ""))
    var newField = document.querySelector('#newFieldOption').value;
    ajaxFunctions.ajaxRequest('post', `/addField/${encodeURIComponent(title)}/${encodeURIComponent(newField)}`,
     function (data) {
        data = JSON.parse(data)
        appendNewField(data)
    })
}

function appendNewField(data) {
    var poll = JSON.parse(data)
    var scaleFactor = 1.5
    var transitioningBars = true
    var votable = true
    var d = document.querySelector(`#barchart_${cssEnc(poll.title)}`)
    var s = document.querySelector('.chart')
    d.removeChild(s)
    var thisPoll = new Barchart(poll, scaleFactor, transitioningBars, votable, voteFromSVG)
    thisPoll.render();   
    closeAnyNewField()
}

function closeAnyNewField() {
    if (document.querySelector('#newFormFieldInput')) {
        document.querySelector('#newFormFieldInput').outerHTML = ''
    }
}

function voteFromSVG (selectedOption) {
    if(!selectedOption) { return }
    var poll = encodeURIComponent(document.querySelector('#pollTitle').textContent)
    var url = `/vote/${poll}/${encodeURIComponent(thisPoll.selectedOption)}`
    function errorTpl (tplMsg){
        return( `
        <div class="alert alert-dismissible alert-danger">
        ${tplMsg}
        </div>  
    `)}
    ajaxFunctions.ajaxRequest('GET', url,
        function success(data) {
            data = JSON.parse(data);
            thisPoll.updateChartOnVote(data)
        },
        function error(err) {
            err = JSON.parse(err)
            document.querySelector("#errorMessage").innerHTML = errorTpl(err.msg)
        });
}
