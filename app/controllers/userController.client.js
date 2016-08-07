'use strict';

(function () {

   var profileId = document.querySelector('#profile-id') || null;
   var profileUsername = document.querySelector('#profile-username') || null;
   var profileRepos = document.querySelector('#profile-repos') || null;
   var displayName = document.querySelector('#display-name');
   var loginButtons = document.querySelector('#login-buttons')
   var apiUrl = appUrl + '/api/:id';

   function updateHtmlElement (data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
      var userObject = JSON.parse(data);
      var useName = ''
      if (userObject.displayName) {
         useName= 'displayName'
      } else if (userObject.username) {
         useName= 'userName'
      } else if (userObject.name) {
         useName= 'name'
      }

      if(useName != ''){
         updateHtmlElement(userObject, displayName, useName);
         if (loginButtons){
            var loginHtml = getLoggedInButtons();
            loginButtons.innerHTML = loginHtml;
         }
      }

      if (profileId !== null) {
         updateHtmlElement(userObject, profileId, 'id');   
      }

      if (profileUsername !== null) {
         updateHtmlElement(userObject, profileUsername, 'username');   
      }

      if (profileRepos !== null) {
         updateHtmlElement(userObject, profileRepos, 'publicRepos');   
      }

   }));
})();

function getLoggedInButtons() {
   return (`
            <div class="row">
            <h4 class="text-center" id="login-header" style="color: white">Make new polls from My Polls</h4>
               <br>
               <a href="/logout" style="text-decoration: none">
                  <div class="btn btn-default" id="logout-btn">
                     Logout  <i class="ion-log-out"></i>
                  </div>
               </a>
               <a href="/profile" style="text-decoration: none">
                  <div class="btn btn-success" id="mypolls-btn">
                     My Polls  <i class="ion-ios-paper"></i>
                  </div>
               </a>
		</div>
   `)
}