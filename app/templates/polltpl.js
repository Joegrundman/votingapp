module.exports = function(poll, isAuthenticated){
	
	var author = 'Unknown'

	if (poll.author && poll.author.facebook && poll.author.facebook.displayName) {
		author = poll.author.facebook.displayName;		
	}

	var addFieldBtn = (`
	<div class="container">
		<div class="row">
			<button type="button" 
					id="addField_${cssEnc(poll.title)}" 
					class="btn btn-info center-block" 
					onclick="addField(this)">
					Add Option <i class="ion-plus-round"></i>
			</button>
		</div>
	</div>
	<br>
	`)

	function getLogin() {
		return (`
		<div class="row">
				<h4 class="text-center" id="login-header" style="color: white">To make your own polls,or modify existing polls, Log In</h4>
				<br>
				<a href="/"><div class="btn btn-info">Go Back <i class="ion-arrow-left-a"></i></div></a>
				<a href="/auth/facebook" style="text-decoration: none">
					<div class="btn facebook" id="login-btn">
						Login with Facebook  <i class="ion-social-facebook"></i>
					</div>
				</a>
				<button class="btn btn-success" id="email-login-button" onclick="showLogin()">Log In <i class="ion-log-in"></i></button>
				<button class="btn btn-default" id="email-signup-button" onclick="showSignup()">Sign Up <i class="ion-person-add"></i></button>
				
		</div>	
		`)
	}

	function getLogout() {
		return (`
	         <div class="row">
            <h4 class="text-center" id="login-header" style="color: white">Make new polls from My Polls</h4>
               <br>
					<a href="/">
						<button class="btn btn-info">Go Back <i class="ion-arrow-left-a"></i></button>
					</a>
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

   function getField(field, pollTitle) {
		var thisPollUrl = cssEnc(pollTitle) + "/" + field._id;
      return (`
   	<div>
         <span>${field.name }: <span id="votes_${field._id}">${field.votes}</span></span>
			<button id="${thisPollUrl}" class="btn btn-primary btn-vote" onclick="upVote(this)">Vote</button>
      </div>
   `)
   }

   return (`
<!DOCTYPE html>

<html>

	<head>
		<title>rs-votemaster</title>
		<link href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet" type="text/css">
		<link href="/public/css/bootswatch-journal.min.css" rel="stylesheet" type="text/css">		
		<link href="/public/css/main.css" rel="stylesheet" type="text/css">
	</head>

	<body>
		<nav class="navbar navbar-default">
			<div class="container-fluid">
				<div class="navbar-header">
					<a class="navbar-brand" href="/">VoteMaster</a>
				</div>
				<h3 class="pull-right">${poll.title} </h3>
			</div>
		</nav>
		<!-- do not delete this line. this is a hook for passing the name of the poll to the client for d3 and ajax to pick up -->
		<div id="pollTitle" style="display: none">${poll.title}</div>
		<div class="container main-controls">	
			<div class="login" id="login-buttons">
				${isAuthenticated ? getLogout() : getLogin()}
			</div>
		</div>
		<div id="login-form-holder"></div>
		<br>
		<div class="bc-container">
			<div id="barchart_${cssEnc(poll.title)}">
			</div>
		</div>
		<span id="errorMessage"></span>

      <br>

		${isAuthenticated ? addFieldBtn : ''}


		<!--  note these resources go back one directory otherwise looks from /poll/-->
		<script src="//d3js.org/d3.v3.min.js"></script>
		<script type="text/javascript" src="../common/encoding.js"></script>
		<script type="text/javascript" src="../common/ajax-functions.js"></script>
		<script type="text/javascript" src="../common/barchart.js"></script>
		<script type="text/javascript" src="../common/login-signup.js"></script>
		<script type="text/javascript" src="../controllers/singlePollController.client.js"></script>
	</body>

</html>
`)
}
// encodes into css compatibiliity
function cssEnc(name) {
    if(!name) {return}
    return name.replace(/\s/g, "__sp__").replace(/'/g, "__apos__").replace(/,/g, "__comma__").replace(/\./g, "__stop__").replace(/[\?]/g, "__q__").replace(/[\!]/g, "__ex__")
}

//decodes from css compatibiliity
function cssDec(name) {
    if(!name) {return}
    return name.replace(/__sp__/g, " ").replace(/__apos__/, "'").replace(/__comma__/, ",").replace(/__stop__/, ".").replace(/__q__/g, "?").replace(/__ex__/g, "!")
}