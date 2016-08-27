'use strict';

(function () {

   var displayName = document.querySelector('#display-name');
   var loginButtons = document.querySelector('#login-buttons')
   var apiUrl = appUrl + '/api/:id';

   function updateHtmlElement (data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
      var parsed = JSON.parse(data);
      var userObject
      if (parsed.facebook){
          userObject = parsed.facebook
      } else {
          userObject = parsed.local
      }
      console.log(data)
      var useName = ''
      if (userObject && userObject.displayName) {
         useName= userObject.displayName
      } else if (userObject && userObject.username) {
         useName= userObject.username
      } else if (userObject && userObject.name) {
         useName= userObject.name
      }

      if(useName != ''){
        //  updateHtmlElement(userObject, displayName, useName);
        displayName.innerHTML = useName
         if (loginButtons){
            var loginHtml = getLoggedInButtons();
            loginButtons.innerHTML = loginHtml;
         }
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