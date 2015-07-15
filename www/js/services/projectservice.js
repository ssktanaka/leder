
var ledermodule = angular.module('leder.projectService', [])

ledermodule.service('ProjectService', function($q) {

    var _db;    

    // We'll need this later.
    var _projects;

    return {
        initDB: initDB,
        // We'll add these later.
        getAllProjects: getAllProjects,
        addProject: addProject,
        // updateBirthday: updateBirthday,
        deleteProject: deleteProject
    };

    function initDB() {
        // Creates the database or opens if it already exists
        _db = new PouchDB('projects', {adapter: 'websql'});
    };


    function addProject(project) {
    	console.log("posted!");

		_db.post({
		  title: project,
		  dateCreated: "",
		  dateLastModified: "",
		  notes: [],
		  quotes: []
		}).then(function (response) {
		  console.log("The project has been put");
		}).catch(function (err) {
		  console.log(err);
		});
        // return $q.when(_db.post(project));
    };

  //   function getProject(project) {
  //   	console.log("gotten!");

		// _db.allDocs({
		//   include_docs: true, 
		//   attachments: true
		// }).then(function (result) {
		//   console.log("yeahhh");
		//   console.log(result);
		// }).catch(function (err) {
		//   console.log(err);
		// });

  //   };

    // function updateproject(project) {
    //     return $q.when(_db.put(project));
    // };

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

    function onDatabaseChange(change) {
    	console.log("Database changing!");
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



