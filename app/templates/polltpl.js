module.exports = function(poll, isAuthenticated){
	
	var author = 'Unknown'

	if (poll.author && poll.author.facebook && poll.author.facebook.displayName) {
		author = poll.author.facebook.displayName;		
	}

	var addFieldBtn = (`
	<button type="button" 
			id="addField_${cssEnc(poll.title)}" 
			class="btn btn-info" 
			onclick="addField(this)">
			Add Field
	</button>
	<br>
	`)

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
		<link href="/public/css/bootswatch-journal.min.css" rel="stylesheet" type="text/css">		
		<link href="/public/css/main.css" rel="stylesheet" type="text/css">
	</head>

	<body>
	
      <div class="container">
         <h1 class="text-center" id="pollTitle">${poll.title}</h3> 
		   <h4 id="pollAuthor" class="text-center">posted by ${author}</h4>
      </div>
		<br>
		<br>
		<div class="container">
			<div id="bar-chart">
			</div>
		</div>
		<span id="errorMessage"></span>
		<div class="container fieldContainer">
         ${poll.fields.map(f => getField(f, poll.title)).join('')}
		</div>
      <br>
		${isAuthenticated ? addFieldBtn : ''}
		<br>
		<a href="/"><button class="btn btn-info">Go Back</button></a>
		<br>

		<!--  note these resources go back one directory otherwise looks from /poll/-->
		<script src="//d3js.org/d3.v3.min.js"></script>
		<script type="text/javascript" src="../common/ajax-functions.js"></script>
		<script type="text/javascript" src="../controllers/singlePollController.client.js"></script>
	</body>

</html>
`)
}

// encode spaces, question marks and exclamation marks to make compatible as css selector
function cssEnc(name) {
    return name.replace(/\s/g, "__sp__").replace(/[\?]/g, "__q__").replace(/[\!]/g, "__ex__")
}

//decodes from css compatibiliity
function cssDec(name) {
    return name.replace(/__sp__/g, " ").replace(/__q__/g, "?").replace(/__ex__/g, "!")
}