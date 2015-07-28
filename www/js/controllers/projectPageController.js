angular.module('leder.projectPageController', [])


.controller('ProjectPageCtrl', function($scope, $stateParams, EvernoteOAuth, $ionicPopup, $timeout, $state, $ionicModal, ProjectService, Quotes) {

    // $state.go('app.projectSources', { ProjectId: $stateParams.ProjectId});
  //get current project
  ProjectService.getProject($stateParams.ProjectId).then(function(project) {
    $scope.project = project;
  });

  $scope.checkLogin = function() {
	//check if loggedin
	if (EvernoteOAuth.checkLogin()){
    //get project ID and set in url

    //open source note modal
    $scope.sourceNoteModal.show();
       EvernoteOAuth.getAllNoteTitles(function(error, notetitles) {
        //populate page with source notes
        $scope.sourceNotes = notetitles;
        //update sources.html to fill page
        $scope.$apply($scope.sourceNotes);

       });
    	} else {
        //remind users that htey need to log into evernote
    		$scope.showAlert();
    	}
  };

  // Create the edit note modal that we will use later
  $ionicModal.fromTemplateUrl('templates/sources.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then(function(modal) {
    $scope.sourceNoteModal = modal;
  });



  //function save source notes is called when user clicks "import notes"
  $scope.saveSourceNotes = function() {
    //get current state of project notes
    var sourceArray = $scope.project.notes;

    for (var i=0; i < $scope.sourceNotes.length; i++) {
      //if the "touched" attribute of the div is true
      if ($scope.sourceNotes[i].touched) {
        //add last date modified in 'updated' field
        $scope.sourceNotes[i].updated = new Date();
        console.log($scope.sourceNotes[i]);
        sourceArray.push($scope.sourceNotes[i]);
      } else {
        //do nothing
      }
    };

    //update project object with cnew source array
    ProjectService.updateProjectObject($stateParams.ProjectId, sourceArray)
    .then(function(updatedProject){$scope.project = updatedProject});
 
    //close note modal and clear highlighting
    $scope.closeSourceNote(); 
  }

  //clear highlighting so list is fresh again
  $scope.closeSourceNote = function() {
    $scope.sourceNoteModal.hide();
    for (var i=0; i < $scope.sourceNotes.length; i++) {
      //if the "touched" attribute of the div is true
      if ($scope.sourceNotes[i].touched) {
        $scope.sourceNotes[i].touched = false;
      } else {
        //do nothing
      }
    };
  };

  $scope.deleteNote = function(note){

    for (var i = 0; i<$scope.project.notes.length; i++) {
      //iterate through note array of the project.
      //if note GUID matches the guid of ith element of the array, remove it
      if (note.guid == $scope.project.notes[i].guid) {
        $scope.project.notes.splice(i, 1);
      } else {
        //do nothing
      }
    }
    //update project object with new array
    ProjectService.updateProjectObject($stateParams.ProjectId, $scope.project.notes);
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.sourceNoteModal.remove();
  });

  // Execute action on hide modal
  $scope.$on('sourceNoteModal.hidden', function() {
    // Execute action
  });

  // Execute action on remove modal
  $scope.$on('sourceNoteModal.removed', function() {
    // Execute action
  });


 $scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Need Evernote Access',
     template: 'Leder needs access to your Evernote account in order to add notes. Login using the lefthand menu.'
   });
   alertPopup.then(function(res) {
     console.log('Failed');
   });
 };


})