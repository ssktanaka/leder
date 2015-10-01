
var ledermodule = angular.module('leder.projectService', [])

ledermodule.service('ProjectService', function($q) {

    var _db;    

    // We'll need this later.
    var _projects;

    var project;

    return {
        initDB: initDB,

        // We'll add these later.
        getAllProjects: getAllProjects,
        getProject: getProject,
        addProject: addProject,
        updateProjectObject: updateProjectObject,
        updateProjectObjectWithQuotes: updateProjectObjectWithQuotes,

        // updateBirthday: updateBirthday,
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


    function updateProjectObject(projectID, noteArray) {
        //update project object with new note array
        return _db.get(projectID)
        .then(function(doc) {
            doc.notes = noteArray;
            //update last date modified
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



