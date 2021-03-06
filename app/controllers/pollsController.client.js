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
            <a href="/poll/${encodeURIComponent(cssDec(encTitle))}" style="text-decoration: none">
            <button class="btn btn-primary btn-gotopoll center-block">Go to Poll <i class="ion-arrow-right-a"></i></button>
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
        // barchartFunctions.drawBarchart(p)
        var ch = new Barchart(p)
        ch.render()
    })
}

// function showSignup() {
//     if (document.querySelector("#signup-panel")) {
//         document.querySelector("#login-form-holder").innerHTML = ""        
//     } else {
//         var signupTpl = drawSignupTemplate()
//         document.querySelector("#login-form-holder").innerHTML = signupTpl
//     }
// }

// function showLogin() {
//     if (document.querySelector("#login-panel")) {
//         document.querySelector("#login-form-holder").innerHTML = ""        
//     } else {
//         var loginTpl = drawLoginTemplate()
//         document.querySelector("#login-form-holder").innerHTML = loginTpl
//     }
// }