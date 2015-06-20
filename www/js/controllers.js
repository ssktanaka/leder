angular.module('leder.controllers', [])

.directive('detectGestures', function($ionicGesture) {
  return {
    restrict :  'A',

    link : function(scope, elem, attrs) {
      $ionicGesture.on('touch', scope.getHTMLObject, elem);
      $ionicGesture.on('release', scope.onRelease, elem);
    }
  }
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout, Notes, $stateParams) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };


  // Create the edit note modal that we will use later
  $ionicModal.fromTemplateUrl('templates/editnote.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.editModal = modal;
  });

  //open edit model to edit notes
  $scope.editNote = function(noteID) {
    $scope.editModal.show();

    //populate edit screen with source text
    $scope.noteText = Notes.getNoteText(noteID); 

    // parse source text into array 
    $scope.noteText = $scope.parseNoteText($scope.noteText);
  };


  //function to split string for display
  $scope.parseNoteText = function(noteText) {
    //split the string into individual words
    var noteText = noteText.split(" ");

    //empty array to hold my word objects
    $scope.words = [];

    //function to loop through string array and create an array of objects
    for (var i = 0; i < noteText.length; i++) {
      var obj = {};
      obj.text = noteText[i];
      obj.isHighlighted = false; 
      obj.id = i;
      $scope.words.push(obj);
    }
    return $scope.words;
  };

//highlighting function

  //set two variables for first and last word IDs
  var firstWordID = null;
  var lastWordID = null;
  

 //function to set first and last word IDs
  $scope.onDrag = function dragTest(htmlID) {
    if (!firstWordID) {
      firstWordID = htmlID;
      console.log(firstWordID + ", the first word has been tagged");
    }
    lastWordID = htmlID;
    console.log(lastWordID + ", the last word has been tagged");

    //iterate through object array.
    for (var i = 0; i < $scope.words.length; i++){
      //if current element is greater than first word ID and less than last word ID, then change isHighlighted to true
      if ($scope.words[i].id >= firstWordID && $scope.words[i].id <= lastWordID){
        $scope.words[i].isHighlighted = true;
        console.log($scope.words[i].isHighlighted);
      } 
    };

  };



  $scope.getHTMLObject = function htmlTest(e){
    e.preventDefault(); 

    var htmlID = e.srcElement.id;
    $scope.onDrag(htmlID);
    firstWordID = null;
    lastWordID = null;
  }




  //function to clear highlighted words
  $scope.clearHighlightedWords = function() {
    $scope.highlightedWords = [];
    for (var i = 0; i < $scope.words.length; i++){
      if ($scope.words[i].isHighlighted){
        $scope.words[i].isHighlighted = false;
      } 
    };
  };

  //highlighted words into an array of quote arrays of objects
  $scope.highlightedWords = [];

  //function to parse highlighted words
  $scope.parseHighlightedWords = function() {
    $scope.highlightedWords = [];
    var quoteArray = [];

    for (var i = 0; i < $scope.words.length; i++){
      //if word is highlighted, push to array
      if ($scope.words[i].isHighlighted){
        quoteArray.push($scope.words[i]);
      } 
      //once the iteration hits a non-highlighted word, push to array if quote exists
      else if (quoteArray.length > 0) {
        $scope.highlightedWords.push(quoteArray);
        quoteArray = [];
      } 
    };

    //check once more for final quote, then push to quote array
    if (quoteArray.length > 0) {
        $scope.highlightedWords.push(quoteArray);
    }

  };




  $scope.closeEditNote = function() {
    $scope.editModal.hide();

  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.editModal.remove();
  });

  // Execute action on hide modal
  $scope.$on('editModal.hidden', function() {
    // Execute action
  });

  // Execute action on remove modal
  $scope.$on('editModal.removed', function() {
    // Execute action
  });



})

.controller('ProjectsCtrl', function($scope, Notes, $stateParams) {
  $scope.notes = Notes.all();

})

.controller('ProjectPageCtrl', function($scope, Notes, $stateParams) {
  //get project ID and set in url
  $scope.projectID = $stateParams.ProjectId;

})

.controller('NotesCtrl', function($scope, Notes, $stateParams, $ionicModal) {
  $scope.notes = Notes.getSourcesForProject($stateParams.ProjectId); 





})

.controller('OutlineCtrl', function($scope, Notes, $stateParams) {

  
})

.controller('EditNoteCtrl', function($scope, Notes, $stateParams) {


})
