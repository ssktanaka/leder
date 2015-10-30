
var ledermodule = angular.module('leder.projectService', [])

ledermodule.service('ProjectService', function($q) {

    var _db;    

    var _projects;

    var project;

    return {
        initDB: initDB,
        getAllProjects: getAllProjects,
        getProject: getProject,
        addProject: addProject,
        addFirstProject: addFirstProject,
        updateProjectObject: updateProjectObject,
        updateProjectObjectWithQuotes: updateProjectObjectWithQuotes,
        deleteProject: deleteProject
    };

    function initDB() {
        // Creates the database or opens if it already exists
        _db = new PouchDB('projects', {adapter: 'websql'});
    };


    function addProject(project) {

		_db.post({
		  title: project,
		  dateCreated: new Date(),
    	  dateLastModified: new Date(),
		  notes: [],
		  quotes: []
		}).then(function (response) {
		  console.log("The project has been put");
		}).catch(function (err) {
		  console.log(err);
		});
    };

    //create sample notes!
    //I'm a note!
    //I'm a note, too.
    //Here you can import notes from your Evernote account
    //You can edit each note by selecting it
    //For now, click on any of these sample notes to try it out. 
    function addFirstProject(project) {

        _db.post({
          title: project,
          dateCreated: new Date(),
          dateLastModified: new Date(),
          notes: [
                    {
                        title: "These are notes.",
                        guid: "SAMPLENOTE"
                    },
                    {
                        title: "Tap a note to get started.",
                        guid: "SAMPLENOTE"
                    },
                    {
                        title: "(Usually, notes are copies",
                        guid: "SAMPLENOTE"
                    },
                    {
                        title: "of your Evernote notes.",
                        guid: "SAMPLENOTE"
                    },
                    {
                        title: "You can import more",
                        guid: "SAMPLENOTE"
                    },
                    {
                        title: "by tapping 'Add Notes')",
                        guid: "SAMPLENOTE"
                    }
          ],
          quotes: [
                    {
                        source: "Nice job! All of your previously highlighted quotes should be in here.",
                        text: "If you don't see any of your quotes, go back to the previous page and choose a sample note to highlight. Don't forget to 'Save' your quotes!",
                        flagged: false
                    },
                    {
                        source: "Step 1: Rearrange Your Quotes",
                        text: "Touch the three-bar icon on the right and drag the quote to the appropriate spot.",
                        flagged: false
                    },
                    {
                        source: "Step 2: Customize Your Quotes",
                        text: "Touch and hold the three-bar icon to bring up options, like flagging the quote, renaming the title, and copying the text.",
                        flagged: false
                    },
                    {
                        source: "Step 3: Delete Quotes",
                        text: "Delete a quote from the outline by hitting the 'Edit' button below. Press 'Done' to return to the default view.",
                        flagged: false
                    },
                    {
                        source: "Step 4: Add a Custom Quote",
                        text: "Add your own quote by touching the compose icon above.",
                        flagged: false
                    },
                    {
                        source: "Step 5: Export Your Outline",
                        text: "Once you are happy with your outline, tap the upload icon above to export your outline.",
                        flagged: false
                    },

          ]
        }).then(function (response) {
          console.log("The project has been put");
        }).catch(function (err) {
          console.log(err);
        });
    };


    function updateProjectObject(projectID, noteArray) {
        //update project object with new note array
        return _db.get(projectID)
        .then(function(doc) {
            doc.notes = noteArray;
            //update last date modified
            console.log(doc);
            doc.dateLastModified = new Date();
            return _db.put(doc);
        }).then(function(response) {
          console.log("NoteArray has been updated!");
          return _db.get(projectID);
        }).catch(function (err) {
          console.log(err);
        });
    };

    function updateProjectObjectWithQuotes(projectid, noteguid, quoteArray) {
        //update project object with new note array
        return _db.get(projectid)
        .then(function(doc) {
            doc.quotes = quoteArray;
            //update last date modified
            doc.dateLastModified = new Date();
            //update note's date last modified
            if (noteguid !== undefined){
                for (var i = 0; i < doc.notes.length; i++){
                    if (doc.notes[i].guid == noteguid) {
                        doc.notes[i].updated = new Date();
                    }
                }
            }
            return _db.put(doc);
        }).then(function(response) {
          console.log("quoteArray has been updated!");
          return _db.get(projectid);
        }).catch(function (err) {
          console.log(err);
        });
    };


    function deleteProject(project) {
        return $q.when(_db.remove(project));
    };

    function getAllProjects() {

        if (!_projects) {
            return $q.when(_db.allDocs({ include_docs: true}))
                      .then(function(docs) {

                        // Each row has a .doc object and we just want to send an 
                        // array of birthday objects back to the calling controller,
                        // so let's map the array to contain just the .doc objects.
                        _projects = docs.rows.map(function(row) {
                            // Dates are not automatically converted from a string.
                            row.doc.Date = new Date(row.doc.Date);
                            return row.doc;
                        });

                        // Listen for changes on the database.
                        _db.changes({ live: true, since: 'now', include_docs: true})
                           .on('change', onDatabaseChange);

                       return _projects;
                     });
        } else {
            // Return cached data as a promise
            return $q.when(_projects);
        }
    };

    function getProject(projectID) {
        return _db.get(projectID);
    };

    function onDatabaseChange(change) {
        var index = findIndex(_projects, change.id);
        var project = _projects[index];

        if (change.deleted) {
            if (project) {
                _projects.splice(index, 1); // delete
            }
        } else {
            if (project && project._id === change.id) {
                _projects[index] = change.doc; // update
            } else {
                _projects.splice(index, 0, change.doc) // insert
            }
        }
        //refresh project screen
        getAllProjects();
    }
    
    function findIndex(array, id) {
      var low = 0, high = array.length, mid;
      while (low < high) {
        mid = (low + high) >>> 1;
        array[mid]._id < id ? low = mid + 1 : high = mid
      }
      return low;
    }



});



