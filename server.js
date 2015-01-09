var express,
    fs,
    app,
    config,
    developerToken,
    client,
    userStore,
    noteStore;

express = require('express');
app = express();
fs = require('fs');
Evernote = require('evernote').Evernote;
config = JSON.parse(fs.readFileSync('config.json'));
// console.log(config);

// app.get('/', function (req, res) {
//   res.send('Hello World!')
// })


//app.use("/", express.static(__dirname));

developerToken = config.DEVELOPER_TOKEN;
client = new Evernote.Client({
    token: developerToken,
    sandbox: true
});


userStore = client.getUserStore();

// userStore.checkVersion(
//   "Evernote EDAMTest (Node.js)",
//   Evernote.EDAM_VERSION_MAJOR,
//   Evernote.EDAM_VERSION_MINOR,
//   function(err, versionOk) {
//     console.log("Is my Evernote API version up to date? " + versionOk);
//     console.log();
//     if (!versionOk) {
//       process.exit(1);
//     }
//   }
// );

// Set up the NoteStore client 
noteStore = client.getNoteStore();

app.get("/notebooks", function(req, res) {
    var nbooks = '';
    var notebooks = noteStore.listNotebooks(function(err, notebooks) {
        console.log("Found " + notebooks.length + " notebooks:");
        for (var i in notebooks) {
            console.log("  * " + notebooks[i].name);
            console.log("  * " + notebooks[i].guid);
            nbooks = nbooks + " {NAME: " + notebooks[i].name + ", GUID: " + notebooks[i].guid + "} ";
        }

        res.send(JSON.stringify(nbooks));
    });
});


app.get("/", function(req, res) {
    var filter = new Evernote.NoteFilter();
    filter.ascending = true;
    filter.notebookGuid = config.BLOG_NOTEBOOK_GUID || ''; // Blog

    var rspec = new Evernote.NotesMetadataResultSpec();
    rspec.includeTitle = true;
    rspec.includeNotebookGuid = true;

    noteStore.findNotesMetadata(developerToken, filter, 0, 100, rspec, function(err, data) {
        console.log("data: " + JSON.stringify(data));
        console.log("err: " + JSON.stringify(err));

        res.send(JSON.stringify(data));
    });
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});


// console.log(JSON.stringify());
