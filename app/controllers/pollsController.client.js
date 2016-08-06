var newPolUrl = appUrl + '/newpoll'
var allPollsUrl = appUrl + '/allpolls'

ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', allPollsUrl, updatePolls))

function updatePolls(data) {
    var pollsObject = JSON.parse(data);

    var fieldTemplate = function (field, pollTitle) {
        var thisPollUrl = cssDec(pollTitle) + "/" + field._id
        return (`
           <div>
               <h4 id="">${field.name}: <span id="votes_${field._id}">${field.votes} </span>
           </div>
           `)
    }

    var pollTemplate = function (poll) {
        var title = poll.title
        var encTitle = cssEnc(title)
        var author = 'unknown'
        if(poll.author && poll.author.facebook && poll.author.facebook.displayName) {
            author = poll.author.facebook.displayName
        }
        // convert fields array into template string
        var fields = poll.fields.reduce(function (tpl, curField) {
            return tpl += fieldTemplate(curField, poll.title)
        }, '')

        return (`
         <div>
            <div id="barchart_${encTitle}"></div>
            <br>
            <a href="/poll/${encodeURIComponent(cssDec(encTitle))}" style="text-decoration: none">
            <button class="btn btn-primary btn-large center-block">Go to Poll</button>
            </a>
         </div>
         <br>
         <br>
         `)
    }


    var pollsHtml = pollsObject.map(function (p) { return pollTemplate(p) }).join('')
      
    
   // Attach generated html to Index.html   
    document.querySelector('#poll-holder').innerHTML = pollsHtml;

    // import from common/barcharts.js
    pollsObject.forEach(function(p){
        drawBarchart(p)
    })
}

// encode spaces, question marks and exclamation marks to make compatible as css selector
function cssEnc(name) {
    if(!name) { return }
    return name.replace(/\s/g, "__sp__").replace(/[\?]/g, "__q__").replace(/[\!]/g, "__ex__")
}

//decodes from css compatibiliity
function cssDec(name) {
    if(!name) {return}
    return name.replace(/__sp__/g, " ").replace(/__q__/g, "?").replace(/__ex__/g, "!")
}


