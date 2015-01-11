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

var DOMParser = require('xmldom').DOMParser;

// console.log(config);

// app.get('/', function (req, res) {
//   res.send('Hello World!')
// })


app.use("/", express.static(__dirname));

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


var notesFilter = new Evernote.NoteFilter();
notesFilter.ascending = true;
notesFilter.notebookGuid = config.BLOG_NOTEBOOK_GUID || ''; // Blog

var notesRspec = new Evernote.NotesMetadataResultSpec();
// notesRspec.includeTitle = true;
notesRspec.includeNotebookGuid = true;

app.get("/notes", function(req, res) {
    noteStore.findNotesMetadata(developerToken, notesFilter, 0, 100, notesRspec, function(err, metadata) {
        // console.log("total notes: " + JSON.stringify(metadata.notes.totalNotes));
        console.log("notes: " + JSON.stringify(metadata.notes));
        console.log("err: " + JSON.stringify(err));

        var result = [];

        for (var i = 0; i < metadata.notes.length; i++) {
            noteStore.getNote(developerToken, metadata.notes[i].guid, true, false, false, false, function(err, note) {
                    console.log("title: " + JSON.stringify(note.title));

                    result.push({
                        title: note.title,
                        // content: (new DOMParser().parseFromString(note.content)).getElementByTagName("en-note"),
                        content: /<en-note[^>]*>([\s\S]*?)<\/en-note>/.exec(note.content)[1],
                        created: note.created
                    });

                    if (result.length === metadata.notes.length) {
                        res.send(JSON.stringify(result)); 
                    }

            });

            // res.send(JSON.stringify(result)); 
        }

        // res.send(JSON.stringify(result)); 
        
    });
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});


// console.log(JSON.stringify());


// /<en-note[^>]*>([\s\S]*?)<\/en-note>/.exec(str)