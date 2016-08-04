var newPolUrl = appUrl + '/newpoll'
var usersPollsUrl= appUrl + '/usersPolls'

ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', usersPollsUrl, updatePolls))

function updatePolls(data) {
    var pollsObject = JSON.parse(data);

    var fieldTemplate = function (field, pollTitle) {
        var thisPollUrl = cssDec(pollTitle) + "/" + field._id
        return (
           `
           <div>
               <h4 id="">${field.name}: <span id="votes${field._id}">${field.votes} </span>
           </div>
           `
        )
    }

    var pollTemplate = function (poll) {
        var title = poll.title
        var encTitle = cssEnc(title)
        var author = 'unknown'
        if(poll.author && poll.author.facebook && poll.author.facebook.displayName) {
            author = poll.author.facebook.displayName
        }
        var fields = poll.fields.reduce(function (acc, cur) {
            return acc += fieldTemplate(cur, poll.title)
        }, '')

        return (
            `
         <div>
            <h3>${title}</h3> by ${author}
            <div id="fieldContainer_${encTitle}">
                ${fields}
            </div>
            <br>
            <button id="del_${encTitle}" onclick="deletePoll(this)">Delete</button>
            <button type="button" id="addField_${encTitle}" class="btn btn-info" onclick="addField(this)">Add Field</button>
         </div>
         <br>
         <br>
         `
        )
    }
    var pollsHtml = pollsObject.map(function (p) { return pollTemplate(p) }).join('')
    document.querySelector('#poll-holder').innerHTML = pollsHtml;
}

function deletePoll(e) {
    var title = e.id.replace("del_", "")
    ajaxFunctions.ajaxRequest('POST', /delPoll/ + cssEnc(title), function () {
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', allPollsUrl, updatePolls))
    })
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
               <h4 id="">${field.name}: <span id="votes${field._id}">${field.votes} </span>
               </h4> <button id="${thisPollUrl}" class="btn-vote" onclick="upVote(this)">Vote</button>
           </div>
         `)
    var fieldsDiv = document.querySelector('#fieldContainer_' + cssEnc(title))
    fieldsDiv.insertAdjacentHTML('beforeend', nfTemplate)
    // remove newfield input
    closeAnyNewField();
}

// encode spaces, question marks and exclamation marks to make compatible as css selector
function cssEnc(name) {
    return name.replace(/\s/g, "__sp__").replace(/[\?]/g, "__q__").replace(/[\!]/g, "__ex__")
}

//decodes from css compatibiliity
function cssDec(name) {
    return name.replace(/__sp__/g, " ").replace(/__q__/g, "?").replace(/__ex__/g, "!")
}

// close any open newfield inputs
function closeAnyNewField () {
    if(document.querySelector('#newFormFieldInput')){
        document.querySelector('#newFormFieldInput').outerHTML = ''
    }
}