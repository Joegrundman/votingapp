
function updateVoteOnPoll(data) {
    data = JSON.parse(data)
    var votes = document.querySelector('#votes_' + data.id)
    votes.textContent = data.votes;
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

// encoding to make names css compatibl
function cssDec(name) {
    return name.replace(/__sp__/g, " ").replace(/__q__/g, "?").replace(/__ex__/g, "!")
}

function cssEnc(name) {
    return name.replace(/\s/g, "__sp__").replace(/[\?]/g, "__q__").replace(/[\!]/g, "__ex__")
}

// closes open newField inputs
function closeAnyNewField () {
    if(document.querySelector('#newFormFieldInput')){
        document.querySelector('#newFormFieldInput').outerHTML = ''
    }
}

