var newPolUrl = appUrl + '/newpoll'
var usersPollsUrl= appUrl + '/usersPolls'
var fieldsOnNewPollOptions = 2;

ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', usersPollsUrl, updatePolls))

function addFieldToOldPoll(e) {
    closeAnyNewField();
    var title = e.id.replace("addField_", "")
    var target = document.querySelector("#barchart_" + cssEnc(title))
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

function addFieldToNewPoll(){
    fieldsOnNewPollOptions++

    var newFieldTpl = (`
        <br>
        <input class="form-control fc-newpoll-option" 
            id="option${fieldsOnNewPollOptions}" 
            maxlength="28" 
            type="text" 
            placeholder="Option ${fieldsOnNewPollOptions}">    
    `)
    document.querySelector('.form-newpoll').insertAdjacentHTML('beforeend', newFieldTpl)
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
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', usersPollsUrl, updatePolls))
    closeAnyNewField();
}

// function appendNewField(data) {
//     var poll = JSON.parse(data)
//     var scaleFactor = 1.5
//     var transitioningBars = true
//     var votable = true
//     var element = document.querySelector(`#barchart_${cssEnc(poll.title)}`)
//     while(element.firstChild) {
//         element.removeChild(element.firstChild)
//     }
//     var thisPoll = new Barchart(poll, scaleFactor, transitioningBars, votable, voteFromSVG)
//     thisPoll.render();   
//     closeAnyNewField()
// }

function appendNewPoll(data) {
    document.querySelector('#poll-holder').insertAdjacentHTML('beforeend', pollTemplate(data))
    var ch = new Barchart(data)
    ch.render(data)
    var inputs = document.querySelectorAll('.fc-newpoll-option')
    document.querySelector('.fc-newpoll-title').value = ''
    inputs.forEach(function(input) { input.value = ''})
}

function closeAnyNewField () {
    if(document.querySelector('#newFormFieldInput')){
        document.querySelector('#newFormFieldInput').outerHTML = ''
    }
}

function deletePoll(e) {
    var title = e.id.replace("del_", "")
    ajaxFunctions.ajaxRequest('POST', /delPoll/ + uriEnc(title), function () {
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', usersPollsUrl, updatePolls))
    })
}

function pollTemplate (poll) {
    var title = poll.title
    var encTitle = cssEnc(title)
    var author = 'unknown'
    if(poll.author && poll.author.facebook && poll.author.facebook.displayName) {
        author = poll.author.facebook.displayName
    }

    return (
        `
        <div>
        <div id="barchart_${encTitle}"></div>
        <br>
        <div class="row">
        <div class="center-block" style="width: 26em">
        <button id="del_${encTitle}" class="btn btn-danger" onclick="deletePoll(this)">Delete <i class="ion-trash-b"></i></button>
        <button type="button" id="addField_${encTitle}" class="btn btn-info" onclick="addFieldToOldPoll(this)">Add Field <i class="ion-plus-round"></i></button>
        <button class="btn btn-warning" id="toggle_close_${encTitle}" onclick="toggleClose(this)">
            ${poll.isClosed ? "Reopen <i class=\"ion-checkmark-round\"></i>" : "Retire <i class=\"ion-close-round\"></i>"}
        </button>
        <a href="/poll/${encodeURIComponent(cssDec(encTitle))}" style="text-decoration: none">
            <button class="btn btn-primary">Go to Poll <i class="ion-arrow-right-a"></i></button>
        </a>
        </div>
        </div>
        </div>
        <br>
        <br>
        `
    )
}

function submitNewPoll(){
    var inputs = document.querySelectorAll('.fc-newpoll-option')
    var abort = false;
    var polltitle = document.querySelector('.fc-newpoll-title').value
    if (!polltitle || polltitle == '') {abort = true}
    var payload = {
        polltitle: polltitle
    }
    inputs.forEach(function(input, index) {
        if (!input.value || input.value == '')  {abort = true}
        payload["option" + (index + 1)] = input.value
    })

    if(abort) {return}
    payload = JSON.stringify(payload)

    ajaxFunctions.ajaxByObj({
        method: 'POST',
        url: '/newpoll',
        contentType: 'application/json',
        success: appendNewPoll,
        error: function(err){console.log('error', err)},
        payload: payload
    })
}

function toggleClose(e) {
    var title = e.id.replace("toggle_close_", "")
    // optimistically change value
    var btnBefore = document.querySelector(`#${e.id}`)
        if (btnBefore.value == "Retire"){ btn.textContent = "Reopen" }
        else { btnBefore.textContent = "Retire" }    
    ajaxFunctions.ajaxRequest('POST', /toggleClosePoll/ + encodeURIComponent(cssDec(title)), function (msg) {
        // this will make sure value matches server value
        msg = JSON.parse(msg)
        var btn = document.querySelector(`#toggle_close_${cssEnc(msg.poll)}`)
        if (msg.isClosed){ btn.innerHTML = "Reopen <i class=\"ion-checkmark-round\"></i>" }
        else { btn.innerHTML = "Retire <i class=\"ion-close-round\"></i>" }

    })  
}

function updatePolls(data) {
    var pollsObject = JSON.parse(data).reverse();
    var pollsHtml = pollsObject.map(function (p) { return pollTemplate(p) }).join('')
    document.querySelector('#poll-holder').innerHTML = pollsHtml;
    pollsObject.forEach(function(p){
        var ch = new Barchart(p)
        ch.render()
    })

}
