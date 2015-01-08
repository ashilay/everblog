var express = require('express');
var app = express();
Evernote = require('evernote').Evernote;

var config = require('./config.json');

// app.get('/', function (req, res) {
//   res.send('Hello World!')
// })


//app.use("/", express.static(__dirname));

	// var developerToken = "";
 	var developerToken = config.DEVELOPER_TOKEN;
	var client = new Evernote.Client({token: developerToken, sandbox: true});
	var nbooks = '';

	var userStore = client.getUserStore();

	userStore.checkVersion(
	  "Evernote EDAMTest (Node.js)",
	  Evernote.EDAM_VERSION_MAJOR,
	  Evernote.EDAM_VERSION_MINOR,
	  function(err, versionOk) {
	    console.log("Is my Evernote API version up to date? " + versionOk);
	    console.log();
	    if (!versionOk) {
	      process.exit(1);
	    }
	  }
	);
	 
	// Set up the NoteStore client 
	var noteStore = client.getNoteStore();
	console.log(JSON.stringify(noteStore));

	var notebooks = noteStore.listNotebooks(function(err, notebooks) {
	  console.log("Found " + notebooks.length + " notebooks:");
	  for (var i in notebooks) {
	    console.log("  * " + notebooks[i].name);
	    nbooks  = nbooks + ' ' + notebooks[i].name;
	  }
	});

	// var clientStore = client.getUserStore(function(result) {
	// 	res.send(JSON.stringify(result));
	// });


	
	 
	// Make API calls
	// noteStore.listNotebooks(function(notebooks) {
	//   for (var i in notebooks) {
	//   	nbooks ++ notebooks[i].name;
	//     console.log("Notebook: " + notebooks[i].name);
	//   }
	// });


app.get("/getNotes", function (req, res) {

	
	
    res.send(JSON.stringify(nbooks));
    // res.send("Hello World!");
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});