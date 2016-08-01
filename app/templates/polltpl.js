module.exports = function(poll){
	
	var author = 'Unknown'
	if(poll.author && poll.author.github && poll.author.github.displayName) {
		author = poll.author.github.displayName;
	}

   function getField(field, pollTitle) {
		var thisPollUrl = cssEnc(pollTitle) + "/" + field._id;
      return (`
   	<div>
         <h4>${field.name }: <span id="votes_${field._id}">${field.votes}</span></h4>
			<button id="${thisPollUrl}" class="btn-vote" onclick="upVote(this)">Vote</button>
      </div>
   `)
   }

   var fields = poll.fields.map(f => getField(f, poll.title))

   return (`
<!DOCTYPE html>

<html>

	<head>
		<title>Clementine.js - The elegant and lightweight full stack JavaScript boilerplate.</title>
		<link href="/public/css/bootswatch-journal.min.css" rel="stylesheet" type="text/css">		
		<link href="/public/css/main.css" rel="stylesheet" type="text/css">
	</head>

	<body>

		<div class="container">
         <h1>Individual Poll Page</h1>
		</div>		
      <div class="container">
         <h3 id="pollTitle">${poll.title}</h3> by <span id="pollAuthor">${author}</span>
      </div>
		<div class="fieldContainer">
         ${fields}
		</div>
      <br>
		<button type="button" id="addField_${cssEnc(poll.title)}" class="btn btn-info" onclick="addField(this)">Add Field</button>
		<br>
		<br>
		<a href="/"><button class="btn btn-info">Go Back</button></a>

		<!--  note these resources go back one directory otherwise looks from /poll/-->
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